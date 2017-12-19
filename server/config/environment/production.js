'use strict';

// Production specific configuration
// =================================
module.exports = {
  //Server Mail
  domain: process.env.DOMAIN || undefined,
  postmailer: process.env.POST_MAILER || undefined,
  dataServiceKey: process.env.DATA_SERVICE_KEY || undefined,

  // Server IP
  ip:     process.env.OPENSHIFT_NODEJS_IP ||
          process.env.IP ||
          undefined,

  // Server port
  port:   process.env.OPENSHIFT_NODEJS_PORT ||
          process.env.PORT ||
          8080,

  // Should we populate the DB with sample data?
  seedDB: false,
  // MongoDB connection options
  // <http://mongodb.github.io/node-mongodb-native/2.2/api/MongoClient.html>
  // - `autoReconnect` [boolean]:	default `true`, Enable autoReconnect for single server instances
  // - `connectTimeoutMS` [number]: default	`30000`, TCP Connection timeout setting
  // - `socketTimeoutMS` [number]: default `360000`, TCP Socket timeout setting
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
    uri: process.env.MONGOLAB_URI ||
         process.env.MONGOHQ_URL ||
         process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME ||
         process.env.MONGO_URI ||
         'mongodb://localhost/smartplug',
    options: {
       useMongoClient: true,
       promiseLibrary: require('bluebird'), // Use `bluebird` as default Promise Library
       logger: require('../winston.logger').logger,
       loggerLevel: 'error',
       validateOptions: true,
       socketTimeoutMS: 360000,
       connectTimeoutMS: 30000
    }
  }
};
