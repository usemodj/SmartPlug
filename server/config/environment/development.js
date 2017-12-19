'use strict';

// Development specific configuration
// ==================================
module.exports = {
  //site url
  domain: 'http://localhost:9000',
  postmailer: 'postmaster@nodesoft.co.kr',

  // MongoDB connection options
  // <http://mongodb.github.io/node-mongodb-native/2.2/api/MongoClient.html>
  // - `promiseLibrary`	[object]: A Promise library class the application wishes to use such as Bluebird, must be ES6 compatible
  // - `appname`	[string]: The name of the application that created this MongoClient instance.
  // - `loggerLevel` [string]: The logging level (error/warn/info/debug)
  // - `logger` [object]: Custom logger object
  // - `raw`	[boolean]: default `false`, Return document results as raw BSON buffers.
  // - `logger`	[object]: Custom logger object
  //
  // Plugging in your own Promises Library
  // New in Mongoose 4.1.0
  // <http://mongoosejs.com/docs/promises.html>
  //
  mongo: {
    uri: 'mongodb://localhost/smartplug-dev',
    options: {
      useMongoClient: true,
      promiseLibrary: require('bluebird'),
      loggerLevel: 'info',
      validateOptions: true,
      socketTimeoutMS: 0,
      connectTimeoutMS: 30000
    }
  },

  // Seed database on startup
  seedDB: true

};
