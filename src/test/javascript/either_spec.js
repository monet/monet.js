/**
 * Created by chris on 31/10/2013.
 */

describe('An Either', function () {

    beforeEach(function () {
        this.addMatchers({
            toBeRight: function (expected) {
                return this.actual.isRight();
            },
            toBeRightWith: function (expected) {
                return this.actual.right() == expected
            },
            toBeLeft: function () {
                return this.actual.isLeft()
            },
            toBeLeftWith: function (expected) {
                return this.actual.left() == expected
            }
        });
    });
    var rightString = Either.Right("abcd")
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
            expect(rightString.right()).toBe("abcd")
        })
        it('will return false when isLeft is called', function () {
            expect(rightString.isLeft()).toBeFalsy()
        })
        it('will throw error when left() is called', function () {
            expect(function () {
                rightString.left()
            }).toThrow('Illegal state. Cannot call left() on a Either.right')
        })
        it('will be transformed by a bind', function () {
            expect(rightString.bind(function (val) {
                return Either.Right("efgh")
            })).toBeRightWith("efgh")
            expect(rightString.bind(function (val) {
                return Either.Left("big left")
            })).toBeLeftWith("big left")
            expect(rightString.flatMap(function (val) {
                return Either.Right("efgh")
            })).toBeRightWith("efgh")
            expect(rightString.flatMap(function (val) {
                return Either.Left("big left")
            })).toBeLeftWith("big left")
        })
        it('will run the right side of cata', function () {
            expect(rightString.cata(function (val) {
                throw "left"
            }, function (val) {
                return "right " + val
            })).toBe("right abcd")
        })
        it('will not be leftMapped', function () {
            expect(rightString.leftMap(function () {
                throw "left"
            })).toBeRightWith("abcd")
        })
        it('will be bimapped', function () {
            expect(rightString.bimap(function () {
                throw left
            },function (s) {
                return "right " + s
            })).toBeRightWith("right abcd")
        })
        it('can be converted to Maybe.Some', function() {
          expect(rightString.toMaybe().isSome()).toBe(true)
        })
        it('can be converted to Validation.Success', function() {
          expect(rightString.toValidation().success()).not.toBeUndefined()
        })
    })

    var leftString = Either.Left("error dude")
    describe('that is a left', function () {
        it('will not be transformed by a map', function () {
            expect(leftString.map(function (val) {
                return "butterfly"
            })).toBeLeftWith("error dude")
        })
        it('will not be transformed by a bind', function () {
            expect(leftString.bind(function (val) {
                return Either.Right("efgh")
            })).toBeLeftWith("error dude")
            expect(leftString.bind(function (val) {
                return Either.Left("big left")
            })).toBeLeftWith("error dude")
            expect(leftString.flatMap(function (val) {
                return Either.Right("efgh")
            })).toBeLeftWith("error dude")
            expect(leftString.flatMap(function (val) {
                return Either.Left("big left")
            })).toBeLeftWith("error dude")
        })
        it('will return false when isRight is called', function () {
            expect(leftString.isRight()).toBeFalsy()
        })
        it('will return error value when left() is called', function () {
            expect(leftString.left()).toBe("error dude")
        })
        it('will return true when isLeft is called', function () {
            expect(leftString.isLeft()).toBeTruthy()
        })
        it('will throw error when right() is called', function () {
            expect(function () {
                leftString.right()
            }).toThrow('Illegal state. Cannot call right() on a Either.left')
        })
        it('will run the left side of cata', function () {
            expect(leftString.cata(function (val) {
                return "left: " + val
            }, function (val) {
                throw "right"
            })).toBe("left: error dude")
        })
        it('will be leftMapped', function () {
            expect(leftString.leftMap(function (s) {
                return "left: " + s
            }).left()).toBe("left: error dude")
        })
        it('can be bimapped', function () {
            expect(leftString.bimap(function (s) {
                return "left: " + s
            }, function () {
                throw "right"
            })).toBeLeftWith("left: error dude")
        })
        
        it('can be converted to Maybe.None', function() {
          expect(leftString.toMaybe().isNone()).toBe(true)
        })
        it('can be converted to Validation.Fail', function() {
          expect(leftString.toValidation().fail()).not.toBeUndefined()
        })

    })

    var person = function (forename, surname, address) {
        return forename + " " + surname + " lives at " + address
    }.curry();


    var validateAddress = Either.Right('Dulwich, London')
    var validateSurname = Either.Right('Baker')
    var validateForename = Either.Right('Tom')

    describe('Applicative functor pattern', function () {
        it('will produce a person object if all validations are rights', function () {
            var personString = validateAddress.ap(validateSurname.ap(validateForename.map(person))).right()
            expect(personString).toBe("Tom Baker lives at Dulwich, London")
        })
        it('will not produce a person object if any validations are lefts', function () {
            var result = validateAddress.ap(Either.Left(["no surname"]).ap(validateForename.map(person)))
            expect(result).toBeLeftWith("no surname")
        })
        it('will stop on first error if any validations are list type lefts', function () {
            var result = Either.Left(["no address"]).ap(Either.Left(["no surname"]).ap(validateForename.map(person)))
            expect(result.left()[0]).toBe("no address")
        })
        it('will accumulate errors if any validations are string type lefts', function () {
            var result = Either.Left("no address").ap(Either.Left("no surname").ap(validateForename.map(person)))
            expect(result.left()).toBe("no address")
        })

    })

    describe("will pimp an object", function () {
        it("with right", function () {
            expect("hello".right()).toBeRightWith("hello")
        })
        it("with left on string", function () {
            expect("hello".left()).toBeLeftWith("hello")
        })
        it("with left on array", function () {
            expect(["hello"].left()).toBeLeft()
            expect(["hello"].left().left()[0]).toBe("hello")
        })

    })

})