# Monet Pimp

### Functions

#### fn.compose(f1) *alias fn.o(fn1)*
Function composition.  `f.compose(g)` is equivalent to:

	function compose(x) {
		return f(g(x))
	}

#### fn.andThen(fn1)
Function composition flipped. `f.andThen(g)` is equivalent to:

	function compose(x) {
		return g(f(x))
	}

#### fn.curry()
This method on function will curry that function so that it can be partially applied. This implementation is quite flexible and allows
a method to be applied in the following ways:

    var sum = function(a,b,c) {
        return a+b+c
    }.curry()

    sum(1) // will return a function that takes b and c

    sum(1,2)
    //or
    sum(1)(2) // will return a function that takes c

    sum(1,2,3)
    //or
    sum(1)(2)(3)
    //or
    sum(1,2)(3)
    //or
    sum(1)(2,3)
    // or nearly any other combination...
    // will return 6
