describe("A Reader Monad", function () {

  var config1 = {
    url: "http://test1.com",
    port: 8080,
    key: "s3cr3t"
  }
  var config2 = {
    url: "http://test2.com",
    port: 8081
  }
  var connect = function (endpoint, config) {
    return "POST " + config.url + ":" + config.port + "/" + endpoint
  }.reader()

  var format = function (url) {
    return "!" + url + "!"
  }.reader()

  it("must inject config with run()", function () {
    expect(connect("user").run(config1)).toBe("POST http://test1.com:8080/user")
    expect(connect("session").run(config2)).toBe("POST http://test2.com:8081/session")
  })

  it("must be mappable", function () {
    var reader = connect("session").map(function (s) {
      return s + "?secure=true"
    })
    expect(reader.run(config1)).toBe("POST http://test1.com:8080/session?secure=true")

  })

  it("must be flatMappable", function () {
    var reader = connect("something").flatMap(
      function (connectionString, config) {
        return connectionString + "?secretKey=" + config.key
      }.reader())
    expect(reader.run(config1)).toBe("POST http://test1.com:8080/something?secretKey=s3cr3t")
  })

  it("must be applicable", function () {
    var reader = connect("something").ap(Reader(function (config) {
      return function (c) {
        return "**" + c + "**"
      }

    }))
    expect(reader.run(config1)).toBe("**POST http://test1.com:8080/something**")

  })

})