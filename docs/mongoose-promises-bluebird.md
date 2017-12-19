## What is a Promise?
<http://www.dotnetcurry.com/nodejs/1179/using-async-promises-nodejs-application>

A promise is an object that holds an asynchronous operation
and notifies on completion of the operation. At a given point of time,
a promise is in one of the following states:

* Pending: When execution of the operation is still in progress
* Success: Once execution of the operation is successfully completed
* Failure: Once execution of the operation is failed

The promise object accepts callbacks that get invoked
when the operation either succeeds or, fails.
Dependent asynchronous operations can be chained together
to make them look synchronous and yet achieve the same result,
that we get when we use the callback approach.

> [Using Promises in Node.js Applications using Bluebird](http://www.dotnetcurry.com/nodejs/1179/using-async-promises-nodejs-application)


## Using Promises with Mongoose
As a first step, we need to install the `Bluebird` promise package in the project.
```
$ npm install bluebird
```

Now we need to include this package in the `model` layer.
```
var Promise = require('bluebird');
```

Let’s use this promise in the `getTodo` method defined `model`.
```
//API
app.get('/api/todos/:id', function(request, response){
  todosDataOps.getTodo(request, response);
});
 
// Model
exports.getTodo = function(id){
  return new Promise(function(resolve, reject){
    todoModel.find({id: id}).exec(function (error, results) {
      if(error){
        reject({error: error});
      }
      else {
        resolve(results);
      }
    });
  });
};
```

Now the `model` layer is independent of the `request` and `response` objects.
The API layer gets access to the promise returned from the above method and it can compose the response based on the state with which the promise ends.
```
app.get('/api/todos', function(request, response){
  var promise = todosDataOps.getTodo(parseInt(request.params.id));
  promise.then(function(data){
    response.send(data);
  }, function (error) {
    response.status(500).send({error: error});
  });
});
```


```
function findAndUpdate(id, isDone) {
  new Promise(function (resolve, reject) {
    todoModel.find({id: id})
      .exec(function (findError, records) {
        if (findError) {
          reject({text: "Record not found", error: findError});
          return;
        }
        resolve(records);
      });
    }).then(function (result) {
      return new Promise(function (resolve, reject) {
        todoModel.update({id: result[0].id},{done: isDone},{multi: false}, function (updateError, updated) {
          if(updateError){
            reject({text:"Error while updating the todo item"},{error: updateError});
          }
          resolve(updated);
        });
    });
  }, function (error) {
    return error;
  });
}
```


-------------------------------------

```
Warning: a promise was created in a handler at internal/process/next_tick.js:180:9 but was not returned from it, see http://goo.gl/rRqMUw
   at model.Query.ret [as execAsync]
    (eval at makeNodePromisifiedEval
    (.../node_modules/bluebird/js/release/promisify.js:184:12), <anonymous>:8:21)
```
   
## mongoose  Promises : bluebird
<http://mongoosejs.com/docs/promises.html>

###  Built-in Promises
Mongoose async operations, like .save() and queries, return Promises/A+ conformant promises. This means that you can do things like MyModel.findOne({}).then() and yield MyModel.findOne({}).exec() (if you're using co).

For backwards compatibility, Mongoose 4 returns `mpromise` promises by default.

### Queries are not promises
Mongoose queries are not promises.
However, they do have a `.then()` function for `yield` and `async/await`.
If you need a fully-fledged promise, use the `.exec()` function.
```
   var query = Band.findOne({name: "Guns N' Roses"});
   assert.ok(!(query instanceof require('mpromise')));

   // A query is not a fully-fledged promise, but it does have a `.then()`.
   query.then(function (doc) {
     // use doc
   });

   // `.exec()` gives you a fully-fledged promise
   var promise = query.exec();
   assert.ok(promise instanceof require('mpromise'));

   promise.then(function (doc) {
     // use doc
   });
 
```
 
### Plugging in your own Promises Library
__New in Mongoose 4.1.0__

While mpromise is sufficient for basic use cases, advanced users may want to plug in their favorite `[ES6-style promises library](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)`  like `[bluebird](https://www.npmjs.com/package/bluebird)`,  or just use `native ES6 promises`.
Just set `mongoose.Promise` to your favorite ES6-style promise constructor and mongoose will use it.

Mongoose tests with `ES6 native promises`, `[bluebird](https://www.npmjs.com/package/bluebird)`, and `[q](https://www.npmjs.com/package/q)`.
```
   var query = Band.findOne({name: "Guns N' Roses"});

   // Use native promises
   mongoose.Promise = global.Promise;
   assert.equal(query.exec().constructor, global.Promise);

   // Use bluebird
   mongoose.Promise = require('bluebird');
   assert.equal(query.exec().constructor, require('bluebird'));

   // Use q. Note that you **must** use `require('q').Promise`.
   mongoose.Promise = require('q').Promise;
   assert.ok(query.exec() instanceof require('q').makePromise);
 ```

### Promises for the MongoDB Driver
The `mongoose.Promise` property sets the promises mongoose uses.
However, this does **not** affect the underlying MongoDB driver.

  If you use the underlying driver, for instance `Model.collection.db.insert()`,
you need to do a little extra work to change the underlying promises library.
_Note that the below code assumes mongoose >= 4.4.4._
```
   var uri = 'mongodb://localhost:27017/mongoose_test';

   // Use bluebird
   var options = { promiseLibrary: require('bluebird') };
   
   var db = mongoose.createConnection(uri, options);

   Band = db.model('band-promises', { name: String });

   db.on('open', function() {
     assert.equal(Band.collection.findOne().constructor, require('bluebird'));
   });
 ```

## Example:
file `server/app.js` :
```
. . .
import config from './config/environment';
import http from 'http';
import mailer from './config/mailer';

import bluebird from 'bluebird';
import mongoose from 'mongoose';

// Use `bluebird` as default Promise Library
mongoose.Promise = bluebird;

// Connect to MongoDB
//console.log('>> mongo.options: '+ JSON.stringify(config.mongo.options))
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
 console.error('MongoDB connection error: ' + err);
 process.exit(-1);
});
```

file `server/config/environment/index.js` :
```
'use strict';
 . . .
 // MongoDB connection options
 // <http://mongodb.github.io/node-mongodb-native/2.2/api/MongoClient.html>
 // - `promiseLibrary`	[object]: A Promise library class the application wishes to use such as Bluebird, must be ES6 compatible
 // - `appname`	[string]: The name of the application that created this MongoClient instance.
 // - `loggerLevel` [string]: The logging level (error/warn/info/debug)
 // - `logger` [object]: Custom logger object
 // - `raw`	[boolean]: default `false`, Return document results as raw BSON buffers.
 //
 // Plugging in your own Promises Library
 // New in Mongoose 4.1.0
 // <http://mongoosejs.com/docs/promises.html>
 //
 mongo: {
   options: {
     useMongoClient: true,
     promiseLibrary: require('bluebird'), // Use `bluebird` as default Promise Library
     loggerLevel: 'debug',
     validateOptions: true
   }
 },
  . . .
```

> MongoDB connection options
> <http://mongodb.github.io/node-mongodb-native/2.2/api/MongoClient.html>
