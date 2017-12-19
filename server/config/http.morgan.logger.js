'use strict';
// `morgan`
//   HTTP request logger middleware for node.js
//   [expressjs/morgan](https://github.com/expressjs/morgan)
//
// ## log file rotation :
// Simple app that will log all requests in the Apache combined format
// to one log file per day in the log/ directory using the rotating-file-stream module.
//
// ## split / dual logging :
// The morgan middleware can be used as many times as needed,
// enabling combinations like:
//
//     Log entry on request and one on response
//     Log all requests to file, but errors to console
//     ... and more!
//
// Sample app that will log all requests to a file using Apache format,
// but error responses are logged to the console:
//
// ## Predefined Formats
//  There are various _pre-defined_ `formats` provided:
//
// * `combined` : Standard Apache combined log output.
// ```
// :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
// ```
//
// * `common` : Standard Apache common log output.
// ```
// :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]
// ```
//
// * `dev` : Concise output colored by response status for development use. The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
// ```
// :method :url :status :response-time ms - :res[content-length]
// ```
//
// * `short` : Shorter than default, also including response time.
// ```
// :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms
// ```
//
// * `tiny` : The minimal output.
// ```
// :method :url :status :res[content-length] - :response-time ms
// ```
//
var fs = require('fs');
var morgan = require('morgan');
var path = require('path');
var rfs = require('rotating-file-stream');
var logDirectory = path.join(__dirname, '../log');

export default function(app) {
  // ensure log directory exists
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

  // create a rotating write stream
  var accessLogStream = rfs('access-morgan.log', {
    interval: '1d', // rotate daily
    path: logDirectory
  })

  // setup the logger:
  // log responses to `console`
  app.use(morgan('dev', {
    // log only 4xx and 5xx responses to console
    // skip: function (req, res) { return res.statusCode < 400 }
  }));
  // log all requests to `access.log`
  app.use(morgan('combined', {
    stream: accessLogStream
  }));

}
