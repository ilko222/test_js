const path = require('path');

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),


  multiCapabilities: [{
    browserName: 'chrome',
    shardTestFiles: true,
    maxInstances: 2,
    chromeOptions: {
        args: ['disable-infobars',
        // "incognito"
      ]
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
    strict: true
  },
  plugins: [{
    package: 'protractor-multiple-cucumber-html-reporter-plugin',
    options:{
      automaticallyGenerateReport: true,
      removeExistingJsonReportFile: true,
      openReportInBrowser: true
    }
}]
}
