# monet.js

[![Build Status](https://travis-ci.org/cwmyers/monet.js.png)](https://travis-ci.org/cwmyers/monet.js)


For people who wish they didn't have to programme in JavaScript. Full documentation at http://cwmyers.github.com/monet.js/


## Introduction

Monet is a library designed to bring great power to your JavaScript programming. It is a tool bag that assists Functional Programming by providing a rich set of Monads and other useful functions.

This library is inspired by those that have come before, especially the [FunctionalJava][functionalJava] and [Scalaz][scalaz] projects.

While functional programming may be alien to you, this library is a simple way to introduce monads and pure functional programming into your daily practises.

## Download

Download the [zip][gitZip] or [tar][gitTar] ball.

## Source code

The source is available at: [http://github.com/cwmyers/monet.js](http://github.com/cwmyers/monet.js).

## Installation

Simply download and add to your html pages or we also support [bower].  You can also include `monet-pimp.js` which contains extra functions on the `Object.prototype` for creating monads.

    <script type="text/javascript" src="monet.js"></script>
    <!-- Optionally -->
    <script type="text/javascript" src="monet-pimp.js"></script>

### Bower installation
Using [bower]:

	bower install monet

or to install a specific version

	bower install monet#0.8.10

### Node installation
Using [npm]:

	npm install monet

or to install a specific version

	npm install monet@0.8.10

## A note on types

#### Well it's JavaScript - there ain't any
As you know JavaScript isn't a strongly typed language.  This kinda sucks.  Types are a great help when it comes to functional programming as it makes the code more comprehensible and prevents a range of errors from being introduced.

Knowing the types of your functions and data is also important when writing documentation (such as this one), so we will invent some type annotations to make things more clear.  We will only do this in the function definition and *not* in the **concrete examples**.

#### Generic Types

JavaScript doesn't have generic types but it's useful to know about them when dealing with Monads.  For instance the `List` monad is a type that requires another type, such as a string or integer or some other type before it can be constructed.  So you would have a List of Strings or a List of Integers or generically a List of `A`s where `A` is a type you will supply.  Now of course this is JavaScript and you can do as you please even though it doesn't make sense.  But to make things clearer (hopefully) we will attempt to do show generics or *type parameters* thusly:

	List[A]

Which means a `List` of `A`s.  Though of course you will have to keep track of the types yourself.

#### Functions

	function x(a: A, b: B): C

And functions on a Monadic type that has been constructed with `A`

	Maybe[A].fromNull(a: A): Maybe[A]

##### Anonymous functions

For functions that take other functions as parameters (which are called *Higher order functions*) we will use an abbreviated way to represent that function
using a pseudo type lambda:

	A -> B

So,

	function x(a: A -> B, c: B -> C): C

means that function `x` takes two parameters that are both functions themselves. `a` is a function that takes a type `A` and returns a type `B` and `c` is a function that takes a type `B` and returns a type `C`. The function `x` will return a type `C`.

##### The Unit type

Some functions (or lambdas) do not take a parameter, and some do not return anything.  Will express this as:

	() -> A

or

	A -> ()

## All monads

Everything that is a monad in will implement the following functions.  The specific monads will be discussed in detail below.

#### bind *alias: flatMap, chain*

	Monad[A].bind(f: A -> Monad[B]): Monad[B]

Performs a monadic bind.

#### map

	Monad[A].map(f: A -> B): Monad[B]

#### unit *alias: pure, of*

	Monad.unit(A): Monad[A]

#### ap

	Monad[A].ap(m: Monad[A -> B]): Monad[B]

#### join

	Monad[Monad[A]].join(): Monad[A]

The inner and outer monads are the same type.

#### takeLeft

	Monad[A].takeLeft(m: Monad[B]): Monad[A]

Performs a combination of both monads and takes the left one.

For example:

	Some(1).takeLeft(Some(2))
	// result: Some(1)
	Some(1).takeLeft(None())
	// result: None
	None().takeLeft(Some(3))
	// result: None

#### takeRight

	Monad[A].takeRight(m: Monad[B]): Monad[B]

Performs a combination of both monads and takes the right one.

For example:

	Some(1).takeRight(Some(2))
	// result: Some(2)
	Some(1).takeRight(None())
	// result: None
	None().takeRight(Some(2))
	//result: None


## Maybe

The `Maybe` type is the most common way of representing *nothingness* (or the `null` type) with making the possibilities of `NullPointer` issues disappear.

`Maybe` is effectively abstract and has two concrete subtypes: `Some` (also `Just`) and `None` (also `Nothing`).

#### Creating an Maybe

	var maybe = Maybe.Some(val);
	var maybe = Maybe.None();
	var maybe = Maybe.fromNull(val);  // none if val is null, some otherwise

or more simply with the pimped method on Object.

	var maybe = "hello world".some()
	var maybe = val.some()

### Functions

#### map

	Maybe[A].map(fn: A -> B) : Maybe[B]

`map` takes a function (A -> B) and applies that function to the value inside the `Maybe` and returns another `Maybe`.

For example:

	Maybe.Some(123).map(function(val) {
		return val+1
	})
	=> 124


#### bind *alias: flatMap, chain*

	Maybe[A].bind(fn: A -> Maybe[B]): Maybe[B]

`bind` takes a function that takes a value and returns a `Maybe`.  The value to the function will be supplied from the `Maybe` you are binding on.


For example:

	maybe.bind(function(val) {
		if (val == "hi") {
			return Maybe.Some("world")
		} else {
			return Maybe.None()
		}
	})


#### isSome *alias: isJust*

	Maybe[A].isSome(): Boolean

`isSome` on a `Some` value will return `true` and will return `false` on a `None`.

For example:

	Maybe.some("hi").isSome()
	//result: true


#### isNone *alias: isNothing*

	Maybe[A].isNone(): Boolean

`isNone` on a `None` value will return `true` and will return `false` on a `Some`.

For example:

	Maybe.none().isNone()
	//result: true

#### some *alias: just*

	Maybe[A].some(): A

`some` will 'reduce' the `Maybe` to its value.  But warning! It will throw an error if you attempt to do this on a none.  Use `orSome` instead.

For example:

	Maybe.some("hi").some()
	//result: "hi"

#### orSome *alias: orJust*

	Maybe[A].orSome(a:A) : A

Will return the containing value inside the `Maybe` or return the supplied value.

	maybe.some("hi").orSome("bye")
	=> "hi"
	Maybe.none().orSome("bye")
	=> "bye"

#### orElse

	Maybe[A].orElse(Maybe[A]): Maybe[A]

Returns the Maybe if it is a Some otherwise returns the supplied Maybe.

#### ap

	Maybe[A].ap(Maybe[A->B]): Maybe[B]

The `ap` function implements the Applicative Functor pattern.  It takes as a parameter another `Maybe` type which contains a function, and then applies that function to the value contained in the calling `Maybe`.

It may seem odd to want to apply a function to a monad that exists inside another monad, but this is particular useful for when you have a curried function being applied across many monads.

Here is an example for creating a string out of the result of a couple of `Maybe`s.  We use `curry()` which is a pimped method on Function so we can partially apply.

	var person = function (forename, surname, address) {
        return forename + " " + surname + " lives in " + address
    }.curry()

    var maybeAddress = Maybe.just('Dulwich, London')
    var maybeSurname = Maybe.just('Baker')
    var maybeForename = Maybe.just('Tom')

    var personString = maybeAddress
                      .ap(maybeSurname
	                     .ap(maybeForename.map(person))).just()

    // result: "Tom Baker lives in Dulwich, London"

For further reading see [this excellent article](http://learnyouahaskell.com/functors-applicative-functors-and-monoids).

#### toEither

	Maybe[A].toEither(fail: E): Either[E,A]

Converts a Maybe to an Either

#### toValidation

	Maybe[A].toValidation(fail: E): Validation[E,A]

Converts a Maybe to a Validation.

#### toList

	Maybe[A].toList: List[A]

Converts to a list, returns an Empty list on None.

## Either
Either (or the disjunct union) is a type that can either hold a value of type `A` or a value of type `B` but never at the same time.  Typically
it is used to represent computations that can fail with an error.  Think of it as a better way to handle exceptions.  We think of an `Either`
as having two sides, the success is held on the right and the failure on the left.  This is a right biased either which means that `map`
and `flatMap` (`bind`) will operate on the right side of the either.

#### Creating an Either

	var success = Either.Right(val);
	var failure = Either.Left(val);

or with the pimped methods on object:

	var success = val.right()
	var failure = "some error".left()

### Functions

#### map

	Either[E,A].map(fn: A -> B): Either[E,B]

This will apply the supplied function over the right side of the either, if one exists, otherwise it returns the `Either` untouched.

For example:

	Right(123).map(function (e) {return e+1})
	// result: Right(124)
	Left("grr").map(function (e) {return e+1})
	// result: Left("grr")

#### flatMap *alias: bind, chain*

	Either[E,A].flatMap(fn: A -> Either[E,B]): Either[E,B]

This will perform a monadic bind over the right side of the either, otherwise it will do nothing.

#### ap

	Either[E,A].ap(v: Either[E, A -> B]): Either[E,B]

This takes an either that has a function on the right side of the either and then applies it to the right side of itself. This implements
the applicative functor pattern.

#### cata

	Either[E,A].cata(leftFn: E -> X, rightFn: A ->X): X

The catamorphism for either.  If the either is `right` the right function will be executed with the right value and the value of the function returned. Otherwise the `left` function will be called with the left value.

	For example:

		var result = either.cata(function(failure) {
			return "oh dear it failed because " + failure
		}, function(success) {
			return "yay! " + success
		})

#### bimap

	Either[A,B].bimap(leftFn: A->C, rightFn: B->D): Either[C,D]

#### isRight

	Either[E,A].isRight(): Boolean

Returns true if this Either is right, false otherwise.

#### isLeft

	Either[E,A].isLeft(): Boolean

Returns true if this Either is left, false otherwise.

#### right

	Either[E,A].right(): A

Returns the value in the right side, otherwise throws an exception.

#### left

	Either[E,A].left(): E

Returns the value in the left side, otherwise throws an exception.

#### toValidation

	Either[E,A].toValidation(): Validation[E,A]

Converts the `Either` to a `Validation`.

#### toMaybe

	Either[E,A].toMaybe(): Maybe[A]

Converts to a `Maybe` dropping the left side.

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

	Validation[E,A].map(fn:A -> B): Validation[E,A]

`map` takes a function (A -> B) and applies that function to the value inside the `success` side of the `Validation` and returns another `Validation`.

For example:

	Validation.success(123).map(function(val) { return val + 1})
	//result: Success(124)

#### bind *alias: flatMap, chain*

	Validation[E,A].bind(fn:A -> Validation[E,B]) : Validation[E,B]

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

	Validation[E,A].ap(v: Validation[E, A->B]) : Validation[E,B]

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

#### cata

	Validation[E,A].cata(failureFn: E->X, successFn: A->X): X

The catamorphism for validation.  If the validation is `success` the success function will be executed with the success value and the value of the function returned. Otherwise the `failure` function will be called with the failure value.

For example:

	var result = v.cata(function(failure) {
		return "oh dear it failed because " + failure
	}, function(success) {
		return "yay! " + success
	})

#### toEither

	Validation[E,A].toEither(): Either[E,A]

Converts a `Validation` to an `Either`

#### toMaybe

	Validation[E,A].toMaybe(): Maybe[A]

Converts to a `Maybe` dropping the failure side.

## Immutable lists

An immutable list is a list that has a head element and a tail. A tail is another list.  The empty list is represented by the `Nil` constructor.  An immutable list is also known as a "cons" list.  Whenever an element is added to the list a new list is created which is essentially a new head with a pointer to the existing list.

#### Creating a list

The easiest way to create a list is with the pimped method on Array, available in monet-pimp.js.

	var myList = [1,2,3].list()

which is equivalent to:

	var myList = List(1, List(2, List(3, Nil)))

As you can see from the second example each List object contains a head element and the tail is just another list element.

### Functions

#### cons

	List[A].cons(a: A) : List[A]

`cons` will prepend the element to the front of the list and return a new list.  The existing list remains unchanged.

For example:

	var newList = myList.cons(4)
	// newList.toArray() == [4,1,2,3]
	// myList.toArray() == [1,2,3]

`cons` is also available as a pimped method on `Object.prototype`:

	var myList = ["a","b","c"].list()
	var newList = "z".cons(myList)
	newList.toArray() == ["z","a","b","c"]

#### map

	List[A].map(fn: A->B): List[B]

Maps the supplied function over the list.

	var list = [1,2,3].list().map(function(a) {
		return a+1
	})
	// list == [2,3,4]

#### flatMap *alias: bind*

	List[A].flatMap(fn: A -> List[B]): List[B]

Maps the supplied function over the list and then flattens the returned list.  The supplied function must return a new list.

#### head

	List[A].head(): A

Returns the head of the list.

For example:

	[1,2,3].list().head()
	//result: 1

#### headMaybe

	List[A].headMaybe(): Maybe[A]

Returns the optional head of the list.


For example:

	[1,2,3,4].list().headMaybe()
	// result: Some(1)

	Nil.headMaybe()
	// result: None()

#### foldLeft

	List[A].foldLeft(initialValue: B)(fn: (acc:B, element:A) -> B): B

`foldLeft` takes an initial value and a function and will 'reduce' the list to a single value.  The supplied function takes an accumulator as its first value and the current element in the list as its second argument.  The returned value from the function will be pass into the accumulator on the subsequent pass.


For example, say you wanted to add up a list of integers, your initial value would be `0` and your function would return the sum of the accumulator and the passed in element.

	var myList = [1,2,3,4].list()
	var sum = myList.foldLeft(0)(function(acc, e) {
		return e+acc
	})
	// sum == 10

#### foldRight(initialValue)(function(e, acc))

	List[A].foldRight(initialValue: B)(fn: (element: A, acc: B) -> B): B

Performs a fold right across the list.  Similar to `foldLeft` except the supplied function is first applied to the right most side of the list.

#### append *alias: concat()*

	List[A].append(list: List[A]) : List[A]

Will append the second list to the current list.  Both list must be of the same type.

For example:

	var list1 = [1,2,3].list()
	var list2 = [4,5,6].list()
	var list3 = list1.append(list2)
	// list3.toArray() == [1,2,3,4,5,6]


#### sequence

	List[Monad[A]].sequence(Monad): Monad[List[A]]

Will `sequence` a list of monads.  The signature above is slightly hard to represent, but this function will sequence a list of any type of monad, but you will need to supply the name of the monad you are sequencing.

**Note: This version of sequence will only work with Monads that can cope with eager evaluations.  For lazy monads such as `IO` and `Reader` please use `lazySequence` or the explicit versions, such as `sequenceIO`.**

For example:

	[1.right(), 2.left()].list().sequence(Either) // For Eithers
	[1.some(), 2.none()].list().sequence(Maybe)

Or you can use the convenience methods like `sequenceMaybe` or `sequenceEither` below.  Note that since Validation is not a true monad it will not work as expected for this method; use `sequenceValidation` instead.

#### lazySequence

	List[Monad[A].lazySequence(Monad): Monad[List[A]]

This is the same as `sequence` except it caters for Monads that require laziness, such as `IO` and `Reader`.

#### sequenceMaybe

	List[Maybe[A]].sequenceMaybe(): Maybe[List[A]]

Takes a list of `Maybe`s and turns it into a `Maybe` `List`.  If the list contains at least one `None` value then a `None` will be returned, otherwise a `Some` will be returned with a list of all the values.

For example:

	var sequenced = [Some(1), Some(2), Some(3)].list().sequenceMaybe()
	// sequenced == Some([1,2,3]) <- That's an immutable list not an array

	var sequenced = [Some(1), Some(2), None, Some(3), None].list().sequenceMaybe()
	// sequenced == None

This is the same as calling:

	[Some(1), Some(2)].sequence(Maybe)

#### sequenceEither

	List[Either[E,A]].sequenceEither(): Either[E, List[A]]

This will sequence a `List` of `Either`s stopping on the first `Left` that it finds.  It will return either a `List` of the `Right` values or the first `Left` value it encounters.

For example:

	[1.right(), 2.right(), 3.right()].list().sequenceEither() == Right(List(1,2,3))
	[1.right(), 2.left(), 3.left()].list() == Left(2)

Note: Unlike `sequenceValidation` it does not accumulate the `Left` (or "failing") values, but rather stops execution and returns the first `Left`.

#### sequenceValidation

	List[Validation[E,A]].sequenceValidation(): Validation[List[E], List[A]]

Takes a list of `Validation`s and turns it into a `Validation` `List`.  It will collect all the `success` values into a list on the `Success` side of the validation or it accumulates the errors on the `Failure` side, if there are **any** failures.

	var sequenced = ["a".success(), "b".success(), "c".success()]
		.list().sequenceValidation()
	// sequenced == Success(["a", "b", "c"])

	var sequenced = ["a".success(),
	                 "b".success(),
                     "c".fail(),
                     "d".fail(),
                     "e".success()]
					.list().sequenceValidation()
	// sequenced == Fail(["c","d"])

#### sequenceIO

	List[IO[A]].sequenceIO(): IO[List[A]]

Will sequence a list of `IO` actions.

#### sequenceReader

	List[Reader[A]].sequenceReader(): Reader[List[A]]

Will sequence a list of `Reader`s.

#### reverse

	List[A].reverse(): List[A]

Returns a new list reversed.

	var list = [1,2,3].list().reverse()
	// list.toArray() == [3,2,1]


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

	NEL[A].map(fn: A -> B): NEL[B]

Maps a function over a NonEmptyList.

#### bind *alias: flatMap, chain*

	NEL[A].bind(fn: A -> NEL[B]): NEL[B]

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

	NEL[A].mapTails(fn: NEL[A] -> B): NEL[B]

Maps a function over the tails of the `NonEmptyList`.  Also known as `cobind` this is part of the comonad pattern.

For example:

	nonEmptyList.cobind(function (nel) {
	            return nel.foldLeft(0)(function(a,b){
	                return a+b
	            })
	        }
	//result: [10,9,7,4]

#### foldLeft

	NEL[A].foldLeft(initialValue: B)(fn: (acc:B, element:A) -> B): B

`foldLeft` takes an initial value and a function and will 'reduce' the list to a single value.  The supplied function takes an accumulator as its first value and the current element in the list as its second argument.  The returned value from the function will be pass into the accumulator on the subsequent pass.


For example, say you wanted to add up a non empty list of integers, your initial value would be `0` and your function would return the sum of the accumulator and the passed in element.

	var sum = nonEmptyList.foldLeft(0)(function(acc, e) {
		return e+acc
	})
	// sum == 10

#### foldRight(initialValue)(function(e, acc))

	NEL[A].foldRight(initialValue: B)(fn: (element: A, acc: B) -> B): B

Performs a fold right across the non empty list.  Similar to `foldLeft` except the supplied function is first applied to the right most side of the list.

#### reduceLeft(function(e,acc))

	NEL[A].reduceLeft(fn: (element: A, acc: A) -> A): A

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

#### fromList

	NEL.fromList(List[A]): Maybe[NEL[A]]

Returns an optional `NonEmptyList`.  If the supplied `List` is empty the result will be a `None`, otherwise a `NonEmptyList` wrapped in
a `Some` (or `Just`).

## IO
The `IO` monad is for isolating effects to maintain referential transparency in your software.  Essentially you create a description of your effects of which is performed as the last action in your programme.  The IO is lazy and will not be evaluated until the `perform` (*alias* `run`) method is called.

#### Creating an IO

	var ioAction = IO(function () { return $("#id").val() })

### Functions

#### IO *alias: io*

	IO[A](fn: () -> A): IO[A]

The constructor for the `IO` monad.  It is a purely functional wrapper around the supplied effect and enables referential transparency in your software.

#### bind *alias: flatMap*

	IO[A](fn: A -> IO[B]): IO[B]

Perform a monadic bind (flatMap) over the effect.  It takes a function that returns an `IO`. This will happen lazily and will not evaluate the effect.

Examples: see below

#### map

	IO[A](fn: A -> B): IO[B]

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

	Reader[A].map(f: A -> B): Reader[B]

Maps the supplied function over the `Reader`.

#### bind *alias: flatMap, chain*

	Reader[A].bind(f: A -> Reader[B]): Reader[B]

Performs a monadic bind over the `Reader`.

#### ap

	Reader[A].ap(a: Reader[A->B]): Reader[B]

Applies the function inside the supplied `Reader` to the value `A` in the outer `Reader`.  Applicative Functor pattern.

#### run

	Reader[A].run(config)

Executes the function wrapped in the `Reader` with the supplied `config`.

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

	Free[F[_], A].map(f: A -> B): Free[F[_],B]

Performs a map across the value inside the functor.

#### bind *alias: flatMap, chain*

	Free[F[_],A].bind(f: A -> Free[F[_], B]): Free[F[_],B]

Performs a monadic bind over the `Free`.

#### Free.liftF

	Free.liftF(F[A]): Free[F,A]

Lifts a Functor `F` into a `Free`.

#### resume

	Free[F[_],A].resume(): Either[F[Free[F,A]] , A]

Evalutates a single layer in the computation, returning either a suspension or a result.

#### go

	Free[F[_],A].go(f: F[Free[F, A]] -> Free[F, A]) : A

Runs the computation to the end, returning the final result, using the supplied functor `f` to extract the next `Free` from the suspension.

#### run

	Free[Function, A].run(): A

This function only makes sense for Tampolined computations where the supplied functor is a Function.  This will run the computation to the end returning the result `A`.

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

## Author

Written and maintained by Chris Myers [@cwmyers](http://twitter.com/cwmyers). Follow Monet.js at [@monetjs](http://twitter.com/monetjs).


[functionalJava]: http://functionaljava.org/
[gitZip]: https://github.com/cwmyers/monet.js/archive/v0.8.10.zip
[gitTar]: https://github.com/cwmyers/monet.js/archive/v0.8.10.tar.gz
[bower]: http://bower.io
[npm]: https://www.npmjs.com/
[scalaz]: https://github.com/scalaz/scalaz
