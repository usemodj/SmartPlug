'use strict';

// Test specific configuration
// ===========================
module.exports = {
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
    uri: 'mongodb://localhost/smartplug-test',
    options: {
      useMongoClient: true,
      promiseLibrary: require('bluebird'),
      loggerLevel: 'info',
      validateOptions: true,
      socketTimeoutMS: 0,
      connectTimeoutMS: 30000
    }
  },

  sequelize: {
    uri: 'sqlite://',
    options: {
      logging: false,
      storage: 'test.sqlite',
      define: {
        timestamps: false
      }
    }
  }
};
