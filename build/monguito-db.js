/*! MonguitoDB v0.0.1 | Thu May 14 2015 00:54:07 | (c) Juan Cuartas | MIT license */
(function (exports) {

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

/**
 * Custom implementation of the Storage Interface defined by the W3C. This
 * implementation stores key/value pairs in memory.
 *
 * @see     http://www.w3.org/TR/webstorage/#the-storage-interface
 * @author  Juan Cuartas
 * @version 0.0.1, Jun 2014
 *
 * @constructor
 * @ignore
 */
function MemoryStorage() {

    // PRIVATE ATTRIBUTES:
    // ------------------------------------------------------------------------
    
    /**
     * Stores the list of key/value pairs.
     *
     * @private
     */
    var _items = {};
    
    // PUBLIC ATTRIBUTES:
    // ------------------------------------------------------------------------

    /**
     * Number of key/value pairs currently stored.
     *
     * @public
     */
    this.length = 0;

    // PUBLIC METHODS:
    // ------------------------------------------------------------------------
    
    /**
     * Gets the key associated with the given index.
     *
     * @param  {number} index - Item index (starting from zero).
     * @return {string|null}
     * @public
     */
    this.key = function (index) {
        var counter = 0;
        for (var key in _items) {
            if (counter++ === index) {
                return key;
            }
        }
        return null;
    };
    
    /**
     * Gets the value associated with the given key.
     *
     * @param  {string} key - Item key.
     * @return {string|null}
     * @public
     */
    this.getItem = function (key) {
        return _items[key + ""] || null;
    };
    
    /**
     * Sets the value associated with the given key.
     *
     * @param {string} key   - Item key.
     * @param {string} value - Item value.
     * @public
     */
    this.setItem = function (key, value) {
        key = key + "";
        value = value + "";
        var oldValue = this.getItem(key);
        if (oldValue !==  value) {
            _items[key] = value;
            if (oldValue === null) {
                this.length++;
            }
        }
    };
    
    /**
     * Removes an item from the storage.
     *
     * @param {string} key - Item key.
     * @public
     */
    this.removeItem = function (key) {
        key = key + "";
        var oldValue = this.getItem(key);
        if  (oldValue !== null) {
            delete _items[key];
            this.length--;
        }
    };
    
    /**
     * Removes all items from the storage.
     *
     * @public
     */
    this.clear = function () {
        if (this.length) {
            _items = {};
            this.length = 0;
        }
    };

    /**
     * Returns a string that represents the current object.
     *
     * @return {string}
     * @public
     */
    this.toString = function () {
        return "[object Storage]";
    };
}

/**
 * A document belongs to a {@link Collection}. It is a JSON structure composed
 * by key-value pairs. It can be thought as a "record" belonging to a
 * table in the relational world.<br><br>
 *
 * The following actions can be performed on a document: update, remove,
 * pretty.<br><br>
 *
 * Documents are retrieved through methods in the {@link Collection} class,
 * so, don't initialize documents by yourself!
 *
 * @example
 *    var db = new MonguitoDB(localStorage, "orders");
 *
 *    // You get a reference to a Document when you insert one.
 *    var order = db.orders.insert({recipient: "Juan", total: 50});
 *
 *    // You can get a Document with get() if you know its _id.
 *    var order = db.orders.get(1);
 *
 *    // Individual elements retrieved from find() are of type Document.
 *    var order = db.orders.find({recipient: "Juan"})[0];
 *
 *    // By using findOne you can get the first Document retrieved from a query.
 *    var order = db.orders.findOne({recipient: "Juan"});
 *
 *    // You can also get a reference to a Document by using first() or last().
 *    var order = db.orders.find().first();
 *
 * @author  Juan Cuartas
 * @version 0.0.1, Jun 2014
 *
 * @constructor
 */
function Document(doc, storage, getConfig, getKey) {

    // PRIVATE METHODS:
    // ------------------------------------------------------------------------

    /**
     * Adds functions to manipulate the passed-in doc, specifically:
     * update, remove, pretty.
     *
     * @private
     */
    var _addBehaviour = function () {
        if (doc) {
            doc.update = _update;
            doc.remove = _remove;
            doc.pretty = _pretty;
        }
        
        return doc;
    };

    // PUBLIC METHODS:
    // ------------------------------------------------------------------------

    /**
     * Updates the document in the storage.<br><br>
     *
     * NOTE: _id property can't be modified.
     *
     * @example
     *    var db    = new MonguitoDB(localStorage, "orders");
     *    var order = db.orders.get(1);
     *
     *    // Update with arguments.
     *    order.update({status: "Delivered"});
     *
     *    // Update without arguments.
     *    order.status = "Delivered";
     *    order.update();
     *
     * @param  {?object} obj - The modifications to apply (_id is omitted).
     * @return {Document}
     * @alias  Document#update
     * @public
     */
    var _update = function (obj) {
        var path = "MonguitoDB.Document.update()";

        if (obj !== undefined) {
            util.validateArguments(arguments, 1, path);
            util.validateObject(obj, "arg[0]:obj", path);
            
            for (var property in obj) {
                if (property !== "_id") {
                    doc[property] = obj[property];
                }
            }
        }

        var config = getConfig();
        var index  = config.ids.indexOf(doc._id);

        if (index >= 0) {
            var key  = getKey(doc._id);
            var json = JSON.stringify(doc);
            storage.setItem(key, json);
            return doc;
        } else {
            throw new Error(
                path + ", _id:" + doc._id + " doesn't exist."
            );
        }
    };

    /**
     * Removes the document from the storage.<br><br>
     *
     * NOTE: Once you call remove() on a document, you can't perform remove()
     * or update() on the document anymore, because an exception will be thrown.
     *
     * @example
     *    var db    = new MonguitoDB(localStorage, "orders");
     *    var order = db.orders.get(1);
     *
     *    order.remove();
     *
     * @alias  Document#remove
     * @public
     */
    var _remove = function () {
        var path = "MonguitoDB.Document.remove()";
        util.validateArguments(arguments, 0, path);

        var config = getConfig();
        var index  = config.ids.indexOf(doc._id);

        if (index >= 0) {
            storage.removeItem(getKey(doc._id));
            config.ids.splice(index, 1);
            config.save();
        } else {
            throw new Error(
                path + ", _id:" + doc._id + " doesn't exist."
            );
        }
    };

    /**
     * Gets a "pretty" JSON representation of this document.
     *
     * @example
     *    var db    = new MonguitoDB(localStorage, "orders");
     *    var order = db.orders.get(1);
     *
     *    console.log(order.pretty());
     *
     * @alias Document#pretty
     * @public
     */
    var _pretty = function () {
        var path = "MonguitoDB.Document.pretty()";
        util.validateArguments(arguments, 0, path);

        return util.prettyJSON(doc);
    };

    return _addBehaviour();
}

/**
 * A cursor is a set of documents. It can be manipulated as an array plus the
 * following actions: update, remove, get, find, findOne, sort, first, last,
 * pretty, count.<br><br>
 *
 * Cursors are initialized by {@link Collection}.find(), so, don't initialize
 * cursors by yourself!
 *
 * @example
 *    var db     = new MonguitoDB(localStorage, "orders");
 *    var cursor = db.orders.find({recipient: "Juan"});
 *
 * @author  Juan Cuartas
 * @version 0.0.1, Jun 2014
 *
 * @constructor
 */
function Cursor(collection) {

    // PRIVATE METHODS:
    // ------------------------------------------------------------------------

    /**
     * Adds functions to manipulate the passed-in collection, specifically:
     * update, remove, get, find, findOne, sort, first, last, pretty, count.
     *
     * @private
     */
    var _addBehaviour = function () {
        if (collection) {
            collection.update  = _update;
            collection.remove  = _remove;
            collection.get     = _get;
            collection.find    = _find;
            collection.findOne = _findOne;
            collection.sort   = _sort;
            collection.first   = _first;
            collection.last    = _last;
            collection.pretty  = _pretty;
            collection.count   = _count;
        }

        return collection;
    };
    
    // PUBLIC METHODS:
    // ------------------------------------------------------------------------

    /**
     * Updates all documents in this cursor (changes are applied both in the
     * cursor and the storage).<br><br>
     *
     * NOTE: _id property can't be modified.
     *
     * @example
     *    var db     = new MonguitoDB(localStorage, "orders");
     *    var cursor = db.orders.find({recipient: "Juan"});
     *
     *    // Updates all orders belonging to "Juan" with status "Delivered".
     *    cursor.update({status: "Delivered"});
     *
     * @param  {?object} obj - The modifications to apply (_id is omitted).
     * @return {Cursor}
     * @alias  Cursor#update
     * @public
     */
    var _update = function (obj) {
        if (obj !== undefined) {
            var path = "MonguitoDB.Cursor.update()";
            util.validateArguments(arguments, 1, path);
            util.validateObject(obj, "arg[0]:obj", path);
        }

        collection.forEach(function (doc) {
            doc.update(obj);
        });

        return collection;
    };

    /**
     * Removes all documents in this cursor (changes are applied both in the
     * cursor and the storage).<br><br>
     *
     * NOTE: Once you call remove() on a cursor the cursor will be empty.
     *
     * @example
     *    var db     = new MonguitoDB(localStorage, "orders");
     *    var cursor = db.orders.find({recipient: "Juan"});
     *
     *    // Removes all orders belonging to "Juan".
     *    cursor.remove();
     *
     * @alias  Cursor#remove
     * @public
     */
    var _remove = function () {
        var path = "MonguitoDB.Cursor.remove()";
        util.validateArguments(arguments, 0, path);

        collection.forEach(function (doc) {
            doc.remove();
        });

        collection.length = 0;
    };

    /**
     * Gets the {@link Document} within this cursor matching the specified _id.
     * If there is no matching document within this cursor, it will be returned
     * null.<br><br>
     *
     * @example
     *    var db     = new MonguitoDB(localStorage, "orders");
     *    var cursor = db.orders.find({recipient: "Juan"});
     *
     *    // Gets the order belonging to "Juan" with _id = 1.
     *    var order = cursor.get(1);
     *
     * @param  {number|string} documentId - Document _id.
     * @return {Document|null}
     * @alias  Cursor#get
     * @public
     */
    var _get = function (documentId) {
        var path = "MonguitoDB.Cursor.get()";
        util.validateArguments(arguments, 1, path);
        util.validateDocumentId(documentId, "arg[0]:documentId", path);
        
        return collection.findOne({_id: documentId});
    };

    /**
     * Retrieves all documents within this cursor that match the specified
     * query.<br><br>
     *
     * NOTE: This function creates and returns a new cursor (the original one
     *       won't be modified).
     *
     * @example
     *    var db     = new MonguitoDB(localStorage, "orders");
     *    var cursor = db.orders.find({recipient: "Juan"});
     *
     *    // Gets all orders belonging to "Juan" with status "Pending".
     *    var pending = cursor.find({status: "Pending"});
     *
     *    // Gets all orders belonging to "Juan" with total >= 1000.
     *    var expensive = cursor.find(function (e) { return e.total >= 1000; });
     *
     * @param  {?(object|function)} query - Specifies selection criteria.
     * @return {Cursor}
     * @alias  Cursor#find
     * @public
     */
    var _find = function (query) {
        if (query !== undefined) {
            var path = "MonguitoDB.Cursor.find()";
            util.validateArguments(arguments, 1, path);
            util.validateObjectOrFunction(query, "arg[0]:query", path);
        }

        return Cursor(util.filterArray(collection, query));
    };

    /**
     * Returns a {@link Document} within this cursor matching the specified
     * query. If multiple documents satisfy the query, it will be returned the
     * first document found. If there is no matching document within this
     * cursor, it will be returned null.<br><br>
     * 
     * @example
     *    var db     = new MonguitoDB(localStorage, "orders");
     *    var cursor = db.orders.find({recipient: "Juan"});
     *
     *    // Gets the order belonging to "Juan" with number "107-1".
     *    var order = cursor.findOne({number: "107-1"});
     *
     *    // Another way to do the same above.
     *    var order = cursor.findOne(function (e) { return e.number === "107-1"});
     *
     * @param  {?(object|function)} query - Specifies selection criteria.
     * @return {Document|null}
     * @alias  Cursor#findOne
     * @public
     */
    var _findOne = function (query) {
        if (query !== undefined) {
            var path = "MonguitoDB.Cursor.findOne()";
            util.validateArguments(arguments, 1, path);
            util.validateObjectOrFunction(query, "arg[0]:query", path);
        }

        return util.firstInArray(
            util.filterArray(collection, query)
        );
    };

    /**
     * Sorts the current cursor and returns a reference to the new sorted
     * cursor.<br><br>
     *
     * NOTE: This function creates and returns a new cursor (the original one
     *       won't be modified).
     *
     * @example
     *    var db     = new MonguitoDB(localStorage, "orders");
     *    var cursor = db.orders.find({recipient: "Juan"});
     *
     *    // Sorts the documents by seller (Default sort direction is ascending).
     *    orders = cursor.sort("seller");
     *
     *    // Sorts the documents by seller and total.
     *    orders = cursor.sort("seller, total");
     *
     *    // Sorts the documents by seller (ascending) and total (descending).
     *    orders = cursor.sort("seller ASC, total DESC");
     *
     * @param  {string} sortExpression - Sort expression (You can use ASC or
     *    DESC to specify sort direction.
     * @return {Cursor}
     * @alias  Cursor#sort
     * @public
     */
    var _sort = function (sortExpression) {
        var path = "MonguitoDB.Cursor.sort()";
        util.validateArguments(arguments, 1, path);
        util.validateString(sortExpression, "arg[0]:sortExpression", path);
        
        return Cursor(util.sortArray(collection, sortExpression));
    };

    /**
     * Returns the first {@link Document} within this cursor. If the cursor
     * is empty, it will be returned null.
     * 
     * @example
     *    var db     = new MonguitoDB(localStorage, "orders");
     *    var cursor = db.orders.find({recipient: "Juan"});
     *
     *    // Gets the first order belonging to "Juan".
     *    var order = cursor.first();
     *
     * @return {Document|null}
     * @alias  Cursor#first
     * @public
     */
    var _first = function () {
        var path = "MonguitoDB.Cursor.first()";
        util.validateArguments(arguments, 0, path);

        return util.firstInArray(collection);
    };

    /**
     * Returns the last {@link Document} within this cursor. If the cursor
     * is empty, it will be returned null.
     * 
     * @example
     *    var db     = new MonguitoDB(localStorage, "orders");
     *    var cursor = db.orders.find({recipient: "Juan"});
     *
     *    // Gets the last order belonging to "Juan".
     *    var order = cursor.last();
     *
     * @return {Document|null}
     * @alias  Cursor#last
     * @public
     */
    var _last = function () {
        var path = "MonguitoDB.Cursor.last()";
        util.validateArguments(arguments, 0, path);

        return util.lastInArray(collection);
    };

    /**
     * Gets a "pretty" JSON representation of this cursor.
     *
     * @example
     *    var db     = new MonguitoDB(localStorage, "orders");
     *    var cursor = db.orders.find({recipient: "Juan"});
     *
     *    // Prints all orders belonging to "Juan".
     *    console.log(cursor.pretty());
     *
     * @alias Cursor#pretty
     * @public
     */
    var _pretty = function () {
        var path = "MonguitoDB.Cursor.pretty()";
        util.validateArguments(arguments, 0, path);

        return util.prettyJSON(collection);
    };

    /**
     * Counts the number of documents within this cursor.
     *
     * @example
     *    var db     = new MonguitoDB(localStorage, "orders");
     *    var cursor = db.orders.find({recipient: "Juan"});
     *
     *    // Counts the number of orders belonging to "Juan"
     *    var count  = cursor.count();
     *
     * @return {number}
     * @alias  Cursor#count
     * @public
     */
    var _count = function () {
        var path = "MonguitoDB.Cursor.count()";
        util.validateArguments(arguments, 0, path);

        return collection.length;
    };

    return _addBehaviour();
}

/**
 * A collection is a set of documents. It is equivalent to a table in the
 * relational world, with the difference that a collection does not enforce
 * a schema.<br><br>
 *
 * The following actions can be performed on a Collection: insert, update,
 * remove, get, find, findOne, count.<br><br>
 *
 * Collections are initialized by MonguitoDB() constructor, so, don't
 * initialize collections by yourself!
 *
 * @example
 *    // The following code shows how to reference collections initialized by
 *    // MonguitoDB() constructor.
 *    var db = new MonguitoDB(localStorage, ["orders", "users"]);
 *
 *    var ordersCollection = db.orders;
 *    var usersCollection  = db.users;
 *
 * @author  Juan Cuartas
 * @see     Document
 * @see     Cursor
 * @version 0.0.1, Jun 2014
 *
 * @constructor
 */
function Collection(storage, collectionName) {

    // PRIVATE METHODS:
    // ------------------------------------------------------------------------

    /**
     * Gets the key used to store a document in this collection.
     *
     * @param  {number} documentId - Document _id.
     * @return {string}
     * @private
     */
    var _getKey = function (documentId) {
        if (util.isValidUUID(documentId)) {
            return documentId;
        } else {
            return  collectionName + "-" + documentId;
        }
    };

    /**
     * Gets the configuration regarding to this collection.
     *
     * @return {{identity: number, ids: object[]}}
     * @private
     */
    var _getConfig = function () {
        var config = storage.getItem(collectionName);
        
        if (config === null) {
            config = {
                identity: 1,
                ids: []
            };
        } else {
            config = JSON.parse(config);
        }

        config.save = function () {
            var json = JSON.stringify(this);
            storage.setItem(collectionName, json);
        };

        return config;
    };

    // PUBLIC METHODS:
    // ------------------------------------------------------------------------
    
    /**
     * Inserts a new object into this collection and returns a reference to
     * the inserted {@link Document}.<br><br>
     *
     * NOTE: _id property is the document's "primary key" wich is automatically
     *       assigned. It can be of two types:<br>
     *       1) Auto-numeric: when _id is omitted in the passed-in obj.<br>
     *       2) UUID: When _id is set to "uuid" in the passed-in obj.
     *
     * @example
     *    var db = new MonguitoDB(localStorage, "orders");
     *
     *    // case 1) _id will be automatically assigned as an auto-numeric value.
     *    var order = db.orders.insert({recipient: "Juan", total: 50});
     *    var documentId = order._id;
     *
     *    // case 2) _id will be automatically assigned as an UUID.
     *    var order = db.orders.insert({_id: "uuid", recipient: "Juan", total: 50});
     *    var documentId = order._id;
     *
     * @param  {object} obj - Document to insert into the collection.
     * @return {Document}
     * @alias  Collection#insert
     * @public
     */
    var _insert = function (obj)  {
        var path = "MonguitoDB.Collection.insert()";
        util.validateArguments(arguments, 1, path);
        util.validateObject(obj, "arg[0]:obj", path);

        var config = _getConfig();

        if (obj.hasOwnProperty("_id")) {
            if (obj._id === "uuid") {
                obj._id = util.generateUUID();
            } else {
                throw new TypeError(
                    path + ", invalid _id value, only 'uuid' is allowed."
                );
            }
        } else {
            obj._id = config.identity++;
        }

        var key  = _getKey(obj._id);
        var json = JSON.stringify(obj);
        storage.setItem(key, json);

        config.ids.push(obj._id);
        config.save();

        return Document(obj, storage, _getConfig, _getKey);
    };

    /**
     * Gets the {@link Document} that matches the specified _id. If there is
     * no matching document within this collection, it will be returned
     * null.<br><br>
     *
     * The following actions can be performed on the returned document:
     * update, remove, pretty.<br><br>
     *
     * NOTE: get() is faster than find() and findOne().
     *
     * @example
     *    var db    = new MonguitoDB(localStorage, "orders");
     *    var order = db.orders.get(1);
     *
     *    console.log(order.pretty());         // Prints the document.
     *    order.update({status: "Delivered"}); // Updates the document.
     *    order.remove();                      // Removes the document.
     *
     * @param  {number|string} documentId - Document _id.
     * @return {Document|null}
     * @alias  Collection#get
     * @public
     */
    var _get = function (documentId) {
        var path = "MonguitoDB.Collection.get()";
        util.validateArguments(arguments, 1, path);
        util.validateDocumentId(documentId, "arg[0]:documentId", path);

        var key  = _getKey(documentId);
        var json = storage.getItem(key);

        if (json !== null) {
            var obj = JSON.parse(json);
            return Document(obj, storage, _getConfig, _getKey);
        } else {
            return null;
        }
    };
    
    /**
     * Retrieves all documents in this collection matching the specified query.
     * If no query is passed-in, all documents will be returned.<br><br>
     *
     * This function returns a {@link Cursor} that can be manipulated as an
     * array plus the following actions: update, remove, get, find, findOne,
     * sort, first, last, pretty, count.
     *
     * @example
     *    var db     = new MonguitoDB(localStorage, "orders");
     *    var orders = db.orders.find();
     *
     *    // Each element in the cursor is of type {@link Document}
     *    orders.forEach(function (order) {
     *        console.log(order.pretty());
     *    });
     *
     *    // Applying conditions to retrieve the data.
     *    orders = db.orders.find({status: "Delivered"});
     *    orders = db.orders.find({status: "Delivered", seller: "Armani"});
     *    orders = db.orders.find(function (e) { return e.total > 700; });
     *
     *    // Sorting the data.
     *    orders = db.orders.find().sort("seller");
     *    orders = db.orders.find().sort("seller, total");
     *    orders = db.orders.find().sort("seller ASC, total DESC");
     *
     *    // Executing many actions in cascade.
     *    var firstOrder = db.orders.find().sort("total").first();
     *    var lastOrder  = db.orders.find().sort("total").last();
     *
     *    // Printing the whole collection.
     *    console.log(db.orders.find().pretty());
     *
     * @param  {?(object|function)} query - Specifies selection criteria.
     * @return {Cursor}
     * @alias  Collection#find
     * @public
     */
    var _find = function (query) {
        if (query !== undefined) {
            var path = "MonguitoDB.Collection.find()";
            util.validateArguments(arguments, 1, path);
            util.validateObjectOrFunction(query, "arg[0]:query", path);
        }

        var documents = [];

        _getConfig().ids.forEach(function (documentId) {
            documents.push(_get(documentId));
        });

        if (typeof query !== "undefined") {
            documents = util.filterArray(documents, query);
        }

        return Cursor(documents);
    };
    
    /**
     * Returns a {@link Document} that satisfies the specified query. If
     * multiple documents satisfy the query, it will be returned the first
     * document found (according to insertion order). If there is
     * no matching document within this collection, it will be returned
     * null.<br><br>
     *
     * The following actions can be performed on the returned document:
     * update, remove, pretty.
     * 
     * @example
     *    var db    = new MonguitoDB(localStorage, "orders");
     *    var order = db.orders.findOne({recipient: "Juan"});
     *    
     *    console.log(order.pretty());         // Prints the document.
     *    order.update({status: "Delivered"}); // Updates the document.
     *    order.remove();                      // Removes the document.
     *
     *    // Using findOne() with a function criteria.
     *    var order = db.orders.findOne(function (e) { return e.total > 0; });
     *
     * @param  {?(object|function)} query - Specifies selection criteria.
     * @return {Document|null}
     * @alias  Collection#findOne
     * @public
     */
    var _findOne = function (query) {
        if (query !== undefined) {
            var path = "MonguitoDB.Collection.findOne()";
            util.validateArguments(arguments, 1, path);
            util.validateObjectOrFunction(query, "arg[0]:query", path);
        }
        
        return _find(query).first();
    };

    /**
     * Counts the number of documents in this collection.
     *
     * @example
     *    var db    = new MonguitoDB(localStorage, "orders");
     *    var count = db.orders.count();
     *
     * @return {number}
     * @alias  Collection#count
     * @public
     */
    var _count = function () {
        util.validateArguments(arguments, 0, "MonguitoDB.Collection.count()");
        return _getConfig().ids.length;
    };

    /**
     * Updates one or several documents in the current collection and returns
     * a {@link Cursor} containing the updated documents.<br><br>
     *
     * NOTE: _id property can't be modified.
     *
     * @example
     *    var db = new MonguitoDB(localStorage, "orders");
     *
     *    // Updates a single document (that one matching _id = 1).
     *    db.orders.update({_id: 1}, {status: "Delivered"});
     *
     *    // Updates several documents (those matching recipient = "Juan").
     *    db.orders.update({recipient: "Juan"}, {status: "Delivered"});
     *
     * @param  {object|function} query - Selection criteria for the update.
     * @param  {object} obj - The modifications to apply (_id is omitted).
     * @return {Cursor}
     * @alias  Collection#update
     * @public
     */
    var _update = function (query, obj) {
        var path = "MonguitoDB.Collection.update()";
        util.validateArguments(arguments, 2, path);
        util.validateObjectOrFunction(query, "arg[0]:query", path);
        util.validateObject(obj, "arg[1]:obj", path);

        var documents = _find(query);

        documents.forEach(function (doc) {
            doc.update(obj);
        });

        return documents;
    };
    
    /**
     * Removes one or several documents from the current collection.<br><br>
     *
     * NOTE: If no query is passed-in, all documents will be removed.
     *
     * @example
     *    var db = new MonguitoDB(localStorage, "orders");
     *
     *    // Removes a single document (that one matching _id = 1).
     *    db.orders.remove({_id: 1});
     *
     *    // Removes several documents (those matching recipient = "Juan").
     *    db.orders.remove({recipient: "Juan"});
     *
     *    // Removes all documents.
     *    db.orders.remove();
     *
     * @param  {?(object|function)} query - Selection criteria for the remove.
     * @alias  Collection#remove
     * @public
     */
    var _remove = function (query) {
        if (query !== undefined) {
            var path = "MonguitoDB.Collection.remove()";
            util.validateArguments(arguments, 1, path);
            util.validateObjectOrFunction(query, "arg[0]:query", path);
        }

        _find(query).forEach(function (doc) {
            doc.remove();
        });
    };
    
    return {
        insert:  _insert,
        get:     _get,
        find:    _find,
        findOne: _findOne,
        count:   _count,
        update:  _update,
        remove:  _remove
    };
}

/**
 * Utility to perform CRUD operations over the localStorage, sessionStorage, or
 * any object implementing the Storage Interface defined by the W3C.<br><br>
 *
 * This library was inspired by MongoDB, and some of its functions are
 * syntactically similar to how they are in Mongo, with some differences
 * and limitations.<br><br>
 *
 * NOTE: This utility works synchronously.
 *
 * @example
 *    // An object to perform CRUD operations over the HTML5 localStorage.
 *    var db = new MonguitoDB(localStorage, "orders");
 *
 *    // An object to perform CRUD operations over the HTML5 sessionStorage.
 *    var db = new MonguitoDB(sessionStorage, ["orders", "users"]);
 *
 *    // An object to perform CRUD operations over collections stored in memory.
 *    var db = new MonguitoDB(null, ["orders", "users"]);
 *
 * @param {object|null} storage - Object providing the storage mechanism. You
 *    can send localStorage or sessionStorage if the browser supports HTML5.
 *    Send null to use the default mechanism which stores collections in memory.
 *    Alternatively, you can send your own object implementing the Storage
 *    Interface defined by the W3C.
 * @param {string|string[]} collections - Array containing the names of the
 *    collections to be manipulated (analogous to tables in a relational
 *    database). You can send a single name, or an array of names if you want
 *    to manipulate several collections.
 *
 * @see     http://www.w3.org/TR/webstorage/#the-storage-interface
 * @see     Collection
 * @author  Juan Cuartas
 * @version 0.0.1, Jun 2014
 *
 * @constructor
 */
exports.MonguitoDB = function(storage, collections) {
    util.validateArguments(arguments, 2, "MonguitoDB()");
    
    if (storage !== null && !util.isValidStorage(storage)) {
        throw new TypeError(
            "MonguitoDB(), invalid arg[0]:storage, expecting storage object."
        );
    }

    collections = [].concat(collections);

    if (!collections.length) {
        throw new TypeError(
            "MonguitoDB(), invalid arg[1]:collections, array can not be empty."
        );
    }

    for (var i = 0; i < collections.length; i++) {
        if (typeof collections[i] !== "string") {
            throw new TypeError(
                "MonguitoDB(), invalid arg[1]:collections, " +
                "expecting string or string[]."
            );
        }
    }

    for (i = 0; i < collections.length; i++) {
        if (!util.isValidVariableName(collections[i])) {
            throw new TypeError(
                "MonguitoDB(), invalid arg[1]:collections '" + collections[i] + 
                "' is an invalid collection's name."
            );
        }
    }

    if (storage === null) {
        storage = new MemoryStorage();
    }
    
    for (i = 0; i < collections.length; i++) {
        if (!this[collections[i]]) {
            this[collections[i]] = new Collection(storage, collections[i]);
        }
    }
};

})(window);