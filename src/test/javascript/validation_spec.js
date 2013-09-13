describe('A Validation', function () {

    beforeEach(function () {
        this.addMatchers({
            toBeSuccess: function (expected) {
                return this.actual.isSuccess();
            },
            toBeSuccessWith: function (expected) {
                return this.actual.success() == expected
            },
            toBeFailure: function () {
                return this.actual.isFail()
            },
            toBeFailureWith: function (expected) {
                return this.actual.fail() == expected
            }
        });
    });
    var successString = Validation.success("abcd")
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
            expect(successString.success()).toBe("abcd")
        })
        it('will return false when isFail is called', function () {
            expect(successString.isFail()).toBeFalsy()
        })
        it('will throw error when fail() is called', function () {
            expect(successString.fail).toThrow('Illegal state. Cannot call fail() on a Validation.success')
        })
        it('will be transformed by a bind', function () {
            expect(successString.bind(function (val) {return Validation.success("efgh")})).toBeSuccessWith("efgh")
            expect(successString.bind(function (val) {return Validation.fail("big fail")})).toBeFailureWith("big fail")
            expect(successString.flatMap(function (val) {return Validation.success("efgh")})).toBeSuccessWith("efgh")
            expect(successString.flatMap(function (val) {return Validation.fail("big fail")})).toBeFailureWith("big fail")
        })
        it('will run the success side of cata', function () {
            expect(successString.cata(function(val){
                throw "fail"
            },function(val){
                return "success "+val
            })).toBe("success abcd")
        })
    })

    var failString = Validation.fail("error dude")
    describe('that is a failure', function () {
        it('will not be transformed by a map', function () {
            expect(failString.map(function (val) {
                return "butterfly"
            })).toBeFailureWith("error dude")
        })
        it('will not be transformed by a bind', function () {
            expect(failString.bind(function (val) {return Validation.success("efgh")})).toBeFailureWith("error dude")
            expect(failString.bind(function (val) {return Validation.fail("big fail")})).toBeFailureWith("error dude")
            expect(failString.flatMap(function (val) {return Validation.success("efgh")})).toBeFailureWith("error dude")
            expect(failString.flatMap(function (val) {return Validation.fail("big fail")})).toBeFailureWith("error dude")
        })
        it('will return false when isSuccess is called', function () {
            expect(failString.isSuccess()).toBeFalsy()
        })
        it('will return error value when fail() is called', function () {
            expect(failString.fail()).toBe("error dude")
        })
        it('will return true when isFail is called', function () {
            expect(failString.isFail()).toBeTruthy()
        })
        it('will throw error when success() is called', function () {
            expect(failString.success).toThrow('Illegal state. Cannot call success() on a Validation.fail')
        })
        it('will run the failure side of cata', function () {
            expect(failString.cata(function(val){
                return "fail: "+val
            }, function(val){
                throw "success"
            })).toBe("fail: error dude")
        })

    })

    var person = function (forename, surname, address) {
        return forename + " " + surname + " lives at " + address
    };
    var personCurried = person.partial(_, _, _)

    var validateAddress = Validation.success('Dulwich, London')
    var validateSurname = Validation.success('Baker')
    var validateForename = Validation.success('Tom')

    describe('Applicative functor pattern', function () {
        it('will produce a person object if all validations are successes', function () {
            var personString = validateAddress.ap(validateSurname.ap(validateForename.map(personCurried))).success()
            expect(personString).toBe("Tom Baker lives at Dulwich, London")
        })
        it('will not produce a person object if any validations are failures', function () {
            var result = validateAddress.ap(Validation.fail(["no surname"]).ap(validateForename.map(personCurried)))
            expect(result).toBeFailureWith("no surname")
        })
        it('will accumulate errors if any validations are list type failures', function () {
            var result = Validation.fail(["no address"]).ap(Validation.fail(["no surname"]).ap(validateForename.map(personCurried)))
            expect(result.fail()[0]).toBe("no address")
            expect(result.fail()[1]).toBe("no surname")
        })
        it('will accumulate errors if any validations are string type failures', function () {
            var result = Validation.fail("no address ").ap(Validation.fail("no surname").ap(validateForename.map(personCurried)))
            expect(result.fail()).toBe("no address no surname")
        })
        it('will anonymously accumulate errors if any validations are failures', function () {
            var result = Validation.fail(["no address"]).ap(Validation.fail(["no surname"]).ap(validateForename.acc()))
            expect(result.fail()[0]).toBe("no address")
            expect(result.fail()[1]).toBe("no surname")

        })
        it('will anonymously accumulate errors if any validations are failures, acc() on fail', function () {
            var result = Validation.fail(["no address"]).ap(Validation.fail(["no surname"]).ap(Validation.fail("no first name").acc()))
            expect(result.fail()[0]).toBe("no address")
            expect(result.fail()[1]).toBe("no surname")
            expect(result.fail()[2]).toBe("no first name")

        })
        it('will anonymously accumulate errors if any validations are failures, acc() on fail, ap() on success', function () {
            var result = validateAddress.ap(Validation.fail(["no surname"]).ap(Validation.fail("no first name").acc()))
            expect(result.fail()[0]).toBe("no surname")
            expect(result.fail()[1]).toBe("no first name")

        })

    })

    describe("will pimp an object", function() {
        it ("with success", function(){
            expect("hello".success()).toBeSuccessWith("hello")
        })
        it("with fail", function(){
            expect("hello".fail()).toBeFailureWith("hello")
        })

    })

})