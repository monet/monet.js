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

    var isFunction = function (f) {
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


    var swap = function (f) {
        return function (a, b) {
            return f(b, a)
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

    var listReverse = function (list) {
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
        of: function (value) {
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
        reverse: function () {
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
    List.prototype.empty = function () {
        return Nil
    }


    List.fromArray = function (array) {
        var l = Nil
        for (i = array.length; i--; i <= 0) {
            l = l.cons(array[i])
        }
        return l

    }

    List.of = function (a) {
        return new List(a, Nil)
    }


    /* Maybe Monad */

    var Maybe = window.Maybe = {}

    Maybe.fromNull = function (val) {
        return (val == undefined || val == null) ? Maybe.None() : Maybe.Some(val)
    };

    Maybe.of = function (a) {
        return Some(a)
    }

    var Some = Just = Maybe.Just = Maybe.Some = window.Some = window.Just = function (val) {
        return new Maybe.fn.init(true, val)
    };

    var None = Nothing = Maybe.Nothing = Maybe.None = window.None = function () {
        return new Maybe.fn.init(false, null)
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

    Maybe.fn = Maybe.prototype = {
        init: function (isValue, val) {
            this.isValue = isValue
            if (val == null && isValue) {
                throw "Illegal state exception"
            }
            this.val = val
        },

        map: function (fn) {
            return this.bind(Maybe.of.compose(fn))
        },
        isSome: function () {
            return this.isValue
        },
        isNone: function () {
            return !this.isSome()
        },
        bind: function (bindFn) {
            return this.isValue ? bindFn(this.val) : this
        },
        some: function () {
            if (this.isValue) {
                return this.val
            } else {
                throw "Illegal state exception"
            }
        },
        orSome: function (otherValue) {
            return this.isValue ? this.val : otherValue
        },

        ap: function (maybeWithFunction) {
            var value = this.val
            return this.isValue ? maybeWithFunction.map(function (fn) {
                return fn(value)
            }) : this
        }

    };

    // aliases
    Maybe.prototype.orJust = Maybe.prototype.orSome
    Maybe.prototype.just = Maybe.prototype.some
    Maybe.prototype.isJust = Maybe.prototype.isSome
    Maybe.prototype.isNothing = Maybe.prototype.isNone
    Maybe.prototype.flatMap = Maybe.prototype.chain = Maybe.prototype.bind


    Maybe.fn.init.prototype = Maybe.fn


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


    var Success = Validation.Success = Validation.success = window.Success = function (val) {
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


    var Fail = Validation.Fail = Validation.fail = window.Fail = function (error) {
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

    /* Either Monad */

    var Either = window.Either = {}


    Either.of = function (a) {
        return Right(a)
    }

    var Right = Either.Right = window.Right = function (val) {
        return new Either.fn.init(val, true)
    };
    var Left = Either.Left = window.Left = function (val) {
        return new Either.fn.init(val, false)
    };

    Either.map2 = function (fn) {
        return function (a, b) {
            return a.flatMap(function (a1) {
                return b.map(function (b1) {
                    return fn(a1, b1)
                })
            })
        }
    }

    Either.fn = Either.prototype = {
        init: function (val, isRightValue) {
            this.isRightValue = isRightValue
            this.value = val
        },
        map: function (fn) {
            return this.isRightValue ? Right(fn(this.value)) : this
        },
        flatMap: function (fn) {
            return this.isRightValue ? fn(this.value) : this
        },
        ap: function (eitherWithFn) {
            var self = this
            return this.isRightValue ? eitherWithFn.map(function (fn) {
                return fn(self.value)
            }) : this
        },
        isRight: function () {
            return this.isRightValue
        },
        isLeft: function () {
            return !this.isRight()
        },
        right: function () {
            if (this.isRightValue) {
                return this.value
            } else {
                throw "Illegal state. Cannot call right() on a Either.left"
            }
        },
        left: function () {
            if (this.isRightValue) {
                throw "Illegal state. Cannot call left() on a Either.right"
            } else {
                return this.value
            }
        },
        cata: function (leftFn, rightFn) {
            return this.isRightValue ? rightFn(this.value) : leftFn(this.value)
        }
    }

    Either.prototype.bind = Either.prototype.chain = Either.prototype.flatMap

    Either.fn.init.prototype = Either.fn;


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

