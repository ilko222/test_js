const stringHelper = require('./string-helper.js');

const thisModule = {

  /**
     * Find element by CSS and wait for it visibility within appropriate timeout.
     *
     * @param ms - waiting time in milliseconds
     * @param value
     * @returns {promise.Promise<any>}
     */
  getElementByCss: function (value, ms = browser.params.timeout) {
    const elem = element(by.css(value));
    browser.wait(protractor.ExpectedConditions.presenceOf(elem), ms, 'Wait for element appears');
    return elem;
  },

  /**
     * Find element by CSS and text and wait for it visibility within appropriate timeout.
     *
     * @param ms - waiting time in milliseconds
     * @param css
     * @param text|new RegExp()
     * @returns {promise.Promise<any>}
     */
  getElementByCssContainingText: function (css, text, ms = browser.params.timeout) {
    const regexp = ((typeof text) === 'string') ? stringHelper.getExactStringRegexp(text) : text;
    const elem = element(by.cssContainingText(css, regexp));
    browser.wait(protractor.ExpectedConditions.presenceOf(elem), ms, 'Wait for element appears');
    return elem;
  },

  /**
     * Find element using indicated method By and wait for it visibility within appropriate timeout.
     *
     * @param ms - waiting time in milliseconds
     * @param by
     *
     * @returns {promise.Promise<any>}
     */
  getElementBy: function (by, ms = browser.params.timeout) {
    const elem = element(by);
    browser.wait(protractor.ExpectedConditions.presenceOf(elem), ms, 'Wait for element appears');
    return elem;
  },

  /**
     * Verify that element is not only presented in DOM, but also has height and width.
     *
     * @param elem
     * @param ms - waiting time in milliseconds.
     * ms = browser.params.timeout by default, if it is not defined.
     * @returns {promise.Promise<boolean>}
     */
  isElementVisible: async function (elem, ms = browser.params.timeout) {
      try {
          await browser.wait(protractor.ExpectedConditions.visibilityOf(elem), ms)
          return true
      } catch (ex) {
          return false
      }
  },
  /**
     * Verify that element is not presented in DOM and has not height and width.
     *
     * @param elem
     * @param ms - waiting time in milliseconds.
     * ms = 1 second by default, if it is not defined.
     * @returns {promise.Promise<boolean>}
     */
  isElementNotVisible: function (elem, ms = 1000) {
    return browser.wait(protractor.ExpectedConditions.invisibilityOf(elem), ms).then(() => true, () => false);
  },

  /**
     * Verify that element is selected.
     *
     * @param elem
     * @param ms - waiting time in milliseconds.
     * ms = browser.params.timeout by default, if it is not defined.
     * @returns {promise.Promise<boolean>}
     */
  isElementSelected: async function (elem, ms = browser.params.timeout) {
      try {
          await browser.wait(protractor.ExpectedConditions.elementToBeSelected(elem), ms)
          return true
      } catch (ex) {
          return false
      }
  },

  /**
     * Wait for element visibility within appropriate amount of seconds.
     *
     * @param elem
     * @param sec
     * @returns {promise.Promise<boolean|error>}
     */
  waitElementVisibility: async function (elem, sec) {
      const isVisible = await thisModule.isElementVisible(elem, sec * 1000);

      if (!isVisible) {
          throw new Error(`Element did not appeared in ${sec} seconds`);
      }
  },

  /**
   * Wait for element invisibility within appropriate amount of seconds.
   *
   * @param elem
   * @param sec
   * @returns {promise.Promise<boolean|error>}
   */
  waitElementInvisibility: function (elem, sec) {
      return thisModule.isElementNotVisible(elem, sec * 1000).then(function (isNotVisible) {
          if (!isNotVisible) {
              throw new Error(`Element did not disappeared in ${sec} second(s)`);
          }
      });
  },
  /**
     * Verify if horizontal scroll is existed for element.
     *
     * @param elem
     * @returns {boolean}
     */
  isHorizontalScrollExisted: function (elem) {
    return isHorizontalScroll(elem);
  },

  /**
     * Verify if horizontal scroll is not existed for element.
     *
     * @param elem
     * @returns {boolean}
     */
  isHorizontalScrollNotExisted: async function (elem) {
      const isScroll = await isHorizontalScroll(elem);

      return !isScroll;
  },

  /**
     * Click on element.
     *
     * If failed to click - try to scroll to element and click again.
     * If failed to click again - try to scroll to page top and click again.
     * If it is not element visibility issue - will fail with Element is not clickable error
     * @param elem
     * @returns {PromiseLike<T> | Promise<T>}
     */
  clickOnElement: async function (elem) {
      let retryWithScrollToTop = function (error) {
          return scrollToTop()
              .then(() => elem.click());
      };
      let retryWithScrollToElementByLocation = async function (error) {
          try {
              await scrollToElementByLocation(elem)
              await elem.click()
          } catch (ex) {
              retryWithScrollToTop(ex);
          }
      };
      browser.sleep(1000);
      try {
          await elem.click()
      } catch (ex) {
          retryWithScrollToElementByLocation(ex);
      }
  },


    /**
     * Click on element if it exists.
     *
     * wait for Angular.
     * Verify if element is present on page.
     * If element is present - click.
     *
     * @param cssLocator
     * @param ms time to wait in ms
     * @returns {promise.Promise<any>}
     */
  clickIfExist: function (cssLocator, ms = 3000) {
    let isElementPresent = function () {
      const elem = element(by.css(cssLocator));
      return browser.wait(protractor.ExpectedConditions.visibilityOf(elem), ms).then(() => true, () => false);
    };
    let clickIfPresent = function (isPresent) {
      if (isPresent) {
        return thisModule.clickOnElement(element(by.css(cssLocator))).then(null, function () {
          // ignore error that element is not clickable at the point, other element would receive the click.
        });
      }
    };
    return isElementPresent()
      .then(clickIfPresent);
  },

  /**
     * Click on element with text if it exists.
     *
     * wait for Angular.
     * Verify if element is present on page.
     * If element is present - click.
     *
     * @param cssLocator
     * @param text
     * @param ms time to wait in miliseconds
     * @returns {promise.Promise<any>}
     */
  clickOnElementWithTextIfExist: function (cssLocator, text, ms = 3000) {
    let isElementPresent = function () {
      const elem = element(by.cssContainingText(cssLocator, text));
      return browser.wait(protractor.ExpectedConditions.visibilityOf(elem), ms).then(() => true, () => false);
    };
    let clickIfPresent = function (isPresent) {
      if (isPresent) {
        return thisModule.clickOnElement(element(by.cssContainingText(cssLocator, text))).then(null, function () {
          // ignore error that element is not clickable at the point, other element would receive the click.
        });
      }
    };
    return isElementPresent()
      .then(clickIfPresent);
  },

  /**
     * Collect table content as JSON.
     *
     * @param table - element
     * @param cellCss - exact tag locator where cell text is stored.
     * Used for long tables where need to scroll right to see content.
     * getText() will take '' for invisible column content.
     * Using getAttribute('innerText') helps to get cell text for invisible columns without scrolling.
     * But we need exact tag locator where cell text is stored.
     */
  getTableContentAsJSON: function (table, cellCss) {
    const headers = [];
    const actual = [];
    return thisModule.isElementVisible(table).then((visible) => {
      if (visible) {
        return table.all(by.css('th')).each(function (header, i) {
          header.element(by.css('span')).getAttribute('innerText').then(function (text) {
            headers[i] = text.trim();
          }, function (e) {
            headers[i] = '';
          })
        }).then(function () {
          table.all(by.css('tbody tr')).each(function (row) {
            let rowAsJson = {};
            row.all(by.css('td')).each(function (cell, i) {
              // for long tables need identify cellCss = exact tag where cell text is stored.
              let cellText = cellCss ? cell.element(by.css(cellCss)).getAttribute('innerText') : cell.getText();
              cellText.then(function (text) {
                rowAsJson[headers[i]] = text.trim();
              }, function (e) {
                rowAsJson[headers[i]] = '';
              })
            });
            actual.push(rowAsJson);
          })
        }).then(function () {
          return actual;
        })
      } else {
        throw new Error('Table is not visible');
      }
    })
  },

  /**
     * Collect element texts as [['text1'],['text2'],['text3']] array.
     * Mostly for using with cucumber table.row()
     * @param locator
     * @return {PromiseLike<Array<String>> | Promise<Array<String>>}
     */
  getElementTexts: function (locator) {
    const actual = [];
    return element.all(by.css(locator)).each(function (item) {
      item.getText().then(function (text) {
        let newItem = [];
        newItem.push(text);
        actual.push(newItem);
      });
    }).then(function () {
      return actual;
    });
  },

  /**
     * return Elements count by css
     * @param locator
     * @return {Promise<Integer>}
     */
  getElementsCount: function (locator) {
    return element.all(by.css(locator)).count();
  },

  /** Scrolling according to direction
     *
     * @param direction - may have 2 values top|bottom
     * @returns {promise.Promise<any>}
     */
  scrollTo: function (direction = 'bottom') {
    if (direction === 'bottom') {
      return scrollToBottom();
    }
    
    return scrollToTop();
  },

  /** verify if element has any text
     *
     * @param cssLocator - css selector
     * @returns {promise.Promise<boolean>}
     */
  isElementHasText: function (cssLocator) {
    const elem = thisModule.getElementByCss(cssLocator);
    return elem.getTagName().then(tagName => {
      // inputs don't have text, only value
      if(tagName === 'input') {
        return elem.getAttribute('value');
      }

      return elem.getText();
    }).then(value => {
      // Regexp /^(?!\s*$).+/ - means a Non-blank/non-whitespace string
      // !! - convert value to boolean
      return !!value.match(/^(?!\s*$).+/);
    });
  },

  /** clear text from element
     *
     * @param cssLocator - css selector
     * @returns {promise.Promise<void>}
     */
  clearTextFromElement: function (cssLocator) {
  // webdriver clear() doesn't update angular forms: https://github.com/angular/protractor/issues/301
    const element = thisModule.getElementByCss(cssLocator);
    const ctrlA = protractor.Key.chord(protractor.Key.CONTROL, 'a');
    element.sendKeys(ctrlA);

    return element.sendKeys(protractor.Key.BACK_SPACE);
  }
};

/**
 * Scroll to element by it's location.
 *
 * @param elem
 * @returns {promise.Promise<any>}
 */
function scrollToElementByLocation(elem) {
  return elem.getLocation().then(function (location) {
    return browser.executeScript('window.scrollTo(0,' + (location.y) + ')');
  });
}

/**
 * Scroll to top of the page.
 *
 * @returns {promise.Promise<any>}
 */
function scrollToTop() {
  return browser.executeScript('window.scrollTo(0, 0)');
}

/**
 * Scroll to the bottom of the page.
 *
 * @returns {promise.Promise<any>}
 */
function scrollToBottom() {
  return browser.executeScript('window.scrollTo(0, 100000)');
}

/**
 * Check if element scrollWidth more than element clientWidth.
 * The scrollWidth property returns the entire width of an element in pixels.
 * The clientWidth property returns the viewable width of an element in pixels.
 *
 * @param elem
 * @returns {promise.Promise<T>|promise.Promise<any>}
 */
function isHorizontalScroll(elem) {
  return browser.executeScript(function (el) {
    return el.scrollWidth > el.clientWidth;
  }, elem);
}

module.exports = thisModule;