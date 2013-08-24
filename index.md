---
title: Home
layout: index
version: 0.4.1
dev-version: 0.4.1
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

##Installation

Simply download and add to your html pages or we also support [bower].

### Bower installation
Using [bower]:

	bower install monad.js

or to install a specific version

	bower install monad.js#0.4.0
	
## Maybe

The `Maybe` type is the most common way of represented the `null` type with making the possibilities of `NullPointer`
issues disappear.

`Maybe` is effectively abstract and as two concrete subtypes: `Some` (also `Just`) and `None` (also `Nothing`).

#### Creating an Maybe

	var maybe = Maybe.some(val);
	var maybe = Maybe.none();
	var maybe = Maybe.fromNull(val);  // none if val is null, some otherwise
	
### Functions
#### map(fn)
`map` takes a function (a -> b) and applies that function to the value inside the `Maybe` and returns another `Maybe`.
	
	maybe.map(fn) : Maybe

For example:

	maybe.some(123).map(function(val) {
		return val+1
	})
	=> 124

#### bind(fn) *alias: flatMap*
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


#### isSome() *alias: isJust*
`isSome` on a `Some` value will return `true` and will return `false` on a `None`.

	maybe.some("hi").isSome()
	=> true


#### isNone() *alias: isNothing*
`isNone` on a `None` value will return `true` and will return `false` on a `Some`.

####some() *alias: just*
`some` will 'reduce' the `Maybe` to its value.

	maybe.some("hi").some()
	=> "hi"

####ap(Maybe(fn))
The `ap` function implements the Applicative Functor pattern.  It takes as a parameter another `Maybe` type which contains a function, and then applies that function to the value contained in the calling `Maybe`. 

	maybe.ap(maybeWithfn): Maybe

It may seem odd to want to apply a function to a monad that exists inside another monad, but this is particular useful for when you have a curried function being applied across many monads.

Here is an example for creating a string out of the result of a couple of `Maybe`s.  The example uses [Functional Javascript] to partially apply the function.

	var person = function (forename, surname, address) {
        return forename + " " + surname + " lives in " + address
    }.partial(_,_,_)

    var maybeAddress = Maybe.just('Dulwich, London')
    var maybeSurname = Maybe.just('Baker')
    var maybeForename = Maybe.just('Tom')
    
    var personString = maybeAddress.ap(maybeSurname.ap(maybeForename.map(person))).just()
    
    // result: "Tom Baker lives in Dulwich, London"

For further reading see [this excellent article](http://learnyouahaskell.com/functors-applicative-functors-and-monoids).
	

## Validation
Validation is not quite a monad as it [doesn't quite follow the monad rules](http://stackoverflow.com/questions/12211776/why-isnt-validation-a-monad-scalaz7), even though it has the monad methods.  It that can hold either a success value or a failure value (i.e. an error message or some other failure object) and has methods for accumulating errors.

#### Creating a Validation

	var success = Validation.success(val);
	var failure = Validation.fail("some error");

###Functions
####map()
`map` takes a function (a -> b) and applies that function to the value inside the `success` side of the `Validation` and returns another `Validation`.

####bind(fn) *alias: flatMap*
`bind` takes a function that takes a value and returns an `Validation`.  The value to the function will be supplied from the `Validation` you are binding on.
            
	validation.bind(fn) : validation

For example:

	validation.bind(function(val) {
		if (val == "hi") {
			return Validation.success("world")
		} else {
			return Validation.fail("wow, you really failed.")
		}
	})


####isSuccess()
Will return `true` if this is a successful validation, `false` otherwise. 

####isFail()
Will return `false` if this is a failed validation, `true` otherwise.

####success()
Will return the successful value.

####fail()
Will return the failed value, usually an error message.

####ap(Validation(fn))

Implements the applicative functor pattern.  `ap` will apply a function over the validation from within the supplied validation.  If any of the validations are `fail`s then the function will collect the errors.

	var person = function (forename, surname, address) {
        return forename + " " + surname + " lives at " + address
    };
    var personCurried = person.partial(_,_,_)

    var validateAddress = Validation.success('Dulwich, London')
    var validateSurname = Validation.success('Baker')
    var validateForename = Validation.success('Tom')
    
    var personString = validateAddress.ap(validateSurname
    	.ap(validateForename.map(personCurried))).success()
    
    // result: "Tom Baker lives at Dulwich, London"
    
    var result = Validation.fail(["no address"])
    	.ap(Validation.fail(["no surname"])
    	.ap(validateForename.map(personCurried)))
    // result: Validation(["no address", "no surname"])
    
####cata(failFn,successFn)

The catamorphism for validation.  If the validation is `success` the success function will be executed with the success value and the value of the function returned. Otherwise the `failure` function will be called with the failure value.

	var result = v.cata(function(failure) {
		return "oh dear it failed because " + failure
	}, function(success) {
		return "yay! " + success
	})
	
## IO
The `IO` monad is for isolating effects to maintain referential transparency in your software.  Essentially you create a description of your effects of which is performed as the last action in your programme.  The IO is lazy and will not be evaluated until the `perform` (*alias* `run`) method is called.

###Functions
####IO(fn) *alias: io*
The constructor for the `IO` monad.  It is a purely functional wrapper around the supplied effect and enables referential transparency in your software.
####bind(fn) *alias: flatMap*
Perform a monadic bind (flatMap) over the effect.  This will happen lazily and will not evaluate the effect.
####map(fn)
Performs a map over the result of the effect.  This will happen lazily and will not evaluate the effect.
####run *alias: perform*
Evaluates the effect inside the `IO` monad.  This can only be run once in your programme and at the very end.
            
[functionalJava]: http://functionaljava.org/
[Functional Javascript]: http://osteele.com/sources/javascript/functional/
[gitZip]: https://github.com/cwmyers/monad.js/zipball/master (zip format)
[gitTar]: https://github.com/cwmyers/monad.js/tarball/master (tar format)
[bower]: http://bower.io