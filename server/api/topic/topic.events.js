/**
 * Topic model events
 */

'use strict';

import {EventEmitter} from 'events';
var Topic = require('./topic.model');
var TopicEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
TopicEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Topic.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    TopicEvents.emit(event + ':' + doc._id, doc);
    TopicEvents.emit(event, doc);
  }
}

export default TopicEvents;
