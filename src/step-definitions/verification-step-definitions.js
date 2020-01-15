require('../support/parameter-types');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiString = require('chai-string');
chai.use(chaiAsPromised);
chai.use(chaiString);
const expect = chai.expect;
const stringHelper = require('../helpers/string-helper.js');
const endpointHelper = require('../helpers/endpoint-helper.js');
const {Then} = require('cucumber');
const helper = require('../helpers/element-helper.js');
const until = protractor.ExpectedConditions;
const path = require('path');
const fileSep = path.sep;// returns '\\' on windows, '/' on *nix
const fileHelper = require('../helpers/file-helper');


Then('Verification step name', function (callback) {
  return callback;
});

//downolads file with contains data and time in name
//steps "Then Downloaded file with name contains "iLead_contacts_.csv" exists"
//Check file Ilead_contacts_28-08-18_08-15.csv" is exists
Then('Downloaded file with name contains {text} exists', function (name) {
    var currentdate = new Date();
    let day = currentdate.getDate();
    let month = currentdate.getMonth()+1;
    let year = (currentdate.getFullYear()).toString().charAt(2) + (currentdate.getFullYear()).toString().charAt(3);
    let hours = currentdate.getHours() - 3;
    let minuts = currentdate.getMinutes();
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    let data = day + "-" + month + "-" + year + "_" + hours + "-" + minuts;
    const array = name.split('.');
    const tempname = array[0] + data + "." + array[1];
    if(process.platform==="linux")
    {
        var exec = require('child_process').exec;
        var child;
        let shell_command = "chmod +x " + browser.params.basePath + fileSep + tempname;
        const cmd = shell_command;
        console.log(shell_command);
        //require('child_process').exec(cmd.toString());
        child = exec(shell_command, function (error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });

    }
    const filePath = browser.params.basePath + fileSep + tempname;//generate file path
    console.log(filePath);
    return expect(fileHelper.isFileExist(filePath)).to.eventually.equal(true);
});
Then('Attribute {string} of {detail} {css} is equal to {string}', function (attribute, _, cssLocator, value) {
    return expect((helper.getElementByCss(cssLocator)).getAttribute(attribute)).to.eventually.equal(value);
});

Then('Attribute {string} of {detail} {css} is not equal to {string}', function (attribute, _, cssLocator, value) {
    return expect((helper.getElementByCss(cssLocator)).getAttribute(attribute)).to.not.equal(value);
});

Then('Attribute {string} of {detail} {css} contains {string}', function (attribute, _, cssLocator, value) {
    return expect((helper.getElementByCss(cssLocator)).getAttribute(attribute)).to.eventually.contains(value);
});

Then('Attribute {string} of {detail} {css} with text {text} contains {string}', function (attribute, _, cssLocator, text, value) {
    return expect((helper.getElementByCssContainingText(cssLocator, text)).getAttribute(attribute)).to.eventually.contains(value);
});

Then('Attribute {string} of {detail} {css} does not contain {string}', function (attribute, _, cssLocator, value) {
    return expect((helper.getElementByCss(cssLocator)).getAttribute(attribute)).to.not.contains(value);
});

Then('Attribute {string} of {detail} {css} with text {text} does not contain {string}', function (attribute, _, cssLocator, text, value) {
    return expect((helper.getElementByCssContainingText(cssLocator, text)).getAttribute(attribute)).to.not.contains(value);
});

Then('{detail} {css} text is equal to {text}', function (_, cssLocator, value) {
    return helper.getElementByCss(cssLocator).getText().then((text) => {
            return expect(text).to.equalIgnoreCase(value);
        }
    );
});

Then('{detail} {css} input text is equal to {text}', function (_, cssLocator, value) {
    return expect((helper.getElementByCss(cssLocator)).getAttribute('value')).to.eventually.equal(value);
});

Then('{detail} {css} text is equal to {text} on {detail} {css}', function (_, itemCssLocator, value, _, parentCssLocator) {
    const webElement = helper.getElementByCss(parentCssLocator).element(by.css(itemCssLocator));
    return expect(webElement.getText()).to.eventually.equal(value);
});

Then('{detail} {css} count is equal to {int}', function (_, elementCssSelector, expectedValue) {
    return expect(helper.getElementsCount(elementCssSelector)).to.eventually.equal(expectedValue);
});

Then('{detail} {css} text is equal to {text} on {detail} {css} with text {text}', function (_, itemCssLocator, value, _, parentCssLocator, text) {
    const webElement = helper.getElementByCssContainingText(parentCssLocator, text).element(by.css(itemCssLocator));
    return expect(webElement.getText()).to.eventually.equal(value);
});

Then('{detail} {css} text is not equal to {text}', function (_, cssLocator, value) {
    return expect((helper.getElementByCss(cssLocator)).getText()).to.not.equal(value);
});

Then('{detail} {css} contains {text} text', function (_, cssLocator, value) {
    return expect((helper.getElementByCss(cssLocator)).getText()).to.eventually.contains(value);
});

Then('{detail} {css} input contains {text} text', function (_, cssLocator, value) {
    return expect((helper.getElementByCss(cssLocator)).getAttribute('value')).to.eventually.contains(value);
});

Then('{detail} {css} does not contain {text} text', function (_, cssLocator, value) {
    return expect((helper.getElementByCss(cssLocator)).getText()).to.not.eventually.contains(value);
});

Then('{detail} {css} is selected', function (_, cssLocator) {
    const element = helper.getElementByCss(cssLocator);
    return expect(helper.isElementSelected(element)).to.eventually.equal(true);
});

Then('{detail} {css} on {detail} {css} with text {text} is selected', function (_, cssLocator, __, parentCssSelector, text) {
    const parent = helper.getElementByCssContainingText(parentCssSelector, text);
    const element = parent.element(by.css(cssLocator));
    return expect(helper.isElementSelected(element)).to.eventually.equal(true);
});

Then('{detail} {css} is not selected', function (_, cssLocator) {
    // don't wait too long! (maybe temporary)
    const TIMEOUT = 1000;
    const element = helper.getElementByCss(cssLocator);
    return expect(helper.isElementSelected(element, TIMEOUT)).to.eventually.equal(false);
});

Then('{detail} {css} on {detail} {css} with text {text} is not selected', function (_, cssLocator, __, parentCssSelector, text) {
    const parent = helper.getElementByCssContainingText(parentCssSelector, text);
    const element = parent.element(by.css(cssLocator));
    return expect(helper.isElementSelected(element)).to.eventually.equal(false);
});

Then('{detail} {css} is displayed', function (_, cssLocator) {
    const elem = element(by.css(cssLocator));
    return expect(helper.isElementVisible(elem)).to.eventually.equal(true);
});

Then('{detail} {css} with text {text} is displayed', function (_, cssLocator, text) {
    const elem = element(by.cssContainingText(cssLocator, text));
    return expect(helper.isElementVisible(elem)).to.eventually.equal(true);
});

Then('{detail} {css} on {detail} {css} with text {text} is displayed', function (_, itemCssLocator, __, cssLocator, text) {
    const parent = helper.getElementByCssContainingText(cssLocator, text);
    const elem = parent.element(by.css(itemCssLocator));
    return expect(helper.isElementVisible(elem)).to.eventually.equal(true);
});

Then('{detail} {css} with text {text} on {detail} {css} with text {text} is displayed', function (_, itemCssLocator, itemText, __, elementCssLocator, elementText) {
    const parent = helper.getElementByCssContainingText(elementCssLocator, elementText);
    const child = parent.element(by.cssContainingText(itemCssLocator, itemText));
    return expect(helper.isElementVisible(child)).to.eventually.equal(true);
});

Then('{detail} {css} is not displayed', function (_, cssLocator) {
    const elem = element(by.css(cssLocator));
    return expect(helper.isElementNotVisible(elem)).to.eventually.equal(true);
});

Then('{detail} {css} with text {text} is not displayed', function (_, cssLocator, text) {
    const elem = element(by.cssContainingText(cssLocator, text));
    return expect(helper.isElementNotVisible(elem)).to.eventually.equal(true);
});

Then('{detail} {css} is disabled', function (_, cssLocator) {
    const elem = helper.getElementByCss(cssLocator);
    return expect(elem.isEnabled()).to.eventually.equal(false);
});

Then('{detail} {css} with text {text} is disabled', function (_, cssLocator, text) {
    const elem = helper.getElementByCssContainingText(cssLocator, text);
    return expect(elem.isEnabled()).to.eventually.equal(false);
});

Then('{detail} {css} on {detail} {css} is disabled', function (_, itemCssLocator, __, cssLocator) {
    const parent = helper.getElementByCss(cssLocator);
    const child = parent.element(by.css(itemCssLocator));
    return expect(child.isEnabled()).to.eventually.equal(false);
});

Then('{detail} {css} on {detail} {css} with text {text} is disabled', function (_, itemCssLocator, __, elementCssLocator, elementText) {
    const elem = element.all(by.css(elementCssLocator)).filter(function (item) {
        return item.getText().then(function (text) {
            const regexp = stringHelper.getExactStringRegexp(elementText);
            if (text.match(regexp)) {
                return true;
            }
        });
    }).first().element(by.css(itemCssLocator));
    browser.wait(until.presenceOf(elem), browser.params.timeout, 'Wait for element appears');
    return expect(elem.isEnabled()).to.eventually.equal(false);
});

Then('{detail} {css} is enabled', function (_, cssLocator) {
    const elem = helper.getElementByCss(cssLocator);
    return expect(elem.isEnabled()).to.eventually.equal(true);
});

Then('{detail} {css} with text {text} is enabled', function (_, cssLocator, text) {
    const elem = helper.getElementByCssContainingText(cssLocator, text);
    return expect(elem.isEnabled()).to.eventually.equal(true);
});

Then('{detail} {css} on {detail} {css} with text {text} is enabled', function (_, itemCssLocator, __, elementCssLocator, elementText) {
    const parent = helper.getElementByCssContainingText(elementCssLocator, elementText);
    const child = parent.element(by.css(itemCssLocator));
    return expect(child.isEnabled()).to.eventually.equal(true);
});

Then('Page title is equal to {string}', function (value) {
    return expect(browser.getTitle()).to.eventually.equal(value);
});

Then('Page URL is equal to {landing-url}', function (value) {
    let expectedConditions = protractor.ExpectedConditions;
    return browser.wait(expectedConditions.urlIs(value), browser.params.timeout).then(() => {
    }, (error => {
        return browser.getCurrentUrl().then(url => {
            throw new Error(`Expected url: ${value} is not loaded; Current url: ${url}`);
        })
    }));
});

Then('Page URL contains {landing-url}', function (value) {
    let expectedConditions = protractor.ExpectedConditions;
    return browser.wait(expectedConditions.urlContains(value), browser.params.timeout).then(() => {
    }, (error => {
        return browser.getCurrentUrl().then(url => {
            throw new Error(`Current url: ${url} doesn't contain expected url: ${value}`);
        })
    }));
});

Then('Page URL contains {landing-url} with path {string}', function (url, path) {
    const fullURL = url + path;
    let expectedConditions = protractor.ExpectedConditions;
    return browser.wait(expectedConditions.urlContains(fullURL), browser.params.timeout).then(() => {
    }, (error => {
        return browser.getCurrentUrl().then(url => {
            throw new Error(`Current url: ${url} doesn't contain expected url: ${fullURL}`);
        })
    }));
});

Then('Page URL is equal to {landing-url} with path {string}', function (url, path) {
    const fullURL = url + path;
    let expectedConditions = protractor.ExpectedConditions;
    return browser.wait(expectedConditions.urlIs(fullURL), browser.params.timeout).then(() => {
    }, (error => {
        return browser.getCurrentUrl().then(url => {
            throw new Error(`Expected url: ${fullURL} is not loaded; Current url: ${url}`);
        })
    }));
});

Then('{detail} table {css} with cell element {css} data match values:', function (_, tableCssLocator, cellCssLocator, expectedTable) {
    const expected = expectedTable.hashes();
    const table = helper.getElementByCss(tableCssLocator);
    const actual = helper.getTableContentAsJSON(table, cellCssLocator);
    return expect(actual).to.deep.eventually.equal(expected);
});

Then('{detail} table {css} data match values:', function (_, cssLocator, expectedTable) {
    const expected = expectedTable.hashes();
    const table = helper.getElementByCss(cssLocator);
    browser.sleep(5000);
    const actual = helper.getTableContentAsJSON(table);
    return expect(actual).to.deep.eventually.equal(expected);
});

Then('Horizontal scroll for {detail} {css} is existed', function (_, cssLocator) {
    const elem = helper.getElementByCss(cssLocator);
    return expect(helper.isHorizontalScrollExisted(elem)).to.eventually.equal(true);
});

Then('Horizontal scroll for {detail} {css} is not existed', function (_, cssLocator) {
    const elem = helper.getElementByCss(cssLocator);
    return expect(helper.isHorizontalScrollNotExisted(elem)).to.eventually.equal(true);
});

Then('User waits for {detail} {css} visibility within {int} second(s)', {timeout: 35 * 60 * 1000}, function (_, cssLocator, sec) {
    const elem = element(by.css(cssLocator));
    return helper.waitElementVisibility(elem, sec);
});

Then('User waits for {detail} {css} with text {text} visibility within {int} second(s)', {timeout: 35 * 60 * 1000}, function (_, cssLocator, text, sec) {
    const elem = element(by.cssContainingText(cssLocator, text));
    return helper.waitElementVisibility(elem, sec);
});

Then('User verify response from {landing-url} with {detail} {string} contains {string}', function (host, _, path, text) {
    let responseText = endpointHelper.getResponseText("GET", host + path);
    return expect(responseText).to.eventually.contains(text);
});

Then('{detail} list {css} contains values:', function (_, cssLocators, expected) {
    expected = expected.raw();
    const actual = helper.getElementTexts(cssLocators);
    return expect(actual).to.deep.eventually.equal(expected);
});

Then('Downloaded file with name {text} exists', function (name) {
    const filePath = browser.params.basePath + fileSep + name;//generate file path
    return expect(fileHelper.isFileExist(filePath)).to.eventually.equal(true);
});

Then('User verify downloaded file {text} hash is equal to {hash}', function (fileName, hash) {
    const filePath = browser.params.basePath + fileSep + fileName;//generate file path
    return expect(fileHelper.getFileHash(filePath)).to.eventually.equal(hash);
});

Then('User verify downloaded file {text} hash is equal to template file {text} hash', function (fileName, templateFileName) {
    const filePath = browser.params.basePath + fileSep + fileName;//generate file path
    const fileTemplatePath = path.resolve(__dirname, '../../../features/test-data/file-templates/' + templateFileName);
    fileHelper.getFileHash(fileTemplatePath).then((hash) => {
            return expect(fileHelper.getFileHash(filePath)).to.eventually.equal(hash);
        }
    );

});

Then('{detail} {css} is sorted {text} in {text} order', (_, locator, alphabeticallyOrNumerically, ascendingOrDescending) => {
    const ORDERS = ['ascending', 'descending'];
    const FORMATS = ['alphabetically', 'numerically'];
    const order = ascendingOrDescending.toLowerCase();
    const format = alphabeticallyOrNumerically.toLowerCase();

    if (!ORDERS.includes(order)) {
        throw new Error(`Wrong order - '${ascendingOrDescending}' was given. Use: ${ORDERS.join(' or ')}`);
    }

    if (!FORMATS.includes(format)) {
        throw new Error(`Wrong format - '${alphabeticallyOrNumerically}' was given. Use: ${FORMATS.join(' or ')}`);
    }

    return helper.getElementTexts(locator).then(array => {
        let actualArray = array.slice();
        stringHelper.arraySorting(array, format, order);
        return expect(JSON.stringify(actualArray), `${actualArray} is not sorted ${format} in ${order} order`).to.deep.equal(JSON.stringify(array));
    });

});

Then('{detail} {css} is empty', function (_, cssLocator) {
    return expect(helper.isElementHasText(cssLocator), `Element ${cssLocator} is not empty`).to.eventually.be.false;
});

Then('{detail} {css} is not empty', function (_, cssLocator) {
    return expect(helper.isElementHasText(cssLocator), `Element ${cssLocator} is empty`).to.eventually.be.true;
});

Then('User verifies each {detail} {css} contains {detail} {css}', function (_, parentCss, __, itemCss) {
    return element.all(by.css(parentCss)).each((parent, index) => {
        const elem = parent.element(by.css(itemCss));
        expect(helper.isElementVisible(elem), `${index + 1} element ${itemCss} is not displayed`).to.eventually.equal(true);
    });
});

Then('User verifies each {detail} {css} contains {detail} {css} with text {text}', function (_, parentCss, __, itemCss, itemText) {
    return element.all(by.css(parentCss)).each((parent, index) => {
        const elem = parent.element(by.cssContainingText(itemCss, itemText));
        expect(helper.isElementVisible(elem), `${index + 1} element ${itemCss} with text ${itemText} is not displayed`).to.eventually.equal(true);
    });
});
//
Then('{detail} {css} is equal saved list',function(_,css){
     global.uniqueMap['test2'] = {};
    element.all(by.css(css)).each(function(elem,index){
        elem.getText().then(function(text){
           let mykey = index.toString();
           global.uniqueMap.test2[mykey] = text;
       });
   
   }).then(function(){
       browser.sleep(1000);
       let text1 = JSON.stringify(global.uniqueMap.test);
       let text2 = JSON.stringify(global.uniqueMap.test2);
       return expect(text1).to.equal(text2);
   });
});
Then('{detail} {css} is not equal saved list',function(_,css){
    global.uniqueMap['test2'] = {};
    element.all(by.css(css)).each(function(elem,index){
         elem.getText().then(function(text){
            let mykey = index.toString();
            global.uniqueMap.test2[mykey] = text;
        });
    
    }).then(function(){
        browser.sleep(1000);
        let text1 = JSON.stringify(global.uniqueMap.test);
        let text2 = JSON.stringify(global.uniqueMap.test2);
        return expect(text1).to.not.equal(text2);
    });
});


