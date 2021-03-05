describe('A Maybe', function () {
    var Maybe = Monet.Maybe
    var Some = Monet.Some
    var Just = Monet.Just
    var None = Monet.None
    var Nothing = Monet.Nothing
    var Nil = Monet.Nil
    var sideEffectsReceiver
    var someString
    var none

    beforeEach(function () {
        jasmine.addMatchers({
            toBeSomeMaybe: getCustomMatcher(function (actual) {
                return actual.isSome()
            }),
            toBeSomeMaybeWith: getCustomMatcher(function (actual, expected) {
                return actual.some() == expected
            }),
            toBeNoneMaybe: getCustomMatcher(function (actual) {
                return actual.isNone()
            })
        })
        someString = Some('abcd')
        none = None()
        sideEffectsReceiver = {
            setVal: function (val) {
            }
        }
        spyOn(sideEffectsReceiver, 'setVal')
    })

    afterEach(function () {
        someString = undefined
        none = undefined
    })

    describe('with a value', function () {
        it('will be transformed by a map', function () {
            expect(someString.map(function (val) {
                return val.length
            })).toBeSomeMaybeWith(4)
        })
        it('will be will true for isSome()', function () {
            expect(someString.isSome()).toBeTruthy()
        })
        it('will be will true for isJust()', function () {
            expect(someString.isJust()).toBeTruthy()
        })
        it('will be false for isNone()', function () {
            expect(someString.isNone()).toBeFalsy()
            expect(someString.isNothing()).toBeFalsy()
        })
        it('will be transformed by a bind', function () {
            expect(someString.bind(function (val) {
                return Some('Hello')
            })).toBeSomeMaybeWith('Hello')
        })
        it('will be transformed by a flatMap', function () {
            expect(someString.flatMap(function (val) {
                return Some('Hello')
            })).toBeSomeMaybeWith('Hello')
        })
        it('will not be transformed by a catchMap', function () {
            expect(someString.catchMap(function (val) {
                return Some('Hello')
            })).toBeSomeMaybeWith(someString.some())
        })
        it('will be transformed to a None on bind that returns None', function () {
            expect(someString.bind(function (val) {
                return None()
            })).toBeNoneMaybe()
            expect(someString.flatMap(function (val) {
                return None()
            })).toBeNoneMaybe()
        })
        it('will return the value when orSome() is called', function () {
            expect(someString.orSome('no no!')).toBe('abcd')
            expect(someString.orJust('no no!')).toBe('abcd')
            expect(someString.orNull()).toBe('abcd')
        })
        it('will return the first monad on orElse', function () {
            expect(someString.orElse(none)).toBeSomeMaybeWith('abcd')
        })
        it('will return a None on a failed filter', function () {
            expect(someString.filter(function (a) {
                return a === '123'
            })).toBeNoneMaybe()
        })
        it('will return a some on a successful filter', function () {
            expect(someString.filter(function (a) {
                return a === 'abcd'
            })).toBe(someString)
        })
        it('will return a none on a failed filterNot', function () {
            expect(someString.filterNot(function (a) {
                return a === 'abcd'
            })).toBeNoneMaybe()
        })
        it('will return a some on a successful filterNot', function () {
            expect(someString.filterNot(function (a) {
                return a === '123'
            })).toBe(someString)
        })
        it('will return false on a contains with the wrong value', function () {
            expect(someString.contains('test')).toBe(false)
        })
        it('will return true on a contains with the right value', function () {
            expect(someString.contains('abcd')).toBe(true)
        })
        it('will run the function supplied to fold', function () {
            expect(someString.fold('efg')(function (val) {
                return 'hij'
            })).toBe('hij')
        })
        it('can be reduced using foldLeft', function () {
            expect(someString.foldLeft('efg')(function (acc, val) {
                return acc + val
            })).toBe('efgabcd')
        })
        it('can be reduced using foldRight', function () {
            expect(someString.foldRight('efg')(function (val, acc) {
                return acc + val
            })).toBe('efgabcd')
        })
        it('will run the some side of cata', function () {
            expect(someString.cata(function () {
                return 'efg'
            }, function (val) {
                return 'hij'
            })).toBe('hij')
        })
        it('will compare for equality', function () {
            expect(someString.equals(Some('abcd'))).toBe(true)
            expect(someString.equals(Maybe.some('abcd'))).toBe(true)
            expect(someString.equals(None())).toBe(false)
            expect(someString.equals(Nothing())).toBe(false)
            expect(someString.equals(Maybe.none())).toBe(false)
            expect(Some(someString).equals(Some(Some('abcd')))).toBe(true)
        })

        it('should be compatible with Fantasy Land', function () {
            expect(someString.equals).toBe(someString['fantasy-land/equals'])
        })

        it('will render as Just(x)', function () {
            expect(someString.inspect()).toBe('Just(abcd)')
        })
        it('will execute side-effects on forEach', function () {
            someString.forEach(sideEffectsReceiver.setVal)
            expect(sideEffectsReceiver.setVal).toHaveBeenCalledTimes(1)
            expect(sideEffectsReceiver.setVal).toHaveBeenCalledWith('abcd')
        })
        it('will not invoke the orElseRun callback', function () {
            someString.orElseRun(sideEffectsReceiver.setVal)
            expect(sideEffectsReceiver.setVal).toHaveBeenCalledTimes(0)
        })
        it('will be unchanged on orNoneIf with false', function () {
            expect(someString.orNoneIf(false)).toBe(someString)
        })
        it('will become None on orNoneIf with true', function () {
            expect(someString.orNoneIf(true)).toBeNoneMaybe()
        })
    })

    describe('without a value', function () {
        it('will stay a None type after a map', function () {
            expect(none.map(function (val) {
                return val.length
            }).isNone()).toBeTruthy()
        })
        it('will throw an exception when Some() is called', function () {
            expect(function () {
                none.some()
            }).toThrow(new Error('Cannot call .some() on a None.'))
        })
        it('will be true for isNone()', function () {
            expect(none.isNone()).toBeTruthy()
            expect(none.isNothing()).toBeTruthy()
        })
        it('will be false for isSome()', function () {
            expect(none.isSome()).toBeFalsy()
        })
        it('will always return a None on bind', function () {
            expect(none.bind(function () {
                return Some('a')
            })).toBeNoneMaybe()
            expect(none.flatMap(function () {
                return Some('a')
            })).toBeNoneMaybe()
            expect(none.bind(function () {
                return None()
            })).toBeNoneMaybe()
            expect(none.flatMap(function () {
                return None()
            })).toBeNoneMaybe()
        })

        it('will be transformed by a catchMap', function () {
            expect(none.catchMap(function (val) {
                return Some('Hello')
            })).toBeSomeMaybeWith('Hello')
        })
        it('will return the other value when orSome() is called', function () {
            expect(none.orSome('yep')).toBe('yep')
            expect(none.orNull()).toBe(null)
        })

        it('will return the supplied monad on orElse', function () {
            expect(none.orElse(someString)).toBeSomeMaybeWith('abcd')
        })
        it('will always return a None on filter', function () {
            expect(none.filter(function (a) {
                return true
            })).toBeNoneMaybe()
        })
        it('will always return a None on filterNot', function () {
            expect(none.filterNot(function (a) {
                return false
            })).toBeNoneMaybe()
        })
        it('will return false on a contains', function () {
            expect(None().contains('test')).toBe(false)
        })
        it('will return the default value supplied to fold', function () {
            expect(none.fold('efg')(function (val) {
                throw 'none has no value'
            })).toBe('efg')
        })
        it('can be reduced using foldLeft', function () {
            expect(none.foldLeft('efg')(function (acc, val) {
                throw 'none should have nothing to accumulate'
            })).toBe('efg')
        })
        it('can be reduced using foldRight', function () {
            expect(none.foldRight('efg')(function (val, acc) {
                throw 'none should have nothing to accumulate'
            })).toBe('efg')
        })
        it('will run the None side of cata', function () {
            expect(none.cata(function () {
                return 'efg'
            }, function (val) {
                return 'hij'
            })).toBe('efg')
        })
        it('will compare for equality', function () {
            expect(none.equals(None())).toBe(true)
            expect(none.equals(Maybe.none())).toBe(true)
            expect(none.equals(Nothing())).toBe(true)
            expect(none.equals(Maybe.Just(1))).toBe(false)
            expect(none.equals(Maybe.some(1))).toBe(false)
            expect(Some(none).equals(Maybe.some(Maybe.none()))).toBe(true)
        })

        it('should be compatible with Fantasy Land', function () {
            expect(none.equals).toBe(none['fantasy-land/equals'])
        })

        it('will render as Nothing', function () {
            expect(none.inspect()).toBe('Nothing')
            expect(Maybe.none().inspect()).toBe('Nothing')
            expect(Nothing().inspect()).toBe('Nothing')
        })
        it('will invoke side-effects on orElseRun', function () {
            none.orElseRun(sideEffectsReceiver.setVal)
            expect(sideEffectsReceiver.setVal).toHaveBeenCalledTimes(1)
        })
        it('will not invoke the forEach callback', function () {
            none.forEach(sideEffectsReceiver.setVal)
            expect(sideEffectsReceiver.setVal).toHaveBeenCalledTimes(0)
        })
        it('will be None on orNoneIf with false', function () {
            expect(none.orNoneIf(false)).toBeNoneMaybe()
        })
        it('will be None on orNoneIf with true', function () {
            expect(none.orNoneIf(true)).toBeNoneMaybe()
        })
    })

    describe('"to…" operators', function () {
        describe('toList', function () {
            it('should return a singleton List for Some', function () {
                const list = Some(1).toList();

                expect(list.head()).toBe(1)
                expect(list.tail()).toBe(Nil)
            })
            it('should return an empty List for None', function () {
                expect(None().toList()).toBe(Nil)
            })
        })
        describe('toSet', function () {
            it('should return a singleton Set for Some', function () {
                expect(Some(1).toSet()).toEqual(new Set([1]))
            })
            it('should return an empty Set for None', function () {
                expect(None().toSet()).toEqual(new Set([]))
            })
        })
        describe('toArray', function () {
            it('should return a singleton Array for Some', function () {
                expect(Some(1).toArray()).toEqual([1])
            })
            it('should return an empty Array for None', function () {
                expect(None().toArray()).toEqual([])
            })
        })
    })

    describe('can be described with collection predicates', function () {
        var predicateAll = function (e) {
            return e < 5
        }
        var predicateSome = function (e) {
            return e < 3
        }
        var predicateNone = function (e) {
            return e === -12
        }
        var someThree = Some(3)
        var aNothing = None()
        describe('every / forall', function () {
            it('should test if value wrapped in Some matches predicate', function () {
                expect(someThree.every(predicateAll)).toBe(true)
                expect(someThree.every(predicateSome)).toBe(false)
                expect(someThree.every(predicateNone)).toBe(false)

                expect(someThree.every(predicateAll)).toBe(someThree.forall(predicateAll))
                expect(someThree.every(predicateSome)).toBe(someThree.forall(predicateSome))
                expect(someThree.every(predicateNone)).toBe(someThree.forall(predicateNone))
            })
            it('should return true for None', function () {
                expect(aNothing.every(predicateAll)).toBe(true)
                expect(aNothing.every(predicateSome)).toBe(true)
                expect(aNothing.every(predicateNone)).toBe(true)

                expect(aNothing.every(predicateAll)).toBe(aNothing.forall(predicateAll))
                expect(aNothing.every(predicateSome)).toBe(aNothing.forall(predicateSome))
                expect(aNothing.every(predicateNone)).toBe(aNothing.forall(predicateNone))
            })
        })
        describe('exists', function () {
            it('should test if element in Some matches predicate', function () {
                expect(someThree.exists(predicateAll)).toBe(true)
                expect(someThree.exists(predicateSome)).toBe(false)
                expect(someThree.exists(predicateNone)).toBe(false)
            })
            it('should return false for None', function () {
                expect(aNothing.exists(predicateAll)).toBe(false)
                expect(aNothing.exists(predicateSome)).toBe(false)
                expect(aNothing.exists(predicateNone)).toBe(false)
            })
        })
    })

    it('should be an Iterable', function () {
        var someOne = Some(1)
        var aNothing = None()
        var onIter = jasmine.createSpy('onIteration')
        for (var a of someOne) {
            onIter(a)
        }
        expect(onIter.calls.allArgs()).toEqual([[1]])
        for (var a of aNothing) {
            onIter(a)
        }
        expect(onIter.calls.allArgs()).toEqual([[1]])
    })

    it('should have a ".to()" operator', function () {
        expect(Some(1).to(Array.from)).toEqual([1])
        expect(None().to(Array.from)).toEqual([])
    })

    describe('Some constructed without a value', function () {
        it('will throw an exception', function () {
            expect(function () {
                Some()
            }).toThrow(new Error('Can not create Some with illegal value: undefined.'))
            expect(function () {
                Maybe.Just(null)
            }).toThrow(new Error('Can not create Some with illegal value: null.'))
        })
    })

    var person = Monet.curry(function (forename, surname, address) {
        return forename + ' ' + surname + ' lives at ' + address
    })

    var maybeAddress = Maybe.Just('Dulwich, London')
    var maybeSurname = Maybe.Just('Baker')
    var maybeForename = Maybe.Just('Tom')

    describe('Applicative functor pattern', function () {
        it('will produce a person object if all maybes contain values', function () {
            var personString = maybeAddress.ap(maybeSurname.ap(maybeForename.map(person))).just()
            expect(personString).toBe('Tom Baker lives at Dulwich, London')
        })
        it('will not produce a person object if any maybes do not contain values', function () {
            var result = maybeAddress.ap(Maybe.Nothing().ap(maybeForename.map(person)))
            expect(result).toBeNoneMaybe()
        })

        it('should be compatible with Fantasy Land', function () {
            expect(maybeAddress.ap).toBe(maybeAddress['fantasy-land/ap'])
        })

        it('will work with apply2 with two Somes', function () {
            var result = Monet.apply2(maybeForename, maybeSurname, function (f, l) {
                return f + ' ' + l
            })
            expect(result).toBeSomeMaybeWith('Tom Baker')
        })

        it('will work with apply2 with one Some and a None', function () {
            var result = Monet.apply2(None(), maybeSurname, function (f, l) {
                return f + ' ' + l
            })
            expect(result).toBeNoneMaybe()
            var result2 = Monet.apply2(maybeForename, None(), function (f, l) {
                return f + ' ' + l
            })
            expect(result2).toBeNoneMaybe()
        })

        it('will work with apply2 with two Nones', function () {
            var result = Monet.apply2(None(), maybeSurname, function (f, l) {
                return f + ' ' + l
            })
            expect(result).toBeNoneMaybe()
        })

        it('has .apTo instance method, which is the same as .ap, but has swapped `this` and `argument`', function () {
            var result = Maybe.of(person)
                .apTo(maybeForename)
                .apTo(maybeSurname)
                .apTo(maybeAddress)
                .just()

            expect(result).toBe('Tom Baker lives at Dulwich, London')
        })

        it('.apTo returns Nothing if maybeFunction is None', function () {
            var result = Maybe.none()
                .apTo(maybeForename)
                .apTo(maybeSurname)
                .apTo(maybeAddress)

            expect(result).toBeNoneMaybe()
        })

        it('.apTo returns Nothing if at least one of arguments is None', function () {
            var result = Maybe.of(person)
                .apTo(Maybe.none())
                .apTo(maybeSurname)
                .apTo(maybeAddress)

            expect(result).toBeNoneMaybe()
        })

        it('.apTo returns Nothing if both arguments and function are None', function () {
            var result = Maybe.none()
                .apTo(Maybe.none())
                .apTo(Maybe.none())
                .apTo(Maybe.none())

            expect(result).toBeNoneMaybe()
        })
    })

    describe('Maybe.fromFalsy', function () {
        describe('will create a none for', function () {
            it('undefined', function () {
                expect(Maybe.fromFalsy(undefined)).toBeNoneMaybe()
            })
            it('null', function () {
                expect(Maybe.fromFalsy(null)).toBeNoneMaybe()
            })
            it('""', function () {
                expect(Maybe.fromFalsy('')).toBeNoneMaybe()
            })
            it('false', function () {
                expect(Maybe.fromFalsy(false)).toBeNoneMaybe()
            })
            it('NaN', function () {
                expect(Maybe.fromFalsy(NaN)).toBeNoneMaybe()
            })
            it('0', function () {
                expect(Maybe.fromFalsy(0)).toBeNoneMaybe()
            })
        })
        describe('will create a some for', function () {
            it('non empty string', function () {
                expect(Maybe.fromFalsy("asdf")).toBeSomeMaybeWith("asdf")
            })
            it('number > 0', function () {
                expect(Maybe.fromFalsy(1)).toBeSomeMaybeWith(1)
            })
            it('number < 0', function () {
                expect(Maybe.fromFalsy(-1)).toBeSomeMaybeWith(-1)
            })
            it('array', function () {
                const arrayRef = []
                expect(Maybe.fromFalsy(arrayRef)).toBeSomeMaybeWith(arrayRef)
            })
            it('object', function () {
                const objectRef = {}
                expect(Maybe.fromFalsy(objectRef)).toBeSomeMaybeWith(objectRef)
            })
            it('true', function () {
                expect(Maybe.fromFalsy(true)).toBeSomeMaybeWith(true)
            })
            it('Infinity', function () {
                expect(Maybe.fromFalsy(Infinity)).toBeSomeMaybeWith(Infinity)
            })
            it('-Infinity', function () {
                expect(Maybe.fromFalsy(-Infinity)).toBeSomeMaybeWith(-Infinity)
            })
        })
    })

    describe('Maybe.fromNull', function () {
        describe('will create a none for', function () {
            it('undefined', function () {
                expect(Maybe.fromUndefined()).toBeNoneMaybe()
                expect(Maybe.fromNull(undefined)).toBeNoneMaybe()
            })
            it('null', function () {
                expect(Maybe.fromNull(null)).toBeNoneMaybe()
            })
        })
        describe('will create a some for', function () {
            it('string', function () {
                expect(Maybe.fromNull('asdf')).toBeSomeMaybe('asdf')
            })
        })
    })

    describe('Maybe.fromUndefined', function () {
        describe('will create a none for', function () {
            it('undefined', function () {
                expect(Maybe.fromUndefined()).toBeNoneMaybe()
                expect(Maybe.fromUndefined(undefined)).toBeNoneMaybe()
            })
        })
        describe('will create a some for', function () {
            it('string', function () {
                expect(Maybe.fromUndefined('asdf')).toBeSomeMaybe('asdf')
            })
        })
    })

    describe('Maybe.fromEmpty', function () {
        describe('will create a none for', function () {
            it('undefined', function () {
                expect(Maybe.fromEmpty()).toBeNoneMaybe()
                expect(Maybe.fromEmpty(undefined)).toBeNoneMaybe()
            })
            it('null', function () {
                expect(Maybe.fromEmpty(null)).toBeNoneMaybe()
            })
            it('an empty string', function () {
                expect(Maybe.fromEmpty('')).toBeNoneMaybe()
            })
            it('an empty array', function () {
                expect(Maybe.fromEmpty([])).toBeNoneMaybe()
            })
            it('an empty object', function () {
                function foo() {
                }

                foo.prototype.bar = 42
                expect(Maybe.fromEmpty(new foo())).toBeNoneMaybe()
            })
        })
        describe('will create a some for', function () {
            it('any numbers', function () {
                expect(Maybe.fromEmpty(0)).toBeSomeMaybe()
                expect(Maybe.fromEmpty(NaN)).toBeSomeMaybe()
            })
            it('any non-empty strings', function () {
                expect(Maybe.fromEmpty('foo')).toBeSomeMaybe()
                expect(Maybe.fromEmpty('   ')).toBeSomeMaybe()
            })
            it('any non-empty arrays', function () {
                expect(Maybe.fromEmpty([1])).toBeSomeMaybe()
            })
            it('any non-empty objects', function () {
                function foo() {
                    this.value = 42
                }

                expect(Maybe.fromEmpty(new foo())).toBeSomeMaybe()
                expect(Maybe.fromEmpty({foo: 42})).toBeSomeMaybe()
            })
        })
    })

    // TODO: Provide additional test suite for `monet-pimp`
    xdescribe('will pimp an object', function () {
        it('with some', function () {
            expect('hello'.some()).toBeSomeMaybeWith('hello')
        })
        it('with just', function () {
            expect('hello'.just()).toBeSomeMaybeWith('hello')
        })

    })

    describe('complies with FantasyLand spec for', function () {
        it('of()', function () {
            expect(Maybe.of('hello')).toBeSomeMaybeWith('hello')
        })
        it('chain()', function () {
            expect(Maybe.of('hello').chain(function (a) {
                return Maybe.of(a + ' world')
            })).toBeSomeMaybeWith('hello world')
            expect(None().chain(function (a) {
                return Maybe.of(a + ' world')
            })).toBeNoneMaybe()
        })
    })

    describe('with a Maybe', function () {
        it('will join', function () {
            expect(Some(Just('hello')).join()).toBeSomeMaybeWith('hello')
        })
    })

    describe('with combinators', function () {
        it('will take left', function () {
            expect(Some('hi').takeLeft(Some('world'))).toBeSomeMaybeWith('hi')
        })
        it('will not take left on None', function () {
            expect(None().takeLeft(Some('world'))).toBeNoneMaybe()
            expect(Some('world').takeLeft(None())).toBeNoneMaybe()
            expect(None().takeLeft(None())).toBeNoneMaybe()
        })
        it('will take right', function () {
            expect(Some('hi').takeRight(Some('world'))).toBeSomeMaybeWith('world')
        })
    })

    describe('Maybe.isInstance', function () {
        it('will return true for Maybe instances', function () {
            expect(Maybe.isInstance(Some('hi'))).toBe(true)
            expect(Maybe.isInstance(None())).toBe(true)
        })
        it('will return false for other monads', function () {
            expect(Maybe.isInstance(Monet.Validation.Success({}))).toBe(false)
            expect(Maybe.isInstance(Monet.Validation.Fail({}))).toBe(false)
            expect(Maybe.isInstance(Monet.List.fromArray([]))).toBe(false)
        })
        it('will return false on non-monads', function () {
            expect(Maybe.isInstance({})).toBe(false)
            expect(Maybe.isInstance(true)).toBe(false)
            expect(Maybe.isInstance(false)).toBe(false)
            expect(Maybe.isInstance('foo')).toBe(false)
        })
    })

})
