//     monad-pimp.js 0.6.0

//     This file needs to be included after monad.js

//     (c) 2012-2013 Chris Myers
//     Monad.js may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://cwmyers.github.com/monad.js


(function (window) {

    Object.prototype.cons = function (list) {
        return list.cons(this)
    }

    Object.prototype.some = Object.prototype.just = function () {
        return new Some(this)
    }

    Object.prototype.success = function () {
        return Validation.success(this)
    }

    Object.prototype.fail = function () {
        return Validation.fail(this)
    }

    return this

})(window || this);