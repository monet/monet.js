/**
 * Created by chris on 31/10/2013.
 */

describe('An Either', function () {
    var sideEffectsReceiver = null

    beforeEach(function () {
        jasmine.addMatchers({
            toBeRight: getCustomMatcher(function (actual) {
                return actual.isRight()
            }),
            toBeRightWith: getCustomMatcher(function (actual, expected) {
                return actual.right() == expected
            }),
            toBeLeft: getCustomMatcher(function (actual) {
                return actual.isLeft()
            }),
            toBeLeftWith: getCustomMatcher(function (actual, expected) {
                return actual.left() == expected
            })
        })
        sideEffectsReceiver = {
            setVal: function (val) {
            }
        }
        spyOn(sideEffectsReceiver, 'setVal')
    })

    var rightString = Either.Right('abcd')
    describe('that is right', function () {
        it('will be transformed by a map', function () {
            expect(rightString.map(function (val) {
                return val.length
            })).toBeRightWith(4)
        })
        it('will return true when isRight is called', function () {
            expect(rightString.isRight()).toBeTruthy()
        })
        it('will return value when right is called', function () {
            expect(rightString.right()).toBe('abcd')
        })
        it('will return false when isLeft is called', function () {
            expect(rightString.isLeft()).toBeFalsy()
        })
        it('will throw error when left() is called', function () {
            expect(function () {
                rightString.left()
            }).toThrow(new Error('Cannot call left() on a Right.'))
        })
        it('will be transformed by a bind', function () {
            expect(rightString.bind(function (val) {
                return Either.Right('efgh')
            })).toBeRightWith('efgh')
            expect(rightString.bind(function (val) {
                return Either.Left('big left')
            })).toBeLeftWith('big left')
            expect(rightString.flatMap(function (val) {
                return Either.Right('efgh')
            })).toBeRightWith('efgh')
            expect(rightString.flatMap(function (val) {
                return Either.Left('big left')
            })).toBeLeftWith('big left')
        })
        it('will not be transformed by a catchMap', function () {
            expect(rightString.catchMap(function (val) {
                return Either.Left('bye')
            })).toBeRightWith(rightString.right())
        })
        it('will be transformed by a swap', function () {
            expect(rightString.swap()).toBeLeftWith(rightString.right())
        })
        it('can be reduced using foldLeft', function () {
            expect(rightString.foldLeft('efgh')(function (acc, val) {
                return acc + val
            })).toBe('efghabcd')
        })
        it('can be reduced using foldRight', function () {
            expect(rightString.foldRight('efgh')(function (val, acc) {
                return acc + val
            })).toBe('efghabcd')
        })
        it('will run the right side of cata', function () {
            expect(rightString.cata(function (val) {
                throw 'left'
            }, function (val) {
                return 'right ' + val
            })).toBe('right abcd')
            expect(rightString.fold(function (val) {
                throw 'left'
            }, function (val) {
                return 'right ' + val
            })).toBe('right abcd')
        })
        it('will not be leftMapped', function () {
            expect(rightString.leftMap(function () {
                throw 'left'
            })).toBeRightWith('abcd')
        })
        it('will be bimapped', function () {
            expect(rightString.bimap(function () {
                throw left
            }, function (s) {
                return 'right ' + s
            })).toBeRightWith('right abcd')
        })
        it('can be converted to Maybe.Some', function () {
            expect(rightString.toMaybe().isSome()).toBe(true)
        })
        it('can be converted to Validation.Success', function () {
            expect(rightString.toValidation().success()).not.toBeUndefined()
        })
        it('equals to Right with the same value', function () {
            expect(rightString.equals(Either.Right('abcd'))).toBe(true)
            expect(rightString.equals(Either.right('abcd'))).toBe(true)
            expect(Right(Just(2)).equals(Right(Just(2)))).toBe(true)
        })
        it('does not equal to Rights with different values or Lefts', function () {
            expect(rightString.equals(Either.Left('abcd'))).toBe(false)
            expect(rightString.equals(Either.left('abcd'))).toBe(false)
            expect(rightString.equals(Either.Right('x'))).toBe(false)
            expect(rightString.equals(Either.right('x'))).toBe(false)
        })

        it('should be compatible with Fantasy Land', function () {
            expect(rightString.equals).toBe(rightString['fantasy-land/equals'])
        })

        it('renders as Right(value)', function () {
            expect(rightString.toString()).toBe('Right(abcd)')
        })
        it('will execute side-effects on forEach', function () {
            rightString.forEach(sideEffectsReceiver.setVal)
            expect(sideEffectsReceiver.setVal).toHaveBeenCalledTimes(1)
            expect(sideEffectsReceiver.setVal).toHaveBeenCalledWith('abcd')
        })
        it('will not invoke the forEachLeft callback', function () {
            rightString.forEachLeft(sideEffectsReceiver.setVal)
            expect(sideEffectsReceiver.setVal).toHaveBeenCalledTimes(0)
        })
    })

    var leftString = Either.Left('error dude')
    describe('that is a left', function () {
        it('will not be transformed by a map', function () {
            expect(leftString.map(function (val) {
                return 'butterfly'
            })).toBeLeftWith('error dude')
        })
        it('will not be transformed by a bind', function () {
            expect(leftString.bind(function (val) {
                return Either.Right('efgh')
            })).toBeLeftWith('error dude')
            expect(leftString.bind(function (val) {
                return Either.Left('big left')
            })).toBeLeftWith('error dude')
            expect(leftString.flatMap(function (val) {
                return Either.Right('efgh')
            })).toBeLeftWith('error dude')
            expect(leftString.flatMap(function (val) {
                return Either.Left('big left')
            })).toBeLeftWith('error dude')
        })
        it('will be transformed by a catchMap', function () {
            expect(leftString.catchMap(function (val) {
                return Either.Right('Hello ' + val)
            })).toBeRightWith('Hello ' + leftString.left())
        })
        it('will be transformed by a swap', function () {
            expect(leftString.swap()).toBeRightWith(leftString.left())
        })
        it('will return false when isRight is called', function () {
            expect(leftString.isRight()).toBeFalsy()
        })
        it('will return error value when left() is called', function () {
            expect(leftString.left()).toBe('error dude')
        })
        it('will return true when isLeft is called', function () {
            expect(leftString.isLeft()).toBeTruthy()
        })
        it('will throw error when right() is called', function () {
            expect(function () {
                leftString.right()
            }).toThrow(new Error('Cannot call right() on a Left.'))
        })
        it('can be reduced using foldLeft', function () {
            expect(leftString.foldLeft('efgh')(function (acc, val) {
                throw 'left should have nothing to accumulate'
            })).toBe('efgh')
        })
        it('can be reduced using foldRight', function () {
            expect(leftString.foldRight('efgh')(function (val, acc) {
                throw 'left should have nothing to accumulate'
            })).toBe('efgh')
        })
        it('will run the left side of cata', function () {
            expect(leftString.cata(function (val) {
                return 'left: ' + val
            }, function (val) {
                throw 'right'
            })).toBe('left: error dude')
            expect(leftString.fold(function (val) {
                return 'left: ' + val
            }, function (val) {
                throw 'right'
            })).toBe('left: error dude')
        })
        it('will be leftMapped', function () {
            expect(leftString.leftMap(function (s) {
                return 'left: ' + s
            }).left()).toBe('left: error dude')
        })
        it('can be bimapped', function () {
            expect(leftString.bimap(function (s) {
                return 'left: ' + s
            }, function () {
                throw 'right'
            })).toBeLeftWith('left: error dude')
        })

        it('can be converted to Maybe.None', function () {
            expect(leftString.toMaybe().isNone()).toBe(true)
        })
        it('can be converted to Validation.Fail', function () {
            expect(leftString.toValidation().fail()).not.toBeUndefined()
        })
        it('equals to Left with the same value', function () {
            expect(leftString.equals(Either.Left('error dude'))).toBe(true)
            expect(leftString.equals(Either.left('error dude'))).toBe(true)
            expect(Left(Just(2)).equals(Left(Just(2)))).toBe(true)
        })
        it('does not equal to Rights with different values or Lefts', function () {
            expect(leftString.equals(Either.Left('x'))).toBeFalsy()
            expect(leftString.equals(Either.Right('error dude'))).toBe(false)
            expect(leftString.equals(Either.right('error dude'))).toBe(false)
        })

        it('should be compatible with Fantasy Land', function () {
            expect(leftString.equals).toBe(leftString['fantasy-land/equals'])
        })

        it('renders as Left(x)', function () {
            expect(leftString.toString()).toBe('Left(error dude)')
        })
        it('will invoke side-effects on forEachLeft', function () {
            leftString.forEachLeft(sideEffectsReceiver.setVal)
            expect(sideEffectsReceiver.setVal).toHaveBeenCalledTimes(1)
            expect(sideEffectsReceiver.setVal).toHaveBeenCalledWith('error dude')
        })
        it('will not invoke the forEach callback', function () {
            leftString.forEach(sideEffectsReceiver.setVal)
            expect(sideEffectsReceiver.setVal).toHaveBeenCalledTimes(0)
        })

    })

    describe('swap', function () {
        it('should be symmetric', function () {
            expect(rightString.swap().swap().equals(rightString)).toBe(true)
            expect(leftString.swap().swap().equals(leftString)).toBe(true)
        })
    })

    var person = Monet.curry(function (forename, surname, address) {
        return forename + ' ' + surname + ' lives at ' + address
    })


    var validateAddress = Either.Right('Dulwich, London')
    var validateSurname = Either.Right('Baker')
    var validateForename = Either.Right('Tom')

    describe('Applicative functor pattern', function () {
        it('will produce a person object if all validations are rights', function () {
            var personString = validateAddress.ap(validateSurname.ap(validateForename.map(person))).right()
            expect(personString).toBe('Tom Baker lives at Dulwich, London')
        })
        it('will not produce a person object if any validations are lefts', function () {
            var result = validateAddress.ap(Either.Left(['no surname']).ap(validateForename.map(person)))
            expect(result).toBeLeftWith('no surname')
        })
        it('will stop on first error if any validations are list type lefts', function () {
            var result = Either.Left(['no address']).ap(Either.Left(['no surname']).ap(validateForename.map(person)))
            expect(result.left()[0]).toBe('no address')
        })
        it('will accumulate errors if any validations are string type lefts', function () {
            var result = Either.Left('no address').ap(Either.Left('no surname').ap(validateForename.map(person)))
            expect(result.left()).toBe('no address')
        })
        it('should be compatible with Fantasy Land', function () {
            expect(validateAddress.ap).toBe(validateAddress['fantasy-land/ap'])
        })
    })

    // TODO: Provide additional test suite for `monet-pimp`
    xdescribe('will pimp an object', function () {
        it('with right', function () {
            expect('hello'.right()).toBeRightWith('hello')
        })
        it('with left on string', function () {
            expect('hello'.left()).toBeLeftWith('hello')
        })
        it('with left on array', function () {
            expect(['hello'].left()).toBeLeft()
            expect(['hello'].left().left()[0]).toBe('hello')
        })

    })

    var e = new Error("some error");
    var eObj = {foo: "error"};
    var noThrow = Either.attempt(function() { return "yay"; });
    var throwError = Either.attempt(function() { throw e; });
    var throwErrorObj = Either.attempt(function() { throw eObj; });
    describe('attempt will produce', function() {
        it('a right for successful function call', function() {
            expect(noThrow).toBeRightWith("yay")
            expect(noThrow.isLeft()).toBe(false)
        })
        it('a left for a function that throws an Error', function() {
            expect(throwError).toBeLeftWith(e)
            expect(throwError.isRight()).toBe(false)
        })
        it('a left for a function that throws an object', function() {
            expect(throwErrorObj).toBeLeftWith(eObj)
            expect(throwErrorObj.isRight()).toBe(false)
        })
    })

})
