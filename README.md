# MonguitoDB

Utility to perform CRUD operations over the localStorage, sessionStorage, or any object implementing the [Storage Interface](http://www.w3.org/TR/webstorage/#the-storage-interface) defined by the W3C.

This library was inspired by MongoDB, and some of its functions are syntactically similar to how they are in Mongo, with some differences and limitations.

NOTE: This utility works synchronously.

## Installation

Download the [minified library](https://raw.githubusercontent.com/equisoide/monguitodb/master/build/monguito-db.min.js) (which is under 10KB) and include it in your html. Alternatively you can download the [development version](https://raw.githubusercontent.com/equisoide/monguitodb/master/build/monguito-db.js).

```html
<script src="monguito-db.min.js"></script>
```

## Getting started

Initialize a new database instance with **new MonguitoDB(storage, collections)** where:

- **storage**: Is an object providing the storage mechanism. You can send localStorage or sessionStorage if the browser supports HTML5. Send null to use the default mechanism which stores collections in memory. Alternatively, you can send your own object implementing the [Storage Interface](http://www.w3.org/TR/webstorage/#the-storage-interface) defined by the W3C.
- **collections**: Is an array containing the names of the collections to be manipulated (analogous to tables in a relational database). You can send a single name, or an array of names if you want to manipulate several collections.

```js
// An object to perform CRUD operations over the HTML5 localStorage.
var db = new MonguitoDB(localStorage, "orders");

// An object to perform CRUD operations over the HTML5 sessionStorage.
var db = new MonguitoDB(sessionStorage, ["orders", "users"]);

// An object to perform CRUD operations over collections stored in memory.
var db = new MonguitoDB(null, ["orders", "users"]);
```

## Collection

A collection is a set of documents. It is equivalent to a table in the relational world, with the difference that a collection does not enforce a schema.

The following actions can be performed on a Collection: **insert, update, remove, find, findOne, get, count.**

Collections are initialized by **MonguitoDB()** constructor, they can't be initialized by yourself.

```js
// The following code shows how to reference collections initialized by
// MonguitoDB() constructor.
var db = new MonguitoDB(localStoraCoge, ["orders", "users"]);

var ordersCollection = db.orders;
var usersCollection  = db.users;
```

### Collection.insert(obj) → {[Document](#document)}

Inserts a new object into the collection and returns a reference to the inserted [Document](#document).

NOTE: _id property is the document's "primary key" wich is automatically assigned. It can be of two types:
 1. Auto-numeric: when _id is omitted in the passed-in obj.
 2. [UUID](http://en.wikipedia.org/wiki/Universally_unique_identifier): When _id is set to "uuid" in the passed-in obj.
 
| Parameter | Type   | Description                            |
| --------- | ------ |--------------------------------------- |
| obj       | object | Document to insert into the collection |

**Returns**: [Document](#document)

```js
var db = new MonguitoDB(localStorage, "orders");

// case 1) _id will be automatically assigned as an auto-numeric value.
var order = db.orders.insert({recipient: "Juan", total: 50});
var documentId = order._id;

// case 2) _id will be automatically assigned as an UUID.
var order = db.orders.insert({_id: "uuid", recipient: "Juan", total: 50});
var documentId = order._id;
```

### Collection.update(query, obj) → {[Cursor](#cursor)}

Updates one or several documents in the collection and returns a [Cursor](#cursor) containing the updated documents.

NOTE: _id property can't be modified.
 
| Parameter | Type             | Description                                 |
| --------- | ---------------- |-------------------------------------------- |
| query     | object, function | Selection criteria for the update           |
| obj       | object           | The modifications to apply (_id is omitted) |

**Returns**: [Cursor](#cursor)

```js
 var db = new MonguitoDB(localStorage, "orders");

 // Updates a single document (that one matching _id = 1).
 db.orders.update({_id: 1}, {status: "Delivered"});

 // Updates several documents (those matching recipient = "Juan").
 db.orders.update({recipient: "Juan"}, {status: "Delivered"});
```

### Collection.remove(query)

Removes one or several documents from the collection.

NOTE: If no query is passed-in, all documents in the collection will be removed.

```js
var db = new MonguitoDB(localStorage, "orders");

// Removes a single document (that one matching _id = 1).
db.orders.remove({_id: 1});

// Removes several documents (those matching recipient = "Juan").
db.orders.remove({recipient: "Juan"});

// Removes all documents in the collection.
db.orders.remove();
```

### Collection.find(query) → {[Cursor](#cursor)}

Retrieves all documents in the collection matching the specified query. If no query is passed-in, all documents within the collection will be returned.

This function returns a [Cursor](#cursor) that can be manipulated as an array plus the following actions: **update, remove, find, findOne, get, first, last, sort, pretty, count.**

| Parameter | Type             | Description                   |
| --------- | ---------------- |------------------------------ |
| query     | object, function |  Specifies selection criteria |

**Returns**: [Cursor](#cursor)

```js
var db     = new MonguitoDB(localStorage, "orders");
var orders = db.orders.find();

// Each element in the cursor is of type Document
orders.forEach(function (order) {
   console.log(order.pretty());
});

// Applying conditions to retrieve the data.
orders = db.orders.find({status: "Delivered"});
orders = db.orders.find({status: "Delivered", seller: "Armani"});
orders = db.orders.find(function (e) { return e.total > 700; });

// Sorting the data.
orders = db.orders.find().sort("seller");
orders = db.orders.find().sort("seller, total");
orders = db.orders.find().sort("seller ASC, total DESC");

// Executing many actions in cascade.
var firstOrder = db.orders.find().sort("total").first();
var lastOrder  = db.orders.find().sort("total").last();

// Printing the whole collection.
console.log(db.orders.find().pretty());
```

### Collection.findOne(query) → {[Document](#document) | null}

Returns a [Document](#document) that satisfies the specified query. If multiple documents satisfy the query, it will be returned the first document found (according to insertion order). If there is no matching document within the collection, it will be returned null.

The following actions can be performed on the returned document: **update, remove, pretty**.

| Parameter | Type             | Description                   |
| --------- | ---------------- |------------------------------ |
| query     | object, function |  Specifies selection criteria |

**Returns**: [Document](#document) | null

```js
var db    = new MonguitoDB(localStorage, "orders");
var order = db.orders.findOne({recipient: "Juan"});

console.log(order.pretty());         // Prints the document.
order.update({status: "Delivered"}); // Updates the document.
order.remove();                      // Removes the document.

// Using findOne() with a function criteria.
var order = db.orders.findOne(function (e) { return e.total > 0; });
```

### Collection.get(documentId) → {[Document](#document) | null}

Gets the Document that matches the specified _id. If there is no matching document within the collection, it will be returned null.

The following actions can be performed on the returned document: **update, remove, pretty**.

NOTE: get() is faster than find() and findOne().

| Parameter  | Type           | Description   |
| ---------- | -------------- |-------------- |
| documentId | number, string |  Document _id |

**Returns**: [Document](#document) | null

```js
var db    = new MonguitoDB(localStorage, "orders");
var order = db.orders.get(1);

console.log(order.pretty());         // Prints the document.
order.update({status: "Delivered"}); // Updates the document.
order.remove();                      // Removes the document.
```

### Collection.count() → {number}

Counts the number of documents in the collection.

**Returns**: number

```js
var db    = new MonguitoDB(localStorage, "orders");
var count = db.orders.count();
```

## Document

A document belongs to a Collection. It is a JSON structure composed by key-value pairs. It can be thought as a "record" belonging to a table in the relational world.

The following actions can be performed on a document: **update, remove, pretty**.

Documents are retrieved through methods in the Collection class, and they can't be initialized by yourself!

```js
var db = new MonguitoDB(localStorage, "orders");

// You get a reference to a Document when you insert one.
var order = db.orders.insert({recipient: "Juan", total: 50});

// You can get a Document with get() if you know its _id.
var order = db.orders.get(1);

// Individual elements retrieved from find() are of type Document.
var order = db.orders.find({recipient: "Juan"})[0];

// By using findOne you can get the first Document retrieved from a query.
var order = db.orders.findOne({recipient: "Juan"});

// You can also get a reference to a Document by using first() or last().
var order = db.orders.find().first();
```

## Cursor

...

## Creator

**Juan Cuartas**

- <http://juancuartas.com>
- <https://twitter.com/juancuartas>

## Copyright and license

Code and documentation released under [the MIT license](https://github.com/equisoide/monguitodb/blob/master/LICENSE)
