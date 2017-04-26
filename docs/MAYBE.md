# Maybe

The `Maybe` type is the most common way of representing *nothingness* (or the `null` type) with making the possibilities of `NullPointer` issues disappear.

`Maybe` is effectively abstract and has two concrete subtypes: `Some` (also `Just`) and `None` (also `Nothing`).

## Constructors

```javascript
Some(5)
Just(5)
// => Some(5)

Maybe.of('a')
Maybe.unit('a')
Maybe.pure('a')
Maybe.some('a')
Maybe.Some('a')
// => Some("a")

Maybe.fromNull('b')
Maybe.fromFalsy('b')
// => Some("a")

None()
Nothing()
Maybe.none()
Maybe.None()
Maybe.Nothing()
// => None

Maybe.fromNull()
Maybe.fromNull(null)
Maybe.fromNull(undefined)
// => None

Maybe.fromFalsy()
Maybe.fromFalsy(null)
Maybe.fromFalsy(0)
Maybe.fromFalsy('')
Maybe.fromFalsy(false)
// => None
```

**It's important to note that monet `Maybe` implementation threats `null` and `undefined` values in special way. Any attempt to provide `null` or `undefined` to constructor (other than `fromNull` or `fromFalsy`) will cause exception. Same will happen if it's mapped to `null` or `undefined`.**

### Creating a Maybe from pimped object

```javascript
const maybe = 'hello world'.some()
const maybe = val.some()
```

## Methods

### map

```scala
Maybe[A].map(fn: A => B) : Maybe[B]
```

`map` takes a function A => B and applies that function to the value inside the `Maybe` and returns another `Maybe`. For example:

```javascript
Some(123).map(val => val + 1)
// => Some(124)
```

**NOTE: Mapping to `null` or `undefined` will cause errors!**

### flatMap
**Aliases:** `bind`, `chain`

```scala
Maybe[A].flatMap(fn: A => Maybe[B]): Maybe[B]
```

`bind` takes a function that takes a value and returns a `Maybe`.  The value to the function will be supplied from the `Maybe` you are binding on. For example:

```javascript
const getWorld = (val) => val === 'hi' ? Some('world') : None()

Some('hi').flatMap(getWorld)
// => Some('world')

Some('bye').flatMap(getWorld)
// => None

None().flatMap(getWorld)
// => None
```

### fold

```scala
Maybe[A].fold(ifNone: B)(ifSomeFn: A => B): B
```

`fold` takes a default value and a function, and will 'reduce' the `Maybe` to a single value.  If the `Maybe` is a `None`, the supplied default value will be returned.  If the `Maybe` is a `Some`, the supplied function will be invoked with the contents of the `Maybe`, and its result will be returned. For example:

```javascript
None().fold(-1)(value => value.length)
// => -1

Some('hi').fold(-1)(value => value.length)
// => 2
```

### foldLeft

```scala
Maybe[A].foldLeft(initialValue: B)(fn: (acc: B, element: A) => B): B
```

`foldLeft` takes an initial value and a function, and will "reduce" the `Maybe` to a single value. The supplied function takes an accumulator as its first argument and the contents of the `Maybe` as its second. The returned value from the function will be passed into the accumulator on the subsequent pass. For example:

```javascript
None().foldLeft(10)((acc, value) => value.length + acc)
// => 10

Maybe.Some('hi').foldLeft(10)((acc, value) => value.length + acc)
// => 12
```

### foldRight

```scala
Maybe[A].foldRight(initialValue: B)(fn: (element: A, acc: B) => B): B
```

Performs a fold right across the `Maybe`. As `Maybe` can contain at most a single value, `foldRight` is functionally equivalent to `foldLeft` - but the supplied function arguments are swapped.

### isSome

**Alias:** `isJust`

```scala
Maybe[A].isSome(): Boolean
```

`isSome` on a `Some` value will return `true` and will return `false` on a `None`. For example:

```javascript
Some('hi').isSome()
// => true

None().isSome()
// => false
```

### isNone

**Alias:** `isNothing`

```scala
Maybe[A].isNone(): Boolean
```

`isNone` on a `None` value will return `true` and will return `false` on a `Some`. For example:

```javascript
None().isNone()
// => true

Some('hi').isNone()
// => false
```

### some 

**Alias:** `just`

```scala
Maybe[A].some(): A
```

`some` will 'reduce' the `Maybe` to its value.  But warning! It will throw an error if you attempt to do this on a none.  Use `orSome` instead.

For example:

```javascript
Some('hi').some()
// => 'hi'
```

#### orSome

**Alias:** `orJust`

```scala
Maybe[A].orSome(a: A) : A
```

Will return the containing value inside the `Maybe` or return the supplied value.

```javascript
Some('hi').orSome('bye')
// => 'hi'
None().orSome('bye')
// => 'bye'
```

### orNull

```scala
Maybe[A].orNull(): A | null
```

Returns the value inside the `Maybe` if it is a Some otherwise returns null.

### orElse

```scala
Maybe[A].orElse(Maybe[A]): Maybe[A]
```

Returns the Maybe if it is a Some otherwise returns the supplied Maybe.

### orNoneIf

**Alias:** `orNothingIf`

```scala
Maybe[A].orNoneIf(val: Boolean): Maybe[A]
```

Returns `None` if the boolean is true, otherwise pass through the maybe value.

### ap

```scala
Maybe[A].ap(Maybe[A=>B]): Maybe[B]
```

The `ap` function implements the Applicative Functor pattern.  It takes as a parameter another `Maybe` type which contains a function, and then applies that function to the value contained in the calling `Maybe`.

It may seem odd to want to apply a function to a monad that exists inside another monad, but this is particular useful for when you have a curried function being applied across many monads.

Here is an example for creating a string out of the result of a couple of `Maybe`s.  We use `curry()` which is a pimped method on Function so we can partially apply.

```ecmascript 6
const person = forename => surname => address => `${forename} ${surname} lives in ${address}`

const personString = Some('Dulwich, London')
  .ap(Some('Baker').ap(Some('Tom').map(person)))
  .some()

// => 'Tom Baker lives in Dulwich, London'
````

For further reading see [this excellent article](http://learnyouahaskell.com/functors-applicative-functors-and-monoids).

### contains

```scala
Maybe[A].contains(val: A): Boolean
```

Returns true if the `Maybe` is a Some containing the given value.

### forEach

```scala
Maybe[A].forEach(fn: A => ()): ()
```

Invoke a function applying a side-effect on the contents of the maybe if any.

### orElseRun

```scala
Maybe[A].orElseRun(fn: () => ()): ()
```

Invoke a parameterless side-effecting function if the maybe is None.

### toEither

```scala
Maybe[A].toEither(fail: E): Either[E,A]
```

Converts a Maybe to an Either

### toValidation

```scala
Maybe[A].toValidation(fail: E): Validation[E,A]
```

Converts a Maybe to a Validation.

### toList

```scala
Maybe[A].toList: List[A]
```

Converts to a list, returns an Empty list on None.

### filter

```scala
Maybe[A].filter(fn: A => Boolean): Maybe[A]
```

Convert to a `None` if predicate function return [falsy](https://developer.mozilla.org/pl/docs/Glossary/Falsy) value, otherwise return the same `Maybe`.
For example:

```javascript
Some('James').filter(val => val === 'James')
// => Some('James')

Some('John').filter(val => val === 'James')
// => None()
```
