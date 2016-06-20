'use strict';

// Production specific configuration
// =================================
module.exports = {
  //Server Mail
  domain: process.env.DOMAIN || undefined,
  postmailer: process.env.POST_MAILER || undefined,

  // Server IP
  ip:     process.env.OPENSHIFT_NODEJS_IP ||
          process.env.IP ||
          undefined,

  // Server port
  port:   process.env.OPENSHIFT_NODEJS_PORT ||
          process.env.PORT ||
          8080,

  // MongoDB connection options
  mongo: {
    uri:  process.env.MONGOLAB_URI ||
          process.env.MONGOHQ_URL ||
          process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME ||
          process.env.MONGO_URI ||
          'mongodb://localhost/smartplug'
  }
};
