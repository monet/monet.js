describe("An IO monad", function () {
    var effect = IO(function () {
        return "effect";
    })
    describe("will have lazy", function () {

        it("map function", function () {
            expect(effect.map(function (b) {
                return b + " hello"
            }).run()).toBe("effect hello");
        })
        it("flatMap function", function () {
            var newEffect = function (b) {
                return IO(function () {
                        return b + "ive flatMap"
                    }
                )
            }
            var flatMapEffect = effect.flatMap(newEffect)
            var bindEffect = effect.bind(newEffect)
            expect(flatMapEffect.run()).toBe("effective flatMap")
            expect(bindEffect.run()).toBe("effective flatMap")

        })
    })
    describe("will run the effect", function () {
        it("with run method", function () {
            expect(effect.run()).toBe("effect")
        })
    })

    describe("will join", function () {
        it("an inner IO", function () {
            var nestedEffect = IO(function () {
                return effect
            });
            expect(nestedEffect.join().run()).toBe("effect")
        })
    })

    describe("is an applicative functor", function () {
        it("and will apply the function", function () {
            var ioWithFn = IO(function () {
                return function (s) {
                    return "cool " + s
                }
            })
            expect(effect.ap(ioWithFn).run()).toBe("cool effect")
        })
    })
})