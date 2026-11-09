---
title: "Async/Await in JavaScript Without the Confusion"
description: "A practical guide to async/await: what await really does, error handling, parallel work with Promise.all, timeouts, and the mistakes I see most often."
pubDate: 2025-04-22
category: Programming
tags: [javascript, async, promises, typescript]
draft: false
featured: false
---

Most async bugs I have run into come from a fuzzy mental model, not from the syntax. Once the model is clear, `async/await` is pleasantly boring. Here is the version I wish I had been given earlier.

## Promises are values for "later"

A promise is an ordinary object that stands in for a result that is not ready yet. It is pending, then it either fulfils with a value or rejects with an error. It never changes state again after that.

```js
const response = fetch("https://example.com/api/users");
console.log(response); // Promise { <pending> }
```

`async/await` is syntax on top of promises. An `async` function always returns a promise, and `await` unwraps one.

## What await really does

`await` pauses the async function, not the thread. JavaScript keeps running other code while the awaited promise is pending, and resumes your function afterwards.

```js
async function loadUser(id) {
  console.log("start");
  const res = await fetch(`https://example.com/api/users/${id}`);
  console.log("got response");
  return res.json();
}

loadUser(1);
console.log("runs second");
```

The output order is `start`, `runs second`, `got response`. The code after `loadUser(1)` does not wait for it.

## Error handling

A rejected promise turns into a thrown exception at the `await`, so `try/catch/finally` works as you would expect.

```js
async function save(form) {
  setLoading(true);
  try {
    const res = await fetch("/api/save", { method: "POST", body: form });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    showError(err);
  } finally {
    setLoading(false);
  }
}
```

Note the `res.ok` check. `fetch` only rejects on network failures, so a 404 or 500 arrives as a normal response.

## Sequential versus parallel

The classic mistake is awaiting independent work one item at a time. Each call waits for the previous one, so total time is the sum instead of the maximum.

```diff
-const user = await getUser(id);
-const orders = await getOrders(id);
-const prefs = await getPrefs(id);
+const [user, orders, prefs] = await Promise.all([
+  getUser(id),
+  getOrders(id),
+  getPrefs(id),
+]);
```

The same applies to loops. `await` inside a `for...of` is right when each step depends on the last. For independent items, start everything first:

```js
const users = await Promise.all(ids.map((id) => getUser(id)));
```

### Partial failure with allSettled

`Promise.all` rejects as soon as one promise rejects. When you want every result, successful or not, use `Promise.allSettled`.

```js
const results = await Promise.allSettled(ids.map((id) => getUser(id)));
const users = results
  .filter((r) => r.status === "fulfilled")
  .map((r) => r.value);
const failures = results.filter((r) => r.status === "rejected").length;
```

## Floating promises

Forgetting `await` is easy and quiet. The function runs, but nothing waits for it and nothing catches its errors.

```js
save(form); // floating: a rejection becomes an unhandled rejection
await save(form); // fine
```

In Node, an unhandled rejection crashes the process by default. In TypeScript projects I enable the `@typescript-eslint/no-floating-promises` lint rule so the mistake gets flagged in the editor.

## Timeouts with AbortSignal

`fetch` has no timeout by default. `AbortSignal.timeout()` gives you one without any manual timer cleanup.

```js
try {
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  console.log(await res.json());
} catch (err) {
  if (err.name === "TimeoutError") {
    console.error("Request took longer than 5 seconds");
  } else {
    throw err;
  }
}
```

## A typed example

In TypeScript, an async function returns `Promise<T>`, and `await` gives you the `T`.

```ts title="src/users.ts"
interface User {
  id: string;
  name: string;
}

export async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`https://example.com/api/users/${id}`, {
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as User;
}
```

That `as User` is only a cast, not a check. I cover how to make this safer in [TypeScript generics with real examples](/blog/typescript-generics-in-practice/).

## What to do next

Search your codebase for `await` inside loops and ask whether the iterations are really dependent. Then add a timeout to every network call. When something still behaves strangely, my notes on [habits for debugging faster](/blog/debugging-habits/) cover how to narrow it down.
