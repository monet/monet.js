//     Monad.js 0.4

//     (c) 2012-2013 Chris Myers
//     Monad.js may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://cwmyers.github.com/monad.js


(function (window) {

    var idFunction = function (value) {
        return value
    };
    var trueFunction = function () {
        return true
    };
    var falseFunction = function () {
        return false
    };


    /* Maybe Monad */

    var Maybe = window.Maybe = {}

    Maybe.fromNull = function (val) {
        if (val == undefined || val == null) {
            return Maybe.none()
        } else {
            return Maybe.some(val)
        }
    }

    var Some = Just = Maybe.Just = Maybe.just = Maybe.Some = Maybe.some = function (val) {
        return new Some.fn.init(val)
    };

    Some.fn = Some.prototype = {
        init:function (val) {
            if (val == null) {
                throw "Illegal state exception"
            }
            this.val = val
        },

        map:function (fn) {
            return new Some(fn(this.val))
        },
        isSome:trueFunction,
        isJust:trueFunction,
        isNone:falseFunction,
        isNothing:falseFunction,
        bind:function (bindFn) {
            return bindFn(this.val)
        },
        some:function () {
            return this.val
        },
        just:function () {
            return this.some()
        },
        orSome:function (otherValue) {
            return this.val
        },
        orJust:function (otherValue) {
            return this.orSome(otherValue)
        },
        ap:function (maybeWithFunction) {
            var value = this.val
            return maybeWithFunction.map(function (fn) {
                return fn(value)
            })
        }

    };

    Some.fn.init.prototype = Some.fn;

    var None = Nothing = Maybe.Nothing = Maybe.None = Maybe.none = Maybe.nothing = function () {
        return new None.fn.init()
    };

    var illegalStateFunction = function () {
        throw "Illegal state exception"
    };
    None.fn = None.prototype = {
        init:function (val) {
        },

        map:function () {
            return this
        },
        isSome:falseFunction,
        isNone:trueFunction,
        isNothing:trueFunction,
        bind:function (bindFn) {
            return this
        },
        some:illegalStateFunction,
        just:illegalStateFunction,
        orSome:idFunction,
        orJust:idFunction,
        ap:function (maybeWithFunction) {
            return this;
        }
    };

    None.fn.init.prototype = None.fn;

    var Validation = window.Validation = {};

    var Success = Validation.Success = Validation.success = function (val) {
        return new Success.fn.init(val)
    };

    Success.fn = Success.prototype = {
        init:function (val) {
            this.val = val
        },
        map:function (fn) {
            return new Success(fn(this.val))
        },
        success:function () {
            return this.val;
        },
        isSuccess:trueFunction,
        isFail:falseFunction,
        fail:function () {
            throw 'Illegal state. Cannot call fail() on a Validation.success'
        },
        bind:function (fn) {
            return fn(this.val);
        },
        ap:function (validationWithFn) {
            var value = this.val
            return validationWithFn.map(function (fn) {
                return fn(value);
            })
        }
    };

    Success.fn.init.prototype = Success.fn;

    var Fail = Validation.Fail = Validation.fail = function (error) {
        return new Fail.fn.init(error)
    };

    Fail.fn = Fail.prototype = {
        init:function (error) {
            this.error = error
        },
        map:function (fn) {
            return this;
        },
        bind:function (fn) {
            return this;
        },
        isFail:trueFunction,
        isSuccess:falseFunction,
        fail:function () {
            return this.error
        },
        success:function () {
            throw 'Illegal state. Cannot call success() on a Validation.fail'
        },
        ap:function (validationWithFn) {
            var value = this.error
            if (validationWithFn.isFail()) {
                return Validation.fail(value.concat(validationWithFn.fail()))
            } else {
                return this;
            }
        }
    };

    Fail.fn.init.prototype = Fail.fn;

    return this
}(window || this));

