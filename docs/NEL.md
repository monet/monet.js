# Non Empty Lists

Much like the immutable list, a Non Empty List can never be empty.  It implements the `comonad` pattern.  It has a guaranteed head (total)
and a guaranteed (total) tail.

## Constructors

	var nonEmptyList = NonEmptyList(1, [2,3,4].list())
	// alias
	var nonEmptyList = NEL(1, [2,3,4].list())
	// or
	var nonEmptyList = NonEmptyList(1, Nil)
	// or fromList which returns a Maybe[NonEmptyList].
	var maybeNonEmptyList = NonEmptyList.fromList([1,2,3,4].list())

Trying to create an empty `NonEmptyList` will throw an exception.

## Methods

### map

	NEL[A].map(fn: A => B): NEL[B]

Maps a function over a NonEmptyList.

### bind *alias: flatMap, chain*

	NEL[A].bind(fn: A => NEL[B]): NEL[B]

Performs a monadic bind over the NonEmptyList.

### head *alias: copure, extract*

	NEL[A].head(): A

Returns the head of the NonEmptyList.  Also known as `copure` or `extract` this is part of the comonad pattern.

### tail

	NEL[A].tail(): List[A]

Returns the tail of the `NonEmptyList`.

### tails *alias: cojoin*

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

### mapTails *alias: cobind, coflatMap*

	NEL[A].mapTails(fn: NEL[A] => B): NEL[B]

Maps a function over the tails of the `NonEmptyList`.  Also known as `cobind` this is part of the comonad pattern.

For example:

	nonEmptyList.cobind(function (nel) {
	            return nel.foldLeft(0)(function(a,b){
	                return a+b
	            })
	        }
	//result: [10,9,7,4]

### foldLeft

	NEL[A].foldLeft(initialValue: B)(fn: (acc: B, element: A) -> B): B

`foldLeft` takes an initial value and a function, and will 'reduce' the list to a single value.  The supplied function takes an accumulator as its first argument and the current element in the list as its second.  The returned value from the function will be pass into the accumulator on the subsequent pass.


For example, say you wanted to add up a non empty list of integers, your initial value would be `0` and your function would return the sum of the accumulator and the passed in element.

	var sum = nonEmptyList.foldLeft(0)(function(acc, e) {
		return e+acc
	})
	// sum == 10

### foldRight

	NEL[A].foldRight(initialValue: B)(fn: (element: A, acc: B) => B): B

Performs a fold right across the non empty list.  Similar to `foldLeft` except the supplied function is first applied to the right most side of the list.

### filter

	NEL[A].filter(fn: (element: A) => Boolean): List[A]

Returns a new list, keeping only elements for which the predicate returns true.

### find

	NEL[A].find(fn: (element: A) => Boolean): Maybe[A]

Returns a `Maybe` containing the first element for which the predicate returns true, or `None`.

### contains

    NEL[A].contains(val: A): Boolean

Returns true if the `NonEmptyList` contains the given value.

### reduceLeft

	NEL[A].reduceLeft(fn: (element: A, acc: A) => A): A

Reduces a `NonEmptyList` of type `A` down to a single `A`.

	var nonEmptyList = NonEmptyList(1, [2,3,4].list())
	nonEmptyList.reduceLeft(function (a,b) {return a+b})
	// result: 10


### append *alias: concat*

	NEL[A].append(n: NEL[A]): NEL[A]

Appends two NonEmptyLists together.

### reverse

	NEL[A].reverse(): NEL[A]

Reverses the `NonEmptyList`.

### forEach

    NEL[A].forEach(fn: A => void): void

Invoke a function applying a side-effect on each item in the list.

### fromList

	NEL.fromList(List[A]): Maybe[NEL[A]]

Returns an optional `NonEmptyList`.  If the supplied `List` is empty the result will be a `None`, otherwise a `NonEmptyList` wrapped in
a `Some` (or `Just`).
