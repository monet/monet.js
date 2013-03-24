---
title: Home
layout: index
version: 0.2
dev-version: 0.2
---

## Introduction

So you've been forced to use JavaScript, eh? Well, don't write your will just yet, this library is what you want to
model all those monadic types that JavaScript (and well most languages) thoughtlessly omit.

If you know what a monad is then you are already an awesome programmer and if you don't, well... awesome is what you are
about to become.

This library is inspired by those that have come before, especially the [FunctionalJava][functionalJava] project.

We are still in the early stages of development and have only implemented a few types, but stay tuned for more monadic
goodness.

##Download

Download the [zip][gitZip] or [tar][gitTar] ball.
## Maybe

The `Maybe` type is the most common way of represented the `null` type with making the possibilities of `NullPointer`
issues disappear.

`Maybe` is effectively abstract and as two concrete subtypes: `Some` and `None`.

#### Creating an Maybe

	var maybe = Maybe.some(val);
	var maybe = Maybe.none();
	
### Functions
#### map(fn)
`map` takes a function (a -> b) and applies that function to the value inside the `Maybe` and returns another `Maybe`.
	
	maybe.map(fn) : Maybe

For example:

	maybe.some(123).map(function(val) {
		return val+1
	})
	=> 124

#### bind(fn)
`bind` takes a function that takes a value and returns an `Maybe`.  The value to the function will be supplied from the `Maybe` you are binding on.
            
	maybe.bind(fn) : Maybe

For example:

	maybe.bind(function(val) {
		if (val == "hi") {
			return maybe.some("world")
		} else {
			return maybe.none()
		}
	})


#### isSome()
`isSome` on a `Some` value will return `true` and will return `false` on a `None`.

	maybe.some("hi").isSome()
	=> true


#### isNone()
`isNone` on a `None` value will return `true` and will return `false` on a `Some`.

####some()
`some` will 'reduce' the `Maybe` to its value.

	maybe.some("hi").some()
	=> "hi"

####ap(Maybe[function])
The `ap` function implements the Applicative Functor pattern.  It takes as a parameter another Maybe type which contains a function. 

## Validation
Validation is a rather specific monad that can hold either a success value or a failure value (i.e. an error message or some other failure object).  Is is catamorphically identical to Either.

#### Creating a Validation

	var success = Validation.success(val);
	var failure = Validation.fail("some error");

###Functions
####map()
`map` takes a function (a -> b) and applies that function to the value inside the `success` side of the `Validation` and returns another `Validation`.

####bind(fn)
`bind` takes a function that takes a value and returns an `Validation`.  The value to the function will be supplied from the `Validation` you are binding on.
            
	validation.bind(fn) : validation

For example:

	validation.bind(function(val) {
		if (val == "hi") {
			return Validation,success("world")
		} else {
			return Validation.fail("wow, you really failed.")
		}
	})


####isSuccess()
Will return `true` if this is a successful validation, `false` otherwise. 

####isFail()
Will return `false` if this is a failed validation, `true` otherwise.

####success()
Will return the succesful value.

####fail()
Will return the failed value, usually an error message.

            
[functionalJava]: http://functionaljava.org/
[gitZip]: https://github.com/cwmyers/monad.js/zipball/master (zip format)
[gitTar]: https://github.com/cwmyers/monad.js/tarball/master (tar format)