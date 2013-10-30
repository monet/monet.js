describe("An immutable list", function () {

    beforeEach(function () {
        this.addMatchers({
            toBeSomeMaybe: function (expected) {
                return this.actual.isSome();
            },
            toBeSomeMaybeWith: function (expected) {
                return this.actual.some() == expected
            },
            toBeSomeMaybeWithList: function (expected) {
                return this.actual.some().toArray() === expected
            },
            toBeNoneMaybe: function () {
                return this.actual.isNone()
            }
        });
    })

    var list = List(1, List(2, List(3, List(4, Nil))))

    var plusOne = function (a) {
        return a + 1
    };


    it("can be converted to Array", function () {
        expect(list.toArray()).toEqual([1, 2, 3, 4])
    })

    it("can be created from an Array", function () {
        expect([1, 2, 3, 4].list()).toEqual(list)
    })

    it("can be mapped", function () {
        var mappedList = list.map(plusOne)
        expect(mappedList.head).toBe(2)
        expect(mappedList.tail.head).toBe(3)
        expect(mappedList.tail.tail.head).toBe(4)
        expect(mappedList.tail.tail.tail.head).toBe(5)
    })

    it("can be reduced using foldLeft", function () {
        expect(list.foldLeft(0)(function (acc, e) {
            return acc + e
        })).toEqual(10)
    })

    it("will have cons available on objects", function () {
        expect("fun".cons(list).toArray()).toEqual(["fun", 1, 2, 3, 4])
    })

    it("will be transformed by a flatMap", function () {
        expect(list.flatMap(function (e) {
            return [e * e, e + e].list()
        }).toArray()).toEqual([1, 2, 4, 4, 9, 6, 16, 8])
    })

    it("will be append another list", function () {
        expect(list.append([5, 6, 7].list()).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7])
    })

    describe("will flatten inner lists", function() {
        it("with two elements", function () {
            expect([[1, 2].list(), [3, 4].list()].list().flatten().toArray()).toEqual([1, 2, 3, 4])
        })
        it("with one element", function() {
            expect([[1,2].list()].list().flatten().toArray()).toEqual([1,2])
        })

    })

    describe("will reverse a list", function() {
        it("with 4 elements", function() {
            expect(list.reverse().toArray()).toEqual([4,3,2,1])
        })
        it("with no elements", function() {
            expect(Nil.reverse().toArray()).toEqual([])
        })
        it("with one element", function() {
            expect(List(1,Nil).reverse().toArray()).toEqual([1])
        })
    })

    describe("will sequence a list", function () {
        describe("of Maybes", function () {
            it("with one defined element", function () {
                expect(List(Some("hello"), Nil).sequenceMaybe().some().toArray()).toEqual(["hello"])
            })
            it("with multiple defined elements", function() {
                expect([Some(1),Some(2),Some(3)].list().sequenceMaybe().some().toArray()).toEqual([1,2,3])
            })
            it("with multiple defined elements (pimped)", function() {
                expect(["1".some(),"2".some(),"3".some()].list().sequenceMaybe().some().toArray()).toEqual(["1","2","3"])
            })
            it("with multiple defined elements and one undefined element", function() {
                expect([Some(1),Some(2),None()].list().sequenceMaybe()).toBeNoneMaybe()
            })
            it("with no elements", function() {
                expect([].list().sequenceMaybe().some().toArray()).toEqual([])
            })
        })
        describe("of Validations", function() {
            it("with one success element", function() {
                expect(List("hello".success(),Nil).sequenceValidation().success().toArray()).toEqual(["hello"])
            })
            it("with two success elements", function() {
                expect(["1".success(),"2".success()].list().sequenceValidation().success().toArray()).toEqual(["1","2"])
            })
            it("with one success element and one fail (in array) element", function() {
                expect(["happy".success(), ["sad"].fail()].list().sequenceValidation().fail()).toEqual(["sad"])
            })
            it("with one success element and two failed (in array) element", function() {
                expect(["happy".success(), ["sad"].fail(), ["really sad"].fail()].list().sequenceValidation().fail()).toEqual(["sad", "really sad"])
            })
            it("with one success element and one fail (in list) element", function() {
                expect(["happy".success(), ["sad"].list().fail()].list().sequenceValidation().fail().toArray()).toEqual(["sad"])
            })
            it("with one success element and two failed (in list) element", function() {
                expect(["happy".success(), ["sad"].list().fail(), ["really sad"].list().fail()].list().sequenceValidation().fail().toArray()).toEqual(["sad", "really sad"])
            })
        })
    })
    describe("complies with FantasyLand spec for", function() {
        it("'of'", function() {
            expect(List.of("some val").toArray()).toEqual(["some val"])
        })
        describe("'chain'", function() {
            it("being associative", function(){

            })
        })
    })
})