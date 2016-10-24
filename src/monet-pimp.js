/**
 * monet-pimp.js 0.9.0-alpha.1
 *
 * This file needs to be included after monet.js
 *
 * (c) 2012-2016 Chris Myers
 * @license Monet-pimp.js may be freely distributed under the MIT license.
 * For all details and documentation:
 * https://cwmyers.github.com/monet.js
 */

(function () {
    "use strict";

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

    Object.prototype.right = function() {
        return Either.Right(this)
    }

    Object.prototype.left = function() {
        return Either.Left(this)
    }

    Array.prototype.list = function () {
        return List.fromArray(this)
    }

    Function.prototype.curry = function() { // TODO: TEST IT !!!!
        return Monet.curry(this)
    }

    Function.prototype.compose = function(g) { // TODO: TEST IT !!!!
        return Monet.compose(this, g)
    }

    Function.prototype.andThen = Function.prototype.map = function (g) { // TODO: TEST IT !!!!
        var f = this
        return function (x) {
            return g(f(x))
        }
    }

    Function.prototype.io = function () { // TODO: TEST IT !!!!
        return IO(this)
    }

    Function.prototype.io1 = function () { // TODO: TEST IT !!!!
        var f = this;
        return function (x) {
            return IO(function () {
                return f(x)
            })
        }
    }

    Function.prototype.reader = function () { // TODO: TEST IT !!!!
        return Monet.wrapReader(this)
    }

    return this

})();
