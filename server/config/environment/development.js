'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/smartplug-dev',
    debug: true
  },

  // Seed database on startup
  seedDB: true

};
