var olx_page  = function() {
    this.getURL = function() {
        browser.ignoreSynchronization = true;
        browser.get('https://www.olx.ua/');
      };

      this.setFirstValue = function(value) {
        element(by.model('first')).sendKeys(value);
      };   
};
module.exports = olx_page;
