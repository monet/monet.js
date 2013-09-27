describe("An immutable list", function () {

    var list = List(1, List(2, List(3, List(4, Nil))))

    var plusOne = function (a) {
        return a + 1
    };


    it("can be converted to Array", function() {
        expect(list.toArray()).toEqual([1,2,3,4])
    })

    it("can be created from an Array", function(){
        expect([1,2,3,4].list()).toEqual(list)
    })

    it("can be mapped", function () {
        var mappedList = list.map(plusOne)
        expect(mappedList.head).toBe(2)
        expect(mappedList.tail.head).toBe(3)
        expect(mappedList.tail.tail.head).toBe(4)
        expect(mappedList.tail.tail.tail.head).toBe(5)
    })

    it("can be reduced using foldLeft", function() {
        expect(list.foldLeft(0)(function(acc,e) {return acc+e})).toEqual(10)
    })
})