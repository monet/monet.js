describe('An Option', function() {

var rootId = "Option"
    var maybeString = new Some("abcd")
    describe('with a value', function() {
        it('will be transformed by a map', function() {
           expect(maybeString.map(function(val){
                return val.length
           }).some()).toBe(4)
        })
        it('will be will true for isSome()', function() {
            expect(maybeString.isSome()).toBeTruthy()
        })
        it('will be false for isNone()', function() {
            expect(maybeString.isNone()).toBeFalsy()
        })
    })

})