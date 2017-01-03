# Immutable lists

An immutable list is a list that has a head element and a tail. A tail is another list. The empty list is represented by the `Nil` constructor. An immutable list is also known as a "cons" list.  Whenever an element is added to the list a new list is created which is essentially a new head with a pointer to the existing list.

## Constructors

```javascript
List();
// => Nil

List('a');
// => List('a')

List('a' List('b', List('c')));
// => List('a', 'b', 'c')

List.of('a')
List.unit('a')
List.pure('a')
// => List('a');

List.fromArray(['a', 'b', 'c']);
// => List('a', 'b', 'c')
```

### Creating a list from pimped array

A list can be created also with the pimped method on Array, available in `monet-pimp.js`.

```javascript
const myList = [1,2,3].list()
```

which is equivalent to:

```javascript
const myList = List(1, List(2, List(3, Nil)))
```

### TODO's

There will be added also `List.from` that will accept anything implementing iterable pattern:

```javascript
const unique = new Set(['a', 'b', 'a', 'b', 'c', 'c', 'a']);
List.from(unique);
// => List('a', 'b', 'c')
```

## Methods

### cons

```scala
List[A].cons(element: A): List[A]
```

`cons` will prepend the element to the front of the list and return a new list.  The existing list remains unchanged. For example:

```javascript
const newList = myList.cons(4)
// myList =>     List(1, 2, 3)
// newList => List(4, 1, 2, 3)
```

### map

```scala
List[A].map(fn: A => B): List[B]
```

Maps the supplied function over the list.

```javascript
const list = List.fromArray([1, 2, 3]).map(a => a + 1)
// list => List(2, 3, 4)
```

### flatMap

**Aliases:** bind, chain

```scala
List[A].flatMap(fn: A => List[B]): List[B]
```

Maps the supplied function over the list and then flattens the returned list. The supplied function must return a new list.

### head

```scala
List[A].head(): A
```

Returns the head of the list. For example:

```javascript
List.fromArray([1,2,3]).head()
// => 1
```

### headMaybe

```scala
List[A].headMaybe(): Maybe[A]
```

Returns the optional head of the list. For example:

```javascript
List.fromArray([1, 2, 3]).headMaybe()
// => Some(1)

Nil.headMaybe()
// => None()
```

### foldLeft

```scala
List[A].foldLeft(z: B)(op: (B, A) => B): B
```

`foldLeft` takes an initial value and a function and will 'reduce' the list to a single value. The supplied function takes an accumulator as its first value and the current element in the list as its second argument. The returned value from the function will be pass into the accumulator on the subsequent pass.

For example, say you wanted to add up a list of integers, your initial value would be `0` and your function would return the sum of the accumulator and the passed in element.

```javascript
List.fromArray([1, 2, 3, 4]).foldLeft(0)((acc, e) => e + acc)
// => 10
```

### foldRight

```scala
List[A].foldRight(z: B)(op: (A, B) => B): B
```

Performs a fold right across the list. Similar to `foldLeft` except the supplied function is first applied to the right most side of the list.

### append

**Alias:** concat

```scala
List[A].append(list: List[A]) : List[A]
```

Will append the second list to the current list. Both list must be of the same type. For example:

```javascript
const list1 = List.fromArray([1, 2, 3])
const list2 = List.fromArray([4, 5, 6])

list1.append(list2)
// => List(1, 2, 3, 4, 5, 6)

list2.append(list1)
// => List(4, 5, 6, 1, 2, 3)
```

### filter

```scala
List[A].filter(op: A => Boolean): List[A]
```

Returns a new list, keeping only elements for which the predicate returns true.

#### contains

```scala
List[A].contains(val: A): Boolean
```

Returns true if the `List` contains the given value.

### find

```scala
List[A].find(op: A => Boolean): Maybe[A]
```

Returns a `Maybe` containing the first element for which the predicate returns true, or `None`.

### sequence

```scala
List[Monad[A]].sequence(Monad): Monad[List[A]]
```

Will `sequence` a list of monads.  The signature above is slightly hard to represent, but this function will sequence a list of any type of monad, but you will need to supply the name of the monad you are sequencing.

**Note: This version of sequence will only work with Monads that can cope with eager evaluations. For lazy monads such as `IO` and `Reader` please use `lazySequence` or the explicit versions, such as `sequenceIO`.**

For example:

```javascript
List.fromArray([Right(1), Left(2)]).sequence(Either)
// => Left(2)

List.fromArray([Right(1), Right(2)]).sequence(Either)
// => Right(List(1, 2))

List.fromArray([Some(1), Some(2)].list().sequence(Maybe)
// => Some(List(1, 2))

List.fromArray([Some(1), None()].list().sequence(Maybe)
// => None
```

Or you can use the convenience methods like `sequenceMaybe` or `sequenceEither` below. Note that since `Validation` is not a true monad it will not work as expected for this method; use `sequenceValidation` instead.

### lazySequence *UNIMPLEMENTED*

```scala
List[Monad[A].lazySequence(Monad): Monad[List[A]]
```

This is the same as `sequence` except it caters for Monads that require laziness, such as `IO` and `Reader`.

### sequenceMaybe

```scala
List[Maybe[A]].sequenceMaybe(): Maybe[List[A]]
```

Takes a list of `Maybe`s and turns it into a `Maybe` `List`.  If the list contains at least one `None` value then a `None` will be returned, otherwise a `Some` will be returned with a list of all the values.

For example:

```javascript
List.fromArray([Some(1), Some(2), Some(3)]).sequenceMaybe()
// => Some(List(1,2,3)) <- That's an immutable list not an array

List.fromArray([Some(1), Some(2), None, Some(3), None]).sequenceMaybe()
// => None
```

This is the same as calling:

```javascript
List.fromArray([Some(1), Some(2)).sequence(Maybe)
```

### sequenceEither

```scala
List[Either[E,A]].sequenceEither(): Either[E, List[A]]
```

This will sequence a `List` of `Either`s stopping on the first `Left` that it finds.  It will return either a `List` of the `Right` values or the first `Left` value it encounters. For example:

```javascript
List.fromArray([Right(1), Right(2), Right(3)]).sequenceEither()
// => Right(List(1, 2, 3))

List.fromArray([Right(1), Left(2), Left(3)]).sequenceEither()
// => Left(2)
```

Note: Unlike `sequenceValidation` it does not accumulate the `Left` (or "failing") values, but rather stops execution and returns the first `Left`.

### sequenceValidation

```scala
List[Validation[E,A]].sequenceValidation(): Validation[List[E], List[A]]
```

Takes a list of `Validation`s and turns it into a `Validation` `List`.  It will collect all the `success` values into a list on the `Success` side of the validation or it accumulates the errors on the `Failure` side, if there are **any** failures.

```javascript
List.fromArray([
  Success("a"),
  Success("b"),
  Success("c")
]).sequenceValidation()
// => Success(List("a", "b", "c"))

List.fromArray([
  Success("a"),
  Success("b"),
  Fail("c"),
  Fail("d"),
  Success("e")
]).sequenceValidation()
// => Fail(List("c", "d"))
```

### sequenceIO

```scala
List[IO[A]].sequenceIO(): IO[List[A]]
```

Will sequence a list of `IO` actions.

### sequenceReader

```scala
List[Reader[A]].sequenceReader(): Reader[List[A]]
```

Will sequence a list of `Reader`s.

### reverse

```scala
List[A].reverse(): List[A]
```
Returns a new list reversed.

```javascript
List.fromArray([1,2,3]).reverse()
// => List(3, 2, 1)


### forEach

```scala
List[A].forEach(fn: A => ()): ()
```

Invoke a function applying a side-effect on each item in the list.

### ...and undocumented

  - join
  - takeLeft
  - takeRight
  - ap
  - snoc
  - isNEL
  - size
  - tail
  - tails
  - flatten
  - flattenMaybe
  - toArray
