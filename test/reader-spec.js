describe('A Reader Monad', function () {
    var Reader = Monet.Reader

    var config1 = {
        url: 'http://test1.com',
        port: 8080,
        key: 's3cr3t'
    }
    var config2 = {
        url: 'http://test2.com',
        port: 8081,
        key: 'not so secret'
    }
    var connect = function (endpoint) {
        return Reader(function (config) {
            return 'POST ' + config.url + ':' + config.port + '/' + endpoint
        })
    }

    it('must inject config with run()', function () {
        expect(connect('user').run(config1)).toBe('POST http://test1.com:8080/user')
        expect(connect('session').run(config2)).toBe('POST http://test2.com:8081/session')
    })

    it('must be mappable', function () {
        var reader = connect('session').map(function (s) {
            return s + '?secure=true'
        })
        expect(reader.run(config1)).toBe('POST http://test1.com:8080/session?secure=true')

    })

    it('must be flatMappable', function () {
        var reader = connect('something').flatMap(function (connectionString) {
            return Reader(function (config) {
                return connectionString + '?secretKey=' + config.key
            })
        })
        expect(reader.run(config1)).toBe('POST http://test1.com:8080/something?secretKey=s3cr3t')
    })

    it('must be applicable', function () {
        var reader = connect('something').ap(Reader(function (config) {
            return function (c) {
                return '**' + c + '**'
            }

        }))
        expect(reader.run(config1)).toBe('**POST http://test1.com:8080/something**')
    })

    it('must be applicable to another value', function () {
        var reader = Reader(function (config) {
            return function (c) {
                return '**' + c + '**'
            }

        }).apTo(connect('something'))
        expect(reader.run(config1)).toBe('**POST http://test1.com:8080/something**')
    })

    it('should be compatible with Fantasy Land', function () {
        var reader = connect('something')
        expect(reader.ap).toBe(reader['fantasy-land/ap'])
    })

    it('must support local', function () {
        var reader = connect('something').flatMap(function (connectionString) {
            return Reader(function (key) {
                return connectionString + '?secretKey=' + key
            }).local(function (c) {
                return c.key
            })
        })

        expect(reader.run(config1)).toBe('POST http://test1.com:8080/something?secretKey=s3cr3t')

    })

    it('can ask for config', function () {
        var reader = Reader.ask().map(function (config) {
            return config.key
        })
        expect(reader.run(config1)).toBe('s3cr3t')

    })

    describe('Reader.isInstance', function () {
        it('will return true for Reader instances', function () {
            var instance = Reader(function (x) {
                return x
            })
            expect(Reader.isInstance(instance)).toBe(true)
        })
        it('will return false for other monads', function () {
            expect(Reader.isInstance(Monet.Validation.Success({}))).toBe(false)
            expect(Reader.isInstance(Monet.Validation.Fail({}))).toBe(false)
            expect(Reader.isInstance(Monet.List.fromArray([]))).toBe(false)
        })
        it('will return false on non-monads', function () {
            expect(Reader.isInstance({})).toBe(false)
            expect(Reader.isInstance(true)).toBe(false)
            expect(Reader.isInstance(false)).toBe(false)
            expect(Reader.isInstance('foo')).toBe(false)
        })
    })

})
