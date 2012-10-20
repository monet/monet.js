describe('A Validation', function() {

    beforeEach(function() {
      this.addMatchers({
        toBeSuccess: function(expected) {
          return this.actual.isSuccess();
        },
        toBeSuccessWith: function(expected) {
            return this.actual.success() == expected
        },
        toBeFailure: function() {
            return this.actual.isNone()
        }
      });
    });
    var successString = Validation.success("abcd")
    describe('that is successful', function() {
    it('will be transformed by a map', function() {
               expect(successString.map(function(val){
                    return val.length
               })).toBeSuccessWith(4)
            })
    })
})