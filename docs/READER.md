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
