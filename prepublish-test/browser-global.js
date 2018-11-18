describe('Browser: global Monet object', function () {
  it('should be available', function () {
    expect(Monet).toBeDefined()
    expect(Monet.Maybe).toBeDefined()
    expect(Monet.Either).toBeDefined()
    expect(Monet.Validation.success).toBe(Monet.Success)

    expect(() => Maybe).toThrow()
    expect(() => Either).toThrow()
  })
})
