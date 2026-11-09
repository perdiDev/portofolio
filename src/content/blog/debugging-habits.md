---
title: "Habits for Debugging Faster"
description: "Practical debugging habits that save time: reproduce first, read the error, test one hypothesis at a time, bisect, log with context, and write a failing test."
pubDate: 2026-09-15
category: Tips & Tricks
tags: [debugging, workflow, productivity, testing]
draft: false
featured: false
---

Debugging speed is mostly about habits, not cleverness. These are the ones that have saved me the most time, roughly in the order I use them.

## Make it fail on demand

Before changing anything, find a way to trigger the bug reliably. A bug you can reproduce in ten seconds is half fixed. A bug you can only see "sometimes" is a guessing game.

Then shrink it. Remove inputs, steps and features until the smallest case that still fails remains. Along the way you usually discover what the bug does not depend on.

## Read the actual error

It sounds obvious, but I still catch myself skimming. Read the message in full, then read the stack trace from the top and find the first frame that is your code. The message often names the exact variable or line, and the trace shows how you got there.

## One hypothesis at a time

Guess a cause, decide what you would observe if you were right, and check. Change one thing per experiment. If you change three things and the bug disappears, you have learned nothing about which one mattered.

Writing the hypothesis down helps. If I cannot explain the problem in a couple of sentences, to a colleague or to a rubber duck, I probably do not understand it yet. Often the explanation itself reveals the mistake.

## Bisect everything

Binary search is the best debugging tool there is. Use it on history and on data.

For history, `git bisect` finds the commit that introduced a bug in a handful of steps. If you have a command that exits non-zero on failure, it can run unattended.

```bash
git bisect start
git bisect bad HEAD
git bisect good v1.4.0
git bisect run npm test
git bisect reset
```

Without `run`, git checks out a middle commit and you mark it with `git bisect good` or `git bisect bad` yourself. Bisecting works far better when commits are small and focused, which is one more reason for [writing good commit messages](/blog/writing-good-commit-messages/) and keeping changes tidy.

For data, halve the input. If a 10,000-line file breaks the parser, try the first half, then the half of that, until you reach the offending line.

## Log with context

A bare `console.log("here")` tells you little. Log named values, and wrap them in an object so the names are printed alongside them.

```js {2,5}
function applyDiscount(cart, coupon) {
  console.log("applyDiscount:input", { cartId: cart.id, total: cart.total, coupon });
  const rate = coupon?.rate ?? 0;
  const result = cart.total * (1 - rate);
  console.log("applyDiscount:output", { rate, result });
  return result;
}
```

Log at boundaries: what went in, what came out. Remove the logs when you are done.

## Use the debugger for state you cannot reason about

When the logic is too tangled to simulate in your head, set a breakpoint and inspect. A debugger lets you see every variable at once, step line by line, and evaluate expressions without editing code. In Node, `node --inspect-brk app.js` lets Chrome DevTools or your editor attach.

## Write the failing test first

Once you understand the bug, capture it in a test before fixing it. Watch the test fail, apply the fix, and watch it pass. That proves the test actually detects the problem, and it keeps the bug from coming back.

```diff
 describe("applyDiscount", () => {
   it("applies a percentage coupon", () => {
     expect(applyDiscount({ total: 100 }, { rate: 0.1 })).toBe(90);
   });
+  it("ignores an expired coupon", () => {
+    expect(applyDiscount({ total: 100 }, { rate: 0.1, expired: true })).toBe(100);
+  });
 });
```

## Take a break

If you have been stuck for an hour, walk away. Fresh eyes spot what tired ones skip, and many of my hardest bugs have been solved in the shower or on a short walk.

## What to do next

Pick one habit and apply it to your next bug. For me, forcing myself to write down a hypothesis before touching code made the biggest difference. If your bug involves promises, [async/await in JavaScript without the confusion](/blog/async-await-in-javascript/) covers a few common traps worth checking first.
