global.useMonetGlobalObject = true // run browser style tests
require('../dist/monet.js')

describe('global Monet object', function () {
  it('should be available', function () {
    expect(Monet).toBeDefined()
    expect(Maybe).toBeDefined()
    expect(Either).toBeDefined()
    expect(Validation.success).toBe(Success)
  })
})
