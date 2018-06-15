module.exports = function (config) {

  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      // 'node_modules/core-js/client/core.min.js',
      'src/monet.js',
      'test/*-helper.js',
      'test/*-spec.js'
    ],
    exclude: [],
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadlessCustom', 'FirefoxHeadlessCustom'],
    customLaunchers: {
      ChromeHeadlessCustom: { base: 'ChromeHeadless', flags: ['--no-sandbox'] },
      FirefoxHeadlessCustom: { base: 'Firefox', flags: [ '-headless' ] },
    },
    singleRun: true,
    concurrency: 6e6
  });

};
