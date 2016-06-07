/**
 * Taxonomy model events
 */

'use strict';

import {EventEmitter} from 'events';
var Taxonomy = require('./taxonomy.model');
var TaxonomyEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
TaxonomyEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Taxonomy.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    TaxonomyEvents.emit(event + ':' + doc._id, doc);
    TaxonomyEvents.emit(event, doc);
  }
}

export default TaxonomyEvents;
