describe('A Monad Transformer', function () {

    Functional.install()

    beforeEach(function() {
        this.addMatchers({
            toBeSomeMaybe: function(expected) {
                return this.actual.isSome();
            },
            toBeSomeMaybeWith: function(expected) {
                return this.actual.some() == expected
            },
            toBeNoneMaybe: function() {
                return this.actual.isNone()
            }
        });
    });

    function create(a) {
        return monadT(IO(function() {return Maybe.some(a)}))
    }
    var maybeIO = create("hi")

    it('will allow a containing value to be mapped', function() {
        var mappedMaybeIO = maybeIO.map(function (s) { return s+" world"})

        expect(mappedMaybeIO.perform().run()).toBeSomeMaybeWith("hi world")
    })

    it('will allow a containing value to be flatMapped', function() {
        var flatmappedMaybeIO = maybeIO.flatMap(function (s) { return Maybe.some("w00t")})
        expect(flatmappedMaybeIO.perform().run()).toBeSomeMaybeWith("w00t")
    })

    it('will allow a containing value to be applied (applicative functor style)', function() {
        var plus = function(a,b) { return a + b}.partial(_,_)
        var maybeIOWithFn = create(plus)
        var maybeIO1 = create(20)
        var maybeIO2 = create(22)
        var maybeIOResult = maybeIO2.ap(maybeIO1.ap(maybeIOWithFn))
        expect(maybeIOResult.perform().run()).toBeSomeMaybeWith(42)

    })
})