describe('An immutable list', function () {
    var List = Monet.List
    var Nil = Monet.Nil
    var Some = Monet.Some
    var None = Monet.None
    var IO = Monet.IO
    var Reader = Monet.Reader
    var Right = Monet.Right
    var Left = Monet.Left
    var Success = Monet.Success
    var Fail = Monet.Fail
    var sideEffectsReceiver = null

    function expectCalls(spiedCall, values) {
        expect(spiedCall.calls.all().length).toEqual(values.length)
        values.forEach(function (value, index) {
            expect(spiedCall.calls.all()[index].args[0]).toEqual(value)
        })
    }

    beforeEach(function () {
        jasmine.addMatchers({
            toBeSomeMaybe: getCustomMatcher(function (actual) {
                return actual.isSome()
            }),
            toBeSomeMaybeWith: getCustomMatcher(function (actual, expected) {
                return actual.some() == expected
            }),
            toBeSomeMaybeWithList: getCustomMatcher(function (actual, expected) {
                return actual.some().toArray() === expected
            }),
            toBeNoneMaybe: getCustomMatcher(function (actual) {
                return actual.isNone()
            })
        })
        sideEffectsReceiver = {
            setVal: function (val) {
            }
        }
        spyOn(sideEffectsReceiver, 'setVal')
    })

    var list = List(1, List(2, List(3, List(4, Nil))))
    var listBase = [1, 2, 3, 4]

    var plusOne = function (a) {
        return a + 1
    }

    it('should check equality', function () {
        expect(List(1).equals(List(1))).toBe(true)
        expect(List(1, Nil).equals(List(1))).toBe(true)
        expect(List(1).equals(List(1, Nil))).toBe(true)
        expect(
            List(1, List(2)).equals(List(1, List(2, Nil)))
        ).toBe(true)

        expect(List(1).equals(List([1, 1]))).toBe(false)
        expect(List(1, Nil).equals(List(2))).toBe(false)
        expect(List(1, List(1)).equals(List(1, Nil))).toBe(false)
        expect(List(1, List(2)).equals(List(1), List(1, Nil))).toBe(false)
        expect(List(1, List(2)).equals(List(1), List(2, List(3)))).toBe(false)
    })

    it('should be created from array', function () {
        expect(List.fromArray(listBase).equals(list)).toBe(true)
    })
    
    it('should be created from any iterable (array)', function () {
        expect(List.from(listBase).equals(list)).toBe(true)
    })
    
    it('should be created from any iterable (set)', function () {
        expect(List.from(new Set(listBase)).equals(list)).toBe(true)
    })

    it('should have a ".to()" operator', function () {
        expect(Nil.to(Array.from)).toEqual([])
        expect(list.to(Array.from)).toEqual(listBase)
        expect(List.from(list.to(Array.from))).toEqual(list)
        expect(List.from(listBase).to(Array.from)).toEqual(listBase)
    })

    it('will return all the possible tails on tails()', function () {
        expect(list.tails().equals(List.fromArray([
            [1, 2, 3, 4],
            [2, 3, 4],
            [3, 4],
            [4],
            []
        ]).map(List.fromArray))).toBe(true)
    })

    it('will return proper size on size()', function () {
        expect(List().size()).toEqual(0)
        expect(List('a').size()).toEqual(1)
        expect(List('a', List('b')).size()).toEqual(2)
        expect(List('a', List('b', List('c'))).size()).toEqual(3)
    })

    it('can be converted to an Array', function () {
        expect(list.toArray()).toEqual([1, 2, 3, 4])
    })

    it('can be created from an Array', function () {
        expect(List.fromArray([1, 2, 3, 4]).equals(list)).toBe(true)
    })

    it('can be converted to a Set', function () {
        expect(list.toSet()).toEqual(new Set([1, 2, 3, 4]))
    })

    it('can be mapped', function () {
        var mappedList = list.map(plusOne)
        expect(mappedList.head()).toBe(2)
        expect(mappedList.tail().head()).toBe(3)
        expect(mappedList.tail().tail().head()).toBe(4)
        expect(mappedList.tail().tail().tail().head()).toBe(5)
    })

    it('can be reduced using foldLeft', function () {
        expect(list.foldLeft(0)(function (acc, e) {
            return acc + e
        })).toEqual(10)
    })

    it('can be reversed using foldLeft and cons', function () {
        expect(list.foldLeft(Nil)(function (acc, e) {
            return acc.cons(e)
        }).toArray()).toEqual([4, 3, 2, 1])
    })

    it('can not be reversed using foldRight and cons', function () {
        expect(list.foldRight(Nil)(function (e, acc) {
            return acc.cons(e)
        }).toArray()).toEqual([1, 2, 3, 4])
    })

    // TODO: Provide additional test suite for `monet-pimp`
    xit('will have cons available on objects', function () {
        expect('fun'.cons(list).toArray()).toEqual(['fun', 1, 2, 3, 4])
    })

    describe('cons', function () {
        const cba = List('b', List('a')).cons('c')

        it('should add elements', function () {
            expect(cba.toArray().join('')).toBe('cba')
        })
    })

    describe('snoc', function () {
        const abc = List('a', List('b')).snoc('c')

        it('should add elements', function () {
            expect(abc.toArray().join('')).toBe('abc')
        })
    })

    it('will be transformed by a flatMap', function () {
        expect(list.flatMap(function (e) {
            return List.fromArray([e * e, e + e])
        }).toArray()).toEqual([1, 2, 4, 4, 9, 6, 16, 8])
    })

    it('will be append another list', function () {
        expect(list.append(List.fromArray([5, 6, 7])).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7])
    })

    describe('will flatten inner lists', function () {
        it('with two elements', function () {
            expect(List.fromArray([List.fromArray([1, 2]), List.fromArray([3, 4])]).flatten().toArray()).toEqual([1, 2, 3, 4])
            expect(List.fromArray([List.fromArray([1, 2]), List.fromArray([3, 4])]).join().toArray()).toEqual([1, 2, 3, 4])
        })
        it('with one element', function () {
            expect(List.fromArray([List.fromArray([1, 2])]).flatten().toArray()).toEqual([1, 2])
            expect(List.fromArray([List.fromArray([1, 2])]).join().toArray()).toEqual([1, 2])
        })
    })

    describe('flattenMaybe', function () {
        it(`should drop Nones and return List of Some values`, function () {
            expect(List.fromArray([Some(1), None(), Some(10)]).flattenMaybe().toArray()).toEqual([1, 10])
        })
    })

    describe('can be created with any values, including null and undefined', function () {

        it('from array', function () {
            expect(List.fromArray([]).size()).toEqual(0)
            expect(List.fromArray([undefined, undefined]).size()).toEqual(2)
            expect(List.fromArray([null, null, null]).size()).toEqual(3)
            expect(List.fromArray([null, undefined, null, undefined]).size()).toEqual(4)
        })

        it('with basic constructor', function () {
            expect(List().size()).toEqual(0)
            expect(List(null).size()).toEqual(1)
            expect(List(null, List(undefined)).size()).toEqual(2)
            expect(List(undefined, List(null, List())).size()).toEqual(2)
            expect(List(undefined, List(null, List(undefined))).size()).toEqual(3)
        })

    })

    describe('allows side-effects on each item', function () {

        it('with the legacy each function', function () {
            List.fromArray([1, 2, 3]).each(sideEffectsReceiver.setVal)
            expectCalls(sideEffectsReceiver.setVal, [1, 2, 3])
        })

        it('with the newer forEach function', function () {
            List.fromArray([1, 2, 3]).forEach(sideEffectsReceiver.setVal)
            expectCalls(sideEffectsReceiver.setVal, [1, 2, 3])
        })
    })

    describe('allows mapping to any value, including', function () {

        var constant = function (value) {
            return function () {
                return value
            }
        }

        it('null', function () {
            expect(List.fromArray(['a', 'b', 'c']).map(constant(null)).size()).toEqual(3)
            expect(List.fromArray(['a', 'b', 'c']).map(constant(null)).toArray()).toEqual([null, null, null])
        })

        it('undefined', function () {
            expect(List.fromArray(['a', 'b', 'c']).map(constant(undefined)).size()).toEqual(3)
            expect(List.fromArray(['a', 'b', 'c']).map(constant(undefined)).toArray()).toEqual([undefined, undefined, undefined])
        })

    })

    describe('will reverse a list', function () {
        it('with 4 elements', function () {
            expect(list.reverse().toArray()).toEqual([4, 3, 2, 1])
        })
        it('with no elements', function () {
            expect(Nil.reverse().toArray()).toEqual([])
        })
        it('with one element', function () {
            expect(List(1, Nil).reverse().toArray()).toEqual([1])
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
                expect(list.every(predicateAll)).toBe(true)
                expect(list.every(predicateSome)).toBe(false)
                expect(list.every(predicateNone)).toBe(false)
    
                expect(list.every(predicateAll)).toBe(list.forall(predicateAll))
                expect(list.every(predicateSome)).toBe(list.forall(predicateSome))
                expect(list.every(predicateNone)).toBe(list.forall(predicateNone))
            })
            it('should return true on empty List', function () {
                expect(Nil.every(predicateAll)).toBe(true)
                expect(Nil.every(predicateSome)).toBe(true)
                expect(Nil.every(predicateNone)).toBe(true)
    
                expect(Nil.every(predicateAll)).toBe(Nil.forall(predicateAll))
                expect(Nil.every(predicateSome)).toBe(Nil.forall(predicateSome))
                expect(Nil.every(predicateNone)).toBe(Nil.forall(predicateNone))
            })
        })
        describe('exists', function () {
            it('should test if any element matches predicate', function () {
                expect(list.exists(predicateAll)).toBe(true)
                expect(list.exists(predicateSome)).toBe(true)
                expect(list.exists(predicateNone)).toBe(false)
            })
            it('should return false for an empty List', function () {
                expect(Nil.exists(predicateAll)).toBe(false)
                expect(Nil.exists(predicateSome)).toBe(false)
                expect(Nil.exists(predicateNone)).toBe(false)
            })
        })
    })

    it('should be an Iterable', function () {
        var onIter = jasmine.createSpy('onIteration')
        for (var a of list) {
            onIter(a)
        }
        expect(onIter.calls.allArgs()).toEqual([[1], [2], [3], [4]])
    })

    describe('will sequence a list', function () {

        describe('of Maybes', function () {

            it('with one defined element', function () {
                expect(List(Some('hello'), Nil).sequenceMaybe().some().toArray()).toEqual(['hello'])
            })

            it('with multiple defined elements', function () {
                expect(List.fromArray([Some(1), Some(2), Some(3)]).sequenceMaybe().some().toArray()).toEqual([1, 2, 3])
            })

            // TODO: Provide additional test suite for `monet-pimp`
            xit('with multiple defined elements (pimped)', function () {
                expect(List.fromArray(['1'.some(), '2'.some(), '3'.some()]).sequenceMaybe().some().toArray()).toEqual(['1', '2', '3'])
            })

            it('with multiple defined elements and one undefined element', function () {
                expect(List.fromArray([Some(1), Some(2), None()]).sequenceMaybe()).toBeNoneMaybe()
            })

            it('with no elements', function () {
                expect(List.fromArray([]).sequenceMaybe().some().toArray()).toEqual([])
            })

        })

        describe('of Validations', function () {

            it('with one success element', function () {
                expect(List(Success('hello'), Nil).sequenceValidation().success().toArray()).toEqual(['hello'])
            })

            it('with two success elements', function () {
                expect(List.fromArray([
                    Success('1'),
                    Success('2')
                ]).sequenceValidation().success().toArray()).toEqual(['1', '2'])
            })

            it('with one success element and one fail (in array) element', function () {
                expect(List.fromArray([
                    Success('happy'),
                    Fail(['sad'])
                ]).sequenceValidation().fail()).toEqual(['sad'])
            })

            it('with one success element and two failed (in array) element', function () {
                expect(List.fromArray([
                    Success('happy'),
                    Fail(['sad']),
                    Fail(['really sad'])
                ]).sequenceValidation().fail()).toEqual(['sad', 'really sad'])
            })

            it('with one success element and one fail (in list) element', function () {
                expect(List.fromArray([
                    Success('happy'),
                    Fail(List.fromArray(['sad']))
                ]).sequenceValidation().fail().toArray()).toEqual(['sad'])
            })

            it('with one success element and two failed (in list) element', function () {
                expect(List.fromArray([
                    Success('happy'),
                    Fail(List.fromArray(['sad'])),
                    Fail(List.fromArray(['really sad']))
                ]).sequenceValidation().fail().toArray()).toEqual(['sad', 'really sad'])
            })

        })

        describe('of Eithers', function () {

            it('with one right element', function () {
                expect(List(Right('hello'), Nil).sequenceEither().right().toArray()).toEqual(['hello'])
            })

            it('with two right elements', function () {
                expect(List.fromArray([
                    Right('1'),
                    Right('2')
                ]).sequenceEither().right().toArray()).toEqual(['1', '2'])
            })

            it('with one right element and one left element', function () {
                expect(List.fromArray([
                    Right('happy'),
                    Left('sad')
                ]).sequenceEither().left()).toEqual('sad')
            })

            it('with one right element and two left element', function () {
                expect(List.fromArray([
                    Right('happy'),
                    Left('sad'),
                    Left('really sad')
                ]).sequenceEither().left()).toEqual('sad')
            })

            it('with one right element and one left (in list) element', function () {
                expect(List.fromArray([
                    Right('happy'),
                    Left(List.fromArray(['sad']))
                ]).sequenceEither().left().toArray()).toEqual(['sad'])
            })

            it('with one right element and two left (in list) element', function () {
                expect(List.fromArray([
                    Right('happy'),
                    Left(List.fromArray(['sad'])),
                    Left(List.fromArray(['really sad']))
                ]).sequenceEither().left().toArray()).toEqual(['sad'])
            })

        })

        describe('of IOs', function () {
            it('with one IO', function () {
                var io1 = IO(function () {
                    return 'hi'
                })
                expect(List.fromArray([io1]).sequence(IO).run().toArray()).toEqual(['hi'])
            })
            it('with two IOs', function () {
                var io1 = IO(function () {
                    return 'hi'
                })
                expect(List.fromArray([io1, io1]).sequence(IO).run().toArray()).toEqual(['hi', 'hi'])
            })
        })

        describe('of Readers', function () {
            it('with one Reader', function () {
                var r = Reader(function (config) {
                    return config.text
                })
                expect(List.fromArray([r]).sequence(Reader).run({ text: 'Hi Reader' }).toArray()).toEqual(['Hi Reader'])

            })
            it('with two Readers', function () {
                var r1 = Reader(function (config) {
                    return config.text
                })
                var r2 = Reader(function (config) {
                    return config.name
                })
                expect(List.fromArray([r1, r2]).sequence(Reader).run({
                    text: 'Hi Reader',
                    name: 'Tom'
                }).toArray()).toEqual(['Hi Reader', 'Tom'])

            })
        })

        it('will render as List(x1, x2, x3)', function () {
            expect(List.fromArray([1, false, 'xyz']).inspect()).toBe('List(1, false, xyz)')
        })

    })

    describe('that is empty', function () {
        it('will return Nil on tail()', function () {
            expect(Nil.tail()).toBe(Nil)
        })
        it('will return a list with an empty list on tails()', function () {
            expect(Nil.tails().toArray()).toEqual([Nil])
        })
        it('will return None for headMaybe', function () {
            expect(Nil.headMaybe()).toBeNoneMaybe()
        })
        it('will return an empty list on filter', function () {
            expect(Nil.filter(function () {
                return true
            })).toEqual(Nil)
        })
        it('will return an empty list on filterNot', function () {
            expect(Nil.filterNot(function () {
                return false
            })).toEqual(Nil)
        })
        it('will return a None on find', function () {
            expect(Nil.find(function () {
                return true
            })).toBeNoneMaybe()
        })
        it('will return false on contains', function () {
            expect(Nil.contains('anything')).toEqual(false)
        })
        it('will render as Nil', function () {
            expect(Nil.inspect()).toBe('Nil')
        })
    })

    describe('that has multiple elements', function () {
        it('will return the first element in a Some for headMaybe', function () {
            expect(list.headMaybe()).toBeSomeMaybeWith(1)

        })
        it('will return the elements that pass the filter', function () {
            expect(list.filter(function (a) {
                return a % 2 == 0
            }).toArray()).toEqual([2, 4])

        })
        it('will return the elements that does not pass the filterNot', function () {
            expect(list.filterNot(function (a) {
                return a % 2 == 0
            }).toArray()).toEqual([1, 3])

        })
        it('will return the first elements that pass the predicate', function () {
            expect(list.find(function (a) {
                return a % 2 == 0
            })).toBeSomeMaybeWith(2)
        })
        it('will return None if no element pass the predicate', function () {
            expect(list.find(function (a) {
                return a < 0
            })).toBeNoneMaybe()
        })
        it('will return false on contains on a value not present in the list', function () {
            expect(list.contains(-1)).toBe(false)
        })
        it('will return true on contains on a value present in the list', function () {
            expect(list.contains(2)).toBe(true)
        })
    })

    describe('that is huge, must not blow the stack', function () {
        var list1 = [], list2 = []
        var size = 1000
        for (var i = 0 ; i < size ; i++) {
            list1.push(i)
            list2.push(i * 2)
        }
        it('for an append', function () {
            expect(List.fromArray(list1).append(List.fromArray(list2)).size()).toBe(size * 2)
        })
        it('for a find', function () {
            expect(List.fromArray(list1).find(function (x) {
                return false
            })).toBeNoneMaybe()
        })
    })

    describe('complies with FantasyLand spec for', function () {

        it('of()', function () {
            expect(List.of('some val').toArray()).toEqual(['some val'])
        })

        xdescribe('chain()', function () {
            it('being associative', function () { })
        })
    })

    it('should be compatible with Fantasy Land', function () {
        var list = List.of('some val')
        expect(list.equals).toBe(list['fantasy-land/equals'])
    })

    describe('List.isInstance', function () {
        it('will return true for List instances', function () {
            expect(List.isInstance(List.fromArray([]))).toBe(true)
        })
        it('will return false for other monads', function () {
            expect(List.isInstance(Monet.Maybe.Some({}))).toBe(false)
            expect(List.isInstance(Monet.Maybe.None())).toBe(false)
            expect(List.isInstance(Monet.Validation.Success([]))).toBe(false)
        })
        it('will return false on non-monads', function () {
            expect(List.isInstance({})).toBe(false)
            expect(List.isInstance(true)).toBe(false)
            expect(List.isInstance(false)).toBe(false)
            expect(List.isInstance('foo')).toBe(false)
        })
    })

})
