//     Monet.js 0.7.1

//     (c) 2012-2014 Chris Myers
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

    var Monet = window.Monet = {}

    var swap = Monet.swap = function (f) {
        return function (a, b) {
            return f(b, a)
        }
    }

    var map = function (fn) {
        return this.bind(this.of.compose(fn))
    }

    Function.prototype.curry = function () {
        return curry(this, Nil)
    }

    // List monad

    var List = list = window.List = function (head, tail) {
        return new List.fn.init(head, tail)
    }

    var listMap = function (fn, l) {
        return l.isNil ? l : listMap(fn, l.tail()).cons(fn(l.head()))
    }

    var listEach = function (effectFn, l) {
        if (!l.isNil) {
            effectFn(l.head())
            listEach(effectFn, l.tail())
        }
    }

    var foldLeft = function (fn, acc, l) {
        return l.isNil ? acc : foldLeft(fn, fn(acc, l.head()), l.tail())
    }

    var foldRight = function (fn, l, acc) {
        return l.isNil ? acc : fn(l.head(), foldRight(fn, l.tail(), acc))
    }

    var append = function (list1, list2) {
        return list1.isNil ? list2 : append(list1.tail(), list2).cons(list1.head())
    }

    var sequence = function (list, type) {
        return list.foldRight(type.of(Nil))(type.map2(cons))
    }

    var lazySequence = function (list, type) {
        return list.foldRight(type.of(function () {
            return Nil
        }))(type.map2(cons))
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
                this.head_ = head
                this.tail_ = (tail == undefined || tail == null) ? Nil : tail
                this.size_ = (tail == undefined || tail == null) ? 0 : tail.size() + 1
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
        snoc: function (element) {
            return this.concat(List(element))
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
        flattenMaybe: function () {
            return this.flatMap(Maybe.toList)
        },
        reverse: function () {
            return listReverse(this)
        },
        bind: function (fn) {
            return this.map(fn).flatten()
        },
        each: function (effectFn) {
            listEach(effectFn, this)
        },
        // transforms a list of Maybes to a Maybe list
        sequenceMaybe: function () {
            return sequence(this, Maybe)
        },
        sequenceValidation: function () {
            return sequenceValidation(this)
        },
        sequenceEither: function () {
            return sequence(this, Either)
        },
        sequenceIO: function () {
            return lazySequence(this, IO)
        },
        sequenceReader: function () {
            return lazySequence(this, Reader)
        },
        sequence: function (monadType) {
            return sequence(this, monadType)
        },
        lazySequence: function (monadType) {
            return lazySequence(this, monadType)
        },
        head: function () {
            return this.head_
        },
        headMaybe: function () {
            return this.isNil ? None() : Some(this.head_)
        },
        tail: function () {
            return this.isNil ? Nil : this.tail_
        },
        tails: function () {
            return this.isNil ? List(Nil, Nil) : this.tail().tails().cons(this)
        },
        isNEL: falseFunction
    }

    List.fn.init.prototype = List.fn;
    var Nil = window.Nil = new List.fn.init()

    // Aliases

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

    /*
     * Non-Empty List monad
     * This is also a comonad because there exists the implementation of extract(copure), which is just head
     * and cobind and cojoin.
     *
     */

    var NEL = window.NEL = NonEmptyList = window.NonEmptyList = function (head, tail) {
        if (head == undefined || head == null) {
            throw "Cannot create an empty Non-Empty List."
        }
        return new NEL.fn.init(head, tail)
    }

    NEL.fn = NEL.prototype = {
        init: function (head, tail) {
            if (head == undefined || head == null) {
                this.isNil = true
                this.size_ = 0
            } else {
                this.isNil = false
                this.head_ = head
                this.tail_ = (tail == undefined || tail == null) ? Nil : tail
                this.size_ = this.tail_.size() + 1
            }
        },
        map: function (fn) {
            return NEL(fn(this.head_), listMap(fn, this.tail_))
        },

        bind: function (fn) {
            var p = fn(this.head_)
            if (!p.isNEL()) {
                throw "function must return a NonEmptyList."
            }
            var list = this.tail().foldLeft(Nil.snoc(p.head()).append(p.tail()))(function (acc, e) {
                var list2 = fn(e).toList()
                return acc.snoc(list2.head()).append(list2.tail())
            })

            return new NEL(list.head(), list.tail())
        },

        head: function () {
            return this.head_
        },

        tail: function () {
            return this.tail_
        },
        //NEL[A] -> NEL[NEL[A]]
        tails: function () {
            var listsOfNels = this.toList().tails().map(NEL.fromList).flattenMaybe();
            return  NEL(listsOfNels.head(), listsOfNels.tail())
        },
        toList: function () {
            return List(this.head_, this.tail_)
        },
        reverse: function () {
            if (this.tail().isNil) {
                return this
            } else {
                var reversedTail = this.tail().reverse()
                return NEL(reversedTail.head(), reversedTail.tail().append(List(this.head())))
            }
        },
        foldLeft: function (initialValue) {
            return this.toList().foldLeft(initialValue)
        },
        append: function (list2) {
            return NEL.fromList(this.toList().append(list2.toList())).some()
        },
        // NEL[A] -> (NEL[A] -> B) -> NEL[B]
        cobind: function (fn) {
            return this.cojoin().map(fn)
        },
        size: function () {
            return this.size_
        },
        isNEL: trueFunction
    }

    NEL.fromList = function (list) {
        return list.isNil ? None() : Some(NEL(list.head(), list.tail()))
    }

    NEL.fn.init.prototype = NEL.fn;
    NEL.prototype.toArray = List.prototype.toArray
    NEL.prototype.extract = NEL.prototype.copure = NEL.prototype.head
    NEL.prototype.cojoin = NEL.prototype.tails
    NEL.prototype.coflatMap = NEL.prototype.mapTails = NEL.prototype.cobind


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

    Maybe.toList = function (maybe) {
        return maybe.toList()
    }

    Maybe.fn = Maybe.prototype = {
        init: function (isValue, val) {
            this.isValue = isValue
            if (val == null && isValue) {
                throw "Illegal state exception"
            }
            this.val = val
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
        orElse: function (maybe) {
            return this.isValue ? this : maybe
        },
        ap: function (maybeWithFunction) {
            var value = this.val
            return this.isValue ? maybeWithFunction.map(function (fn) {
                return fn(value)
            }) : this
        },

        toList: function () {
            return this.map(List).orSome(Nil)
        },
        toEither: function (failVal) {
            return this.isSome() ? Right(this.val) : Left(failVal)
        },
        toValidation: function (failVal) {
            return this.isSome() ? Success(this.val) : Fail(failVal)
        },
        fold: function (defaultValue) {
            var self = this
            return function (fn) {
                return self.isSome() ? fn(self.val) : defaultValue
            }
        }
    };

    // aliases
    Maybe.prototype.orJust = Maybe.prototype.orSome
    Maybe.prototype.just = Maybe.prototype.some
    Maybe.prototype.isJust = Maybe.prototype.isSome
    Maybe.prototype.isNothing = Maybe.prototype.isNone

    Maybe.fn.init.prototype = Maybe.fn

    var Validation = window.Validation = {};

    var Success = Validation.Success = Validation.success = window.Success = function (val) {
        return new Validation.fn.init(val, true)
    }

    var Fail = Validation.Fail = Validation.fail = window.Fail = function (error) {
        return new Validation.fn.init(error, false)
    }

    Validation.of = function (v) {
        return Success(v)
    }

    Validation.fn = Validation.prototype = {
        init: function (val, success) {
            this.val = val
            this.isSuccessValue = success
        },
        success: function () {
            if (this.isSuccess())
                return this.val;
            else
                throw 'Illegal state. Cannot call success() on a Validation.fail'
        },
        isSuccess: function () {
            return this.isSuccessValue
        },
        isFail: function () {
            return !this.isSuccessValue
        },
        fail: function () {
            if (this.isSuccess())
                throw 'Illegal state. Cannot call fail() on a Validation.success'
            else
                return this.val
        },
        bind: function (fn) {
            return this.isSuccess() ? fn(this.val) : this
        },
        ap: function (validationWithFn) {
            var value = this.val
            return this.isSuccess() ?
                validationWithFn.map(function (fn) {
                    return fn(value);
                })
                :
                (validationWithFn.isFail() ?
                    Validation.Fail(Semigroup.append(value, validationWithFn.fail()))
                    : this)
        },
        acc: function () {
            var x = function () {
                return x
            }
            return this.isSuccessValue ? Validation.success(x) : this
        },
        cata: function (fail, success) {
            return this.isSuccessValue ?
                success(this.val)
                : fail(this.val)
        },
        failMap: function (fn) {
            return this.isFail() ? Fail(fn(this.val)) : this
        },
        bimap: function (fail, success) {
            return this.isSuccessValue ? this.map(success) : this.failMap(fail)
        },
        toMaybe: function () {
            return this.isSuccess() ? Some(this.val) : None()
        },
        toEither: function () {
            return (this.isSuccess() ? Right : Left)(this.val)
        }
    };

    Validation.fn.init.prototype = Validation.fn;


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

    MonadT.of = function (m) {
        return MonadT(m)
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
        bind: function (fn) {
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

    var IO = io = window.IO = window.io = function (effectFn) {
        return new IO.fn.init(effectFn)
    }

    IO.of = function (fn) {
        return IO(fn)
    }

    IO.fn = IO.prototype = {
        init: function (effectFn) {
            if (!isFunction(effectFn))
                throw "IO requires a function"
            this.effectFn = effectFn;
        },
        map: function (fn) {
            var self = this;
            return IO(function () {
                return fn(self.effectFn())
            })
        },
        bind: function (fn) {
            var self = this
            return IO(function () {
                return fn(self.effectFn()).run()
            });
        },
        ap: function (ioWithFn) {
            var self = this
            return ioWithFn.map(function (fn) {
                return fn(self.effectFn())
            })
        },
        run: function () {
            return this.effectFn()
        }
    }

    IO.fn.init.prototype = IO.fn;

    IO.prototype.perform = IO.prototype.performUnsafeIO = IO.prototype.run

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

    Either.fn = Either.prototype = {
        init: function (val, isRightValue) {
            this.isRightValue = isRightValue
            this.value = val
        },
        bind: function (fn) {
            return this.isRightValue ? fn(this.value) : this
        },
        ap: function (eitherWithFn) {
            var self = this
            return this.isRightValue ? eitherWithFn.map(function (fn) {
                return fn(self.value)
            }) : this
        },
        leftMap: function (fn) {
            return this.isLeft() ? Left(fn(this.value)) : this
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
        },
        bimap: function (leftFn, rightFn) {
            return this.isRightValue ? this.map(rightFn) : this.leftMap(leftFn)
        },
        toMaybe: function () {
            return this.isRight() ? Some(this.val) : None()
        },
        toValidation: function () {
            return this.isRight() ? Success(this.val) : Fail(this.val)
        }
    }

    Either.fn.init.prototype = Either.fn;

    var Reader = reader = window.Reader = function (fn) {
        return new Reader.fn.init(fn)
    }

    Reader.of = function (fn) {
        return Reader(fn)
    }

    Reader.fn = Reader.prototype = {
        init: function (fn) {
            this.f = fn
        },
        run: function (config) {
            return this.f(config)
        },
        bind: function (fn) {
            var self = this
            return Reader(function (config) {
                return fn(self.run(config)).run(config)
            })
        },
        ap: function (readerWithFn) {
            var self = this
            return readerWithFn.bind(function (fn) {
                return Reader(function (config) {
                    return fn(self.run(config))
                })
            })
        },
        map: function (fn) {
            var self = this
            return Reader(function (config) {
                return fn(self.run(config))
            })
        }
    }

    Reader.fn.init.prototype = Reader.fn;


    var Trampoline = window.Trampoline = {}

    var Suspend = Trampoline.Suspend = window.Suspend = function (fn) {
        return new Trampoline.fn.init(fn, true)
    };
    var Return = Trampoline.Return = window.Return = function (val) {
        return new Trampoline.fn.init(val, false)
    };


    Trampoline.fn = Trampoline.prototype = {
        init: function (val, isSuspend) {
            this.isSuspend = isSuspend
            this.value = val
        },
        run: function () {
            return this.isSuspend ? this.value() : this.value
        }
    }

    Trampoline.fn.init.prototype = Trampoline.fn;


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

    Function.prototype.reader = function () {
        var f = this
        var wrapReader = function (fn, args) {
            return function () {
                var args1 = args.append(List.fromArray(Array.prototype.slice.call(arguments)));
                var self = this
                return args1.size() + 1 == fn.length ?
                    Reader(function (c) {
                        return fn.apply(self, (args1.append(List(c))).toArray())
                    }) :
                    wrapReader(fn, args1)
            }
        }
        return wrapReader(f, Nil)
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

    // Wire up aliases
    function alias(type) {
        type.prototype.flatMap = type.prototype.chain = type.prototype.bind
        type.prototype.pure = type.prototype.unit = type.prototype.of
        type.pure = type.unit = type.of
        type.prototype.of = type.of
        if (type.prototype.append != undefined) {
            type.prototype.concat = type.prototype.append
        }

        type.prototype.join = function () {
            return this.flatMap(idFunction)
        }
        type.map2 = function (fn) {
            return function (ma, mb) {
                return ma.flatMap(function (a) {
                    return mb.map(function (b) {
                        return fn(a, b)
                    })
                })
            }
        }

        if (type.prototype.map == undefined) {
            type.prototype.map = function (fn) {
                return map.call(this, fn)
            }
        }

    }

    alias(MonadT)
    alias(Either)
    alias(Maybe)
    alias(IO)
    alias(NEL)
    alias(List)
    alias(Validation)
    alias(Reader)

    return this
}(window || this));

