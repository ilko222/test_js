require('../support/parameter-types');
const { When } = require('cucumber');
const { Given } = require('cucumber');
const helper = require('../helpers/element-helper.js');
const stringHelper = require('../helpers/string-helper');
const path = require('path');
const loginPage = require('../data/page-selectors/main-page');

const { setDefaultTimeout } = require('cucumber');
const fs = require('fs');

setDefaultTimeout(300 * 1000);

When('User logs in as {user} on {landing-url}', async function (user, url) {
    const login = user.login;
    const password = user.password;

    await browser.get(url);
    await elementHelper.getElementByCss(loginPage.loginInput).sendKeys(login);
    await elementHelper.getElementByCss(loginPage.passwordInput).sendKeys(password);
    return elementHelper.getElementByCss(loginPage.loginButton).click();
});
Given('User prints comment {string}', function (comment) {
    return console.log(comment);
});

When('User waits for angular {string}', function (waitForAngular) {
    return browser.waitForAngularEnabled(waitForAngular === 'true');
});

When('User clicks {detail} {css}', async function (_, cssLocator) {
    const elem = await helper.getElementByCss(cssLocator);
    return helper.clickOnElement(elem);
});

When('User clicks {detail} {css} with text {text}', function (_, cssLocator, text) {
    const elem = helper.getElementByCssContainingText(cssLocator, text);
    return helper.clickOnElement(elem);
});

When('User clicks {detail} {css} with text equal to {text}', function (_, cssLocator, text) {
    const elem = element.all(by.css(cssLocator)).filter(function (item) {
        return item.getText().then(function (currentText) {
            return text.toLowerCase() === currentText.toLowerCase();
        });
    }).first();
    return helper.clickOnElement(elem);
});

When('User clicks browser back button', function () {
    return browser.navigate().back();
});

When('User double clicks {detail} {css}', function (_, cssLocator) {
    return helper.getElementByCss(cssLocator).doubleClick();
});

When('User clicks {detail} {css} with text {text} on {detail} {css} with text {text}', function (_, childCssLocator, childText, __, parentCssLocator, parentText) {
    const elem = element.all(by.css(parentCssLocator)).filter(function (item) {
        return item.getText().then(function (text) {
            const regexp = stringHelper.getExactStringRegexp(parentText);
            if (text.match(regexp)) {
                return true;
            }
        });
    }).first().element(by.cssContainingText(childCssLocator, childText));
    return helper.clickOnElement(elem);
});

When('User clicks {detail} {css} on {detail} {css} with text {text}', async function (_, childCssLocator, __, parentCssLocator, parentText) {
    const parent = await helper.getElementByCssContainingText(parentCssLocator, parentText);
    const child = await parent.element(by.css(childCssLocator));
    return helper.clickOnElement(child);
});

When('User clicks {detail} {css} on {detail} {css}', function (_, childCssLocator, __, parentCssLocator) {
    const parent = helper.getElementByCss(parentCssLocator);
    const child = parent.element(by.css(childCssLocator));
    return helper.clickOnElement(child);
});

When('User selects {detail} {css} from {detail} {css}', function (_, itemCssLocator, __, dropdownCssLocator) {
    const parentElement = helper.getElementByCss(dropdownCssLocator);
    const inputChildElement = parentElement.element(by.css('input'));
    if (helper.isElementNotVisible(inputChildElement, 1000)) {
        helper.clickOnElement(parentElement);
    } else {
        helper.clickOnElement(inputChildElement);
    }
    return parentElement.element(by.css(itemCssLocator)).click();
});

When('User selects item {css} with text {text} from {detail} {css}', function (itemCssLocator, itemText, _, dropdownCssLocator) {
    const parentElement = helper.getElementByCss(dropdownCssLocator);
    const inputChildElement = parentElement.element(by.css('input'));
    if (helper.isElementNotVisible(inputChildElement, 1000)) {
        helper.clickOnElement(parentElement);
    } else {
        helper.clickOnElement(inputChildElement);
    }
    return parentElement.element(by.cssContainingText(itemCssLocator, itemText)).click();
});

When('User selects {detail} {css}', function (_, cssLocator) {
    const elem = helper.getElementByCss(cssLocator);
    return helper.clickOnElement(elem);
});

When('User selects {detail} {css} with text {text}', function (_, cssLocator, text) {
    const elem = helper.getElementByCssContainingText(cssLocator, text);
    return helper.clickOnElement(elem);
});

When('User unselects {detail} {css}', function (_, cssLocator) {
    const elem = helper.getElementByCss(cssLocator);
    return helper.clickOnElement(elem);
});

When('User enters {text} in {detail} {css}', function (text, _, cssLocator) {
    //FF has an issue with sending keys. This workaround helps to completely send all text into field.
    let elem = helper.getElementByCss(cssLocator);
    for (var i = 0; i < text.length; i++) {
        elem.sendKeys(text.charAt(i));
    }
    //need one second for completing animation
    return browser.sleep(3000);
});

When('User enters fast {text} in {detail} {css}', async function (text, _, cssLocator) {
    
    const isFerfox = await browser.getCapabilities().then(caps => {
    return caps.get('browserName').toLowerCase() === 'firefox';
    });
    let elem = await helper.getElementByCss(cssLocator);
    await elem.sendKeys(text);
    return browser.sleep(2000);
    });

When('User enters from file {text} in {detail} {css}', async function (fileName, _, cssLocator) {
    
    let elem = await helper.getElementByCss(cssLocator);
    const fileToUpload = '../test-data/' + fileName;
    const absolutePath = path.resolve(__dirname, fileToUpload);
    fs.readFile(absolutePath, 'utf8', function (err,contents) {
        if(err) {
            console.log(err)
        }
        elem.sendKeys(contents);
    });
    return browser.sleep(2000);
});

When('User enters random value in {detail} {css}', function (_, cssLocator) {
    const text = stringHelper.getRandomString(10).toLowerCase();
    return helper.getElementByCss(cssLocator).sendKeys(text);
});

When('User clears text from {detail} {css}', function (_, cssLocator) {
    // webdriver clear() doesn't update angular forms: https://github.com/angular/protractor/issues/301
    const element = helper.getElementByCss(cssLocator);
    const ctrlA = protractor.Key.chord(protractor.Key.CONTROL, "a"); 
    element.sendKeys(ctrlA);
        
    return element.sendKeys(protractor.Key.BACK_SPACE);
});

When('User moves mouse over {detail} {css}', function (_, cssLocator) {
    const elem = helper.getElementByCss(cssLocator);
    return browser.actions().mouseMove(elem).perform();
});

When('User refreshes page', function () {
    return browser.navigate().refresh();
});

When('User opens new browser tab', async function () {
    await browser.executeScript('window.open()');
    const handles = await browser.getAllWindowHandles();
    const secondWindow = handles[1];
    return browser.switchTo().window(secondWindow);
});

When('User waits {int} second(s)', { timeout: 35 * 60 * 1000 }, function (seconds) {
    return browser.sleep(seconds * 1000);
});

When('User goes to {int} browser tab', async function (tab) {
    const handles = await browser.getAllWindowHandles();
    return browser.switchTo().window(handles[tab - 1]);
});

When('User restarts browser', function () {
    return browser.restart();
});

Given('User navigates to {landing-url}', function (url) {
    return browser.driver.get(url);
});

When('User navigates to {landing-url} with {detail} {string}', function (url, _, path) {
    return browser.driver.get(url + path);
});

When('User presses Enter key in {detail} {css}', function (_, css) {
    let elem = helper.getElementByCss(css);
    return elem.sendKeys(protractor.Key.ENTER);
    // return browser.actions().sendKeys(protractor.Key.ENTER).perform();
});

When('User uploads {detail} {string} using {detail} {css}', async function (_, fileName, __, cssLocator) {
    const fileToUpload = '../test-data/' + fileName;
    const absolutePath = path.resolve(__dirname, fileToUpload);
    const form = await helper.getElementByCss(cssLocator);

    await browser.actions().mouseMove(form).perform();
    await form.clear();
    return form.sendKeys(absolutePath);
});

When('User clicks {int} item in {css} collection', (itemNumber, cssLocator) => {
    const collection = element.all(by.css(cssLocator));
    return helper.clickOnElement(collection.get(itemNumber - 1));
});

When('User clicks {int} item in {css} collection with text {text}', (itemNumber, cssLocator, text) => {
    const collection = element.all(by.cssContainingText(cssLocator, text));
    return helper.clickOnElement(collection.get(itemNumber - 1));
});

When('User scroll to end the page', function () {
    let elem = helper.getElementByCss("footer div");
    return browser.actions().mouseMove(elem).perform();

    //return elem.sendKeys(protractor.Key.END).perform();
    //browser.executeScript('window.scrollTo(100,document.body.scrollHeight)')
});

When('User clicks {detail} {css} by execute script', function (__, cssLocator) {
    let elem = element(by.css(cssLocator));
    browser.executeScript('arguments[0].click()', elem.getWebElement());
});

When('User approved alert message', function () {
    let alertDialog = browser.switchTo().alert();
    return alertDialog.accept();
})
//
When('User saved values {detail} {css}', function(_, cssLocator){
    global.uniqueMap = {test:{}};
    element.all(by.css(cssLocator)).each(function(elem,index){
         elem.getText().then(function(text){
            let mykey = index.toString();
            global.uniqueMap.test[mykey] = text;
        });
    });
});

When('User copy text {detail} {css}', function (_, cssLocator) {
    let elem = helper.getElementByCss(cssLocator);
    elem.getText().then(function (text) {
        // console.log(text);
        global.uniqueMap = { test3: {} };
        global.uniqueMap.test3['copyText'] = text;
    });

});

When('User Paste text {detail} {css}', function (_, css) {
    let text = JSON.stringify(global.uniqueMap.test3['copyText']);
    // console.log(text);
    let elem = helper.getElementByCss(css);
    for (var i = 1; i < text.length-1; i++) { //забрав кавички var i = 1(перша), i < text.length-1;(остання)
        elem.sendKeys(text.charAt(i));
    }
    //need one second for completing animation
    return browser.sleep(3000);
});
////
When('User clears all text from {detail} {css}', function (_, cssLocator) {
    const element = helper.getElementByCss(cssLocator);
    return element.clear();
});

When('User scroll bottom in {int} pixels', function (itemNumber) {
    browser.executeScript('window.scrollTo(0,'+itemNumber+');');
});