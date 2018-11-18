const monet = require('../dist/monet.js')

describe('Node: monet.js exports object', function () {
  it('should be available', function () {
    expect(monet).toBeDefined()
    expect(monet.Maybe).toBeDefined()
    expect(monet.Either).toBeDefined()
    expect(monet.Validation.success).toBe(monet.Success)
  })
})
