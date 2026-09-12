---
title: "Why Kafka Isn't Actually Losing Your Order"
excerpt: "Kafka only promises order inside a single partition. Here's how that works in practice, why things still arrive jumbled anyway, and how to keep order intact without getting burned in production."
date: 2026-09-12
image: '/assets/images/blog/blog-16.png'
---

## The inventory update arrived before the order that caused it

When I was building an order-processing pipeline with Kafka, wiring up services for orders, inventory, payments, and shipping, something weird kept happening. I'd look at the inventory stream and see the stock adjustment for an order arrive before the order that triggered it. My first instinct was that I'd misconfigured something. Wrong consumer group? Broken rebalance? Nothing in the logs looked wrong.

Turns out everything was configured correctly. I just didn't understand what Kafka actually promises about ordering, versus what I'd quietly assumed it promised. That mismatch cost me a good chunk of a week, and it's common enough that I want to write it down properly.

## Kafka is a log, not a queue

Kafka is best described as a durable, replayable log. Something happens, like an order getting placed, and you append that event to the log. Plenty of services can then read it on their own schedule, and reading doesn't consume or remove anything. Your inventory service, your notification service, and your analytics job can all chew through the same stream without stepping on each other.

```java
Properties props = new Properties();
props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());

KafkaProducer<String, String> producer = new KafkaProducer<>(props);

producer.send(new ProducerRecord<>("orders", "{\"order_id\":101,\"status\":\"created\"}"));
producer.send(new ProducerRecord<>("orders", "{\"order_id\":101,\"status\":\"paid\"}"));
producer.send(new ProducerRecord<>("orders", "{\"order_id\":101,\"status\":\"shipped\"}"));
```

Looks safe enough, right? It isn't automatically. That's the entire reason for this post.

## A topic isn't one log. It's several.

Here's the part almost everyone skips: a Kafka topic is not a single log. It's split into partitions, and each partition is its own little ordered log.

```
Topic: orders
Partition 0: [msg0] [msg1] [msg2] [msg3] ...
Partition 1: [msg0] [msg1] [msg2] ...
Partition 2: [msg0] [msg1] [msg2] [msg3] [msg4] ...
```

The rule that trips people up constantly:

> Kafka guarantees order within a single partition. Across partitions, it promises nothing.

So if the three events for order 101 land in three different partitions, a consumer can legitimately see "shipped" before "created". That's not a bug, and Kafka never claimed it wouldn't happen. The mistake is treating the topic as one big ordered queue when it's really several independent ones running side by side.

## The fix is a partition key

Without a key, Kafka spreads messages across partitions round-robin. Great for throughput, useless for ordering. Add a key, and every message sharing that key lands on the same partition:

```java
ProducerRecord<String, String> created =
    new ProducerRecord<>("orders", "101", "{\"order_id\":101,\"status\":\"created\"}");
ProducerRecord<String, String> paid =
    new ProducerRecord<>("orders", "101", "{\"order_id\":101,\"status\":\"paid\"}");

producer.send(created);
producer.send(paid);
```

Under the hood it's `hash(key) % number_of_partitions`. Same key, same hash, same partition, every time, as long as nobody changes the partition count (more on that below). Every event for order 101 ends up in the same partition, in the order you sent it, and any consumer reading that partition sees them back-to-front correctly.

That's the whole trick. Kafka gives you order per key, not global order. So the key you pick defines what "in order" actually means for your system. Pick poorly, like keying by warehouse when you actually care about order-level sequencing, and you get a stream that's technically ordered but doesn't guarantee the thing you needed.

## Three ways things still go sideways

Even with the right key, order can break. I hit all three of these myself.

**Careless retries.** If a send fails mid-flight and gets retried while another request is still in flight, messages in the same partition can end up written out of the order you called them. Turning on idempotence fixes this, and most modern clients default to it, but I'd still set it explicitly instead of trusting an inherited config:

```java
Properties props = new Properties();
props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);
props.put(ProducerConfig.ACKS_CONFIG, "all");
props.put(ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION, 5);

KafkaProducer<String, String> producer = new KafkaProducer<>(props);
```

**Adding partitions later.** Add a partition and `hash(key) % num_partitions` changes overnight for a bunch of keys. Today's messages for order 101 might land in partition 2 while next week's land in partition 5. Nothing crashes. You just quietly lose the ordering guarantee for every affected key, with zero warning. Pick your partition count with room to grow before you go live, not after.

**Parallelizing inside one partition.** This one isn't Kafka's fault at all. It's ours.

```java
// This throws away the order Kafka just handed you
for (ConsumerRecord<String, String> record : records) {
    executorService.submit(() -> processOrder(record.value()));
}
```

Kafka delivers messages to you in order. The second you hand them to a thread pool, they finish in whatever order the scheduler happens to pick. I made exactly this mistake. Reads were ordered, processing wasn't, and the database ended up with a later update being overwritten by an earlier one that finished last.

```java
// Process each partition's stream one message at a time.
// If you need more throughput, spread work across partitions/keys,
// not across messages within the same key.
for (ConsumerRecord<String, String> record : records) {
    processOrder(record.value());
}
```

## You can scale out without breaking order

Kafka scales reads with consumer groups. Each partition is assigned to exactly one consumer at a time, so per-partition order survives scaling: as long as you don't run more consumers than partitions, every partition still has exactly one reader and its order stays intact.

```java
Properties props = new Properties();
props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
props.put(ConsumerConfig.GROUP_ID_CONFIG, "inventory-service");
props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);
props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
consumer.subscribe(List.of("orders"));

while (true) {
    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(500));
    for (ConsumerRecord<String, String> record : records) {
        processOrder(record.value());
        consumer.commitSync();
    }
}
```

Manual commits matter because auto-commit can mark a message as done before you've actually finished processing it. If the service crashes right there, or loses the partition during a rebalance, that message is gone for good and never retried. Committing only after the work succeeds closes that hole.

## Exactly-once is narrower than the phrase sounds

"Exactly once" gets thrown around a lot. What Kafka's transactional producer actually gives you is atomic writes across multiple partitions or topics. Either everything in the transaction shows up, or none of it does.

```java
Properties props = new Properties();
props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);
props.put(ProducerConfig.ACKS_CONFIG, "all");
props.put(ProducerConfig.TRANSACTIONAL_ID_CONFIG, "order-service-1");

KafkaProducer<String, String> producer = new KafkaProducer<>(props);
producer.initTransactions();

try {
    producer.beginTransaction();
    producer.send(new ProducerRecord<>("orders", "101", "{\"status\":\"paid\"}"));
    producer.send(new ProducerRecord<>("payments", "101",
        "{\"order_id\":101,\"amount\":49.99}"));
    producer.commitTransaction();
} catch (Exception e) {
    producer.abortTransaction();
    throw e;
}
```

That solves a real problem. Without it, a crash between those two sends leaves one topic updated and the other not, with no clean way to notice or undo it.

What it doesn't solve is anything that happens outside Kafka. If processing an order also calls a payment gateway or writes to a separate database, that write isn't covered by the transaction. A crash between the Kafka commit and that external write still leaves you with a duplicate or a gap. To close that you need an idempotent consumer, something that checks "have I already handled this message" before doing anything, inside the same transaction as the side effect:

```java
public void processOrder(ConsumerRecord<String, String> record, Connection db) throws SQLException {
    db.setAutoCommit(false);
    try {
        if (alreadyProcessed(db, record.partition(), record.offset())) {
            db.rollback();
            return;
        }
        applyOrderUpdate(db, record.value());
        markProcessed(db, record.partition(), record.offset());
        db.commit();
    } catch (SQLException e) {
        db.rollback();
        throw e;
    }
}
```

## What I'd actually check before shipping this

- Pick the partition key based on what needs to stay in order for your consumers. Usually the order ID, not the customer ID, since one customer can have several orders that don't need to interleave.
- Decide the partition count with headroom before launch. Changing it later reshuffles your key-to-partition mapping without asking.
- Set `ENABLE_IDEMPOTENCE_CONFIG` and `acks=all` explicitly. Don't assume library defaults match what you think they are.
- Never fan out processing across threads within one partition's stream. Parallelize across partitions instead.
- Commit offsets after the work is done, never before.
- Use transactions when one logical event touches more than one topic, and pair them with an idempotent consumer if you need true end-to-end exactly-once.
- Watch consumer lag, not just whether the process is alive. A consumer can be up and still falling further and further behind.

## Conclusion

Kafka only guarantees order inside a single partition. A topic is really several independent logs, not one big queue. Partition keys turn that into something useful: same key, same partition, same order, as long as you don't change the partition count carelessly. Idempotent producers stop retries from scrambling a partition. Manual offset commits stop crashes from silently dropping messages. Processing each partition one message at a time, instead of throwing it at a thread pool, is what actually preserves the order Kafka already gave you. And transactions get you atomic writes across topics, not free exactly-once. That last part still needs your own idempotency check before you act on a message.

---

_Prakash Raj_
