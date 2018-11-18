module.exports = require('./karma.conf.base')([
  'dist/monet.js',
  'prepublish-test/browser-global.js'
])
