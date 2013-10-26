//     Monet.js 0.6.4

//     (c) 2012-2013 Chris Myers
//     Monet.js may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://cwmyers.github.com/monet.js


(function (window) {

    var curry = function (fn, args) {
        return function () {
            var args1 = args.append(List.fromArray(Array.prototype.slice.call(arguments)));
            return args1.size() == fn.length ? fn.apply(this, args1.toArray()) : curry(fn, args1)
        }
    }
    window.curry = curry

    return this

})(window || this);

(function (window) {

    var isFunction = function(f) {
        return !!(f && f.constructor && f.call && f.apply)
    }

    var idFunction = function (value) {
        return value
    };
    var trueFunction = function () {
        return true
    };
    var falseFunction = function () {
        return false
    };


    var swap = function(f) {
        return function(a,b) {
            return f(b,a)
        }
    }

    Function.prototype.curry = function () {
        return curry(this, Nil)
    }


    // List monad

    var List = list = window.List = function (head, tail) {
        return new List.fn.init(head, tail)
    }

    var listMap = function (fn, l) {
        if (l.isNil) {
            return l
        } else {
            return listMap(fn, l.tail).cons(fn(l.head))
        }
    }

    var foldLeft = function (fn, acc, l) {
        return l.isNil ? acc : foldLeft(fn, fn(acc, l.head), l.tail)
    }

    var foldRight = function (fn, l, acc) {
        return l.isNil ? acc : fn(l.head, foldRight(fn, l.tail, acc))
    }

    var append = function (list1, list2) {
        return list1.isNil ? list2 : append(list1.tail, list2).cons(list1.head)
    }

    var sequenceMaybe = function (list) {
        return list.foldRight(Some(Nil))(Maybe.map2(cons))
    }

    var sequenceValidation = function (list) {
        return list.foldLeft(Success(Nil))(function (acc, a) {
            return  acc.ap(a.map(function (v) {
                return function (t) {
                    return cons(v, t)
                }
            }))
        }).map(listReverse)
    }

    var listReverse = function(list) {
        return list.foldLeft(Nil)(swap(cons))
    }

    var cons = function (head, tail) {
        return tail.cons(head)
    }


    List.fn = List.prototype = {
        init: function (head, tail) {
            if (head == undefined || head == null) {
                this.isNil = true
                this.size_ = 0
            } else {
                this.isNil = false
                this.head = head
                this.tail = (tail == undefined || tail == null) ? Nil : tail
                this.size_ = tail.size() + 1
            }
        },
        of: function(value) {
            return new List(value)
        },
        size: function () {
            return this.size_
        },
        cons: function (head) {
            return List(head, this)
        },
        map: function (fn) {
            return listMap(fn, this)
        },
        toArray: function () {
            return foldLeft(function (acc, e) {
                acc.push(e)
                return acc
            }, [], this)
        },
        foldLeft: function (initialValue) {
            var self = this
            return function (fn) {
                return foldLeft(fn, initialValue, self)
            }
        },
        foldRight: function (initialValue) {
            var self = this
            return function (fn) {
                return foldRight(fn, self, initialValue)
            }
        },
        append: function (list2) {
            return append(this, list2)
        },
        flatten: function () {
            return foldRight(append, this, Nil)

        },
        reverse: function() {
           return listReverse(this)
        },
        flatMap: function (fn) {
            return this.map(fn).flatten()
        },
        // transforms a list of Maybes to a Maybe list
        sequenceMaybe: function () {
            return sequenceMaybe(this)
        },
        sequenceValidation: function () {
            return sequenceValidation(this)
        }
    }

    List.fn.init.prototype = List.fn;
    var Nil = window.Nil = new List.fn.init()

    // Aliases

    List.prototype.concat = List.prototype.append
    List.prototype.bind = List.prototype.chain = List.prototype.flatMap
    List.prototype.empty = function(){return Nil}


    List.fromArray = function (array) {
        var l = Nil
        for (i = array.length; i--; i <= 0) {
            l = l.cons(array[i])
        }
        return l

    }



    /* Maybe Monad */

    var Maybe = window.Maybe = {}

    Maybe.fromNull = function (val) {
        return (val == undefined || val == null) ? Maybe.none() : Maybe.some(val)
    };

    var Some = Just = Maybe.Just = Maybe.just = Maybe.Some = Maybe.some = window.Some = window.Just = function (val) {
        return new Some.fn.init(val)
    };

    Maybe.map2 = function (fn) {
        return function (maybeA, maybeB) {
            return maybeA.flatMap(function (a) {
                return maybeB.map(function (b) {
                    return fn(a, b)
                })
            })
        }
    }

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
        map2: function (maybeB) {

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


    var None = Nothing = Maybe.Nothing = Maybe.None = Maybe.none = Maybe.nothing = window.None = function () {
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

    Validation.map2 = function (fn) {
        return function (validationA, validationB) {
            return validationA.flatMap(function (a) {
                return validationB.map(function (b) {
                    return fn(a, b)
                })
            })
        }
    }


    var Success = Validation.Success = Validation.success = function (val) {
        return new Success.fn.init(val)
    }

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

    var Semigroup = window.Semigroup = {}

    Semigroup.append = function (a, b) {
        if (a instanceof Array) {
            return a.concat(b)
        }
        if (typeof a === "string") {
            return a + b
        }
        if (isFunction(a.concat)) {
            return a.concat(b)
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
        ap: function (monadWithFn) {
            return monadT(this.monad.flatMap(function (v) {
                return monadWithFn.perform().map(function (v2) {
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

    Function.prototype.io = function () {
        return IO(this)
    }

    Function.prototype.io1 = function () {
        var f = this;
        return function (x) {
            return IO(
                function () {
                    return f(x)
                }
            )
        }
    }

    Function.prototype.compose = Function.prototype.o = function (g) {
        var f = this
        return function (x) {
            return f(g(x))
        }
    }

    Function.prototype.andThen = function (g) {
        var f = this
        return function (x) {
            return g(f(x))
        }
    }


    return this
}(window || this));

