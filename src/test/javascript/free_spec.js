describe("A Free monad", function () {
    it("Do a flatMap", function () {
        var s1 = Free.liftF(Identity(1));
        var s2 = Free.liftF(Identity(2));
        var s3 = Free.liftF(Identity(3));

        var free = s1.flatMap(function (i1) {
            return s2.flatMap(function (i2) {
                return s3.flatMap(function (i3) {
                    return i1 + i2 + i3
                })
            })

        })
        expect(free.run().get()).toBe(6)
    })

})
