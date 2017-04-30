# Non Empty Lists

Much like the immutable list, a Non Empty List can never be empty. It implements the `comonad` pattern. It has a guaranteed head (total)
and a guaranteed (total) tail.

## Constructors

```javascript
NonEmptyList(1, List.fromArray([2, 3, 4]))
NEL(1, List.fromArray([2, 3, 4]))
NEL.of(1, List.fromArray([2, 3, 4]))
NEL.unit(1, List.fromArray([2, 3, 4]))
NEL.pure(1, List.fromArray([2, 3, 4]))
// => NonEmptyList(1,2,3,4)

NEL(1, Nil)
// => NonEmptyList(1)
```

### fromList

```scala
NEL.fromList(List[A]): Maybe[NEL[A]]
```

Returns an optional `NonEmptyList`. If the supplied `List` is empty the result will be a `None`, otherwise a `NonEmptyList` wrapped in a `Some`.

```javascript
NEL.fromList(List.fromArray([1,2,3,4]))
// => Some(NonEmptyList(1,2,3,4))

NEL.fromList(Nil)
// => None()
```
```

Trying to create an empty `NonEmptyList` will throw an exception.

## Methods

### map

```scala
NEL[A].map(fn: A => B): NEL[B]
```

Maps a function over a NonEmptyList.

### flatMap
**Aliases:** `bind`, `chain`

```scala
NEL[A].bind(fn: A => NEL[B]): NEL[B]
```

Performs a monadic bind over the NonEmptyList.

### head
**Aliases:** `copure`, `extract`

```scala
NEL[A].head(): A
```

Returns the head of the NonEmptyList. Also known as `copure` or `extract` this is part of the comonad pattern.

### tail

```scala
NEL[A].tail(): List[A]
```

Returns the tail of the `NonEmptyList`.

### tails
**Aliases:** `cojoin`

```scala
NEL[A].tails(): NEL[NEL[A]]
```

Returns all the tails of the `NonEmptyList`. Also known as `cojoin` this is part of the comonad pattern. A list is considered
a tail of itself. For example:

```javascript
NEL(1, List.fromArray([2,3,4])).tails()
// => [
//      [ 1, 2, 3, 4 ],
//      [ 2, 3, 4 ],
//      [ 3, 4 ],
//      [ 4 ]
//    ]
```

### mapTails
**Aliases:** `cobind`, `coflatMap`

```scala
NEL[A].mapTails(fn: NEL[A] => B): NEL[B]
```

Maps a function over the tails of the `NonEmptyList`. Also known as `cobind` this is part of the comonad pattern. For example:

```javascript

NEL(1, List.fromArray([2,3,4])).cobind(tail => tail.foldLeft(0)((a, b) => a + b))
// => [10, 9, 7, 4]
```

### foldLeft

```scala
NEL[A].foldLeft(initialValue: B)(fn: (acc: B, element: A) -> B): B
```

`foldLeft` takes an initial value and a function, and will 'reduce' the list to a single value. The supplied function takes an accumulator as its first argument and the current element in the list as its second. The returned value from the function will be pass into the accumulator on the subsequent pass.


For example, say you wanted to add up a non empty list of integers, your initial value would be `0` and your function would return the sum of the accumulator and the passed in element.

```javascript
NEL(1, List.fromArray([2,3,4])).foldLeft(0)((acc, e) => e + acc)
// => 10
```

### foldRight

```scala
NEL[A].foldRight(initialValue: B)(fn: (element: A, acc: B) => B): B
```

Performs a fold right across the non empty list. Similar to `foldLeft` except the supplied function is first applied to the right most side of the list.

### filter

```scala
NEL[A].filter(fn: (element: A) => Boolean): List[A]
```

Returns a new list, keeping only elements for which the predicate returns true.

### find

```scala
NEL[A].find(fn: (element: A) => Boolean): Maybe[A]
```

Returns a `Maybe` containing the first element for which the predicate returns true, or `None`.

### contains

```scala
NEL[A].contains(val: A): Boolean
```

Returns true if the `NonEmptyList` contains the given value.

### reduceLeft

```scala
NEL[A].reduceLeft(fn: (element: A, acc: A) => A): A
```

Reduces a `NonEmptyList` of type `A` down to a single `A`.

```javascript
NEL(1, List.fromArray([2,3,4])).reduceLeft((a, b) => a + b)
// => 10
```

### append
**Alias:** `concat`

```scala
NEL[A].append(n: NEL[A]): NEL[A]
```

Appends two NonEmptyLists together.

### reverse

```scala
NEL[A].reverse(): NEL[A]
```

Reverses the `NonEmptyList`.

### forEach

```scala
NEL[A].forEach(fn: A => void): void
```

Invoke a function applying a side-effect on each item in the list.

### ...and undocumented
- takeLeft
- takeRight
- ap
- isNEL
- size
- toArray
- toList
- **BROKEN** join
- **UNIMPLEMENTED** cons
- **UNIMPLEMENTED** snoc
