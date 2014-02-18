describe("A Non-Empty immutable list", function () {

    var nonEmptyList = NEL(1, List(2, List(3, List(4, Nil))))

    it ("cannot be create with zero elements", function() {
        expect(function() {new NEL()}).toThrow("Cannot create an empty Non-Empty List.")
    })

    it("must have a head", function() {
        expect(new NEL(1,Nil).head()).toEqual(1)
    })

    it("Must be mappable", function() {
        expect(new NEL(1, Nil).map(function(a){return a+1}).toArray()).toEqual([2])
    })

    it("will be transformed by a flatMap", function () {
        expect(nonEmptyList.flatMap(function (e) {
            return NEL(e*e, List(e+e))
        }).toArray()).toEqual([1, 2, 4, 4, 9, 6, 16, 8])
    })

})

