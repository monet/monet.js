---
title: Home
layout: index
version: 0.6.1
dev-version: 0.6.1
---

## Introduction

So you've been forced to use JavaScript, eh? Well, don't write your will just yet, this library is what you want to
model all those monadic types that JavaScript (and well most languages) thoughtlessly omit.

If you know what a monad is then you are already an awesome programmer and if you don't, well... awesome is what you are
about to become.

This library is inspired by those that have come before, especially the [FunctionalJava][functionalJava] and [Scalaz][scalaz] projects.

While functional programming may be alien to you, this library is a simple way to introduce monads and pure functional programming into your daily practises.

##Download

Download the [zip][gitZip] or [tar][gitTar] ball.

##Source code

The source is available at: [http://github.com/cwmyers/monad.js](http://github.com/cwmyers/monad.js).

##Installation

Simply download and add to your html pages or we also support [bower].  You can also include `monad-pimp.js` which contains extra functions on the `Object.prototype`
for creating monads.

    <script type="text/javascript" src="monad.js"></script>
    <!-- Optionally -->
    <script type="text/javascript" src="monad-pimp.js"></script>

### Bower installation
Using [bower]:

	bower install monad.js

or to install a specific version

	bower install monad.js#{{ page.version }}
	
## Maybe

The `Maybe` type is the most common way of represented the `null` type with making the possibilities of `NullPointer`
issues disappear.

`Maybe` is effectively abstract and as two concrete subtypes: `Some` (also `Just`) and `None` (also `Nothing`).

#### Creating an Maybe

	var maybe = Maybe.some(val);
	var maybe = Maybe.none();
	var maybe = Maybe.fromNull(val);  // none if val is null, some otherwise
	
or more simply with the pimped method on Object.

	var maybe = "hello world".some()
	var maybe = val.some()
	
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

	Maybe.some("hi").some()
	=> "hi"
	
####orSome(value) *alias: orJust*
Will return the containing value inside the `Maybe` or return the supplied value.

	maybe.some("hi").orSome("bye")
	=> "hi"
	Maybe.none().orSome("bye")
	=> "bye"

####ap(Maybe(fn))
The `ap` function implements the Applicative Functor pattern.  It takes as a parameter another `Maybe` type which contains a function, and then applies that function to the value contained in the calling `Maybe`. 

	maybe.ap(maybeWithfn): Maybe

It may seem odd to want to apply a function to a monad that exists inside another monad, but this is particular useful for when you have a curried function being applied across many monads.

Here is an example for creating a string out of the result of a couple of `Maybe`s.  We use `curry()` which is a pimped method on Function so we can partially apply.

	var person = function (forename, surname, address) {
        return forename + " " + surname + " lives in " + address
    }.curry()

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

or with pimped methods on an object

	var success = val.success();
	var failure = "some error".fail();

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
    
####cata(failFn,successFn)

The catamorphism for validation.  If the validation is `success` the success function will be executed with the success value and the value of the function returned. Otherwise the `failure` function will be called with the failure value.

	var result = v.cata(function(failure) {
		return "oh dear it failed because " + failure
	}, function(success) {
		return "yay! " + success
	})
	
## IO
The `IO` monad is for isolating effects to maintain referential transparency in your software.  Essentially you create a description of your effects of which is performed as the last action in your programme.  The IO is lazy and will not be evaluated until the `perform` (*alias* `run`) method is called.

#### Creating an IO

	var ioAction = IO(function () { return $("#id").val() })

###Functions
####IO(fn) *alias: io*
The constructor for the `IO` monad.  It is a purely functional wrapper around the supplied effect and enables referential transparency in your software.
####bind(fn) *alias: flatMap*
Perform a monadic bind (flatMap) over the effect.  It takes a function that returns an `IO`. This will happen lazily and will not evaluate the effect.
####map(fn)
Performs a map over the result of the effect.  This will happen lazily and will not evaluate the effect.
####run *alias: perform*
Evaluates the effect inside the `IO` monad.  This can only be run once in your programme and at the very end.
###"Pimped" functions
####fn.io()
Wraps a supplied function in an `IO`.  Assumes no arguments will be supplied to the function.
	
	function() { return $("#id") }.io()
	
####fn.io1()
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

##Other useful functions
###Functions
####fn.compose(f1) *alias fn.o(fn1)*
Function composition.  `f.compose(g)` is equivalent to: 

	function compose(x) {
		return f(g(x))
	}
####fn.andThen(fn1)
Function composition flipped. `f.andThen(g)` is equivalent to:

	function compose(x) {
		return g(f(x))
	}

## Immutable lists

An immutable list is a list that has a head element and a tail. A tail is another list.  The empty list is represented by the `Nil` constructor.  An immutable list is also known as a "cons" list.  Whenever an element is added to the list a new list is created which is essentially a new head with a pointer to the existing list.

#### Creating a list

The easiest way to create a list is with the pimped method on Array.

	var myList = [1,2,3].list()

which is equivalent to:

	var myList = List(1, List(2, List(3, Nil)))

As you can see from the second example each List object contains a head element and the tail is just another list element.

###Functions
####cons(element)

`cons` will prepend the element to the front of the list and return a new list.  The existing list remains unchanged.

	var newList = myList.cons(4)
	// newList.toArray() == [4,1,2,3]
	// myList.toArray() == [1,2,3]

`cons` is also available as a pimped method on `Object.prototype`:

	var myList = ["a","b","c"].list()
	var newList = "z".cons(myList)
	newList.toArray() == ["z","a","b","c"]

####map(fn)

Maps the supplied function over the list.

	var list = [1,2,3].list().map(function(a) {
		return a+1
	})
	// list == [2,3,4]	

####flatMap(fn) *alias: bind()*

Maps the supplied function over the list and then flattens the returned list.  The supplied function must return a new list.
	
####foldLeft(initialValue)(function(acc, e))

`foldLeft` takes an initial value and a function and will 'reduce' the list to a single value.  The supplied function takes an accumulator as its first value and the current element in the list as its second argument.  The returned value from the function will be pass into the accumulator on the subsequent pass.

For example, say you wanted to add up a list of integers, your initial value would be `0` and your function would return the sum of the accumulator and the passed in element.

	var myList = [1,2,3,4].list()
	var sum = myList.foldLeft(0)(function(acc, e) {
		return e+acc
	})
	// sum == 10
	
####foldRight(initialValue)(function(e, acc))

Performs a fold right across the list.  Similar to `foldLeft` except the supplied function is first applied to the right most side of the list.

####append(list2)

Will append the second list to the current list.

	var list1 = [1,2,3].list()
	var list2 = [4,5,6].list()
	var list3 = list1.append(list2)
	// list3.toArray() == [1,2,3,4,5,6]


            
[functionalJava]: http://functionaljava.org/
[gitZip]: https://github.com/cwmyers/monad.js/zipball/master (zip format)
[gitTar]: https://github.com/cwmyers/monad.js/tarball/master (tar format)
[bower]: http://bower.io
[scalaz]: https://github.com/scalaz/scalaz
