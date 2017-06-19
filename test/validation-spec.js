describe('A Validation', function () {
    var sideEffectsReceiver = null;

    beforeEach(function () {
        jasmine.addMatchers({
            toBeSuccess: getCustomMatcher(function (actual) {
                return actual.isSuccess();
            }),
            toBeSuccessWith: getCustomMatcher(function (actual, expected) {
                return actual.success() == expected;
            }),
            toBeFailure: getCustomMatcher(function (actual) {
                return actual.isFail()
            }),
            toBeFailureWith: getCustomMatcher(function (actual, expected) {
                return actual.fail() == expected
            })
        });
        sideEffectsReceiver = {
            setVal: function (val) {
            }
        };
        spyOn(sideEffectsReceiver, 'setVal');
    });
    var successString = Validation.success('abcd')
    var successMap = function (val) {
        return 'success ' + val
    };

    describe('that is successful', function () {
        it('will be transformed by a map', function () {
            expect(successString.map(function (val) {
                return val.length
            })).toBeSuccessWith(4)
        })
        it('will return true when isSuccess is called', function () {
            expect(successString.isSuccess()).toBeTruthy()
        })
        it('will return value when success is called', function () {
            expect(successString.success()).toBe('abcd')
        })
        it('will return false when isFail is called', function () {
            expect(successString.isFail()).toBeFalsy()
        })
        it('will throw error when fail() is called', function () {
            expect(function () {
                return successString.fail()
            }).toThrow(new Error('Cannot call fail() on a Success.'))
        })
        it('will be transformed by a bind', function () {
            expect(successString.bind(function (val) {
                return Validation.success('efgh')
            })).toBeSuccessWith('efgh')
            expect(successString.bind(function (val) {
                return Validation.fail('big fail')
            })).toBeFailureWith('big fail')
            expect(successString.flatMap(function (val) {
                return Validation.success('efgh')
            })).toBeSuccessWith('efgh')
            expect(successString.flatMap(function (val) {
                return Validation.fail('big fail')
            })).toBeFailureWith('big fail')
        })
        it('can be reduced using foldLeft', function () {
            expect(successString.foldLeft('efgh')(function (acc, val) {
                return acc + val
            })).toBe('efghabcd')
        })
        it('can be reduced using foldRight', function () {
            expect(successString.foldRight('efgh')(function (val, acc) {
                return acc + val
            })).toBe('efghabcd')
        })
        it('will run the success side of cata', function () {
            expect(successString.cata(function (val) {
                throw 'fail'
            }, successMap)).toBe('success abcd')
            expect(successString.fold(function (val) {
                throw 'fail'
            }, successMap)).toBe('success abcd')
        })
        it('will not be failMapped', function () {
            expect(successString.failMap(function () {
                throw 'fail'
            })).toBeSuccessWith('abcd')
        })
        it('will be bimapped', function () {
            expect(successString.bimap(function () {
                throw 'fail'
            }, successMap)).toBeSuccessWith('success abcd')
        })
        it('does not contain another value', function () {
            expect(successString.contains('x')).toBe(false)
        })
        it('does contain its value', function () {
            expect(successString.contains('abcd')).toBe(true)
        })
        it('will render as Success(x)', function () {
            expect(successString.inspect()).toBe('Success(abcd)')
        })
        it('will execute side-effects on forEach', function () {
            successString.forEach(sideEffectsReceiver.setVal)
            expect(sideEffectsReceiver.setVal).toHaveBeenCalledTimes(1)
            expect(sideEffectsReceiver.setVal).toHaveBeenCalledWith('abcd')
        })
        it('will not invoke the forEachFail callback', function () {
            successString.forEachFail(sideEffectsReceiver.setVal)
            expect(sideEffectsReceiver.setVal).toHaveBeenCalledTimes(0)
        })
    })

    var failString = Validation.fail('error dude')
    var failMap = function (val) {
        return 'fail: ' + val
    };
    describe('that is a failure', function () {
        it('will not be transformed by a map', function () {
            expect(failString.map(function (val) {
                return 'butterfly'
            })).toBeFailureWith('error dude')
        })
        it('will not be transformed by a bind', function () {
            expect(failString.bind(function (val) {
                return Validation.success('efgh')
            })).toBeFailureWith('error dude')
            expect(failString.bind(function (val) {
                return Validation.fail('big fail')
            })).toBeFailureWith('error dude')
            expect(failString.flatMap(function (val) {
                return Validation.success('efgh')
            })).toBeFailureWith('error dude')
            expect(failString.flatMap(function (val) {
                return Validation.fail('big fail')
            })).toBeFailureWith('error dude')
        })
        it('will return false when isSuccess is called', function () {
            expect(failString.isSuccess()).toBeFalsy()
        })
        it('will return error value when fail() is called', function () {
            expect(failString.fail()).toBe('error dude')
        })
        it('will return true when isFail is called', function () {
            expect(failString.isFail()).toBeTruthy()
        })
        it('will throw error when success() is called', function () {
            expect(function () {
                return failString.success()
            }).toThrow(new Error('Cannot call success() on a Fail.'))
        })
        it('can be reduced using foldLeft', function () {
            expect(failString.foldLeft('efgh')(function (acc, val) {
                throw 'fail should have nothing to accumulate'
            })).toBe('efgh')
        })
        it('can be reduced using foldRight', function () {
            expect(failString.foldRight('efgh')(function (val, acc) {
                throw 'fail should have nothing to accumulate'
            })).toBe('efgh')
        })
        it('will run the failure side of cata', function () {
            expect(failString.cata(failMap, function (val) {
                throw 'success'
            })).toBe('fail: error dude')
            expect(failString.fold(failMap, function (val) {
                throw 'success'
            })).toBe('fail: error dude')
        })
        it('can be bimapped', function () {
            expect(failString.bimap(failMap, function () {
                throw 'success side'
            })).toBeFailureWith('fail: error dude')
        })
        it('will return false on contains', function () {
            expect(failString.contains('error dude')).toBe(false)
        })
        it('can be failMapped', function () {
            expect(failString.failMap(failMap)).toBeFailureWith('fail: error dude')
        })
        it('renders as Fail(x)', function () {
            expect(failString.inspect()).toBe('Fail(error dude)')
        })
        it('will invoke side-effects on forEachFail', function () {
            failString.forEachFail(sideEffectsReceiver.setVal)
            expect(sideEffectsReceiver.setVal).toHaveBeenCalledTimes(1)
            expect(sideEffectsReceiver.setVal).toHaveBeenCalledWith('error dude')
        })
        it('will not invoke the forEach callback', function () {
            failString.forEach(sideEffectsReceiver.setVal)
            expect(sideEffectsReceiver.setVal).toHaveBeenCalledTimes(0)
        })

    })

    var person = Monet.curry(function (forename, surname, address) {
        return forename + ' ' + surname + ' lives at ' + address
    })

    var validateAddress = Validation.success('Dulwich, London')
    var validateSurname = Validation.success('Baker')
    var validateForename = Validation.success('Tom')

    describe('Applicative functor pattern', function () {
        it('will produce a person object if all validations are successes', function () {
            var personString = validateAddress.ap(validateSurname.ap(validateForename.map(person))).success()
            expect(personString).toBe('Tom Baker lives at Dulwich, London')
        })
        it('will not produce a person object if any validations are failures', function () {
            var result = validateAddress.ap(Validation.fail(['no surname']).ap(validateForename.map(person)))
            expect(result).toBeFailureWith('no surname')
        })
        it('will accumulate errors if any validations are list type failures', function () {
            var result = Validation.fail(['no address']).ap(Validation.fail(['no surname']).ap(validateForename.map(person)))
            expect(result.fail()[0]).toBe('no address')
            expect(result.fail()[1]).toBe('no surname')
        })
        it('will accumulate errors if any validations are string type failures', function () {
            var result = Validation.fail('no address ').ap(Validation.fail('no surname').ap(validateForename.map(person)))
            expect(result.fail()).toBe('no address no surname')
        })
        it('will anonymously accumulate errors if any validations are failures', function () {
            var result = Validation.fail(['no address']).ap(Validation.fail(['no surname']).ap(validateForename.acc()))
            expect(result.fail()[0]).toBe('no address')
            expect(result.fail()[1]).toBe('no surname')

        })
        it('will anonymously accumulate errors if any validations are failures, acc() on fail', function () {
            var result = Validation.fail(['no address']).ap(Validation.fail(['no surname']).ap(Validation.fail('no first name').acc()))
            expect(result.fail()[0]).toBe('no address')
            expect(result.fail()[1]).toBe('no surname')
            expect(result.fail()[2]).toBe('no first name')

        })
        it('will anonymously accumulate errors if any validations are failures, acc() on fail, ap() on success', function () {
            var result = validateAddress.ap(Validation.fail(['no surname']).ap(Validation.fail('no first name').acc()))
            expect(result.fail()[0]).toBe('no surname')
            expect(result.fail()[1]).toBe('no first name')

        })

        it('should be compatible with Fantasy Land', function () {
            expect(validateAddress.ap).toBe(validateAddress['fantasy-land/ap'])
        })

        it('will apply function for apply2 with two successes', function () {
            var createPersonString = function (f, l) {
                return f + ' ' + l
            }
            var result = Monet.apply2(validateForename, validateSurname, createPersonString);
            expect(result).toBeSuccessWith('Tom Baker')
        })

        it('will accumulate errors for apply2 with one failure', function () {
            var createPersonString = function (f, l) {
                return f + ' ' + l
            }
            var result = Monet.apply2(validateForename, Validation.fail(['no surname']), createPersonString);
            expect(result.fail()[0]).toBe('no surname')
        })
        it('will accumulate errors for apply2 with two failures', function () {
            var createPersonString = function (f, l) {
                return f + ' ' + l
            }
            var result = Monet.apply2(Validation.fail(['no first name']), Validation.fail(['no surname']), createPersonString);
            expect(result.fail()[0]).toBe('no surname')
            expect(result.fail()[1]).toBe('no first name')
        })
    })

    // TODO: Provide additional test suite for `monet-pimp`
    xdescribe('will pimp an object', function () {
        it('with success', function () {
            expect('hello'.success()).toBeSuccessWith('hello')
        })
        it('with fail on string', function () {
            expect('hello'.fail()).toBeFailureWith('hello')
        })
        it('with fail on array', function () {
            expect(['hello'].fail()).toBeFailure()
            expect(['hello'].fail().fail()[0]).toBe('hello')
        })

    })

})
