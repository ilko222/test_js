var chai = require('chai').use(require('chai-as-promised'));
var expect = chai.expect;

var olx_verification_steps = function(){
    var olx_page = require("../pages/olx.js");
  
    this.World = function MyWorld() {
      this.page = new olx_page();
    };
    this.Then('the result should equal $result', function (result, callback) {
        expect(this.page.getResult()).to.eventually.equal(result).and.notify(callback);
      });
  };
  
  module.exports = olx_verification_steps;