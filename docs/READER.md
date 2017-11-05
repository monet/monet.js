# Reader

The `Reader` monad is a wonderful solution to inject dependencies into your functions. There are plenty of great resources to get your teeth into the `Reader` monad such as [these great talks](http://functionaltalks.org/tag/reader-monad/).

The `Reader` monad provides a way to "weave" your configuration throughout your programme.

## Creating a Reader

Say you had this function which requires configuration:

```javascript
const createPrettyName = (name, printer) => printer.write("hello " + name)
```

Calling this function from other functions that don't need the dependency `printer` is kind of awkward.

```javascript
const render = printer => createPrettyName("Tom", printer)
```

One quick win would be to `curry` the `createPrettyName` function, and make `render` partially apply the function and let the caller of
`render` supply the printer.

```javascript
const createPrettyName = name => printer => printer.write("hello " + name)

const render = () => createPrettyName("Tom")
```

This is better, but what if `render` wants to perform some sort of operation on the result of `createPrettyName`? It would have to apply
the final parameter (i.e. the `printer`) before `createPrettyName` would execute.

This where the `Reader` monad comes in. We could rewrite `createPrettyName` thusly:

```javascript
const createPrettyName = name =>
  Reader(printer => printer.write("hello " + name))
```

To sweeten up the syntax a little we can also write (using `monet-pimp` module):

```javascript
const createPrettyName = ((name, printer) => printer.write("hello " + name)).reader()
```

So now, when a name is supplied to `createPrettyName` the `Reader` monad is returned and being a monad it supports all the monadic goodness.

We can now get access to the result of `createPrettyName` through a `map`.

```javascript
const reader = () =>
  createPrettyName("Tom").map(s => `---${s}---`)
```

The top level of our programme would co-ordinate the injecting of the dependency by calling `run` on the resulting `Reader.`

```javascript
reader().run(new BoldPrinter())
````

## Methods

### map

```scala
Reader[E, A].map(f: A => B): Reader[E, B]
```

Maps the supplied function over the `Reader`.

### flatMap

**Aliases:** bind, chain

```scala
Reader[E, A].bind(fn: A => Reader[E, B]): Reader[E, B]
```

Performs a monadic bind over the `Reader`.

### ap

```scala
Reader[E, A].ap(a: Reader[E, A=>B]): Reader[E, B]
```

Applies the function inside the supplied `Reader` to the value `A` in the outer `Reader`. Applicative Functor pattern.

### run

```scala
Reader[E, A].run(env: E): A;
```

Executes the function wrapped in the `Reader` with the supplied `config`.

### ...and undocumented
- join
- takeLeft
- takeRight
- local
