# monet.js

[![Build Status](https://travis-ci.org/cwmyers/monet.js.png)](https://travis-ci.org/cwmyers/monet.js)


For people who wish they didn't have to programme in JavaScript. Full documentation at http://cwmyers.github.com/monet.js/


## Introduction

Monet is a library designed to bring great power to your JavaScript programming. It is a tool bag that assists Functional Programming by providing a rich set of Monads and other useful functions.

This library is inspired by those that have come before, especially the [FunctionalJava][functionalJava] and [Scalaz][scalaz] projects.

While functional programming may be alien to you, this library is a simple way to introduce monads and pure functional programming into your daily practises.

## Documentation

Full detailed documentation can be found [here](docs/README.md)

## Download

Download the [zip][gitZip] or [tar][gitTar] ball.

## Source code

The source is available at: [http://github.com/cwmyers/monet.js](http://github.com/cwmyers/monet.js).

## Installation

Simply download and add to your html pages or we also support [bower]. You can also include `monet-pimp.js` which contains extra functions on the `Object.prototype` for creating monads.
```html
<script type="text/javascript" src="monet.js"></script>
<!-- Optionally -=>
<script type="text/javascript" src="monet-pimp.js"></script>
```
### Bower installation

```bash
bower install monet --save

# or to install a specific version
bower install monet#0.9.0-alpha.2
```

### NPM installation

```bash
npm install monet --save

# or to install a specific version
npm install monet@0.9.0-alpha.2
```

---

## Maybe

The `Maybe` type is the most common way of representing *nothingness* (or the `null` type) with making the possibilities of `NullPointer` issues disappear.

`Maybe` is effectively abstract and has two concrete subtypes: `Some` (also `Just`) and `None` (also `Nothing`).

[documentation](docs/MAYBE.md)

---

## Either
Either (or the disjunct union) is a type that can either hold a value of type `A` or a value of type `B` but never at the same time. Typically it is used to represent computations that can fail with an error.  Think of it as a better way to handle exceptions.  We think of an `Either` as having two sides, the success is held on the right and the failure on the left.  This is a right biased either which means that `map` and `flatMap` (`bind`) will operate on the right side of the either.

[documentation](docs/EITHER.md)

---

## Validation
Validation is not quite a monad as it [doesn't quite follow the monad rules](http://stackoverflow.com/questions/12211776/why-isnt-validation-a-monad-scalaz7), even though it has the monad methods.  It that can hold either a success value or a failure value (i.e. an error message or some other failure object) and has methods for accumulating errors.  We will represent a Validation like this: `Validation[E,A]` where `E` represents the error type and `A` represents the success type.

#### Creating a Validation

	var success = Validation.success(val);
	var failure = Validation.fail("some error");

or with pimped methods on an object

	var success = val.success();
	var failure = "some error".fail();

### Functions

#### map

	Validation[E,A].map(fn:A => B): Validation[E,A]

`map` takes a function (A => B) and applies that function to the value inside the `success` side of the `Validation` and returns another `Validation`.

For example:

	Validation.success(123).map(function(val) { return val + 1})
	//result: Success(124)

#### bind *alias: flatMap, chain*

	Validation[E,A].bind(fn:A => Validation[E,B]) : Validation[E,B]

`bind` takes a function that takes a value and returns a `Validation`.  The value to the function will be supplied from the `Validation` you are binding on.

For example:

	validation.bind(function(val) {
		if (val == "hi") {
			return Validation.success("world")
		} else {
			return Validation.fail("wow, you really failed.")
		}
	})


#### isSuccess

	Validation[E,A].isSuccess() : Boolean

Will return `true` if this is a successful validation, `false` otherwise.

#### isFail

	Validation[E,A].isFail() : Boolean

Will return `false` if this is a failed validation, `true` otherwise.

#### success

	Validation[E,A].success() : A

Will return the successful value.


#### fail

	Validation[E,A].fail() : E

Will return the failed value, usually an error message.

#### ap

	Validation[E,A].ap(v: Validation[E, A=>B]) : Validation[E,B]

Implements the applicative functor pattern.  `ap` will apply a function over the validation from within the supplied validation.  If any of the validations are `fail`s then the function will collect the errors.

	var person = function (forename, surname, address) {
        return forename + " " + surname + " lives at " + address
    }.curry();


    var validateAddress = Validation.success('Dulwich, London')
    var validateSurname = Validation.success('Baker')
    var validateForename = Validation.success('Tom')

    var personString = validateAddress.ap(validateSurname
    	.ap(validateForename.map(person))).success()

    // result: "Tom Baker lives at Dulwich, London"

    var result = Validation.fail(["no address"])
    	.ap(Validation.fail(["no surname"])
    	.ap(validateForename.map(person)))
    // result: Validation(["no address", "no surname"])

#### cata *alias: fold*

	Validation[E,A].cata(failureFn: E=>X, successFn: A=>X): X

The catamorphism for validation.  If the validation is `success` the success function will be executed with the success value and the value of the function returned. Otherwise the `failure` function will be called with the failure value.

For example:

	var result = v.cata(function(failure) {
		return "oh dear it failed because " + failure
	}, function(success) {
		return "yay! " + success
	})

#### foldLeft

	Validation[E,A].foldLeft(initialValue: B)(fn: (acc: B, element: A) -> B): B

`foldLeft` takes an initial value and a function, and will 'reduce' the `Validation` to a single value.  The supplied function takes an accumulator as its first argument and the contents of the success side of the `Validation` as its second.  The returned value from the function will be passed into the accumulator on the subsequent pass.


For example:

	Validation.fail("fail").foldLeft(-1)(function (acc, value) {
		return value.length
	})
	//result: -1

	Validation.success("success").foldLeft(-1)(function (acc, value) {
		return value.length
	})
	//result: 7

#### foldRight

	Validation[E,A].foldRight(initialValue: B)(fn: (element: A, acc: B) -> B): B

Performs a fold right across the success side of the `Validation`.  As a success `Validation` can contain at most a single value, `foldRight` is functionally equivalent to `foldLeft`.

#### contains

    Validation[E,A].contains(val: A): Boolean

Returns true if the `Validation` is a success containing the given value.

#### forEach

    Validation[E,A].forEach(fn: A => void): void

Invoke a function applying a side-effect on the contents of the Validation if it's a success.

#### forEachLeft

    Validation[E,A].forEachFail(fn: E => void): void

Invoke a function applying a side-effect on the contents of the Validation if it's a failure.

#### toEither

	Validation[E,A].toEither(): Either[E,A]

Converts a `Validation` to an `Either`

#### toMaybe

	Validation[E,A].toMaybe(): Maybe[A]

Converts to a `Maybe` dropping the failure side.

---

## Immutable lists

An immutable list is a list that has a head element and a tail. A tail is another list.  The empty list is represented by the `Nil` constructor.  An immutable list is also known as a "cons" list.  Whenever an element is added to the list a new list is created which is essentially a new head with a pointer to the existing list.

[documentation](docs/LIST.md)

---

## Non Empty Lists

Much like the immutable list, a Non Empty List can never be empty.  It implements the `comonad` pattern.  It has a guaranteed head (total)
and a guaranteed (total) tail.

#### Creating a NonEmptyList

	var nonEmptyList = NonEmptyList(1, [2,3,4].list())
	// alias
	var nonEmptyList = NEL(1, [2,3,4].list())
	// or
	var nonEmptyList = NonEmptyList(1, Nil)
	// or fromList which returns a Maybe[NonEmptyList].
	var maybeNonEmptyList = NonEmptyList.fromList([1,2,3,4].list())

Trying to create an empty `NonEmptyList` will throw an exception.

### Functions

#### map

	NEL[A].map(fn: A => B): NEL[B]

Maps a function over a NonEmptyList.

#### bind *alias: flatMap, chain*

	NEL[A].bind(fn: A => NEL[B]): NEL[B]

Performs a monadic bind over the NonEmptyList.

#### head *alias: copure, extract*

	NEL[A].head(): A

Returns the head of the NonEmptyList.  Also known as `copure` or `extract` this is part of the comonad pattern.

#### tail

	NEL[A].tail(): List[A]

Returns the tail of the `NonEmptyList`.

#### tails *alias: cojoin*

	NEL[A].tails(): NEL[NEL[A]]

Returns all the tails of the `NonEmptyList`.  Also known as `cojoin` this is part of the comonad pattern.  A list is considered
a tail of itself.

For example:

	NEL(1, [2,3,4].list()).tails()
	//result: [
	//          [ 1, 2, 3, 4 ],
	//          [ 2, 3, 4 ],
	//          [ 3, 4 ],
	//          [ 4 ]
	//        ]

#### mapTails *alias: cobind, coflatMap*

	NEL[A].mapTails(fn: NEL[A] => B): NEL[B]

Maps a function over the tails of the `NonEmptyList`.  Also known as `cobind` this is part of the comonad pattern.

For example:

	nonEmptyList.cobind(function (nel) {
	            return nel.foldLeft(0)(function(a,b){
	                return a+b
	            })
	        }
	//result: [10,9,7,4]

#### foldLeft

	NEL[A].foldLeft(initialValue: B)(fn: (acc: B, element: A) -> B): B

`foldLeft` takes an initial value and a function, and will 'reduce' the list to a single value.  The supplied function takes an accumulator as its first argument and the current element in the list as its second.  The returned value from the function will be pass into the accumulator on the subsequent pass.


For example, say you wanted to add up a non empty list of integers, your initial value would be `0` and your function would return the sum of the accumulator and the passed in element.

	var sum = nonEmptyList.foldLeft(0)(function(acc, e) {
		return e+acc
	})
	// sum == 10

#### foldRight

	NEL[A].foldRight(initialValue: B)(fn: (element: A, acc: B) => B): B

Performs a fold right across the non empty list.  Similar to `foldLeft` except the supplied function is first applied to the right most side of the list.

#### filter

	NEL[A].filter(fn: (element: A) => Boolean): List[A]

Returns a new list, keeping only elements for which the predicate returns true.

#### find

	NEL[A].find(fn: (element: A) => Boolean): Maybe[A]

Returns a `Maybe` containing the first element for which the predicate returns true, or `None`.

#### contains

    NEL[A].contains(val: A): Boolean

Returns true if the `NonEmptyList` contains the given value.

#### reduceLeft

	NEL[A].reduceLeft(fn: (element: A, acc: A) => A): A

Reduces a `NonEmptyList` of type `A` down to a single `A`.

	var nonEmptyList = NonEmptyList(1, [2,3,4].list())
	nonEmptyList.reduceLeft(function (a,b) {return a+b})
	// result: 10


#### append *alias: concat*

	NEL[A].append(n: NEL[A]): NEL[A]

Appends two NonEmptyLists together.

#### reverse

	NEL[A].reverse(): NEL[A]

Reverses the `NonEmptyList`.

#### forEach

    NEL[A].forEach(fn: A => void): void

Invoke a function applying a side-effect on each item in the list.

#### fromList

	NEL.fromList(List[A]): Maybe[NEL[A]]

Returns an optional `NonEmptyList`.  If the supplied `List` is empty the result will be a `None`, otherwise a `NonEmptyList` wrapped in
a `Some` (or `Just`).

---

## IO
The `IO` monad is for isolating effects to maintain referential transparency in your software.  Essentially you create a description of your effects of which is performed as the last action in your programme.  The IO is lazy and will not be evaluated until the `perform` (*alias* `run`) method is called.

#### Creating an IO

	var ioAction = IO(function () { return $("#id").val() })

### Functions

#### IO *alias: io*

	IO[A](fn: () => A): IO[A]

The constructor for the `IO` monad.  It is a purely functional wrapper around the supplied effect and enables referential transparency in your software.

#### bind *alias: flatMap*

	IO[A](fn: A => IO[B]): IO[B]

Perform a monadic bind (flatMap) over the effect.  It takes a function that returns an `IO`. This will happen lazily and will not evaluate the effect.

Examples: see below

#### map

	IO[A](fn: A => B): IO[B]

Performs a map over the result of the effect.  This will happen lazily and will not evaluate the effect.

#### run *alias: perform*
Evaluates the effect inside the `IO` monad.  This can only be run once in your programme and at the very end.

### "Pimped" functions

#### fn.io()
Wraps a supplied function in an `IO`.  Assumes no arguments will be supplied to the function.

	function() { return $("#id") }.io()

#### fn.io1()
Returns a function that will return an `IO` when one parameter is supplied.

	function(id) { return $(id) }.io1()

or more simply

	$.io1()

### Examples
Say we have a function to read from the DOM and a function to write to the DOM. *This example uses jQuery.*

	var read = function(id) {
		return $(id).text()
	}

	var write = function(id, value) {
		$(id).text(value)
	}

On their own both functions would have a side effect because they violate referential transparency.  The `read` function is dependent on an ever changing DOM  and thus subsequent calls to it would not produce the same result.  The `write` function obviously mutates the DOM and so it too is not referentially transparent, as each time it is called, an effect occurs.

We can modify this functions so that instead of performing these side-effects they will just return an `IO` with the yet-to-be-executed function inside it.

	var read = IO(function (id) { return $(id).text() })

	var write = function(id) {
		return IO(function(value) {
			$(id).text(value)
		})
	}

You can call `write(id)` until you are blue in the face but all it will do is return an `IO` with a function inside.

We can now call `map` and `flatMap` to chain this two effects together.  Say we wanted to read from a `div` covert all the text to uppercase and then write back to that `div`.

	var toUpper = function (text) { return text.toUpperCase() }
	var changeToUpperIO = read("#myId").map(toUpper).flatMap(write("#myId"))

So what is the type of `changeToUpperIO`?  Well it is the `IO` type.  And that means at this stage, **nothing has been executed yet**.  The DOM has not been read from, the text has not been mapped and the DOM has not been updated.  What we have is a **referentially transparent description** of our programme.

In other pure functional languages such as Haskell we would simply return this type back to the runtime, but in JavaScript we have to manage this ourselves.  So now let's run our effect.

	changeToUpperIO.run()

Now our DOM should be updated with the text converted to upper case.

It becomes much clearer which functions deal with IO and which functions simply deal with data.  `read` and `write` return an `IO` effect but `toUpper` simply converts a supplied string to upper case.  This pattern is what you will often find in your software, having an effect when you start (i.e. reading from a data source, network etc), performing transformations on the results of that effect and finally having an effect at the end (such as writing result to a database, disk, or DOM).

---

## Reader

The `Reader` monad is a wonderful solution to inject dependencies into your functions.  There are plenty of great resources to get your
teeth into the `Reader` monad such as [these great talks](http://functionaltalks.org/tag/reader-monad/).

The `Reader` monad provides a way to "weave" your configuration throughout your programme.

### Creating a Reader

Say you had this function which requires configuration:

	function createPrettyName(name, printer) {
		return printer.write("hello " + name)
	}

Calling this function from other functions that don't need the dependency `printer` is kind of awkward.

	function render(printer) {
		return createPrettyName("Tom", printer)
	}

One quick win would be to `curry` the `createPrettyName` function, and make `render` partially apply the function and let the caller of
`render` supply the printer.

	function createPrettyName(name, printer) {
		return printer.write("hello " + name)
	}.curry()

	function render() {
		return createPrettyName("Tom")
	}

This is better, but what if `render` wants to perform some sort of operation on the result of `createPrettyName`?  It would have to apply
the final parameter (i.e. the `printer`) before `createPrettyName` would execute.

This where the `Reader` monad comes in.  We could rewrite `createPrettyName` thusly:

	function createPrettyName(name) {
		return Reader(function(printer) {
			return printer.write("hello " + name)
		})
	}

To sweeten up the syntax a little we can also write:

	function createPrettyName(name, printer) {
		return printer.write("hello " + name)
	}.reader()

So now, when a name is supplied to `createPrettyName` the `Reader` monad is returned and being a monad it supports all the monadic goodness.

We can now get access to the result of `createPrettyName` through a `map`.

	function reader() {
		return createPrettyName("Tom").map(function (s) { return "---"+s+"---"})
	}

The top level of our programme would co-ordinate the injecting of the dependency by calling `run` on the resulting `Reader.`

	reader().run(new BoldPrinter())

### Functions

#### map

	Reader[A].map(f: A => B): Reader[B]

Maps the supplied function over the `Reader`.

#### bind *alias: flatMap, chain*

	Reader[A].bind(f: A => Reader[B]): Reader[B]

Performs a monadic bind over the `Reader`.

#### ap

	Reader[A].ap(a: Reader[A=>B]): Reader[B]

Applies the function inside the supplied `Reader` to the value `A` in the outer `Reader`.  Applicative Functor pattern.

#### run

	Reader[A].run(config)

Executes the function wrapped in the `Reader` with the supplied `config`.

---

## Free
The `Free` monad is a monad that is able to separate instructions from their interpreter.  There are many applications for this monad, and one of them is for implementing Trampolines, (which is a way to make recursion constant stack for languages that don't support tail call elimination, like JavaScript!).

Please see [Ken Scambler](http://twitter.com/KenScambler)'s [excellent talk](http://www.slideshare.net/kenbot/running-free-with-the-monads) and [example project](https://github.com/kenbot/free) to get an in-depth understanding of this very useful monad.

#### Creating a Free monad

The `Free` monad has two constructors, `Suspend` and `Return`, which represents the continuation of a calculation and the completion of one, respectively.

	Return(a: A): Free[F[_], A]
	Suspend(f: F[Free[F,A]]): Free[F[_], A]

	var a = Return(1)
	var sum = Suspend(Identity(Return(1))
	// or
	var sum = Free.liftF(Identity(1))

As you may see, `Return` wraps a value A, where as `Suspend`, wraps a `Functor` containing another `Free`.

### Functions

#### map

	Free[F[_], A].map(f: A => B): Free[F[_],B]

Performs a map across the value inside the functor.

#### bind *alias: flatMap, chain*

	Free[F[_],A].bind(f: A => Free[F[_], B]): Free[F[_],B]

Performs a monadic bind over the `Free`.

#### Free.liftF

	Free.liftF(F[A]): Free[F,A]

Lifts a Functor `F` into a `Free`.

#### resume

	Free[F[_],A].resume(): Either[F[Free[F,A]] , A]

Evalutates a single layer in the computation, returning either a suspension or a result.

#### go

	Free[F[_],A].go(f: F[Free[F, A]] => Free[F, A]) : A

Runs the computation to the end, returning the final result, using the supplied functor `f` to extract the next `Free` from the suspension.

#### run

	Free[Function, A].run(): A

This function only makes sense for Tampolined computations where the supplied functor is a Function.  This will run the computation to the end returning the result `A`.

---

## Other useful functions

### Functions

#### fn.compose(f1) *alias fn.o(fn1)*
Function composition.  `f.compose(g)` is equivalent to:

	function compose(x) {
		return f(g(x))
	}

#### fn.andThen(fn1)
Function composition flipped. `f.andThen(g)` is equivalent to:

	function compose(x) {
		return g(f(x))
	}

#### fn.curry()
This method on function will curry that function so that it can be partially applied. This implementation is quite flexible and allows
a method to be applied in the following ways:

    var sum = function(a,b,c) {
        return a+b+c
    }.curry()

    sum(1) // will return a function that takes b and c

    sum(1,2)
    //or
    sum(1)(2) // will return a function that takes c

    sum(1,2,3)
    //or
    sum(1)(2)(3)
    //or
    sum(1,2)(3)
    //or
    sum(1)(2,3)
    // or nearly any other combination...
    // will return 6

---

## Author

Written and maintained by Chris Myers [@cwmyers](https://twitter.com/cwmyers) and Jakub Strojewski [@ulfryk](https://twitter.com/ulfryk). Follow Monet.js at [@monetjs](http://twitter.com/monetjs).


[functionalJava]: http://functionaljava.org/
[gitZip]: https://github.com/cwmyers/monet.js/archive/v0.8.10.zip
[gitTar]: https://github.com/cwmyers/monet.js/archive/v0.8.10.tar.gz
[bower]: http://bower.io
[npm]: https://www.npmjs.com/
[scalaz]: https://github.com/scalaz/scalaz
