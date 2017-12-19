/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var PaymentMethodEvents = require('./paymentMethod.events');

// Model events to emit
var events = ['save', 'remove'];

export function register(socket) {
  // Bind model events to socket events
  for (var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener('paymentMethod:' + event, socket);

    PaymentMethodEvents.on(event, listener);
    return socket.on('disconnect', removeListener(event, listener));
  }
}


function createListener(event, socket) {
  return function(doc) {
    return socket.emit(event, doc);
  };
}

function removeListener(event, listener) {
  return function() {
    return PaymentMethodEvents.removeListener(event, listener);
  };
}
