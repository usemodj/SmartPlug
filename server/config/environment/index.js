
'use strict';

var path = require('path');
var _ = require('lodash');
var logger = require('../winston.logger').logger;

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,
  //site url
  domain: process.env.DOMAIN || 'http://localhost:9000',
  postmailer: process.env.POST_MAILER || 'postmaster@nodesoft.co.kr',
  dataServiceKey: process.env.DATA_SERVICE_KEY || undefined,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Path file upload
  uploadPath: path.normalize(__dirname + '/../../../client/assets/upload/'),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'smart-plug-secret'
  },

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
    options: {
      useMongoClient: true,
      promiseLibrary: require('bluebird'), // Use `bluebird` as default Promise Library
      logger: logger,
      loggerLevel: 'error',
      validateOptions: true,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000
    }
  },

  facebook: {
    clientID:     process.env.FACEBOOK_ID || 'id',
    clientSecret: process.env.FACEBOOK_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/facebook/callback'
  },

  twitter: {
    clientID:     process.env.TWITTER_ID || 'id',
    clientSecret: process.env.TWITTER_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/twitter/callback'
  },

  google: {
    clientID:     process.env.GOOGLE_ID || 'id',
    clientSecret: process.env.GOOGLE_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/google/callback'
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./shared'),
  require('./' + process.env.NODE_ENV + '.js') || {});
