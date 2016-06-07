/**
 * Shipment model events
 */

'use strict';

import {EventEmitter} from 'events';
var Shipment = require('./shipment.model');
var ShipmentEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ShipmentEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Shipment.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ShipmentEvents.emit(event + ':' + doc._id, doc);
    ShipmentEvents.emit(event, doc);
  }
}

export default ShipmentEvents;
