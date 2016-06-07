/**
 * OptionType model events
 */

'use strict';

import {EventEmitter} from 'events';
var OptionType = require('./optionType.model');
var OptionTypeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
OptionTypeEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  OptionType.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    OptionTypeEvents.emit(event + ':' + doc._id, doc);
    OptionTypeEvents.emit(event, doc);
  }
}

export default OptionTypeEvents;
