# Monet Pimp

## Function

### fn.compose(f1)
Function composition. `f.compose(g)` is equivalent to:

```javascript
x => f(g(x))
```

### fn.andThen(fn1)
Function composition flipped. `f.andThen(g)` is equivalent to:

```javascript
x => g(f(x))
```

### fn.curry()
This method on function will curry that function so that it can be partially applied. This implementation is quite flexible and allows a method to be applied in the following ways:

```javascript
const sum = function(a, b, c) {
    return a + b + c
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
```

## ...and undocumented
- Function
    - io
    - io1
    - reader

- Object
    - cons
    - some
    - success
    - fail
    - right
    - left

- Array
    - list
