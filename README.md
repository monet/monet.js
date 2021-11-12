# monet.js

For people who wish they didn't have to program in JavaScript. [documentation](https://github.com/monet/monet.js/tree/master/docs/README.md)

## Introduction

Monet is a library designed to bring great power to your JavaScript programming. It is a tool bag that assists Functional Programming by providing a rich set of Monads and other useful functions.

This library is inspired by those that have come before, especially the [FunctionalJava][functionalJava] and [Scalaz][scalaz] projects.

While functional programming may be alien to you, this library is a simple way to introduce monads and pure functional programming into your daily practices.

## Documentation

Full detailed documentation can be found [here](https://github.com/monet/monet.js/tree/master/docs/README.md)

## Installation

### NPM

```bash
npm install monet --save

# or to install a specific version
npm install monet@0.9.3
```

### Download

Download the [zip][gitZip] or [tar][gitTar] ball.

### Browser

Simply download and add to your html pages. You can also include `monet-pimp.js` which contains extra functions on the `Object.prototype` for creating monads.

```html
<script src="monet.js"></script>
<!-- Optionally -->
<script src="monet-pimp.js"></script>
```

## Contents

### [Maybe](https://github.com/monet/monet.js/tree/master/docs/MAYBE.md)

The `Maybe` type is the most common way of representing *nothingness* (or the `null` type) with making the possibilities of `NullPointer` issues disappear.

`Maybe` is effectively abstract and has two concrete subtypes: `Some` (also `Just`) and `None` (also `Nothing`).

### [Either](https://github.com/monet/monet.js/tree/master/docs/EITHER.md)

Either (or the disjunct union) is a type that can either hold a value of type `A` or a value of type `B` but never at the same time. Typically it is used to represent computations that can fail with an error. Think of it as a better way to handle exceptions. We think of an `Either` as having two sides, the success is held on the right and the failure on the left. This is a right biased either which means that `map` and `flatMap` (`bind`) will operate on the right side of the either.

### [Validation](https://github.com/monet/monet.js/tree/master/docs/VALIDATION.md)

Validation is not quite a monad as it [doesn't quite follow the monad rules](http://stackoverflow.com/questions/12211776/why-isnt-validation-a-monad-scalaz7), even though it has the monad methods. It that can hold either a success value or a failure value (i.e. an error message or some other failure object) and has methods for accumulating errors. We will represent a Validation like this: `Validation[E,A]` where `E` represents the error type and `A` represents the success type.

### [Immutable lists](https://github.com/monet/monet.js/tree/master/docs/LIST.md)

An immutable list is a list that has a head element and a tail. A tail is another list. The empty list is represented by the `Nil` constructor. An immutable list is also known as a "cons" list. Whenever an element is added to the list a new list is created which is essentially a new head with a pointer to the existing list.

### [Non Empty Lists](https://github.com/monet/monet.js/tree/master/docs/NEL.md)

Much like the immutable list, a Non Empty List can never be empty. It implements the `comonad` pattern. It has a guaranteed head (total)
and a guaranteed (total) tail.

### [IO](https://github.com/monet/monet.js/tree/master/docs/IO.md)

The `IO` monad is for isolating effects to maintain referential transparency in your software. Essentially you create a description of your effects of which is performed as the last action in your programme. The IO is lazy and will not be evaluated until the `perform` (*alias* `run`) method is called.

### [Reader](https://github.com/monet/monet.js/tree/master/docs/READER.md)

The `Reader` monad is a wonderful solution to inject dependencies into your functions. There are plenty of great resources to get your
teeth into the `Reader` monad such as [these great talks](http://functionaltalks.org/tags/#reader%20monad).

The `Reader` monad provides a way to "weave" your configuration throughout your programme.

### [Free](https://github.com/monet/monet.js/tree/master/docs/FREE.md)

The `Free` monad is a monad that is able to separate instructions from their interpreter. There are many applications for this monad, and one of them is for implementing Trampolines, (which is a way to make recursion constant stack for languages that don't support tail call elimination, like JavaScript!).

Please see [Ken Scambler](http://twitter.com/KenScambler)'s [excellent talk](http://www.slideshare.net/kenbot/running-free-with-the-monads) and [example project](https://github.com/kenbot/free) to get an in-depth understanding of this very useful monad.

## Author

Written and maintained by Chris Myers [@cwmyers](https://twitter.com/cwmyers) and Jakub Strojewski [@ulfryk](https://twitter.com/ulfryk). Follow Monet.js at [@monetjs](http://twitter.com/monetjs).

[functionalJava]: http://functionaljava.org/
[gitZip]: https://github.com/monet/monet.js/archive/v0.9.3.zip
[gitTar]: https://github.com/monet/monet.js/archive/v0.9.3.tar.gz
[npm]: https://www.npmjs.com/
[scalaz]: https://github.com/scalaz/scalaz
