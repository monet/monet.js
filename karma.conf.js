module.exports = function (config) {

  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'src/monet.js',
      'test/*-helper.js',
      'test/*-spec.js'
    ],
    exclude: [],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: 6e6
  });

};
