/**
 * Provides some utility functions (array manipulators, validators, etc).
 *
 * @author  Juan Cuartas
 * @version 0.0.1, Jun 2014
 *
 * @namespace
 * @ignore
 */
var util = util || {};

// MANIPULATING ARRAYS:
// ----------------------------------------------------------------------------

/**
 * Filters the array given as argument and returns a reference to the new
 * filtered array.<br><br>
 *
 * NOTE: passed-in array is not modified, a new copied array is returned.
 *
 * @param  {object[]} array - Array of objects to be filtered.
 * @param  {?(object|function)} filter - Filter object or function.
 *    E.g. 1: {status: "Delivered", seller: "Armani"}
 *    E.g. 2: function (e) { return e.total > 700; }
 * @return {object[]}
 */
util.filterArray = function (array, filter) {
    if (Object.prototype.toString.call(array) !== "[object Array]") {
        throw new TypeError(
            "util.filterArray(), invalid arg[0]:array, expecting array."
        );
    }
    
    var newArray = array.slice(0);

    if (typeof filter === "function") {
        for (var i = 0; i < newArray.length; i++) {
            if (filter(newArray[i]) !== true) {
                newArray.splice(i--, 1);
            }
        }
    } else if (typeof filter === "object" && filter !== null) {
        var isMatch = function (element) {
            for (var property in filter) {
                if (element[property] !== filter[property]) {
                    return false;
                }
            }
            return true;
        };
        for (var j = 0; j < newArray.length; j++) {
            if (!isMatch(newArray[j])) {
                newArray.splice(j--, 1);
            }
        }
    } else if (typeof filter !== "undefined") {
        throw new TypeError(
            "util.filterArray(), invalid arg[1]:filter, " +
            "expecting object or function."
        );
    }

    return newArray;
};

/**
 * Sorts the array given as argument and returns a reference to the new sorted
 * array.<br><br>
 *
 * NOTE: passed-in array is not modified, a new copied array is returned.
 *
 * @param  {object[]} array - Array of objects to be sortered.
 * @param  {string} sort - Sort expression.
 *    E.g. 1: "seller".
 *    E.g. 2: "seller, total".
 *    E.g. 3: "seller ASC, total DESC".
 * @return {object[]}
 */
util.sortArray = function (array, sort) {
    if (Object.prototype.toString.call(array) !== "[object Array]") {
        throw new TypeError(
            "util.sortArray(), invalid arg[0]:array, expecting array."
        );
    }
    if (typeof sort !== "string") {
        throw new TypeError(
            "util.sortArray(), invalid arg[1]:sort, expecting string."
        );
    }

    var newArray = array.slice(0);
    sort = sort.replace(/ +(?= )/g, "").split(",");

    newArray.sort(function (obj1, obj2) {
        for (var i = 0; i < sort.length; i++) {
            var tokens    = sort[i].trim().split(" ");
            var property  = tokens[0];
            var direction = "ASC";
            if (tokens.length > 1) {
                direction = tokens[1].toUpperCase();
            }
            if (direction === "DESC") {
                if (obj1[property] > obj2[property]) {
                    return -1;
                } else if (obj1[property] < obj2[property]) {
                    return 1;
                }
            } else {
                if (obj1[property] < obj2[property]) {
                    return -1;
                } else if (obj1[property] > obj2[property]) {
                    return 1;
                }
            }
        }
        return 0;
    });

    return newArray;
};

/**
 * Gets the first element in the given array, null if the array is empty.
 *
 * @param  {object[]} array - Array to get its first element.
 * @return {object|null}
 */
util.firstInArray = function (array) {
    if (Object.prototype.toString.call(array) !== "[object Array]") {
        throw new TypeError(
            "util.firstInArray(), invalid arg[0]:array, expecting array."
        );
    }

    if (array.length) {
        return array[0];
    } else {
        return null;
    }
};

/**
 * Gets the last element in the given array, null if the array is empty.
 *
 * @param  {object[]} array - Array to get its last element.
 * @return {object|null}
 */
util.lastInArray = function (array) {
    if (Object.prototype.toString.call(array) !== "[object Array]") {
        throw new TypeError(
            "util.lastInArray(), invalid arg[0]:array, expecting array."
        );
    }
    
    if (array.length) {
        return array[array.length - 1];
    } else {
        return null;
    }
};

// VALIDATORS:
// ----------------------------------------------------------------------------

/**
 * Indicates if the given argument is a valid natural number {0, 1, 2, ...}.
 *
 * @param  {number} num - Number to validate.
 * @return {boolean}
 */
util.isValidNaturalNumber = function (num) {
    return (typeof num === "number") && (num % 1 === 0) && (num >= 0);
};

/**
 * Indicates if the given argument is a valid JavaScript variable name.
 *
 * @param  {string} variableName - Variable to validate.
 * @return {boolean}
 */
util.isValidVariableName = function (variableName) {
    return typeof variableName === "string" && 
           /^[$A-Z_][0-9A-Z_$]*$/i.test(variableName);
};

/**
 * Indicates if the given argument is a valid Universally Unique Identifier,
 * according to the RFC4122 V4 specification.
 *
 * @see    http://en.wikipedia.org/wiki/Universally_unique_identifier
 * @param  {string} uuid - Identifier to validate.
 * @return {boolean}
 */
util.isValidUUID = function (uuid) {
    if (typeof uuid !== "string" || uuid.length !== 36) {
        return false;
    }

    uuid = uuid.toUpperCase();

    var validateDigit = function (digit, index) {
        if ([8, 13, 18, 23].indexOf(index) >= 0) {
            return digit === "-";
        } else if (index === 14) {
            return digit === "4";
        } else if (index === 19) {
            return ["8", "9", "A", "B"].indexOf(digit) >= 0;
        } else {
            return ["0", "1", "2", "3", "4", "5", "6", "7",
                    "8", "9", "A", "B", "C", "D", "E", "F"].indexOf(digit) >= 0;
        }
    };

    for (var i = 0; i < uuid.length; i++) {
        if (!validateDigit(uuid[i], i)) {
            return false;
        }
    }

    return true;
};

/**
 * Indicates if the given argument is a valid document _id (a document _id is
 * valid when it is a Natural Number or an UUID).
 *
 * @param  {number} documentId - Document _id.
 * @return {boolean}
 */
util.isValidDocumentId = function (documentId) {
    return util.isValidNaturalNumber(documentId) ||
           util.isValidUUID(documentId);
};

/**
 * Indicates if the given argument implements the Storage Interface defined by
 * the W3C.
 *
 * @see    http://www.w3.org/TR/webstorage/#the-storage-interface
 * @param  {object} storage - Object to validate.
 * @return {boolean}
 */
util.isValidStorage = function (storage) {
    var key   = "1E7B9A3B-9D53-469F-BF4E-D056A3BE403C";
    var value = "3220B380-2E7A-49BD-9A51-44D6408ED989";

    try {
        storage.removeItem(key);
        var length = storage.length;
        if (!util.isValidNaturalNumber(length)) {
            return false;
        }
        storage.setItem(key, value);
        if (storage.getItem(key) !== value) {
            return false;
        }
        if (storage.length !== (length + 1)) {
            return false;
        }
        storage.removeItem(key);
        if (storage.getItem(key) !== null) {
            return false;
        }
        if (storage.length !== length) {
            return false;
        }
        if (typeof storage.key !== "function") {
            return false;
        }
        if (typeof storage.clear !== "function") {
            return false;
        }
    } catch (err) {
        return false;
    }

    return true;
};

/**
 * Validates that args.length === expected. If args.length !== expected,
 * an exception will be thrown.
 *
 * @param {object[]} args     - The arguments to validate.
 * @param {number}   expected - The expected lenght.
 * @param {string}   path     - Path where the validation was done.
 */
util.validateArguments = function (args, expected, path) {
    if (args.length !== expected) {
        var msg = null;

        switch (expected) {
            case 0:
                msg = "arguments are not allowed.";
                break;
            case 1:
                msg = "expecting 1 arg, " + args.length + " received.";
                break;
            default:
                msg = "expecting " + expected + " args, " + args.length +
                      " received.";
                break;
        }
        
        throw new Error(path + ", " + msg);
    }
};

/**
 * Validates that arg is a valid string. If arg is null or is not an string,
 * an exception will be thrown.
 *
 * @param {object} arg -  The argument to validate.
 * @param {string} name - The argument name.
 * @param {string} path - Path where the validation was done.
 */
util.validateString = function (arg, name, path) {
    if (arg === null) {
        throw new TypeError(
            path + ", " + name + " can't be null."
        );
    }
    if (typeof arg !== "string") {
        throw new TypeError(
            path + ", invalid " + name + ", expecting string."
        );
    }
};

/**
 * Validates that arg is a valid object. If arg is null or is not an object,
 * an exception will be thrown.
 *
 * @param {object} arg -  The argument to validate.
 * @param {string} name - The argument name.
 * @param {string} path - Path where the validation was done.
 */
util.validateObject = function (arg, name, path) {
    if (arg === null) {
        throw new TypeError(
            path + ", " + name + " can't be null."
        );
    }
    if (Object.prototype.toString.call(arg) !== "[object Object]") {
        throw new TypeError(
            path + ", invalid " + name + ", expecting object."
        );
    }
};

/**
 * Validates that arg is a valid object or function. If arg is null or is not
 * an object or a function, an exception will be thrown.
 *
 * @param {object} arg -  The argument to validate.
 * @param {string} name - The argument name.
 * @param {string} path - Path where the validation was done.
 */
util.validateObjectOrFunction = function (arg, name, path) {
    if (arg === null) {
        throw new TypeError(
            path + ", " + name + " can't be null."
        );
    }
    if (typeof arg !== "function" &&
        Object.prototype.toString.call(arg) !== "[object Object]") {
        throw new TypeError(
            path + ", invalid " + name + ", expecting object or function."
        );
    }
};

/**
 * Validates that arg is a valid document _id (a document _id is
 * valid when it is a Natural Number or an UUID.). If arg is null or is not
 * a valid document _id, an exception will be thrown.
 *
 * @param {object} arg -  The argument to validate.
 * @param {string} name - The argument name.
 * @param {string} path - Path where the validation was done.
 */
util.validateDocumentId = function (arg, name, path) {
    if (arg === null) {
        throw new TypeError(
            path + ", " + name + " can't be null."
        );
    }
    if (!util.isValidDocumentId(arg)) {
        throw new TypeError(
            path + ", invalid arg[0]:documentId, expecting number or UUID."
        );
    }
};

// OTHER UTILITIES:
// ----------------------------------------------------------------------------

/**
 * Gets a "pretty" JSON representation of the given object.
 *
 * @param  {object} obj - Object to get its "pretty" JSON representation.
 * @return {string}
 */
util.prettyJSON = function (obj) {
    switch (typeof obj) {
        case "string":
            return obj;
        case "undefined":
            return "undefined";
        default:
            return JSON.stringify(obj, null, "\t");
    }
};

/**
 * Generates an Universally Unique Identifier, according to the RFC4122 V4
 * specification.
 *
 * @see    http://en.wikipedia.org/wiki/Universally_unique_identifier
 * @return {string}
 */
util.generateUUID = function () {
    var format = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    var replaceableChars = /[xy]/g;
    
    var randomDigit = function (digitType) {
        var random = Math.random() * 16 | 0;
        if (digitType === "y") {
            random = random & 0x3 | 0x8;
        }
        return random.toString(16).toUpperCase();
    };
    
    return format.replace(replaceableChars, randomDigit);
};