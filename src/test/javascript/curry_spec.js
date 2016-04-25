describe('curry function', function () {
  var fn1, fn2, curried1, curried2

  beforeEach(function () {
    fn1 = function (a, b, c) {
      return a + b + c;
    }
    fn2 = function (a, b) {
      return a * b;
    }
    curried1 = Monet.curry(fn1)
    curried2 = Monet.curry(fn2)
  })

  afterEach(function () {
    fn = curried = undefined
  })

  it('should return function that works as original without curring', function() {
    expect(curried1(1, 1, 1)).toBe(fn1(1, 1, 1))
    expect(curried2(2, 2)).toBe(fn2(2, 2))
  })

  it('should return properly curried function', function() {
    expect(curried1(1)(1, 1)).toBe(fn1(1, 1, 1))
    expect(curried1(1)(2, 3)).toBe(fn1(1, 2, 3))
    expect(curried1(1, 2)(1)).toBe(fn1(1, 2, 1))
    expect(curried1(2)(1)(2)).toBe(fn1(2, 1, 2))
    expect(curried2(2)(3)).toBe(fn2(2, 3))
  })

  it('should provide curried function with not higher arity', function () {
    expect(curried1(1, 1, 1, 5, 22)).toBe(fn1(1, 1, 1))
    expect(curried1(1)(1, 1, 3)).toBe(fn1(1, 1, 1))
    expect(curried1(1)(2, 3, 5)).toBe(fn1(1, 2, 3))
    expect(curried1(1, 2)(1, 1)).toBe(fn1(1, 2, 1))
    expect(curried1(2)(1)(2, 3, 5, 7, 8)).toBe(fn1(2, 1, 2))
    expect(curried2(2)(3, 22)).toBe(fn2(2, 3))
    expect(curried2(2, 2, 3, 4)).toBe(fn2(2, 2))
  })
})
