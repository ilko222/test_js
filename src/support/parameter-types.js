const {defineParameterType} = require('cucumber');
const userData = require('../data/user-data');
const page = require('../data/pages-enum');
const fileDataHash = require('../data/file-data-hash.js');
const stringHelper = require('../helpers/string-helper');

/**
 * @STRING_REGEXP
 * Regular expression for reading value inside the double quotes
 * double quotes are excluded from result
 * will work in case string contains more than one value inside the double quotes
 *
 * Examples:
 *
 * Code field "#form-question-code" is displayed
 * Preview table ".form-question-preview" with text "Question preview" is displayed
 */
const STRING_REGEXP = /"([^"\\]*(\\.[^"\\]*)*)"/;

/**
 * Used for adding description to elements.
 */
defineParameterType({
  regexp: /[^"]*/,
  name: 'detail',
  useForSnippets: false
});

/**
 * Used for CSS locators.
 * Json-nesting can be any. It depends on project needs.
 * But first parameter should obligatory be page name from page-enum.js.
 * Last parameter should obligatory be element name.
 *
 * @return {string} css locator as it was passed
 * or take it from data folder.
 */
defineParameterType({
  regexp: STRING_REGEXP,
  name: 'css',
  useForSnippets: true,
  transformer(string) {
    if (string.indexOf('|') !== -1) {
      const array = string.split('|');
      const pageName = array[0];
      const element = array[array.length - 1];
      let objectPath = page[pageName];

      for (let i = 1; i < array.length - 1; i++) {
        objectPath = objectPath[array[i]];
      }
      return objectPath[element];
    }
    return string;
  }
});

/**
 * Used for urls.
 * If string starts with 'http', will return string as it is.
 * Else will parse value and return it from user-data.js
 *
 * @return {string}
 */
defineParameterType({
  regexp: STRING_REGEXP,
  name: 'landing-url',
  useForSnippets: false,
  transformer(string) {
    if (string.indexOf('http') === 0) {
      return string;
    }
    const environment = browser.params.env;

    return userData.urls[string][environment];
  }
});

/**
 * Used for reading users from user-data.js
 */
defineParameterType({
  regexp: STRING_REGEXP,
  name: 'user',
  useForSnippets: false,
  transformer(role) {
    return userData.users[role];
  }
});

defineParameterType({
  regexp: STRING_REGEXP,
  name: 'map',
  useForSnippets: false,
  transformer(string) {
    return string.split('=');
  }
});

/**
 * Used for text values.
 * If string starts with "REGEXP:" - get string as regular expression.
 * If string starts with 'UNIQUE:' or 'UNIQUE-EMAIL:' - generate unique text value.
 * or read already generated unique value from global uniqueMap parameter.
 * @return {string}
 */
defineParameterType({
  regexp: STRING_REGEXP,
  name: 'text',
  useForSnippets: true,
  transformer(string) {
    let result = string.replace(/\\"/g, '"');

    result = stringHelper.getUniqueTextIfNeeded(result);
    result = stringHelper.convertToRegexpIfNeeded(result);
    return result;
  }
});

/**
 * Used for hash values.
 * If string starts with 'HASH:' then value after ':' will be used for verification.
 * If HASH: is not set then hash should be defined in data/file-data-hash.js and name field should be provided
 * @return {string}
 */
defineParameterType({
    regexp: STRING_REGEXP,
    name: 'hash',
    useForSnippets: true,
    transformer: function (hash) {
        hash = hash.replace(/\\"/g, '"');
        if (hash.indexOf('HASH:') >= 0) {
            return hash.split('HASH:').pop();
        } else {
            return fileDataHash.hashes[hash];
        }
    }
});