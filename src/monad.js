function None() {

}

function Some(val) {
    if (val == null) {
        throw "Illegal state expection"
    }
     this.val = val
}

None.prototype.map = function() {
    return this
}

Some.prototype.map = function(fn) {
    return new Some(fn(this.val))
}

