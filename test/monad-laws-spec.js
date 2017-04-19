describe('The Monad', function () {

    var test = function (monad) {
        var equals = function (a, b) {
            if (a.equals) {
                return a.equals(b);
            }
            return a.run() === b.run()
        }

        var fa = function (x) {
            return monad.of(x + 1)
        }

        it('must obey left identity', function () {

            var f = monad.of(123).bind(fa)
            var fapply = fa(123)
            expect(equals(f, fapply)).toBe(true)
        })

        it('must obey right identity', function () {
            var m = monad.of(123)
            var m1 = m.bind(function (x) {
                return monad.of(x)
            })

            expect(equals(m, m1)).toBe(true)

        })

        it('must be associative', function () {
            var m = monad.of(123)
            var a = (m.bind(function (x) {
                return monad.of(x * 2)
            })).bind(fa)
            var b = (m.bind(function (x) {
                return monad.of(x * 2).bind(fa)
            }))
            expect(equals(a, b)).toBe(true)

        })

        it('must also be applicative', function () {
            var m = monad.of(123)
            var f = function (t) {
                return 2 * t
            }
            var mf = monad.of(f)
            var a = m.ap(mf)
            var b = m.bind(function (t) {
                return m.unit(f(t))
            })
            expect(equals(a, b)).toBe(true)
        })
    }

    describe('Maybe', function () {
        test(Maybe)
    })

    describe('Either', function () {
        test(Either)
    })

    describe('IO', function () {
        test(IO)
    })
    describe('Reader', function () {
        test(Reader)
    })

    describe('List', function () {
        test(List)
    })

    describe('NonEmptyList', function () {
        test(NEL)
    })

    describe('Free', function () {
        test(Free)
    })

    describe('Validation', function () {
        test(Validation)
    })

})
