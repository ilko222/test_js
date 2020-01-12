var olx_page = function () {
  this.getURL = function () {
    browser.ignoreSynchronization = true;
    browser.get('https://www.olx.ua/');
  };
  this.setFirstValue = function (value) {
    element(by.model('first')).sendKeys(value);
  };
  this.setOperator = function (value) {
    element(by.model('operator')).element(by.cssContainingText('option', value)).click();
  };
  this.getResult = function () {
    return element(by.binding('latest')).getText();
  };

  this.clickGo = function () {
    element(by.id('gobutton')).click()
  }
};

module.exports = olx_page;
