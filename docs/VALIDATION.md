# Validation

Validation is not quite a monad as it [doesn't quite follow the monad rules](http://stackoverflow.com/questions/12211776/why-isnt-validation-a-monad-scalaz7), even though it has the monad methods. It that can hold either a success value or a failure value (i.e. an error message or some other failure object) and has methods for accumulating errors. We will represent a Validation like this: `Validation[E,A]` where `E` represents the error type and `A` represents the success type.

## Constructors

```javascript
Success(2)
// => Success(2)

Validation.of('a')
Validation.unit('a')
Validation.pure('a')
Validation.Success('a')
Validation.success('a')
// => Success("a")

Fail('some error')
// => Fail("some error")

Validation.Fail(7777)
Validation.fail(7777)
// => Fail(7777)
```

### Creating a Validation from pimped object

```javascript
const success = val.success()
const failure = 'some error'.fail()
```

## Methods

### map

```scala
Validation[E,A].map(fn: A => B): Validation[E,A]
```

`map` takes a function (A => B) and applies that function to the value inside the `success` side of the `Validation` and returns another `Validation`. For example:

```javascript
Success(123).map(val => val + 1)
// => Success(124)


Fail('grr').map(val => val + 1)
// => Fail("grr")
```

### failMap

```scala
Validation[E,A].failMap(fn: E => F): Validation[F,A]
```

This will apply the supplied function over the left side of the either, if one exists, otherwise it returns the `Either` untouched. For example:

```javascript
Success('lol').failMap(e => e + 1)
// => Success("lol")

Fail([409, 409, 400, 400, 409]).failMap(err => new Set(err))
// => Fail(Set(2) {409, 400})
```


### flatMap
**Aliases:** `bind`, `chain`

```scala
Validation[E,A].bind(fn:A => Validation[E,B]) : Validation[E,B]
```

`bind` takes a function that takes a value and returns a `Validation`. The value to the function will be supplied from the `Validation` you are binding on. For example:

```javascript
validation.bind(val => val === 'hi' ? Success('world') : Fail('wow, you really failed.'))
```

### isSuccess

```scala
Validation[E,A].isSuccess() : Boolean
```

Will return `true` if this is a successful validation, `false` otherwise.

### isFail

```scala
Validation[E,A].isFail() : Boolean
```

Will return `false` if this is a failed validation, `true` otherwise.

### success

```scala
Validation[E,A].success() : A
```

Will return the successful value.


### fail

```scala
Validation[E,A].fail() : E
```

Will return the failed value, usually an error message.

### ap

```scala
Validation[E,A].ap(v: Validation[E, A=>B]) : Validation[E,B]
```

Implements the applicative functor pattern. `ap` will apply a function over the validation from within the supplied validation. If any of the validations are `fail`s then the function will collect the errors.

```javascript

const person = forename => surname => address =>
  `${forename} ${surname} lives at ${address}`;

const validateAddress = Success('Dulwich, London')
const validateSurname = Success('Baker')
const validateForename = Success('Tom')

validateAddress
  .ap(validateSurname
    .ap(validateForename.map(person)))
// => Success("Tom Baker lives at Dulwich, London")

Fail(['no address'])
  .ap(Fail(['no surname'])
    .ap(validateForename.map(person)))
// => Fail(["no address", "no surname"])
```

### cata
**Alias:** `fold`

```scala
Validation[E,A].cata(failureFn: E=>X, successFn: A=>X): X
```

The catamorphism for validation. If the validation is `success` the success function will be executed with the success value and the value of the function returned. Otherwise the `failure` function will be called with the failure value. For example:

```javascript
const getFailMsg = failure => `oh dear it failed because ${failure}`;
const getSuccessMsg = success => `yay! ${success}`;

Success('hurrah!').cata(getFailMsg, getSuccessMsg)
// => "yay! hurrah!"

Fail('there is nothing to celebrate').cata(getFailMsg, getSuccessMsg)
// => "oh dear it failed because there is nothing to celebrate"
```

### foldLeft

```scala
Validation[E,A].foldLeft(initialValue: B)(fn: (acc: B, element: A) -> B): B
```

`foldLeft` takes an initial value and a function, and will 'reduce' the `Validation` to a single value. The supplied function takes an accumulator as its first argument and the contents of the success side of the `Validation` as its second. The returned value from the function will be passed into the accumulator on the subsequent pass. For example:

```javascript
Fail('fail').foldLeft([])((acc, value) => acc.concat(value))
// => []

Success('success').foldLeft([])((acc, value) => acc.concat(value))
// => ['success']
```

### foldRight

```scala
Validation[E,A].foldRight(initialValue: B)(fn: (element: A, acc: B) -> B): B
```

Performs a fold right across the success side of the `Validation`. As a success `Validation` can contain at most a single value, `foldRight` is functionally equivalent to `foldLeft`.

### contains

```scala
Validation[E,A].contains(val: A): Boolean
```

Returns true if the `Validation` is a success containing the given value.

### forEach

```scala
Validation[E,A].forEach(fn: A => ()): ()
```

Invoke a function applying a side-effect on the contents of the Validation if it's a success.

### forEachFail

```scala
Validation[E,A].forEachFail(fn: E => ()): ()
```

Invoke a function applying a side-effect on the contents of the Validation if it's a failure.

### toEither

```scala
Validation[E,A].toEither(): Either[E,A]
```

Converts a `Validation` to an `Either`

### toMaybe

```scala
Validation[E,A].toMaybe(): Maybe[A]
```

Converts to a `Maybe` dropping the failure side.

### ...and undocumented
- equals
- join
- takeLeft
- takeRight
- bimap
- acc
