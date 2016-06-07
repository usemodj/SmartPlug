/**
 * OrderItem model events
 */

'use strict';

import {EventEmitter} from 'events';
var OrderItem = require('./orderItem.model');
var OrderItemEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
OrderItemEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  OrderItem.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    OrderItemEvents.emit(event + ':' + doc._id, doc);
    OrderItemEvents.emit(event, doc);
  }
}

export default OrderItemEvents;
