# Either

Either (or the disjunct union) is a type that can either hold a value of type `A` or a value of type `B` but never at the same time.  Typically it is used to represent computations that can fail with an error.  Think of it as a better way to handle exceptions.  We think of an `Either` as having two sides, the success is held on the right and the failure on the left.  This is a right biased either which means that `map` and `flatMap` (`bind`) will operate on the right side of the either.

## Constructors

```javascript
Right([1, 3, 5])
// => Right([1,3,5])

Either.of('a')
Either.unit('a')
Either.pure('a')
Either.Right('a')
Either.right('a')
// => Right("a")

Left(2);
// => Left(2)

Either.Left('a')
Either.left('a')
// => Left("a")
```

### Creating an Either from pimped object

```javascript
const success = val.right()
const failure = 'some error'.left()
```

## Methods

### map

```scala
Either[E,A].map(fn: A => B): Either[E,B]
```

This will apply the supplied function over the right side of the either, if one exists, otherwise it returns the `Either` untouched. For example:

```javascript
Right(123).map(e => e + 1)
// => Right(124)

Left('grr').map(e => e + 1)
// => Left("grr")
```

### leftMap

```scala
Either[E,A].leftMap(fn: E => F): Either[F,A]
```

This will apply the supplied function over the left side of the either, if one exists, otherwise it returns the `Either` untouched. For example:

```javascript
Right('lol').leftMap(e => e + 1)
// => Right("lol")

Left(111).leftMap(e => e + 1)
// => Left(112)
```

### flatMap
**Aliases:** `bind`, `chain`

```scala
Either[E,A].flatMap(fn: A => Either[E,B]): Either[E,B]
```

This will perform a monadic bind over the right side of the either, otherwise it will do nothing.

### ap

```scala
Either[E,A].ap(v: Either[E,A=>B]): Either[E,B]
```

This takes an either that has a function on the right side of the either and then applies it to the right side of itself. This implements the applicative functor pattern.

### cata
**Alias:** `fold`

```scala
Either[E,A].cata(leftFn: E => X, rightFn: A => X): X
```

The catamorphism for either.  If the either is `right` the right function will be executed with the right value and the value of the function returned. Otherwise the `left` function will be called with the left value.

```javascript
either.cata(
  failure => `oh dear it failed because ${failure}`,
  success => `yay! ${success}`
)
```

### foldLeft

```scala
Either[E,A].foldLeft(initialValue: B)(fn: (acc: B, element: A) => B): B
```

`foldLeft` takes an initial value and a function, and will 'reduce' the `Either` to a single value. The supplied function takes an accumulator as its first argument and the contents of the right side of the `Either` as its second.  The returned value from the function will be passed into the accumulator on the subsequent pass. For example:

```javascript
Left('left').foldLeft(-1)((acc, value) => value.length)
// => -1

Right('right').foldLeft(-1)((acc, value)  => value.length)
// => 5
```

### foldRight

```scala
Either[E,A].foldRight(initialValue: B)(fn: (element: A, acc: B) => B): B
```

Performs a fold right across the right side of the `Either`. As a right `Either` can contain at most a single value, `foldRight` is functionally equivalent to `foldLeft`.

### bimap

```scala
Either[A,B].bimap(leftFn: A=>C, rightFn: B=>D): Either[C,D]
```

### isRight

```scala
Either[E,A].isRight(): Boolean
```

Returns true if this Either is right, false otherwise.

### isLeft

```scala
Either[E,A].isLeft(): Boolean
```

Returns true if this Either is left, false otherwise.

### right

```scala
Either[E,A].right(): A
```

Returns the value in the right side, otherwise throws an exception.

### left

```scala
Either[E,A].left(): E
```

Returns the value in the left side, otherwise throws an exception.

### contains

```scala
Either[E,A].contains(val: A): Boolean
```

Returns true if the `Either` is a right containing the given value.

### forEach

```scala
Either[E,A].forEach(fn: A => ()): ()
```

Invoke a function applying a side-effect on the right side of the Either if present.

### forEachLeft

```scala
Either[E,A].forEachLeft(fn: E => ()): ()
```

Invoke a function applying a side-effect on the left side of the Either if present.

### toValidation

```scala
Either[E,A].toValidation(): Validation[E,A]
```

Converts the `Either` to a `Validation`.

### toMaybe

```scala
Either[E,A].toMaybe(): Maybe[A]
```

Converts to a `Maybe` dropping the left side.
