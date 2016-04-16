describe('A Monad Transformer', function () {

    beforeEach(function() {
        jasmine.addMatchers({
            toBeSomeMaybe: getCustomMatcher(function(actual) {
                return actual.isSome();
            }),
            toBeSomeMaybeWith: getCustomMatcher(function(actual, expected) {
                return actual.some() == expected;
            }),
            toBeNoneMaybe: getCustomMatcher(function(actual) {
                return actual.isNone();
            })
        });
    });

    function create(a) {
        return monadT(IO(function() {return Maybe.Some(a)}))
    }
    var maybeIO = create("hi")

    it('will allow a containing value to be mapped', function() {
        var mappedMaybeIO = maybeIO.map(function (s) { return s+" world"})

        expect(mappedMaybeIO.perform().run()).toBeSomeMaybeWith("hi world")
    })

    it('will allow a containing value to be flatMapped', function() {
        var flatmappedMaybeIO = maybeIO.flatMap(function (s) { return Maybe.Some("w00t")})
        expect(flatmappedMaybeIO.perform().run()).toBeSomeMaybeWith("w00t")
    })

    it('will allow a containing value to be applied (applicative functor style)', function() {
        var plus = function(a,b) { return a + b}.curry()
        var maybeIOWithFn = create(plus)
        var maybeIO1 = create(20)
        var maybeIO2 = create(22)
        var maybeIOResult = maybeIO2.ap(maybeIO1.ap(maybeIOWithFn))
        expect(maybeIOResult.perform().run()).toBeSomeMaybeWith(42)

    })
})