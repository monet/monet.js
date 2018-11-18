module.exports = require('./karma.conf.base')([
  'src/monet.js',
  'test/*-helper.js',
  'test/*-spec.js'
])
