/**
 * Taxon model events
 */

'use strict';

import {EventEmitter} from 'events';
var Taxon = require('./taxon.model');
var TaxonEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
TaxonEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Taxon.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    TaxonEvents.emit(event + ':' + doc._id, doc);
    TaxonEvents.emit(event, doc);
  }
}

export default TaxonEvents;
