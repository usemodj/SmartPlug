'use strict';

// Development specific configuration
// ==================================
module.exports = {
  //site url
  domain: 'http://localhost:9000',
  postmailer: 'postmaster@nodesoft.co.kr',

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/smartplug-dev',
    debug: true
  },

  // Seed database on startup
  seedDB: true

};
