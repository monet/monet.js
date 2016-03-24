describe('The Monad', function () {

    var test = function(monad, reduction) {
      var fa = function (x) {
        return monad.of(x + 1)
      }

      it("must obey left identity", function() {

        var f = reduction(monad.of(123).bind(fa))
        var fapply = reduction(fa(123))
        expect(f).toBe(fapply)
      })

      it("must obey right identity", function() {
        var m = monad.of(123)
        var m1 = m.bind(function (x) { return monad.of(x)})

        expect(reduction(m)).toBe(reduction(m1))

      })

      it("must be associative", function() {
        var m = monad.of(123)
        var a = (m.bind(function(x) { return monad.of(x*2)})).bind(fa)
        var b = (m.bind(function(x) { return monad.of(x*2).bind(fa)}))
        expect(reduction(a)).toBe(reduction(b))

      })

      it("must also be applicative", function() {
        var m = monad.of(123)
        var f = function(t) { return 2*t }
        var mf = monad.of(f)
        var a = m.ap(mf)
        var b = m.bind(function(t) { return m.unit(f(t)) })
        expect(reduction(a)).toBe(reduction(b))
      })
    }

    describe('Maybe', function() {
      test(Maybe, function(m) {return m.some()})
    })

    describe('Either', function() {
      test(Either, function(m) {return m.right()})
    })

    describe('IO', function() {
      test(IO, function(m) {return m.run()})
    })
    describe('Reader', function() {
     test(Reader, function (m) {return m.run()})
    })

    describe('List', function() {
      test(List, function(m) {return m.head()})
    })

    describe('NonEmptyList', function() {
      test(NEL, function(m) {return m.head()})
    })

    describe('Free', function() {
      test(Free, function(m) {return m.run()})
    })

    describe('Validation', function() {
      test(Validation, function(m) {return m.success()})
    })

})
