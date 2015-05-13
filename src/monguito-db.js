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