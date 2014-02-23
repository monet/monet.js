describe("A Non-Empty immutable list", function () {

    beforeEach(function () {
        this.addMatchers({
            toBeSomeMaybe: function (expected) {
                return this.actual.isSome();
            },
            toBeSomeMaybeWith: function (expected) {
                return this.actual.some() == expected
            },
            toBeNoneMaybe: function () {
                return this.actual.isNone()
            }
        });
    })

    var nonEmptyList = NEL(1, List(2, List(3, List(4, Nil))))

    it("cannot be create with zero elements", function () {
        expect(function () {
            new NEL()
        }).toThrow("Cannot create an empty Non-Empty List.")
    })

    it("must have a head", function () {
        expect(new NEL(1, Nil).head()).toEqual(1)
    })

    it("Must be mappable", function () {
        expect(new NEL(1, Nil).map(function (a) {
            return a + 1
        }).toArray()).toEqual([2])
    })

    it("will be transformed by a flatMap", function () {
        expect(nonEmptyList.flatMap(function (e) {
            return NEL(e * e, List(e + e))
        }).toArray()).toEqual([1, 2, 4, 4, 9, 6, 16, 8])
    })

    it("can be reversed", function () {
        expect(nonEmptyList.reverse().toArray()).toEqual([4, 3, 2, 1])
        expect(NEL(1, Nil).reverse().toArray()).toEqual([1])
    })

    it("can be created from a list", function () {
        expect(NEL.fromList([1, 2, 3, 4].list()).some().toArray()).toEqual([1, 2, 3, 4])
        expect(NEL.fromList(List())).toBeNoneMaybe()
    })

    it("will return a NEL of NELs for tails()", function () {
        expect(nonEmptyList.tails().map(function (m) {
            return m.toArray()
        }).toArray()).toEqual([
            [ 1, 2, 3, 4 ],
            [ 2, 3, 4 ],
            [ 3, 4 ],
            [ 4 ]
        ])
    })

})

