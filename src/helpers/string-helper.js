module.exports = {

    /**
     * Create random text with the specified length from the set of characters.
     *
     * @param characterLength
     * @returns {string}
     */
    getRandomString: function (characterLength) {
        let randomText = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < characterLength; i++)
            randomText += possible.charAt(Math.floor(Math.random() * possible.length));
        return randomText;
    },

    /**
     * Get exact string value from text.
     *
     * @param string
     * @returns {string}
     */
    getExactStringRegexp: function (string) {
        const escapeRegexpString = string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp('(^|\\s)+(' + escapeRegexpString + ')($|\\s)+');
    },

    /**
     * Converts string into regexp if string starts with 'REGEXP:'.
     *
     * @param string
     * @returns {RegExp|string}
     */
    convertToRegexpIfNeeded: function (string) {
        if (string.indexOf('REGEXP:') === 0) {
            let newText = string.split('REGEXP:')[1];
            return new RegExp(newText);
        }
        return string;
    },

    /**
     * Generate unique text value or email if string starts with 'UNIQUE:' or 'UNIQUE-EMAIL:'
     * or read already generated unique value from global uniqueMap parameter.
     *
     * @param text
     * @returns {string}
     */
    getUniqueTextIfNeeded: function (text) {
        if (text.indexOf('UNIQUE:') >= 0) {
            let name = text.split('UNIQUE:').pop();
            if (text.indexOf(':UNIQUE') >= 0) {
                name = text.split('UNIQUE:').pop().split(':UNIQUE').shift();
            }
            let newName = getUniqueText(name);
            text = text.split(':UNIQUE').join('');
            return text.split('UNIQUE:' + name).join(newName);
        }
        else if (text.indexOf('UNIQUE-EMAIL:') === 0) {
            let name = text.split('UNIQUE-EMAIL:')[1];
            return getUniqueText(name, true);
        }
        return text;
    },

    /**
     * Sorting array alphabetically or numerically in ascending or descending order case insensitive
     *
     * @param array - that need to be sorted
     * @param format - alphabetically or numerically
     * @param order - ascending or descending
     * @returns {array} - sorted array
     */
    arraySorting: function (array, format, order) {
        if (format === 'alphabetically') {
            array.sort(function (firstValue, secondValue) {
                firstValue = firstValue.toString().toLowerCase();
                secondValue = secondValue.toString().toLowerCase();
                if (order === 'ascending') {
                    return firstValue === secondValue ? 0 : firstValue > secondValue ? 1 : -1;
                } else {
                    return firstValue === secondValue ? 0 : firstValue < secondValue ? 1 : -1;
                }
            });
        } else {
            if (order === 'ascending') {
                array.sort((firstValue, secondValue) => firstValue - secondValue);
            } else {
                array.sort((firstValue, secondValue) => secondValue - firstValue);
            }
        }
        return array;
    }
};

/**
 * Read unique text value or email from global uniqueMap parameter.
 *
 * @param name
 * @param isEmail
 * @returns {string}
 */
function getUniqueText(name, isEmail = false) {
    return uniqueMap[name] || generateUniqueText(name, isEmail);
}

/**
 * Generate new unique text value or email and save this value in global uniqueMap parameter.
 *
 * @param name
 * @param isEmail
 * @returns {*}
 */
function generateUniqueText(name, isEmail) {
    if (!uniqueMap[name]) {
        let uniqueValue = new Date().getTime();
        let uniqueEmail = 'automation_' + uniqueValue + '@gmail.com';
        uniqueMap[name] = (isEmail) ? uniqueEmail : 'automation_' + name + '_' + uniqueValue;
    }
    return uniqueMap[name];
}