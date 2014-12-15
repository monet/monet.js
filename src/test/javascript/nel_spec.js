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

    it("will map a function over the tails with cobind", function () {
        expect(nonEmptyList.cobind(function (nel) {
            return nel.foldLeft(0)(function(a,b){
                return a+b
            })
        }).toArray()).toEqual([10,9,7,4])
    })

    it("will append two NELs together", function() {
        var n1 = NEL.fromList([1,2,3,4].list()).some()
        var n2 = NEL.fromList([5,6,7,8].list()).some()
        var nAppend = n1.append(n2)
        expect(nAppend.isNEL).toBeTruthy()
        expect(nAppend.size()).toBe(8)
        expect(nAppend.toArray()).toEqual([1,2,3,4,5,6,7,8])
    })

  it("will be filtered", function() {
    var n1 = NEL.fromList([1,2,3,4,5,6,7,8].list()).some()
    expect(n1.filter(function(a){return a%2==0}).toArray()).toEqual([2,4,6,8])

  })

  it("can be reversed using foldLeft and cons", function () {
    expect(nonEmptyList.foldLeft(Nil)(function (acc, e) {
      return acc.cons(e)
    }).toArray()).toEqual([4,3,2,1])
  })

  it("can not be reversed using foldRight and cons", function () {
    expect(nonEmptyList.foldRight(Nil)(function (e, acc) {
      return acc.cons(e)
    }).toArray()).toEqual([1,2,3,4])
  })

  it("can be reduced using reduceLeft", function () {
    expect(nonEmptyList.reduceLeft(function (a,b) {return a+b})).toEqual(10)
  })


})

