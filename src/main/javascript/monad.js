function None() {

}

function Some(val) {
    if (val == null) {
        throw "Illegal state exception"
    }
    this.val = val
}

None.prototype.map = function () {
    return this
}

Some.prototype.map = function (fn) {
    return new Some(fn(this.val))
}

None.prototype.isSome = function () {
    return false
}

Some.prototype.isSome = function () {
    return true
}

None.prototype.isNone = function () {
    return true
}

Some.prototype.isNone = function () {
    return false
}

None.prototype.bind = function (bindFn) {
    return this
}

Some.prototype.bind = function (bindFn) {
    return bindFn(this.val)
}

None.prototype.some = function() {
    throw "Illegal state exception"
}

Some.prototype.some = function() {
    return this.val
}

None.prototype.orSome = function(otherValue) {
    return otherValue
}

Some.prototype.orSome = function(otherValue) {
    return this.val
}