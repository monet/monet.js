---
title: Home
layout: index
version: 0.1
dev-version: 0.1
---

## Introduction

So you've been forced to use JavaScript, eh? Well, don't slit your wrists just yet, this library is what you want to
model all those monadic types that JavaScript (and well most languages) thoughtlessly omit.

If you know what a monad is then you are already an awesome programmer and if you don't, well... awesome is what you are
about to become.

This library is inspired by those that have come before, especially the [FunctionalJava project][functionalJava].

We are still in the early stages of development and have only implemented a few types, but stay tuned for more monadic
goodness.

### Option

The `Option` type is the most common way of represented the `null` type with making the possibilities of `NullPointer`
issues disappear.

Option has effectively abstract and as two concrete subtypes: `Some` and `None`.

#### Creating an Option

            new Some(val)

            new None()
            
[functionalJava]: http://functionaljava.org/