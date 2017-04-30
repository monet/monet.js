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
