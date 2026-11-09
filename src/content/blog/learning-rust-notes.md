---
title: "Notes on Learning Rust as a TypeScript Developer"
description: "Unfinished notes from learning Rust coming from TypeScript: ownership versus garbage collection, and Option and Result instead of undefined and exceptions."
pubDate: 2026-11-05
category: Programming
tags: [rust, typescript, learning]
draft: true
---

## Ownership instead of a garbage collector

In TypeScript I never think about who frees memory. In Rust every value has one owner, and when the owner goes out of scope the value is dropped. Passing a `String` to a function moves it, so the caller can no longer use it unless it borrows with `&`.

The compiler errors are annoying for a week and then start to feel like a code review.

## Option and Result

There is no `undefined` and no `throw` in everyday Rust. Absence is `Option<T>`, failure is `Result<T, E>`, and the compiler makes me handle both.

```rust
fn parse_port(input: &str) -> Result<u16, std::num::ParseIntError> {
    input.trim().parse::<u16>()
}

fn main() {
    match parse_port("8080") {
        Ok(port) => println!("listening on {port}"),
        Err(e) => eprintln!("bad port: {e}"),
    }
}
```

The `?` operator feels like `await` for errors: it unwraps or returns early.

## Still to figure out

- Lifetimes in structs that hold references
- When to use `Rc` or `Arc` instead of fighting the borrow checker
- Async Rust, and how it compares to [async/await in JavaScript](/blog/async-await-in-javascript/)
- Traits versus TypeScript generics
