# MonetJS documentation

## A note on types

### Well it's JavaScript - there ain't any

As you know JavaScript isn't a strongly typed language.  This kinda sucks.  Types are a great help when it comes to functional programming as it makes the code more comprehensible and prevents a range of errors from being introduced.

Knowing the types of your functions and data is also important when writing documentation (such as this one), so we will invent some type annotations to make things more clear.  We will only do this in the function definition and *not* in the **concrete examples**.

### Generic Types

JavaScript doesn't have generic types but it's useful to know about them when dealing with Monads.  For instance the `List` monad is a type that requires another type, such as a string or integer or some other type before it can be constructed.  So you would have a List of Strings or a List of Integers or generically a List of `A`s where `A` is a type you will supply.  Now of course this is JavaScript and you can do as you please even though it doesn't make sense.  But to make things clearer (hopefully) we will attempt to do show generics or *type parameters* thusly:

```scala
List[A]
```

Which means a `List` of `A`s.  Though of course you will have to keep track of the types yourself.

### Functions

```typescript
function x(a: A, b: B): C
```

And functions on a Monadic type that has been constructed with `A`

```scala
Maybe[A].fromNull(a: A): Maybe[A]
```

#### Anonymous functions

For functions that take other functions as parameters (which are called *Higher order functions*) we will use an abbreviated way to represent that function using a pseudo type lambda:

```scala
A => B
```

So,

```scala
x: (a: A => B, c: B => C) => C
```

means that function `x` takes two parameters that are both functions themselves. `a` is a function that takes a type `A` and returns a type `B` and `c` is a function that takes a type `B` and returns a type `C`. The function `x` will return a type `C`.

#### The Unit type

Some functions (or lambdas) do not take a parameter, and some do not return anything.  Will express this as:

```scala
() => A
```

or

```scala
A => ()
```

## All monads

Everything that is a monad in will implement the following functions. The specific monads will be discussed in detail below.

### bind
**Aliases:** `flatMap`, `chain`

```scala
Monad[A].bind(f: A => Monad[B]): Monad[B]
```

Performs a monadic bind.

### map

```scala
Monad[A].map(f: A => B): Monad[B]
```

### unit
**Aliases:** `pure`, `of`

```scala
Monad.unit(A): Monad[A]
```

### ap

```scala
Monad[A].ap(m: Monad[A => B]): Monad[B]
```

### join

```scala
Monad[Monad[A]].join(): Monad[A]
```

The inner and outer monads are the same type.

### takeLeft

```scala
Monad[A].takeLeft(m: Monad[B]): Monad[A]
```

Performs a combination of both monads and takes the left one. For example:

```javascript
Some(1).takeLeft(Some(2))
// => Some(1)

Some(1).takeLeft(None())
// => None

None().takeLeft(Some(3))
// => None
```

### takeRight

```scala
Monad[A].takeRight(m: Monad[B]): Monad[B]
```

Performs a combination of both monads and takes the right one. For example:

```javascript
Some(1).takeRight(Some(2))
// => Some(2)

Some(1).takeRight(None())
// => None

None().takeRight(Some(2))
// => None
```



---
---
---

## Maybe

TBD…

## Either

TBD…

## Validation

TBD…

## [List](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md)

- [cons](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#cons)
- [map](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#map)
- [flatMap](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#flatmap)
- [bind](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#flatmap)
- [chain](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#flatmap)
- [head](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#head)
- [headMaybe](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#headmaybe)
- [foldLeft](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#foldleft)
- [foldRight](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#foldright)
- [append](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#append)
- [concat](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#append)
- [filter](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#filter)
- [contains](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#contains)
- [find](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#find)
- [sequence](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#sequence)
- [sequenceMaybe](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#sequencemaybe)
- [sequenceEither](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#sequenceeither)
- [sequenceValidation](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#sequencevalidation)
- [sequenceIO](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#sequenceio)
- [sequenceReader](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#sequencereader)
- [reverse](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#reverse)
- [forEach](https://github.com/cwmyers/monet.js/blob/master/docs/LIST.md#foreach)
- join
- takeLeft
- takeRight
- ap
- snoc
- isNEL
- size
- tail
- tails
- flatten
- flattenMaybe
- toArray

## Non Empty List

TBD…

## IO

TBD…


## Reader

TBD…

## Free

TBD…

## Other useful functions ( _Monet-Pimp_ )

TBD…
