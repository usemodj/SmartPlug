/**
 * Asset model events
 */

'use strict';

import {EventEmitter} from 'events';
var Asset = require('./asset.model');
var AssetEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AssetEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Asset.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    AssetEvents.emit(event + ':' + doc._id, doc);
    AssetEvents.emit(event, doc);
  }
}

export default AssetEvents;
