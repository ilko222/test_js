const path = require('path');

exports.config = {
  seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
    getPageTimeout: 120000, //120 sec
    allScriptsTimeout: 120000, //120 seconds
    ignoreUncaughtExceptions: true, //This allows cucumber to handle the exception and record it appropriately.
    framework: 'custom',
    // path relative to the current config file
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    // restartBrowserBetweenTests: true,
    baseURL: '',
  multiCapabilities: [{
    browserName: 'chrome',
    shardTestFiles: true,
    maxInstances: 1,
    chromeOptions: {
      args: ['disable-infobars', 'disable-gpu', 'window-size=1920,1024',
      'test-type=browser', 'disable-notifications', 'incognito',
      'disable-application-cache',
           // 'headless'
  ],
    }
}],
  
  specs: [
    'features/olx.feature'
    // 'features/arithmetic.feature'
  ],
  cucumberOpts: {
    require: [
      path.resolve(process.cwd(), './**/*.steps.js')
  ],
    require: 'features/steps/*_steps.js',
    format: 'json:reports/results.json',
    strict: true,
    defaultTimeout: 10000,
    'fail-fast': true
  },
  plugins: [{
    package: 'protractor-multiple-cucumber-html-reporter-plugin',
    options:{
      automaticallyGenerateReport: false,
            removeExistingJsonReportFile: true,
            // openReportInBrowser: false,
            removeOriginalJsonReportFile: false,
            displayDuration: true,
            durationInMS: true,
    }
}]
}
