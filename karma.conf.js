module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'src/main/javascript/*.js',
      'src/test/**/*helper.js',
      'src/test/**/*spec.js'
    ],
    exclude: [],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true,
    concurrency: 6e6
  })
}