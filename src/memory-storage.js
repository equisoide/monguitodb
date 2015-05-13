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