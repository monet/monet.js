describe('A Maybe', function() {

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

    var someString = Maybe.Some("abcd")
    var none = Maybe.none()
    describe('with a value', function() {
        it('will be transformed by a map', function() {
           expect(someString.map(function(val){
                return val.length
           })).toBeSomeMaybeWith(4)
        })
        it('will be will true for isSome()', function() {
            expect(someString.isSome()).toBeTruthy()
        })
        it('will be will true for isJust()', function() {
            expect(someString.isJust()).toBeTruthy()
        })
        it('will be false for isNone()', function() {
            expect(someString.isNone()).toBeFalsy()
            expect(someString.isNothing()).toBeFalsy()
        })
        it('will be transformed by a bind', function() {
            expect(someString.bind(function(val){return Maybe.some('Hello')})).toBeSomeMaybeWith('Hello')
        })
        it('will be transformed to a none on bind that returns none', function() {
            expect(someString.bind(function(val){return Maybe.none()})).toBeNoneMaybe()
        })
        it ('will return the value when orSome() is called', function() {
            expect(someString.orSome('no no!')).toBe('abcd')
            expect(someString.orJust('no no!')).toBe('abcd')
        })
    })

    describe('without a value', function() {
        it('will stay a None type after a map', function() {
            expect(none.map(function(val){return val.length}).isNone()).toBeTruthy()
        })
        it('will throw an exception when some() is called', function() {
            expect(none.some).toThrow("Illegal state exception")
        })
        it('will be true for isNone()', function(){
            expect(none.isNone()).toBeTruthy()
            expect(none.isNothing()).toBeTruthy()
        })
        it('will be false for isSome()', function(){
            expect(none.isSome()).toBeFalsy()
        })
        it('will always return a none on bind', function() {
            expect(none.bind(function() { return Maybe.some('a')})).toBeNoneMaybe()
            expect(none.bind(function() { return Maybe.none()})).toBeNoneMaybe()
        })
        it ('will return the other value when orSome() is called', function() {
            expect(none.orSome('yep')).toBe('yep')
        })
    })

    describe('Some constructed without a value', function() {
        it('will throw an exception', function(){
            expect(function(){Maybe.some()}).toThrow('Illegal state exception')
            expect(function(){Maybe.just()}).toThrow('Illegal state exception')
        })
    })

})