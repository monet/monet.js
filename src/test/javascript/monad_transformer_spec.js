describe('A Monad Transformer', function () {

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

    it('will allow a containing value to be mapped', function() {
        var maybeIO = monadT(IO(function() {return Maybe.some("hi")}))
        var mappedMaybeIO = maybeIO.map(function (s) { return s+" world"})

        expect(mappedMaybeIO.perform().run()).toBeSomeMaybeWith("hi world")
    })
})