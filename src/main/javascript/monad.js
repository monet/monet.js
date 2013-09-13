//     Monad.js 0.5.0

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
        return (val == undefined || val == null) ? Maybe.none() : Maybe.some(val)
    };

    var Some = Just = Maybe.Just = Maybe.just = Maybe.Some = Maybe.some = function (val) {
        return new Some.fn.init(val)
    };

    Some.fn = Some.prototype = {
        init: function (val) {
            if (val == null) {
                throw "Illegal state exception"
            }
            this.val = val
        },

        map: function (fn) {
            return new Some(fn(this.val))
        },
        isSome: trueFunction,
        isJust: trueFunction,
        isNone: falseFunction,
        isNothing: falseFunction,
        bind: function (bindFn) {
            return bindFn(this.val)
        },
        some: function () {
            return this.val
        },
        orSome: function (otherValue) {
            return this.val
        },

        ap: function (maybeWithFunction) {
            var value = this.val
            return maybeWithFunction.map(function (fn) {
                return fn(value)
            })
        }

    };

    // aliases
    Some.prototype.orJust = Some.prototype.orSome
    Some.prototype.just = Some.prototype.some
    Some.prototype.flatMap = Some.prototype.bind


    Some.fn.init.prototype = Some.fn


    Object.prototype.some = Object.prototype.just = function () {
        return new Some(this)
    }

    var None = Nothing = Maybe.Nothing = Maybe.None = Maybe.none = Maybe.nothing = function () {
        return new None.fn.init()
    };

    var illegalStateFunction = function () {
        throw "Illegal state exception"
    };
    None.fn = None.prototype = {
        init: function (val) {
        },

        map: function () {
            return this
        },
        isSome: falseFunction,
        isNone: trueFunction,
        isNothing: trueFunction,
        bind: function (bindFn) {
            return this
        },
        some: illegalStateFunction,
        just: illegalStateFunction,
        orSome: idFunction,
        orJust: idFunction,
        ap: function (maybeWithFunction) {
            return this;
        }
    };

    // aliases
    None.prototype.flatMap = None.prototype.bind

    None.fn.init.prototype = None.fn;

    var Validation = window.Validation = {};

    var Success = Validation.Success = Validation.success = function (val) {
        return new Success.fn.init(val)
    };

    Success.fn = Success.prototype = {
        init: function (val) {
            this.val = val
        },
        map: function (fn) {
            return new Success(fn(this.val))
        },
        success: function () {
            return this.val;
        },
        isSuccess: trueFunction,
        isFail: falseFunction,
        fail: function () {
            throw 'Illegal state. Cannot call fail() on a Validation.success'
        },
        bind: function (fn) {
            return fn(this.val);
        },
        flatMap: function (fn) {
            return this.bind(fn)
        },
        ap: function (validationWithFn) {
            var value = this.val
            return validationWithFn.map(function (fn) {
                return fn(value);
            })
        },
        acc: function () {
            var x = function () {
                return x
            }
            return Validation.success(x)
        },
        cata: function (fail, success) {
            return success(this.val)
        }

    };

    Success.fn.init.prototype = Success.fn;

    Object.prototype.success = function() {
        return Validation.success(this)
    }

    var Fail = Validation.Fail = Validation.fail = function (error) {
        return new Fail.fn.init(error)
    };

    Fail.fn = Fail.prototype = {
        init: function (error) {
            this.error = error
        },
        map: function (fn) {
            return this;
        },
        bind: function (fn) {
            return this;
        },
        flatMap: function (fn) {
            return this.bind(fn)
        },
        isFail: trueFunction,
        isSuccess: falseFunction,
        fail: function () {
            return this.error
        },
        success: function () {
            throw 'Illegal state. Cannot call success() on a Validation.fail'
        },
        ap: function (validationWithFn) {
            var value = this.error
            if (validationWithFn.isFail()) {
                return Validation.fail(Semigroup.append(value, validationWithFn.fail()))
            } else {
                return this;
            }
        },
        acc: function () {
            return this;
        },
        cata: function (fail, success) {
            return fail(this.error)
        }
    };

    Fail.fn.init.prototype = Fail.fn;

    Object.prototype.fail = function() {
        return Validation.fail(this)
    }

    var Semigroup = window.Semigroup = {}

    Semigroup.append = function (a, b) {
        if (a instanceof Array) {
            return a.concat(b)
        }
        if (typeof a === "string") {
            return a + b
        }
        throw "Couldn't find a semigroup appender in the environment, please specify your own append function"
    }

    var MonadT = monadT = monadTransformer = MonadTransformer = window.monadTransformer = window.MonadT = window.monadT = function (monad) {
        return new MonadT.fn.init(monad)
    }

    MonadT.fn = MonadT.prototype = {
        init: function (monad) {
            this.monad = monad
        },
        map: function (fn) {
            return monadT(this.monad.map(function (v) {
                return v.map(fn)
            }))
        },
        flatMap: function (fn) {
            return monadT(this.monad.map(function (v) {
                return v.flatMap(fn)
            }))
        },
        ap: function (validationWithFn) {
            return monadT(this.monad.flatMap(function (v) {
                return validationWithFn.perform().map(function (v2) {
                    return v.ap(v2)
                })
            }))
        },
        perform: function () {
            return this.monad;
        }
    }

    MonadT.fn.init.prototype = MonadT.fn;
    MonadT.prototype.bind = MonadT.prototype.flatMap;

    var IO = io = window.IO = window.io = function (effectFn) {
        return new IO.fn.init(effectFn)
    }

    IO.fn = IO.prototype = {
        init: function (effectFn) {
            this.effectFn = effectFn;
        },
        map: function (fn) {
            var self = this;
            return IO(function () {
                return fn(self.effectFn())
            })
        },
        flatMap: function (fn) {
            var self = this
            return IO(function () {
                return fn(self.effectFn()).run()
            });
        },
        bind: function (fn) {
            return this.flatMap(fn)
        },
        run: function () {
            return this.effectFn()
        },
        perform: function () {
            return this.run()
        },
        performUnsafeIO: function () {
            return this.run()
        }
    }

    IO.fn.init.prototype = IO.fn;


    return this
}(window || this));

