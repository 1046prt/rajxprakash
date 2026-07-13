---
title: 'FastAPI and the New HTTP QUERY Method: From First Principles to Production'
excerpt: 'Learn how the new HTTP QUERY method solves the limitations of GET and POST, understand idempotency, and build production-ready QUERY endpoints in FastAPI.'
date: 2026-07-13
image: '/assets/images/blog/blog-15.png'
---

## What Is FastAPI, and Why Does It Exist?

A web framework sits between "a request arrives" and "your function handles it." It parses the raw HTTP request, matches it to a route, converts raw data into typed Python objects, runs your function, and converts the return value back into a response. Without one, you'd manually parse HTTP bytes, manually route URLs, manually validate input, and manually keep docs in sync with code.

**FastAPI** is built on **Starlette** (the ASGI layer — routing, middleware, async request handling) and **Pydantic** (data validation and parsing). Its core idea: your function's type hints _are_ the API contract. One source of truth generates validation, parsing, and docs together, instead of three things that can drift apart.

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
```

From this one function: `item_id` is validated as an integer (clean 422 error otherwise), `q` is optional because it defaults to `None`, and interactive docs appear at `/docs` and `/redoc` — all with zero extra code. This is why FastAPI has become a default choice for Python backend APIs, publicly used by companies like Uber and Netflix — it removes boilerplate that older frameworks made you write and maintain by hand.

---

## The HTTP Methods You Already Know

**GET** retrieves data. No request body by spec — everything goes in the URL. It's _safe_ (doesn't change server state) and _idempotent_ (repeating it changes nothing further).

**POST** creates something or triggers a side effect. It carries a body, which is why people default to it whenever they need to send structured data — but it's neither safe nor idempotent. Calling it twice can reasonably create two different things.

**PUT** replaces a resource entirely. It carries a body like POST, but unlike POST it's idempotent: sending "here's the final state" once or five times leaves the same end result.

**PATCH** partially updates a resource. It carries a body and is generally not idempotent — "increment by one" gives a different result each time you repeat it, though a fixed-value update would be idempotent. It depends on what the update actually does.

```python
# NOT idempotent — each call adds 1 again, so 3 calls = +3 total
@app.patch("/accounts/{account_id}/increment")
async def increment_counter(account_id: int):
    accounts_db[account_id].balance += 1
    return accounts_db[account_id]

# Idempotent PATCH — setting one field to a fixed value behaves like PUT
@app.patch("/accounts/{account_id}/status")
async def set_status(account_id: int, status: str):
    accounts_db[account_id].status = status  # same result no matter how many times
    return accounts_db[account_id]
```

**DELETE** removes a resource. Usually no body, and idempotent — the resource ends up absent either way, even if a repeat call returns "not found" instead of "deleted."

```python
from fastapi import HTTPException

@app.delete("/accounts/{account_id}", status_code=204)
async def delete_account(account_id: int):
    accounts_db.pop(account_id, None)  # no error even if already deleted —
    return None                        # that's what makes DELETE idempotent
```

Two words above — **safe** and **idempotent** — are the whole reason a new HTTP method got standardized in 2026.

---

## Idempotency, Explained Properly

**Idempotent** means repeating a request produces the same effect as doing it once. It doesn't mean "does nothing" — it means repeating it doesn't change the outcome _further_.

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Account(BaseModel):
    balance: float

accounts_db: dict[int, Account] = {}

# PUT — idempotent: setting balance to 500 once or ten times
# leaves the account in the same state either way.
@app.put("/accounts/{account_id}")
async def set_balance(account_id: int, account: Account):
    accounts_db[account_id] = account
    return accounts_db[account_id]

# POST — NOT idempotent: calling this three times creates three
# separate deposits, each adding to the balance.
@app.post("/accounts/{account_id}/deposit")
async def deposit(account_id: int, amount: float):
    accounts_db[account_id].balance += amount
    return accounts_db[account_id]
```

Why this matters beyond theory: idempotency is what makes retries safe. If a connection drops after a request is sent but before the response arrives, the client can't tell whether the server processed it or not — a dropped response looks identical to a dropped request. If the operation is idempotent, retrying is harmless. If it isn't, a blind retry can double-charge a card or send a duplicate order. This is exactly why payment systems, load balancers, and HTTP caches care which methods are idempotent — it determines what's safe to auto-retry without extra deduplication logic.

**Safe** means no state change at all, under any circumstance. GET is both safe and idempotent, which is why browsers, proxies, and CDNs cache and prefetch GET requests without asking — they know it's harmless by definition.

---

## The Gap: Where GET and POST Both Fall Short

A search endpoint needs complex filtering — categories, nested price ranges, an exclude-list, multi-field sort:

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

**GET can't carry this.** No body by spec, so it all goes in the URL — and most servers/proxies cap URL length around 2048 characters. A complex enough filter simply won't fit. Flattened into a query string, the JSON above turns into something like this:

```
GET /search?category=electronics&category=books&price_min=10&price_max=500
    &in_stock=true&exclude_ids=4&exclude_ids=17&exclude_ids=22
    &exclude_ids=89&exclude_ids=103&sort_field=price&sort_dir=asc&limit=50
```

Already unreadable with a five-item exclude list. Add a few hundred excluded IDs — a completely normal real-world case — and this blows straight past most servers' URL-length limits.

**So most APIs use POST instead** — and it works, but it's semantically wrong with real consequences: POST isn't safe or idempotent, so proxies and CDNs never cache the response, even though a search is a pure read. Retries become unsafe by default, even for read-only data. And it misrepresents intent — `POST /search` reasonably makes a reader wonder if it's creating something.

This is the exact gap QUERY was built to close.

---

## Enter HTTP QUERY: A New Method, Finally Standardized

In June 2026, the IETF finalized **RFC 10008**, standardizing **QUERY** — the first genuinely new HTTP method in roughly 16 years. It circulated for a while as a draft (`draft-ietf-httpbis-safe-method-w-body`) before formal adoption.

**What it is:** GET's safety and idempotency, combined with POST's body-carrying capability. It has a body, so it can carry the filter object above with no URL-length ceiling. It's safe, so it doesn't change server state. Because it's safe, it's idempotent by the same logic that makes GET idempotent. And because it's safe and idempotent, it's cacheable by proxies and CDNs — something never true for POST.

In short: a structured request body that's still cacheable, still safely retryable, still a pure read as far as infrastructure is concerned. It gives you a meaningful chunk of what people reach for GraphQL to get, without adopting a separate query language and execution engine.

---

## Using QUERY in FastAPI Today

Honest status: FastAPI has no native `@app.query()` decorator yet. Open PRs (#12965, with competing implementations #13948 and #14050) are blocked upstream — QUERY is part of OpenAPI 3.2, which hasn't shipped, and Swagger UI doesn't render QUERY operations yet either. Both are outside FastAPI's own control.

The workaround: Starlette's routing doesn't hardcode a fixed method list, so `api_route` works today:

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

```bash
curl -X QUERY http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{"category": ["electronics"], "price_max": 500, "limit": 20}'
```

Send a bad payload — `limit` as a string instead of a number — and FastAPI's automatic validation returns this without you writing any error-handling code:

```json
{
  "detail": [
    {
      "type": "int_parsing",
      "loc": ["body", "limit"],
      "msg": "Input should be a valid integer, unable to parse string as an integer",
      "input": "not-a-number"
    }
  ]
}
```

That's Pydantic's validation surfacing automatically as a structured 422 response — this is the exact mechanism the earlier "one source of truth" point about FastAPI was referring to.

Two things will silently break this if skipped:

**1. Uvicorn's default parser rejects QUERY.** Uvicorn runs on either `httptools` (fast, C-based, default) or `h11` (pure Python). `httptools` doesn't recognize QUERY as valid and rejects it before your code ever runs. Fix:

```bash
uvicorn main:app --http h11
```

**2. CORS needs QUERY explicitly allowed**, or cross-origin calls fail their preflight `OPTIONS` check before the real request is even sent:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourapp.com"],
    allow_methods=["GET", "POST", "QUERY"],
    allow_headers=["*"],
)
```

Skip this and a browser call to the endpoint fails before your handler ever runs, with a console error like:

```
Access to fetch at 'https://api.example.com/search' from origin 'https://yourapp.com'
has been blocked by CORS policy: Method QUERY is not allowed by
Access-Control-Allow-Methods in preflight response.
```

For reference, here's what `run_search` looks like as an actual implementation rather than a stub, using SQLAlchemy:

```python
from sqlalchemy import select, and_

def run_search(query: SearchQuery, visible_to: User | None = None):
    stmt = select(Item)
    conditions = []

    if query.category:
        conditions.append(Item.category.in_(query.category))
    if query.price_min is not None:
        conditions.append(Item.price >= query.price_min)
    if query.price_max is not None:
        conditions.append(Item.price <= query.price_max)
    if query.exclude_ids:
        conditions.append(Item.id.notin_(query.exclude_ids))
    if visible_to is not None:
        conditions.append(Item.owner_id == visible_to.id)

    if conditions:
        stmt = stmt.where(and_(*conditions))

    return db_session.execute(stmt.limit(query.limit)).scalars().all()
```

---

## Production Checklist

A working local example isn't a production endpoint. Here's what closes that gap.

**1. Auth** — QUERY doesn't change how you protect a route; same dependency pattern as anywhere else:

```python
from fastapi import Depends
from your_auth_module import get_current_user

@app.api_route("/search", methods=["QUERY"])
async def search_items(query: SearchQuery, current_user: User = Depends(get_current_user)):
    results = run_search(query, visible_to=current_user)
    return {"results": results, "count": len(results)}
```

If users see different data subsets, make sure `run_search` actually filters by `current_user` — this matters directly for the caching point below.

**2. Cache headers** — QUERY's entire pitch is cacheability, but that only happens if you set headers explicitly:

```python
from fastapi import Response

@app.api_route("/search", methods=["QUERY"])
async def search_items(query: SearchQuery, response: Response):
    results = run_search(query)
    response.headers["Cache-Control"] = "public, max-age=60"
    return {"results": results, "count": len(results)}
```

Per-user results? Use `private, max-age=60` instead of `public` — a shared cache serving user A's results to user B is a real data-leak class, not a hypothetical. Also worth knowing: standard HTTP caching keys on URL, not body — confirm your CDN/proxy actually supports body-aware cache keys for QUERY before relying on this; support varies by provider right now.

**3. A real test:**

```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_search_returns_filtered_results():
    response = client.request(
        "QUERY", "/search",
        json={"category": ["electronics"], "price_max": 500, "limit": 20},
    )
    assert response.status_code == 200
    assert response.json()["count"] <= 20

def test_search_rejects_invalid_body():
    response = client.request("QUERY", "/search", json={"limit": "not-a-number"})
    assert response.status_code == 422
```

`TestClient` runs on `httpx`, which already understands QUERY — no `httptools`/`h11` complication here.

**4. Browser clients** — QUERY isn't browser-forbidden (unlike `TRACE`/`CONNECT`), so `fetch()` sends it directly:

```javascript
const response = await fetch('https://api.example.com/search', {
  method: 'QUERY',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ category: ['electronics'], price_max: 500 }),
});
```

The real risk isn't the browser — it's proxies, older CDNs, and enterprise firewalls in between that may not recognize QUERY yet.

**5. Fallback pattern, as actual code:**

```javascript
async function searchWithFallback(payload) {
  let response = await fetch('/search', {
    method: 'QUERY',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.status === 405) {
    response = await fetch('/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  return response.json();
}
```

Keep the equivalent `POST /search` route alive server-side during the transition:

```python
@app.post("/search")
async def search_items_post_fallback(query: SearchQuery, current_user: User = Depends(get_current_user)):
    return await search_items(query, current_user)
```

**6. Rollout** — don't flip one endpoint over all at once: ship/keep POST first → add QUERY behind a flag or internal-only → monitor 405 rates on the QUERY path (a spike means something in your traffic doesn't support it) → deprecate POST only once 405 rates are consistently near zero.

---

## Should You Actually Use This in Production Right Now?

Mostly for internal APIs you fully control, with real caveats otherwise. Client library, proxy, and CDN support is still inconsistent — some may strip the body or reject the request outright. Swagger UI and ReDoc won't render a QUERY endpoint correctly yet, leaving a visible gap in your auto-generated docs. And body-aware caching support across CDN providers is still immature.

On the other hand: the RFC itself is finalized and stable, unlike a year or two ago when it was still an evolving draft. Server-side support is arriving fast — Node/Express, Go's `net/http`, FastAPI via the workaround above, and upcoming native ASP.NET Core support. And the fallback pattern above lets you adopt it incrementally without breaking older clients.

For a portfolio project, or an internal API where you control both ends, this is a genuinely well-justified choice — it signals you understand HTTP semantics beyond "I picked POST because it lets me send JSON."

---

## Recap

FastAPI turns type hints into automatic validation, parsing, and docs — one source of truth instead of three that drift apart. Idempotency means repeating a request leaves the same end state, which is exactly what makes retries safe across a system. GET can't carry complex structured data; POST can, but sacrifices safety and idempotency to do it. HTTP QUERY (RFC 10008, June 2026) closes that gap: body-carrying, and still safe and idempotent. FastAPI has no native `@app.query()` yet, but `api_route(methods=["QUERY"])` works today — with `h11` instead of `httptools` in uvicorn, and `QUERY` explicitly allowed in CORS. Shipping it for real means adding auth, explicit cache headers (mind public vs. private for per-user data), real tests, a client-side fallback to POST, and a staged, monitored rollout — not an all-at-once switch.

---

_Prakash Raj_
