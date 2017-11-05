describe('A Non-Empty immutable list', function () {
    var sideEffectsReceiver = null;

    function expectCalls(spiedCall, values) {
        expect(spiedCall.calls.all().length).toEqual(values.length)
        for (var i = 0; i < values.length; i++) {
            expect(spiedCall.calls.all()[i].args[0]).toEqual(values[i])
        }
    }

    beforeEach(function () {
        jasmine.addMatchers({
            toBeSomeMaybe: getCustomMatcher(function (actual) {
                return actual.isSome();
            }),
            toBeSomeMaybeWith: getCustomMatcher(function (actual, expected) {
                return actual.some() == expected;
            }),
            toBeNoneMaybe: getCustomMatcher(function (actual) {
                return actual.isNone();
            })
        });
        sideEffectsReceiver = {
            setVal: function (val) {
            }
        };
        spyOn(sideEffectsReceiver, 'setVal');
    });

    var nonEmptyList = NEL(1, List(2, List(3, List(4, Nil))))

    var plus = function (a, b) {
        return a + b
    }


    it('cannot be create with zero elements', function () {
        expect(function () {
            new NEL()
        }).toThrow(new Error('Cannot create an empty Non-Empty List. Passed head is undefined.'))
    })

    it('must have a head', function () {
        expect(new NEL(1, Nil).head()).toEqual(1)
    })

    it('Must be mappable', function () {
        expect(new NEL(1, Nil).map(function (a) {
            return a + 1
        }).toArray()).toEqual([2])
    })

    it('will be transformed by a flatMap', function () {
        expect(nonEmptyList.flatMap(function (e) {
            return NEL(e * e, List(e + e))
        }).toArray()).toEqual([1, 2, 4, 4, 9, 6, 16, 8])
    })

    it('can be reversed', function () {
        expect(nonEmptyList.reverse().toArray()).toEqual([4, 3, 2, 1])
        expect(NEL(1, Nil).reverse().toArray()).toEqual([1])
    })

    it('allows side-effects with the forEach function', function () {
        nonEmptyList.forEach(sideEffectsReceiver.setVal);
        expectCalls(sideEffectsReceiver.setVal, [1, 2, 3, 4])
    })

    it('can be created from a list', function () {
        expect(NEL.fromList(List.fromArray([1, 2, 3, 4])).some().toArray()).toEqual([1, 2, 3, 4])
        expect(NEL.fromList(List())).toBeNoneMaybe()
    })

    it('will return a NEL of NELs for tails()', function () {
        expect(nonEmptyList.tails().map(function (m) {
            return m.toArray()
        }).toArray()).toEqual([
            [1, 2, 3, 4],
            [2, 3, 4],
            [3, 4],
            [4]
        ])
    })

    it('will map a function over the tails with cobind', function () {
        expect(nonEmptyList.cobind(function (nel) {
            return nel.foldLeft(0)(function (a, b) {
                return a + b
            })
        }).toArray()).toEqual([10, 9, 7, 4])
    })

    it('will append two NELs together', function () {
        var n1 = NEL.fromList(List.fromArray([1, 2, 3, 4])).some()
        var n2 = NEL.fromList(List.fromArray([5, 6, 7, 8])).some()
        var nAppend = n1.append(n2)
        expect(nAppend.isNEL).toBeTruthy()
        expect(nAppend.size()).toBe(8)
        expect(nAppend.toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    })

    it('will be filtered', function () {
        var n1 = NEL.fromList(List.fromArray([1, 2, 3, 4, 5, 6, 7, 8])).some()
        expect(n1.filter(function (a) {
            return a % 2 == 0
        }).toArray()).toEqual([2, 4, 6, 8])
    })

    it('will be filtered with filterNot', function () {
        var n1 = NEL.fromList(List.fromArray([1, 2, 3, 4, 5, 6, 7, 8])).some()
        expect(n1.filterNot(function (a) {
            return a % 2 == 0
        }).toArray()).toEqual([1, 3, 5, 7])
    })

    it('can be searched', function () {
        var n1 = NEL.fromList(List.fromArray([1, 2, 3, 4, 5, 6, 7, 8])).some()
        expect(n1.find(function (a) {
            return a % 2 == 0
        })).toBeSomeMaybeWith(2)
    })

    it('can be checked for not containing a value', function () {
        var n1 = NEL.fromList(List.fromArray([1, 2, 3])).some()
        expect(n1.contains(4)).toBe(false)
    })

    it('can be checked for containing a value', function () {
        var n1 = NEL.fromList(List.fromArray([1, 2, 3])).some()
        expect(n1.contains(3)).toBe(true)
    })

    it('can be reversed using foldLeft and cons', function () {
        expect(nonEmptyList.foldLeft(Nil)(function (acc, e) {
            return acc.cons(e)
        }).toArray()).toEqual([4, 3, 2, 1])
    })

    it('can not be reversed using foldRight and cons', function () {
        expect(nonEmptyList.foldRight(Nil)(function (e, acc) {
            return acc.cons(e)
        }).toArray()).toEqual([1, 2, 3, 4])
    })

    it('can be reduced using reduceLeft', function () {
        expect(nonEmptyList.reduceLeft(plus)).toEqual(10)
    })

    it('single element NEL will reduce to the single element', function () {
        expect(NEL(1, Nil).reduceLeft(plus)).toEqual(1)
    })

    it('will render as NEL(x1, x2, x3)', function () {
        expect(NEL(1, NEL(false, Nil)).inspect()).toBe('NEL(1, false)')
    })
})
