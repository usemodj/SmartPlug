/**
 * Forum model events
 */

'use strict';

import {EventEmitter} from 'events';
var Forum = require('./forum.model');
var ForumEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ForumEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Forum.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ForumEvents.emit(event + ':' + doc._id, doc);
    ForumEvents.emit(event, doc);
  }
}

export default ForumEvents;
