describe('A Maybe', function () {
    var someString;
    var none;

    beforeEach(function () {
        jasmine.addMatchers({
            toBeSomeMaybe: getCustomMatcher(function (actual) {
                return actual.isSome();
            }),
            toBeSomeMaybeWith: getCustomMatcher(function (actual, expected) {
                return actual.some() == expected;
            }),
            toBeNoneMaybe: getCustomMatcher(function (actual) {
                return actual.isNone();
            })
        });
        someString = Maybe.Some("abcd");
        none = Maybe.None();
    });

    afterEach(function () {
        someString = undefined;
        none = undefined;
    });

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
                return Maybe.Some('Hello')
            })).toBeSomeMaybeWith('Hello')
        })
        it('will be transformed by a flatMap', function () {
            expect(someString.flatMap(function (val) {
                return Maybe.Some('Hello')
            })).toBeSomeMaybeWith('Hello')
        })
        it('will be transformed to a none on bind that returns none', function () {
            expect(someString.bind(function (val) {
                return Maybe.None()
            })).toBeNoneMaybe()
            expect(someString.flatMap(function (val) {
                return Maybe.None()
            })).toBeNoneMaybe()
        })
        it('will return the value when orSome() is called', function () {
            expect(someString.orSome('no no!')).toBe('abcd')
            expect(someString.orJust('no no!')).toBe('abcd')
            expect(someString.orNull()).toBe('abcd')
        })
        it('will return the first monad on orElse', function () {
            expect(someString.orElse(none)).toBeSomeMaybeWith("abcd")
        })
        it('will return a none on a failed filter', function() {
            expect(someString.filter(function(a) {return a === "123"})).toBeNoneMaybe()
        })
        it('will return a some on a successful filter', function() {
            expect(someString.filter(function(a) {return a === "abcd"})).toBe(someString)
        })
        it('will run the some side of cata', function(){
            expect(someString.cata(function() {return 'efg'},
                function(val){ return 'hij'})).toBe('hij')
        })
        it('will compare for equality', function() {
          expect(someString.equals(Some('abcd'))).toBeTruthy()
          expect(someString.equals(None())).toBeFalsy()
        })
        it('will render as Just(x)', function() {
            expect(someString.inspect()).toBe('Just(abcd)')
        })
    })

    describe('without a value', function () {
        it('will stay a None type after a map', function () {
            expect(none.map(function (val) {
                return val.length
            }).isNone()).toBeTruthy()
        })
        it('will throw an exception when Some() is called', function () {
            expect(function () { none.some() }).toThrow("Illegal state exception")
        })
        it('will be true for isNone()', function () {
            expect(none.isNone()).toBeTruthy()
            expect(none.isNothing()).toBeTruthy()
        })
        it('will be false for isSome()', function () {
            expect(none.isSome()).toBeFalsy()
        })
        it('will always return a none on bind', function () {
            expect(none.bind(function () {
                return Maybe.Some('a')
            })).toBeNoneMaybe()
            expect(none.flatMap(function () {
                return Maybe.Some('a')
            })).toBeNoneMaybe()
            expect(none.bind(function () {
                return Maybe.None()
            })).toBeNoneMaybe()
            expect(none.flatMap(function () {
                return Maybe.None()
            })).toBeNoneMaybe()
        })
        it('will return the other value when orSome() is called', function () {
            expect(none.orSome('yep')).toBe('yep')
            expect(none.orNull()).toBe(null)
        })

        it('will return the supplied monad on orElse', function () {
            expect(none.orElse(someString)).toBeSomeMaybeWith('abcd')
        })
        it('will always return a None on filter', function() {
          expect(none.filter(function(a){return true})).toBeNoneMaybe()
        })
        it('will run the none side of cata', function(){
            expect(none.cata(function() {return 'efg'},
                function(val){ return 'hij'})).toBe('efg')
        })
        it('will compare for equality', function() {
          expect(none.equals(Maybe.None())).toBeTruthy()
          expect(none.equals(Maybe.Just(1))).toBeFalsy()
        })
        it('will render as Nothing', function() {
            expect(none.inspect()).toBe('Nothing')
        })
    })

    describe('Some constructed without a value', function () {
        it('will throw an exception', function () {
            expect(function () {
                Maybe.Some()
            }).toThrow('Illegal state exception')
            expect(function () {
                Maybe.Just()
            }).toThrow('Illegal state exception')
        })
    })

    var person = Monet.curry(function (forename, surname, address) {
        return forename + " " + surname + " lives at " + address
    })

    var maybeAddress = Maybe.Just('Dulwich, London')
    var maybeSurname = Maybe.Just('Baker')
    var maybeForename = Maybe.Just('Tom')

    describe('Applicative functor pattern', function () {
        it('will produce a person object if all maybes contain values', function () {
            var personString = maybeAddress.ap(maybeSurname.ap(maybeForename.map(person))).just()
            expect(personString).toBe("Tom Baker lives at Dulwich, London")
        })
        it('will not produce a person object if any maybes do not contain values', function () {
            var result = maybeAddress.ap(Maybe.Nothing().ap(maybeForename.map(person)))
            expect(result).toBeNoneMaybe()
        })

        it('will work with apply2 with two Somes', function () {
            var result = Monet.apply2(maybeForename, maybeSurname, function (f, l) {
                return f + " " + l
            })
            expect(result).toBeSomeMaybeWith("Tom Baker")
        })

        it('will work with apply2 with one Some and a none', function () {
            var result = Monet.apply2(Maybe.None(), maybeSurname, function (f, l) {
                return f + " " + l
            })
            expect(result).toBeNoneMaybe()
            var result2 = Monet.apply2(maybeForename, Maybe.None(), function (f, l) {
                return f + " " + l
            })
            expect(result2).toBeNoneMaybe()
        })

        it('will work with apply2 with two nones', function () {
            var result = Monet.apply2(Maybe.None(), maybeSurname, function (f, l) {
                return f + " " + l
            })
            expect(result).toBeNoneMaybe()
        })


    })

    describe('Maybe.fromNull', function () {
        describe('will create a none for', function () {
            it('undefined', function () {
                expect(Maybe.fromNull(undefined)).toBeNoneMaybe()
            })
            it('null', function () {
                expect(Maybe.fromNull(null)).toBeNoneMaybe()
            })
        })
        describe('will create a some for', function () {
            it('string', function () {
                expect(Maybe.fromNull("asdf")).toBeSomeMaybe("asdf")
            })
        })
    })

    // TODO: Provide additional test suite for `monet-pimp`
    xdescribe("will pimp an object", function () {
        it("with some", function () {
            expect("hello".some()).toBeSomeMaybeWith("hello")
        })
        it("with just", function () {
            expect("hello".just()).toBeSomeMaybeWith("hello")
        })

    })

    describe("complies with FantasyLand spec for", function () {
        it("'of'", function () {
            expect(Maybe.of("hello")).toBeSomeMaybeWith("hello")
        })
        it("'chain'", function () {
            expect(Maybe.of("hello").chain(function (a) {
                return Maybe.of(a + " world")
            })).toBeSomeMaybeWith("hello world")
            expect(None().chain(function (a) {
                return Maybe.of(a + " world")
            })).toBeNoneMaybe()
        })
    })

    describe("with a Maybe", function () {
        it("will join", function () {
            expect(Some(Just("hello")).join()).toBeSomeMaybeWith("hello")
        })
    })

    describe("with combinators", function() {
        it("will take left", function() {
            expect(Some("hi").takeLeft(Some("world"))).toBeSomeMaybeWith("hi")
        })
        it("will not take left on none", function() {
            expect(None().takeLeft(Some("world"))).toBeNoneMaybe()
            expect(Some("world").takeLeft(None())).toBeNoneMaybe()
            expect(None().takeLeft(None())).toBeNoneMaybe()
        })
        it("will take right", function() {
            expect(Some("hi").takeRight(Some("world"))).toBeSomeMaybeWith("world")
        })
    })


})
