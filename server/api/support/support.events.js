/**
 * Support model events
 */

'use strict';

import {EventEmitter} from 'events';
var Support = require('./support.model');
var SupportEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
SupportEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Support.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    SupportEvents.emit(event + ':' + doc._id, doc);
    SupportEvents.emit(event, doc);
  }
}

export default SupportEvents;
