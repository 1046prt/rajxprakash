---
title: 'FastAPI and the New HTTP QUERY Method: From First Principles to Production'
excerpt: 'Learn how the new HTTP QUERY method solves the limitations of GET and POST, understand idempotency, and build production-ready QUERY endpoints in FastAPI.'
date: 2026-07-13
image: '/assets/images/blog/blog-15.png'
---

## What Is FastAPI, and Why Does It Exist?

If you've never built a backend before, here's the short version: a **web framework** is the piece of software that sits between "a request arrives over the network" and "your Python function that handles it." It parses the incoming HTTP request, figures out which function should run, converts the raw data into something your code can use, runs your function, and converts whatever your function returns back into an HTTP response. Without a framework, you'd be manually parsing raw TCP bytes into HTTP headers and a body, manually matching a URL against a list of routes, manually converting strings into integers or booleans, and manually writing your own documentation by hand and hoping it stays in sync with your code. A framework exists to make all of that disappear.

**FastAPI** is a modern Python web framework, built on top of two other libraries that do the heavy lifting underneath it. The first is **Starlette**, which handles the actual ASGI (Asynchronous Server Gateway Interface) layer — the low-level machinery of receiving a request, running it through middleware, routing it to the right function, and sending a response back, all asynchronously so the server can handle many requests concurrently instead of one at a time. The second is **Pydantic**, which handles data validation and parsing — taking raw, untyped data (JSON from a request body, strings from a URL) and turning it into properly typed Python objects, raising clear errors when the data doesn't match what was expected.

FastAPI's core idea is that your function's type hints _are_ the API contract. You don't write separate validation code, a separate documentation file, and separate parsing logic as three disconnected things that can drift out of sync with each other — you write one Python function with type hints, and FastAPI derives all three from that single source of truth automatically.

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
```

From this one function, FastAPI automatically validates that `item_id` in the URL is actually an integer and returns a clean, structured 422 error if someone sends something that isn't (like `/items/abc`), rather than crashing or silently misbehaving. It knows `q` is optional because it has a default value of `None`, so a request without it doesn't fail. It generates interactive API documentation at `/docs` (an embedded Swagger UI page where you can actually click a button and try each endpoint from the browser) and at `/redoc` (a cleaner, read-only alternative). And it manages the async event loop underneath so this function can run concurrently with hundreds of other in-flight requests without you writing any threading or async-scheduling code yourself.

Why this matters for a backend role specifically: FastAPI has become one of the most common frameworks for building production APIs in Python, in large part because it removes an entire category of boilerplate that older frameworks required you to write and maintain by hand — validation code, docs pages, and request parsing that would otherwise live as three separate files that inevitably drift apart over time. Companies including Uber and Netflix have publicly described using it in production systems.

---

## The HTTP Methods You Already Know

Before getting to what's new, it's worth being precise about what already exists, because the new method only makes sense in contrast to these. HTTP methods (sometimes called "verbs") tell a server what kind of operation a request represents, and each one carries an implicit contract about what's allowed to happen as a result.

- **GET** is for retrieving data. By specification, a GET request does not carry a request body — everything the server needs to know has to be encoded in the URL itself, usually as query string parameters after a `?`. GET is considered both _safe_, meaning it isn't supposed to change anything on the server, and _idempotent_, meaning making the same GET request five times has the exact same effect as making it once (which, for a read operation, just means "no effect, other than returning data").

- **POST** is for creating something new or triggering an action that has side effects — placing an order, sending a message, uploading a file. Unlike GET, POST requests do carry a body, which is exactly why developers reach for it whenever they need to send structured data to the server. But POST is neither safe nor idempotent by default: calling the same POST request twice can very reasonably create two different things (two orders, two messages), and there's no guarantee built into the method itself that repeating it is harmless.

- **PUT** is for replacing a resource entirely with a new version. It carries a body, like POST, but unlike POST, PUT is idempotent: if you tell the server "here is the complete, final state this resource should have," sending that same instruction once or five times in a row leaves the resource in exactly the same end state either way.

- **PATCH** is for partially updating a resource — changing just one field rather than replacing the whole thing. It carries a body, and it's generally not idempotent, because a partial update like "increment this counter by one" produces a different result each time it's repeated, even though a partial update like "set this field to a fixed value" would be idempotent. PATCH doesn't make a blanket guarantee either way; it depends on what the specific update actually does.

- **DELETE** is for removing a resource. It usually doesn't carry a body, and it's considered idempotent: deleting the same resource once, or attempting to delete it again after it's already gone, leaves the system in the same end state — the resource is absent either way, even if the second call might technically return a "not found" instead of a "deleted" response.

Two concepts threaded through all of that — **safe** and **idempotent** — do a huge amount of work in HTTP design, and they deserve their own dedicated explanation, because the entire reason a new HTTP method was standardized in 2026 comes down to a gap in exactly these two properties.

---

## Idempotency, Explained Properly

**Idempotent** means: making the same request multiple times has the same effect as making it once.

This is not the same as "doesn't do anything." An idempotent operation can absolutely change server state — it just means repeating it doesn't change that state _further_, past whatever the first successful call already did.

**A concrete example:**

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Account(BaseModel):
    balance: float

accounts_db: dict[int, Account] = {}

# PUT is idempotent: setting balance to 500 once, or ten times,
# leaves the account in exactly the same state either way.
@app.put("/accounts/{account_id}")
async def set_balance(account_id: int, account: Account):
    accounts_db[account_id] = account
    return accounts_db[account_id]

# POST is NOT idempotent: calling this three times creates three
# separate deposits, each time adding to the balance.
@app.post("/accounts/{account_id}/deposit")
async def deposit(account_id: int, amount: float):
    accounts_db[account_id].balance += amount
    return accounts_db[account_id]
```

Call `PUT /accounts/1` with `{"balance": 500}` once or five times — the account ends up at exactly 500 either way, because each call simply overwrites the same field with the same value. Call `POST /accounts/1/deposit` with `{"amount": 100}` three times, and you've added 300 to the balance, not 100, because each call performs a separate, additive operation on top of whatever came before. That's the distinction, and it's the entire reason the two methods behave so differently under a retry.

Why this matters practically, not just academically: idempotency is what makes retries safe. If a client sends a request and the network connection drops before the client ever sees the response, the client genuinely doesn't know whether the server received and processed that request or not — from the client's point of view, a dropped response after the request was sent looks identical to a dropped request that never arrived at all. If the operation is idempotent, the client can safely just retry it: worst case, it executes twice with no additional effect, because that's exactly what idempotency guarantees. If the operation isn't idempotent, a blind retry could double-charge a customer's card, send a duplicate confirmation email, or create a duplicate order in the system — and this is exactly why payment processors, load balancers, and HTTP caching layers all care so deeply about which methods are idempotent. It directly determines what's safe for infrastructure to automatically retry on your behalf without you writing extra deduplication logic yourself.

**Safe** is a related but distinct concept: a safe method is one that doesn't change server state at all, under any circumstances. GET is both safe and idempotent — reading data doesn't change anything, and reading it repeatedly still doesn't change anything, so both properties happen to hold simultaneously for a pure read. This is exactly why browsers, proxies, and CDNs are comfortable caching and even prefetching GET requests without asking permission first — they know, by the definition of the method itself, that doing so is harmless.

---

## The Gap: Where GET and POST Both Fall Short

Here's a scenario every backend developer eventually runs into. You need to build a search endpoint that supports complex filtering — multiple category values, nested numeric ranges, a boolean flag, an arbitrary list of IDs to explicitly exclude, and a sort order with multiple fields. Something structurally like this:

```json
{
  "filters": {
    "category": ["electronics", "books"],
    "price_range": { "min": 10, "max": 500 },
    "in_stock": true,
    "exclude_ids": [4, 17, 22, 89, 103]
  },
  "sort": [{ "field": "price", "direction": "asc" }],
  "limit": 50
}
```

Why can't this be a GET request? By specification, GET requests don't carry a body, so everything has to be squeezed into the URL as query string parameters. A nested, structured payload like the one above becomes an unreadable, deeply URL-encoded mess once flattened into a query string, and beyond just being ugly, there's a hard practical ceiling on this approach: most servers, load balancers, and intermediary proxies enforce a maximum URL length, commonly somewhere around 2048 characters. A complex enough filter — say, a few hundred excluded IDs, or several nested range conditions — will simply exceed that limit and the request will fail outright, regardless of how carefully you encode it.

So why not just use POST instead? This is what almost every API in production actually does today, and functionally, it "works" — the body arrives, gets parsed, the search executes, results come back. But it's semantically wrong, and that wrongness carries real, measurable consequences rather than being a purely academic objection. POST is not safe and not idempotent, which means browsers, proxies, and CDNs will never cache the response, even though a search is fundamentally a pure read operation with absolutely nothing that needs protecting from being cached. Retries also become unsafe by default: if your client's request to a POST search endpoint times out waiting for a response, there's no built-in guarantee that blindly retrying is harmless — even for something as read-only as a search, the tooling and infrastructure built around POST assumes, correctly in the general case, that repeating it might not be safe. And finally, it misrepresents intent to anyone reading your API surface or your OpenAPI schema: seeing `POST /search` in a list of endpoints, a reasonable engineer would wonder, at least briefly, whether this operation creates something, because that's what POST conventionally signals.

This is precisely the gap that the industry has quietly patched over with POST for well over a decade — and it's the exact gap the new QUERY method was designed to close.

---

## Enter HTTP QUERY: A New Method, Finally Standardized

In June 2026, the IETF finalized RFC 10008, standardizing a new HTTP method called `QUERY` — notably, the first genuinely new HTTP method added to the specification in roughly 16 years, a gap long enough that most working developers today have never seen a new one get standardized during their career. It had circulated for a while beforehand as a draft under the working title `draft-ietf-httpbis-safe-method-w-body`, going through the usual multi-year IETF review and revision process before being formally adopted.

What QUERY actually is, at its core, is a method that combines the safety guarantees of GET with the body-carrying capability of POST. It has a request body, exactly like POST does, which means it can carry the same complex, nested, structured filter object from the example above without any URL-length ceiling to worry about. At the same time, it's defined as safe, meaning it isn't supposed to change server state, exactly like GET. And because it's safe, it's also idempotent by the same logic that makes GET idempotent — repeating a QUERY request produces the same read result each time, with nothing extra happening on the server as a side effect. And because it's both safe and idempotent, it inherits GET's cacheability as well: a proxy or CDN sitting in front of your server is free to cache a QUERY response the same way it would cache a GET response, something that was never true for POST.

Put simply: QUERY lets you send a complex, structured request body while still being something a CDN can cache, a client can safely retry without hesitation, and a load balancer can treat as a pure read rather than a potentially state-changing write. It gives you a meaningful chunk of what people historically reached for GraphQL to get — the ability to express a rich, structured query rather than a flat set of URL parameters — without requiring you to adopt an entirely separate query language, a separate schema definition system, and a separate execution engine on top of your existing REST API.

---

## Using QUERY in FastAPI Today

Here's the honest state of things, because it's worth being precise rather than optimistic about where the tooling actually stands: as of mid-2026, FastAPI does not yet have a first-class `@app.query()` decorator built directly into the framework the way `@app.get()` or `@app.post()` are. There are open pull requests actively working on adding one — tracked against GitHub issue #12965, with at least two competing implementation attempts (PRs #13948 and #14050) — but they're currently blocked further upstream than FastAPI itself. QUERY is part of the OpenAPI 3.2 specification, which hasn't been finalized and released yet, and Swagger UI, the interactive documentation tool FastAPI relies on for its `/docs` page, doesn't know how to render a QUERY operation correctly yet either. Both of those are dependencies outside FastAPI's own control, which is why the native decorator is stalled even though the underlying HTTP method itself is already a finalized, stable standard.

The good news is that because FastAPI is built on top of Starlette, and Starlette's routing layer doesn't hardcode a fixed, closed list of allowed HTTP methods, you can use QUERY today with FastAPI's more generic `api_route` decorator, which accepts an arbitrary list of method strings rather than being limited to the handful of named shortcuts like `.get()` and `.post()`:

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class SearchQuery(BaseModel):
    category: list[str] = []
    price_min: float | None = None
    price_max: float | None = None
    in_stock: bool | None = None
    exclude_ids: list[int] = []
    limit: int = 50

@app.api_route("/search", methods=["QUERY"])
async def search_items(query: SearchQuery):
    results = run_search(query)  # your actual search/filter logic
    return {"results": results, "count": len(results)}
```

A client would call this with the HTTP method literally set to the string `QUERY`, not GET or POST:

```bash
curl -X QUERY http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{"category": ["electronics"], "price_max": 500, "limit": 20}'
```

There are two practical things worth knowing before you try this in a real project, because both will silently break the request if you skip them. First, uvicorn's default HTTP parser doesn't support QUERY yet. Uvicorn can run using either of two different HTTP implementations under the hood: `httptools`, a fast C-based parser that's the default in most installs, or `h11`, a slower but pure-Python implementation. As of this writing, `httptools` simply doesn't recognize QUERY as a valid HTTP method string and will reject the request before it ever reaches your FastAPI code. The fix is to explicitly run uvicorn with the `h11` backend instead:

```bash
uvicorn main:app --http h11
```

Second, CORS matters the moment you're calling this from a browser rather than a server-to-server client like `curl` or a backend service. Because QUERY isn't one of the small set of "standard" methods browsers already implicitly trust for cross-origin requests, any cross-origin call using it will trigger a CORS preflight `OPTIONS` check first. If your CORS middleware doesn't explicitly list QUERY as an allowed method, that preflight check fails and the browser never even sends the actual request. Make sure your CORS configuration explicitly allows it:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourapp.com"],
    allow_methods=["GET", "POST", "QUERY"],
    allow_headers=["*"],
)
```

---

## Production Checklist

Everything above gets you a working QUERY endpoint running locally on your own machine. Actually shipping it in front of real traffic, with real users and real data, needs several more pieces that a minimal tutorial example always leaves out — here's what's missing, and how to close each gap properly.

### 1. Authentication and authorization

The minimal example above is a completely open endpoint with no concept of who's asking. In practice, a search or query route sits behind exactly the same authentication dependency as every other route in your application — using QUERY as the HTTP method doesn't change how you protect an endpoint, since auth is a separate, orthogonal concern from which HTTP verb you chose:

```python
from fastapi import Depends
from your_auth_module import get_current_user

@app.api_route("/search", methods=["QUERY"])
async def search_items(
    query: SearchQuery,
    current_user: User = Depends(get_current_user),
):
    # Scope the search to what this user is allowed to see
    results = run_search(query, visible_to=current_user)
    return {"results": results, "count": len(results)}
```

If different users can legitimately see different subsets of your data — a multi-tenant system, a permissions model, private vs. public records — make sure your `run_search` function actually filters results by `current_user`, not just by the raw filter object the client sent. A cacheable endpoint that ends up leaking another user's data because the cache key didn't account for identity is a genuinely easy bug to introduce and a serious one once it happens, which is exactly why the caching section right below this one calls it out specifically.

### 2. Actually making it cacheable

The entire architectural pitch of QUERY is that it's cacheable by intermediaries — but nothing in the minimal example from earlier actually sets any cache-related headers, which means nothing actually gets cached in practice; being "cacheable by design" and "actually cached" are two different things, and you have to explicitly opt into the second one:

```python
from fastapi import Response

@app.api_route("/search", methods=["QUERY"])
async def search_items(query: SearchQuery, response: Response):
    results = run_search(query)
    # Cache for 60 seconds, and let shared proxies/CDNs cache it too
    # (not just the browser) — that's what the "public" directive means.
    response.headers["Cache-Control"] = "public, max-age=60"
    return {"results": results, "count": len(results)}
```

There's an important caveat here if the endpoint is per-user, per the authentication section above: don't use the `public` cache-control directive on a response whose contents differ depending on which user asked for it — that's precisely the kind of cross-user data leak a shared, intermediary-level cache can cause, since a CDN or proxy might happily serve user A's cached search results back to user B if it isn't told the response is user-specific. In that scenario, use `private, max-age=60` instead, which tells shared proxies and CDNs explicitly not to cache the response on their end, while still allowing the individual browser's own local cache to reuse it for that one specific user on their own machine.

It's also worth understanding a subtlety that's easy to miss: since QUERY has a request body, not just a URL, standard HTTP caching — which historically keys its cache lookups purely on the request URL — doesn't automatically account for the body's content when deciding whether two requests are "the same" for caching purposes. Two QUERY requests to the identical URL but with completely different filter bodies could, in a naively configured caching layer, incorrectly be treated as the same cacheable request. Before relying on this in production, confirm that your specific CDN or reverse-proxy layer actually supports body-aware cache keys for QUERY requests — this is genuinely one of the more immature parts of the surrounding ecosystem right now, and support varies meaningfully from provider to provider.

### 3. A real automated test, not just a manual curl command

```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_search_returns_filtered_results():
    response = client.request(
        "QUERY",
        "/search",
        json={"category": ["electronics"], "price_max": 500, "limit": 20},
    )
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert data["count"] <= 20

def test_search_rejects_invalid_body():
    response = client.request("QUERY", "/search", json={"limit": "not-a-number"})
    assert response.status_code == 422
```

FastAPI's `TestClient` is built on top of `httpx` rather than uvicorn's own HTTP parsing stack, and `httpx` already understands arbitrary HTTP methods including QUERY without any special configuration — so this test works today exactly as written, with none of the `httptools`-versus-`h11` complication that affects actually running the server.

### 4. Calling it from JavaScript and browser clients

Since this is a common next question once a backend endpoint exists: QUERY is not among the small handful of HTTP methods browsers explicitly forbid scripts from sending (a short blocklist that includes things like `TRACE` and `CONNECT`), so the browser's native `fetch()` API can send it directly, without any special workaround or polyfill:

```javascript
const response = await fetch('https://api.example.com/search', {
  method: 'QUERY',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ category: ['electronics'], price_max: 500 }),
});
```

The real-world risk isn't actually the browser itself — it's everything sitting between the browser and your server. Corporate network proxies, older CDN configurations that predate QUERY's standardization, and some enterprise firewalls may not recognize the method yet and could silently strip the request body or reject the request outright before it ever reaches your infrastructure. This is exactly why a fallback pattern matters in practice, rather than being a theoretical nicety.

### 5. The fallback pattern, written as actual code

Advice like "try QUERY, and fall back to POST if you get a 405" needs to exist as something you can actually copy into a codebase, not just as a sentence in an article. Here's a minimal client-side implementation of that pattern:

```javascript
async function searchWithFallback(payload) {
  let response = await fetch('/search', {
    method: 'QUERY',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.status === 405) {
    // Server or an intermediary doesn't support QUERY — fall back to POST.
    response = await fetch('/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  return response.json();
}
```

On the server side, this means keeping an equivalent `POST /search` endpoint alive alongside the QUERY one for at least a transition period, rather than removing the old route the moment the new one works in local testing:

```python
@app.post("/search")
async def search_items_post_fallback(
    query: SearchQuery,
    current_user: User = Depends(get_current_user),
):
    # Same underlying logic as the QUERY handler — you can even
    # call it directly rather than duplicating the implementation.
    return await search_items(query, current_user)
```

### 6. Rollout strategy

Because client and intermediary support for QUERY is still inconsistent across the wider internet, it's not wise to flip a single production endpoint over to it all at once for every user simultaneously. A more reasonable, staged rollout looks like this: ship or keep the POST version first, as the only path your existing clients rely on. Then add the QUERY endpoint alongside it, not as an outright replacement, initially behind a feature flag or restricted to internal-only traffic so you can observe its behavior before exposing it broadly. While it's live, actively monitor the rate of 405 "Method Not Allowed" responses coming back on the QUERY path specifically — a meaningful spike in that rate is a direct signal that some client or intermediary somewhere in your actual traffic path doesn't support the method yet, information you genuinely can't get any other way short of waiting for support tickets to arrive. Only once that 405 rate has settled to consistently near zero across your real client base, over a meaningful observation window, should you consider deprecating the POST fallback entirely — not on a fixed calendar date decided in advance, and not the moment the feature technically works in a demo.

---

## Should You Actually Use This in Production Right Now?

Honestly — with real caveats, and mostly for internal APIs or systems where you fully control both the client and the server, rather than a public-facing service consumed by clients you have no visibility into or control over. Here's the realistic picture on both sides.

On the side of caution: client library support is still inconsistent across the ecosystem, and many HTTP clients, older reverse proxies, and some CDN configurations don't recognize QUERY yet, meaning they may strip the request body or reject the request outright rather than passing it through correctly. FastAPI's own documentation tooling — Swagger UI and ReDoc — won't render a QUERY endpoint properly yet either, so your automatically generated API documentation will have a visible gap around exactly the endpoint you're most excited about. And CDN-level caching support for QUERY, which specifically needs to account for request body content rather than just the URL, is still genuinely immature and inconsistent across different providers.

On the side of it being worth adopting now: the RFC itself is finalized and stable, which is a meaningfully different situation from a year or two ago when it was still an unstable, evolving draft that could change shape before anyone built against it. Server-side support is arriving quickly across multiple ecosystems — Node.js's Express framework, Go's standard library `net/http` package, FastAPI via the `api_route` workaround shown above, and upcoming native support in ASP.NET Core all point toward this becoming a normal, well-supported part of the HTTP toolkit rather than a permanent curiosity. And a genuinely safe fallback pattern already exists, shown in full above, that lets you adopt QUERY incrementally without breaking anything for older clients that don't yet understand it.

For a portfolio project, or for an internal API where you control both ends of the connection, this is a genuinely good, technically well-justified choice to build and demonstrate — it signals that you understand HTTP semantics at a level well beyond simply defaulting to POST because it happens to let you send a JSON body.

---

## Recap

FastAPI turns Python type hints into automatic validation, request parsing, and interactive documentation, which is a large part of why it's become a default choice for building Python backend APIs rather than writing that machinery by hand. Idempotency means that repeating a request produces the exact same end state as making it just once, and that property is specifically what makes automatic retries safe at every layer of a system, from a client's own retry logic up through load balancers and proxies. GET cannot carry complex, structured data because it has no body and is constrained by practical URL-length limits, while POST can carry that data but sacrifices both safety and idempotency in doing so, which breaks caching and safe-retry guarantees for what is very often, in reality, just a read operation dressed up as a write. HTTP QUERY, standardized via RFC 10008 in June 2026, closes that specific gap by being a body-carrying method that remains safe and idempotent at the same time. FastAPI doesn't yet have a native `@app.query()` shorthand built in, but the `api_route(methods=["QUERY"])` approach works today, provided you handle two setup details: running uvicorn with the `h11` HTTP parser instead of the default `httptools`, and explicitly allowing `QUERY` in your CORS configuration. And actually shipping this in a production system, rather than just demonstrating it locally, means layering in authentication exactly as you would for any other route, explicit cache headers with careful attention to the public-versus-private distinction for any per-user data, real automated tests rather than manual curl commands, a working client-side fallback to POST for clients and intermediaries that don't yet support the new method, and a staged, monitored rollout rather than an all-at-once switch.

---

_Prakash Raj_
