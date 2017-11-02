# MonetJS documentation

## A note on types

### Well it's JavaScript - there ain't any

As you know JavaScript isn't a strongly typed language. This kinda sucks. Types are a great help when it comes to functional programming as it makes the code more comprehensible and prevents a range of errors from being introduced.

Knowing the types of your functions and data is also important when writing documentation (such as this one), so we will invent some type annotations to make things more clear. We will only do this in the function definition and *not* in the **concrete examples**.

### Generic Types

JavaScript doesn't have generic types but it's useful to know about them when dealing with Monads. For instance the `List` monad is a type that requires another type, such as a string or integer or some other type before it can be constructed. So you would have a List of Strings or a List of Integers or generically a List of `A`s where `A` is a type you will supply. Now of course this is JavaScript and you can do as you please even though it doesn't make sense. But to make things clearer (hopefully) we will attempt to do show generics or *type parameters* thusly:

```scala
List[A]
```

Which means a `List` of `A`s. Though of course you will have to keep track of the types yourself.

### Functions

```scala
(a: A, b: B) => C
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

Some functions (or lambdas) do not take a parameter, and some do not return anythingWill express this as:

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

## [Maybe](MAYBE.md)

- [map](MAYBE.md#map)
- [flatMap](MAYBE.md#flatmap)
- [bind](MAYBE.md#flatmap)
- [chain](MAYBE.md#flatmap)
- [cata](MAYBE.md#cata)
- [fold](MAYBE.md#fold)
- [foldLeft](MAYBE.md#foldleft)
- [foldRight](MAYBE.md#foldright)
- [isSome](MAYBE.md#issome)
- [isJust](MAYBE.md#issome)
- [isNone](MAYBE.md#isnone)
- [isNothing](MAYBE.md#isnone)
- [some](MAYBE.md#some)
- [just](MAYBE.md#some)
- [orSome](MAYBE.md#orsome)
- [orJust](MAYBE.md#orsome)
- [orNull](MAYBE.md#ornull)
- [orElse](MAYBE.md#orelse)
- [orNoneIf](MAYBE.md#ornoneif)
- [orNothingIf](MAYBE.md#ornoneif)
- [ap](MAYBE.md#ap)
- [contains](MAYBE.md#contains)
- [forEach](MAYBE.md#foreach)
- [orElseRun](MAYBE.md#orelserun)
- [toEither](MAYBE.md#toeither)
- [toValidation](MAYBE.md#tovalidation)
- [toList](MAYBE.md#tolist)
- [filter](MAYBE.md#filter)
- equals
- join
- takeLeft
- takeRight

## [Either](EITHER.md)

- [map](EITHER.md#map)
- [leftMap](EITHER.md#leftmap)
- [flatMap](EITHER.md#flatmap)
- [bind](EITHER.md#flatmap)
- [chain](EITHER.md#flatmap)
- [ap](EITHER.md#ap)
- [cata](EITHER.md#cata)
- [fold](EITHER.md#cata)
- [foldLeft](EITHER.md#foldleft)
- [foldRight](EITHER.md#foldright)
- [bimap](EITHER.md#bimap)
- [isRight](EITHER.md#isright)
- [isLeft](EITHER.md#isleft)
- [right](EITHER.md#right)
- [left](EITHER.md#left)
- [contains](EITHER.md#contains)
- [forEach](EITHER.md#foreach)
- [forEachLeft](EITHER.md#foreachleft)
- [toValidation](EITHER.md#tovalidation)
- [toMaybe](EITHER.md#tomaybe)
- equals
- join
- takeLeft
- takeRight

## [Validation](VALIDATION.md)

- [map](VALIDATION.md#map)
- [failMap](VALIDATION.md#failmap)
- [flatMap](VALIDATION.md#flatmap)
- [bind](VALIDATION.md#flatmap)
- [chain](VALIDATION.md#flatmap)
- [isSuccess](VALIDATION.md#issuccess)
- [isFail](VALIDATION.md#isfail)
- [success](VALIDATION.md#success)
- [fail](VALIDATION.md#fail)
- [ap](VALIDATION.md#ap)
- [cata](VALIDATION.md#cata)
- [fold](VALIDATION.md#cata)
- [foldLeft](VALIDATION.md#foldleft)
- [foldRight](VALIDATION.md#foldright)
- [contains](VALIDATION.md#contains)
- [forEach](VALIDATION.md#foreach)
- [forEachFail](VALIDATION.md#foreachfail)
- [toEither](VALIDATION.md#toeither)
- [toMaybe](VALIDATION.md#tomaybe)
- equals
- join
- takeLeft
- takeRight
- bimap
- acc

## [List](LIST.md)

- [cons](LIST.md#cons)
- [map](LIST.md#map)
- [flatMap](LIST.md#flatmap)
- [bind](LIST.md#flatmap)
- [chain](LIST.md#flatmap)
- [head](LIST.md#head)
- [headMaybe](LIST.md#headmaybe)
- [foldLeft](LIST.md#foldleft)
- [foldRight](LIST.md#foldright)
- [append](LIST.md#append)
- [concat](LIST.md#append)
- [filter](LIST.md#filter)
- [contains](LIST.md#contains)
- [find](LIST.md#find)
- [sequence](LIST.md#sequence)
- [sequenceMaybe](LIST.md#sequencemaybe)
- [sequenceEither](LIST.md#sequenceeither)
- [sequenceValidation](LIST.md#sequencevalidation)
- [sequenceIO](LIST.md#sequenceio)
- [sequenceReader](LIST.md#sequencereader)
- [reverse](LIST.md#reverse)
- [forEach](LIST.md#foreach)
- equals
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

## [Non Empty List](NEL.md)

- [map](NEL.md#map)
- [flatMap](NEL.md#flatmap)
- [bind](NEL.md#flatmap)
- [chain](NEL.md#flatmap)
- [head](NEL.md#head)
- [extract](NEL.md#head)
- [copure](NEL.md#head)
- [tail](NEL.md#tail)
- [tails](NEL.md#tails)
- [cojoin](NEL.md#tails)
- [mapTails](NEL.md#maptails)
- [cobind](NEL.md#maptails)
- [coflatMap](NEL.md#maptails)
- [foldLeft](NEL.md#foldleft)
- [foldRight](NEL.md#foldright)
- [filter](NEL.md#filter)
- [find](NEL.md#find)
- [contains](NEL.md#contains)
- [reduceLeft](NEL.md#reduceleft)
- [append](NEL.md#append)
- [concat](NEL.md#append)
- [reverse](NEL.md#reverse)
- [forEach](NEL.md#foreach)
- takeLeft
- takeRight
- ap
- isNEL
- size
- toArray
- toList
- **BROKEN** join
- **UNIMPLEMENTED** cons
- **UNIMPLEMENTED** snoc

## [IO](IO.md)

- [flatMap](IO.md#flatmap)
- [bind](IO.md#flatmap)
- [chain](IO.md#flatmap)
- [map](IO.md#map)
- [run](IO.md#run)
- [perform](IO.md#run)
- [performUnsafeIO](IO.md#run)
- join
- takeLeft
- takeRight
- ap

## [Reader](READER.md)

- [map](READER.md#map)
- [flatMap](READER.md#flatmap)
- [bind](READER.md#flatmap)
- [chain](READER.md#flatmap)
- [ap](READER.md#ap)
- [run](READER.md#run)
- join
- takeLeft
- takeRight
- local

## [Free](FREE.md)

- [map](FREE.md#map)
- [flatMap](FREE.md#flatmap)
- [bind](FREE.md#flatmap)
- [chain](FREE.md#flatmap)
- [resume](FREE.md#resume)
- [go](FREE.md#go)
- join
- takeLeft
- takeRight

## [Other useful functions (monet-pimp)](PIMP.md)

### [Function](PIMP.md#function)
- [compose](PIMP.md#fncomposef1)
- [andThen](PIMP.md#fnandthenfn1)
- [curry](PIMP.md#fncurry)
- io
- io1
- reader

### Object
- cons
- some
- success
- fail
- right
- left

### Array
- list
