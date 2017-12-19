'use strict';

// ## A MongoDB `transport` for `winston`
//
// * [winstonjs/winston-mongodb](https://github.com/winstonjs/winston-mongodb)
//   A MongoDB `transport` for `winston`.
//
// * [winstonjs/winston](https://github.com/winstonjs/winston)
//   A logger for just about everything.
//   `winston` is designed to be a simple and universal logging library
//   with support for multiple transports.
//   A `transport` is essentially a _storage device_ for your logs.
//
// ### Installation :
// ```
// # `npm install winston`
// $ yarn add winston --save
//
// # `npm install winston-mongodb`
// $ yarn add winston-mongodb --save
// ```
//
// ### Usage :
// ```
// // var winston = require('winston');
// import winston from 'winston';
//
// /**
//  * Requiring `winston-mongodb` will expose
//  * `winston.transports.MongoDB`
//  */
// // require('winston-mongodb');
// import winstonMongodb from 'winston-mongodb';
//
// // MongoDB transport options:
// var options = {
//   db: 'mongodb://localhost/smartplug-dev',
//   level: 'info',
// };
// winston.add(winston.transports.MongoDB, options);
// ```

import winston from 'winston';
require('winston-daily-rotate-file');

var fs = require('fs');
var path = require('path');
var logDirectory = path.join(__dirname, '../log');

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
// A transport for winston which logs to a rotating file each day.
  var dailyRotateTransport = new (winston.transports.DailyRotateFile)({
    filename: path.join(logDirectory, 'combined-winston.log'),
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    level: process.env.ENV === 'development' ? 'debug' : 'info'
  });

// ## Formatting options Of Upgrading to winston@3.0.0
//  `yarn add winston@next --save`
//
// `winston.Logger` has been replaced with `winston.createLogger`.
//
//  Default output format is now `formats.json()`.
//
// <https://github.com/winstonjs/winston/blob/master/UPGRADE-3.0.md#formatting-options>
// <https://github.com/winstonjs/winston/blob/3.0.0-rc1/3.0.0.md>
//
// winston@3.0.0 Formats :
// - `winston.format.colorize()` format.
// - `winston.format.prettyPrint()` format.
// - `winston.format.uncolorize()` format.
// - `winston.format.logstash()` format.
// - `winston.format.cli()`
// - String interpolation (i.e. `splat`) via format
// - Use of different formats across multiple Transports.
//    e.g.:
//    ** Colors on `Console`
//    ** Not on `File`
// - Mutable levels on `info` objects – Use `triple-beam` and `Symbol.for('level')`.
//    ** Needed for `winston.formats.colorize()`.
// - Quieter finalized output using `Symbol.for('message')`
// - Filtering messages completely in a format.
//
let logger = new(winston.createLogger)({
// let logger = exports.logger = new (winston.Logger)({
  level: 'info',
  // format: winston.format.json(),
  format: winston.format.prettyPrint(),
  transports: [
    // A transport for winston which logs to a rotating file each day.
    dailyRotateTransport
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    // new winston.transports.File({ filename: 'error-winston.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined-winston.log' })
  ]
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    level: 'info',
    // format: winston.format.json()
    format: winston.format.prettyPrint()
  }));
}

exports = module.exports = logger;
