/**
 * Main application file
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import config from './config/environment';
import http from 'http';
import mailer from './config/mailer';

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

// Populate databases with sample data
if (config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = http.createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});

// Setup Mailer
app.use(function(req, res, next){
  mailer(function(transport){
    req.transport = transport;
    return next();
  });
});

require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

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
//exports = module.exports = app;
export default app;
