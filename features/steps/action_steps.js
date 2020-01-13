var chai = require('chai').use(require('chai-as-promised'));
var expect = chai.expect;

var olx_action_steps = function () {
  var olx_page = require("../pages/olx.js");

  this.World = function MyWorld() {
    this.page = new olx_page();
  };

  this.Given('User navigates to main OLX page', function (callback) {
    browser.driver.ignoreSynchronization = true;
    browser.waitForAngularEnabled(false);
    this.page.getURL();
    browser.driver.sleep(8000)
    callback();
  });

  // this.When('I click Go', function (callback) {
  //   this.page.clickGo();
  //   callback();
  // });

  this.When('I click $locator', function (locator, callback) {
    element(by.id(locator)).click();
    console.log(locator);
    browser.driver.sleep(1000);
    callback();
  });

  this.When('I wait $seconds', function (seconds){
    browser.driver.sleep(seconds*1000);
    console.log(seconds);
  })
};

module.exports = olx_action_steps;

// var CalculatorSteps = function() {

//   var CalculatorPage = require("../pages/calculator_page.js");

//   this.World = function MyWorld() {
//     this.page = new CalculatorPage();
//   };

//   this.Given('The calculator is open', function (callback) {
//     this.page.get();
//     callback();
//   });

//   this.When('I calculate $first $operator $second', function (first, operator, second, callback) {
//     this.page.setFirstValue(first);
//     this.page.setOperator(operator);
//     this.page.setSecondValue(second);
//     this.page.clickGo();
//     callback();
//   });

//   this.When('I enter first value of $first', function (first, callback) {
//     this.page.setFirstValue(first);
//     callback();
//   });

//   this.When('I enter second value of $second', function (second, callback) {
//     this.page.setSecondValue(second);
//     callback();
//   });

//   this.When('I click Go', function (callback) {
//     this.page.clickGo();
//     callback();
//   });

//   this.Then('the result should equal $result', function (result, callback) {
//     expect(this.page.getResult()).to.eventually.equal(result).and.notify(callback);
//   });
// };

// module.exports = CalculatorSteps;