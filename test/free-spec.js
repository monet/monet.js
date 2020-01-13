describe('A Free monad', function () {
    var Free = Monet.Free
    var Suspend = Monet.Suspend
    var Return = Monet.Return
    var Identity = Monet.Identity

    it('do Ken\'s simple box example', function () {
        var s1 = Free.liftF(Identity(1));
        var s2 = Free.liftF(Identity(2));
        var s3 = Free.liftF(Identity(3));

        var free = s1.flatMap(function (i1) {
            return s2.flatMap(function (i2) {
                return s3.map(function (i3) {
                    return i1 + i2 + i3
                })
            })

        })
        expect(free.go(function (box) {
            return box.get()
        })).toBe(6)
    })

    it('can use a function as a functor', function () {
        var f1 = Free.liftF(function () {
            return 2 + 3
        })

        var computation = f1.flatMap(function (a) {
            return Free.liftF(function () {
                return a * 2
            }).flatMap(function (b) {
                return Free.liftF(function () {
                    return a * b
                })
            })
        })

        expect(computation.go(function (f) {
            return f()
        })).toBe(50)

    })

    it('will not blow the stack', function () {
        var limit = 1000

        function g(a) {
            if (a < limit) {
                return Suspend(function () {
                    return g(a + 1)
                })
            } else {
                return Return(a)
            }
        }

        expect(g(1).run()).toBe(limit)
    })

    describe('Free.isInstance', function () {
        it('will return true for Free instances', function () {
            expect(Free.isInstance(Free.Return([]))).toBe(true)
            expect(Free.isInstance(Free.Suspend([]))).toBe(true)
        })
        it('will return false for other monads', function () {
            expect(Free.isInstance(Monet.Maybe.Some({}))).toBe(false)
            expect(Free.isInstance(Monet.Maybe.None())).toBe(false)
            expect(Free.isInstance(Monet.List.fromArray([]))).toBe(false)
        })
        it('will return false on non-monads', function () {
            expect(Free.isInstance({})).toBe(false)
            expect(Free.isInstance(true)).toBe(false)
            expect(Free.isInstance(false)).toBe(false)
            expect(Free.isInstance('foo')).toBe(false)
        })
    })

})
