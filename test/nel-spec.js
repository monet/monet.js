describe('A Non-Empty immutable list', function () {
    var NEL = Monet.NEL
    var List = Monet.List
    var Nil = Monet.Nil
    var Some = Monet.Some
    var None = Monet.None
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
    var listBase = [1, 2, 3, 4]

    var plus = function (a, b) {
        return a + b
    }

    it('should check equality', function () {
        expect(NEL(1).equals(NEL(1))).toBe(true)
        expect(NEL(1, Nil).equals(NEL(1))).toBe(true)
        expect(NEL(1).equals(NEL(1, Nil))).toBe(true)
        expect(
            NEL(1, List(2)).equals(NEL(1, List(2, Nil)))
        ).toBe(true)

        expect(NEL(1).equals(NEL([1, 1]))).toBe(false)
        expect(NEL(1, Nil).equals(NEL(2))).toBe(false)
        expect(NEL(1, List(1)).equals(NEL(1, Nil))).toBe(false)
        expect(NEL(1, List(2)).equals(NEL(1), List(1, Nil))).toBe(false)
        expect(NEL(1, List(2)).equals(NEL(1), List(2, List(3)))).toBe(false)
    })


    it('cannot be create with zero elements', function () {
        expect(function () {
            new NEL()
        }).toThrow(new Error('Cannot create an empty Non-Empty List. Passed head is undefined.'))
    })

    it('must have a head', function () {
        expect(new NEL(1, Nil).head()).toEqual(1)
    })

    it('should be created from list', function () {
        expect(NEL.fromList(List.fromArray(listBase)).equals(Some(nonEmptyList))).toBe(true)
    })

    it('should be created from array', function () {
        expect(NEL.fromArray(listBase).equals(Some(nonEmptyList))).toBe(true)
    })

    it('should be created from any iterable (array)', function () {
        expect(NEL.from(listBase).equals(Some(nonEmptyList))).toBe(true)
    })

    it('should be created from any iterable (set)', function () {
        expect(NEL.from(new Set(listBase)).equals(Some(nonEmptyList))).toBe(true)
    })

    it('should have a ".to()" operator', function () {
        expect(nonEmptyList.to(Array.from)).toEqual(listBase)
        expect(NEL.from(nonEmptyList.to(Array.from))).toEqual(Some(nonEmptyList))
        expect(NEL.from(listBase).some().to(Array.from)).toEqual(listBase)
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

    it('can be converted to a List', function () {
        expect(nonEmptyList.toList()).toEqual(List.fromArray([1, 2, 3, 4]))
    })

    it('can be converted to an Array', function () {
        expect(nonEmptyList.toArray()).toEqual([1, 2, 3, 4])
    })

    it('can be converted to a Set', function () {
        expect(nonEmptyList.toSet()).toEqual(new Set([1, 2, 3, 4]))
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

    it('should be an Iterable', function () {
        var onIter = jasmine.createSpy('onIteration')
        for (var a of nonEmptyList) {
            onIter(a)
        }
        expect(onIter.calls.allArgs()).toEqual([[1], [2], [3], [4]])
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

    describe('will flatten inner lists', function () {
        it('with two elements', function () {
            expect(
                NEL.fromList(List.fromArray([
                    List.fromArray([1, 2]), 
                    List.fromArray([3, 4]),
                ])).some().flatten().toArray()
            ).toEqual([1, 2, 3, 4])
            expect(
                NEL.fromList(List.fromArray([
                    NEL.fromList(List.fromArray([1, 2])).some(), 
                    NEL.fromList(List.fromArray([3, 4])).some(),
                ])).some().join().toArray()
            ).toEqual([1, 2, 3, 4])
        })
        it('with one element', function () {
            expect(
                NEL.fromList(List.fromArray([List.fromArray([1, 2])])).some().flatten().toArray()
            ).toEqual([1, 2])
            expect(
                NEL.fromList(List.fromArray([
                    NEL.fromList(List.fromArray([1, 2])).some()
                ])).some().join().toArray()
            ).toEqual([1, 2])
        })
    })

    describe('flattenMaybe', function () {
        it(`should drop Nones and return List of Some values`, function () {
            expect(
                NEL.fromList(List.fromArray([Some(1), None(), Some(10)]))
                    .some()
                    .flattenMaybe()
                    .toArray()
            ).toEqual([1, 10])
        })
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

    describe('cons', function () {
        const cba = NEL('b', List('a')).cons('c')

        it('should add elements', function () {
            expect(cba.isNEL()).toBe(true)
            expect(cba.toArray().join('')).toBe('cba')
        })
    })

    describe('snoc', function () {
        const abc = NEL('a', List('b')).snoc('c')

        it('should add elements', function () {
            expect(abc.isNEL()).toBe(true)
            expect(abc.toArray().join('')).toBe('abc')
        })
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

    describe('NEL.isInstance', function () {
        it('will return true for NEL instances', function () {
            expect(NEL.isInstance(NEL(1))).toBe(true)
        })
        it('will return false for other monads', function () {
            expect(NEL.isInstance(Monet.Validation.Success({}))).toBe(false)
            expect(NEL.isInstance(Monet.Validation.Fail({}))).toBe(false)
            expect(NEL.isInstance(Monet.List.fromArray([]))).toBe(false)
        })
        it('will return false on non-monads', function () {
            expect(NEL.isInstance({})).toBe(false)
            expect(NEL.isInstance(true)).toBe(false)
            expect(NEL.isInstance(false)).toBe(false)
            expect(NEL.isInstance('foo')).toBe(false)
        })
    })

    describe('can be described with collection predicates', function () {
        var predicateAll = function (e) {
            return e < 5
        }
        var predicateSome = function (e) {
            return e < 3
        }
        var predicateNone = function (e) {
            return e === -12
        }
        describe('every / forall', function () {
            it('should test if all elements match predicate', function () {
                expect(nonEmptyList.every(predicateAll)).toBe(true)
                expect(nonEmptyList.every(predicateSome)).toBe(false)
                expect(nonEmptyList.every(predicateNone)).toBe(false)
    
                expect(nonEmptyList.every(predicateAll)).toBe(nonEmptyList.forall(predicateAll))
                expect(nonEmptyList.every(predicateSome)).toBe(nonEmptyList.forall(predicateSome))
                expect(nonEmptyList.every(predicateNone)).toBe(nonEmptyList.forall(predicateNone))
            })
        })
        describe('exists', function () {
            it('should test if any element matches predicate', function () {
                expect(nonEmptyList.exists(predicateAll)).toBe(true)
                expect(nonEmptyList.exists(predicateSome)).toBe(true)
                expect(nonEmptyList.exists(predicateNone)).toBe(false)
            })
        })
    })
})
