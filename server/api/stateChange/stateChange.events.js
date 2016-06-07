/**
 * StateChange model events
 */

'use strict';

import {EventEmitter} from 'events';
var StateChange = require('./stateChange.model');
var StateChangeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
StateChangeEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  StateChange.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    StateChangeEvents.emit(event + ':' + doc._id, doc);
    StateChangeEvents.emit(event, doc);
  }
}

export default StateChangeEvents;
