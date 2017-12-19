
## A MongoDB `transport` for `winston`

* [winstonjs/winston-mongodb](https://github.com/winstonjs/winston-mongodb)
  A MongoDB `transport` for `winston`.
  
* [winstonjs/winston](https://github.com/winstonjs/winston)
  A logger for just about everything.
  `winston` is designed to be a simple and universal logging library
  with support for multiple transports.
  A `transport` is essentially a _storage device_ for your logs.

### Installation :
```
# `npm install winston`
$ yarn add winston --save

# `npm install winston-mongodb`
$ yarn add winston-mongodb --save
```
  
### Usage :
```
// var winston = require('winston');
import winston from 'winston';

/**
 * Requiring `winston-mongodb` will expose
 * `winston.transports.MongoDB`
 */
// require('winston-mongodb');
import winstonMongodb from 'winston-mongodb';

// MongoDB transport options:
var options = {
  db: 'mongodb://localhost/smartplug-dev',
  level: 'info',
};
winston.add(winston.transports.MongoDB, options);
```

> The MongoDB transport takes the following ___options___.
> _`db`_ is _required_:
>
> - `level`: Level of messages that this transport should log, defaults to 'info'.
> - `silent`: Boolean flag indicating whether to suppress output, defaults to false.
> - `db`: MongoDB connection uri, pre-connected db object or promise object which will be resolved with pre-connected db object.
> - `options`: MongoDB connection parameters (optional, defaults to {poolSize: 2, autoReconnect: true}).
> - `collection`: The name of the collection you want to store log messages in, defaults to 'log'.
> - `storeHost`: Boolean indicating if you want to store machine hostname in logs entry, if set to true it populates MongoDB entry with 'hostname' field, which stores os.hostname() value.
> - `label`: Label stored with entry object if defined.
> - `name`: Transport instance identifier. Useful if you need to create multiple MongoDB transports.
> - `capped`: In case this property is true, winston-mongodb will try to create new log collection as capped, defaults to false.
> - `cappedSize`: Size of logs capped collection in bytes, defaults to 10000000.
> - `cappedMax`: Size of logs capped collection in number of documents.
> - `tryReconnect`: Will try to reconnect to the database in case of fail during initialization. Works only if db is a string. Defaults to false.
> - `decolorize`: Will remove color attributes from the log entry message, defaults to false.
> - `expireAfterSeconds`: Seconds before the entry is removed. Works only if capped is not set.
