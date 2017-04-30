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
