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

## Collections

A collection is a set of documents. It is equivalent to a table in the relational world, with the difference that a collection does not enforce a schema.

The following actions can be performed on a Collection: insert, update, remove, get, find, findOne, count.

Collections are initialized by MonguitoDB() constructor and they can't be initialized by yourself!

```js
// The following code shows how to reference collections initialized by
// MonguitoDB() constructor.
var db = new MonguitoDB(localStorage, ["orders", "users"]);

var ordersCollection = db.orders;
var usersCollection  = db.users;
```

## Creator

**Juan Cuartas**

- <http://juancuartas.com>
- <https://twitter.com/juancuartas>

## Copyright and license

Code and documentation released under [the MIT license](https://github.com/equisoide/monguitodb/blob/master/LICENSE)
