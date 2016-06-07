/**
 * Address model events
 */

'use strict';

import {EventEmitter} from 'events';
var Address = require('./address.model');
var AddressEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AddressEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Address.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    AddressEvents.emit(event + ':' + doc._id, doc);
    AddressEvents.emit(event, doc);
  }
}

export default AddressEvents;
