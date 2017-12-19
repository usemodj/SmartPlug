/**
 * Main application file
 */

'use strict';

import express from 'express';
import config from './config/environment';
import http from 'http';
import mailer from './config/mailer';
import mongoose from 'mongoose';
import {Promise} from 'bluebird';

// fix for event emitters / memory leak error
// https://github.com/npm/npm/issues/13806
require('events').EventEmitter.defaultMaxListeners = Infinity;

// change mongoose to use NodeJS global promises to supress promise deprication warning.
// and to use NodeJS's Promises.
// https://github.com/Automattic/mongoose/issues/4291
// mongoose.Promise = global.Promise;

// Use `bluebird` as default Promise Library
mongoose.Promise = Promise;

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
// Connect to MongoDB:
// if mongoose connection disconnected, connect to it.
// if(mongoose.connection.readyState == 0){
//   mongoose.connect(url, {
//     useMongoClient: true,
//     socketTimeoutMS: 0,
//     connectTimeoutMS: 30000
//   });
// }
//
// if this process has been signaled to end
// close the connection to mongodb
// process.on('SIGINT', () => {
//   mongoose.connection.close( () => {
//     console.log('Process ending, closing connection to mongodb');
//     process.exit(0);
//   });
// });
//
if(mongoose.connection.readyState === 0){
  mongoose.connect(config.mongo.uri, config.mongo.options);

  mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
  });
  // if this process has been signaled to end
  // close the connection to mongodb
  process.on('SIGINT', () => {
    mongoose.connection.close( () => {
      console.log('Process ending, closing connection to mongodb');
      process.exit(0);
    });
  });
}


// Populate databases with sample data
if (config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = http.createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
var env = app.get('env');
// Populate databases with admin user
if ('production' === env) {require('./config/seed.admin');}

// Setup Mailer
app.use(function(req, res, next){
  mailer(function(transport){
    req.transport = transport;
    return next();
  });
});

require('./config/socketio')(socketio);
require('./config/express')(app);
require('./config/http.morgan.logger')(app);
require('./routes')(app);
//job scheduler
require('./schedule')(config);

//  Avoids DEPTH_ZERO_SELF_SIGNED_CERT error
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Start server
function startServer() {
  server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app; // To import: import app from './app'; Or, var app = require('./app');
// export default app;  // To import:  import app from './app'; Or, var app = require('./app').default;
