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