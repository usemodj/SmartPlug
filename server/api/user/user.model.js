'use strict';

import crypto from 'crypto';
import {Schema} from 'mongoose';
import Comment from '../blog/comment.model';
import {Promise} from 'bluebird';

var mongoose = Promise.promisifyAll(require('mongoose'));
var mongoosastic = Promise.promisifyAll(require('mongoosastic'));
// Use `bluebird` as default Promise Library
mongoose.Promise = Promise;

const CommentSchema = Comment.schema;
const authTypes = ['github', 'twitter', 'facebook', 'google'];

var UserSchema = new Schema({
  name: {type: String, es_type: 'text', es_indexed:true},
  email: {
    type: String, es_type: 'keyword', lowercase: true
  },
  role: {
    type: String, es_type: 'keyword', default: 'user'
  },
  password: {type: String, es_type: 'keyword'},
  comments: {type: Schema.Types.ObjectId, ref: 'Comment',
    es_schema: CommentSchema, es_type: 'object', es_indexed:true, es_select: 'content'
  },
  active: {type: Boolean, default: 'true'},
  provider: {type: String, es_type: 'keyword'},
  salt: {type: String, es_type: 'keyword'},
  passwordToken: {type: String, es_type: 'keyword'},
  facebook: {},
  twitter: {},
  google: {},
  github: {}
});

/**
 * Virtuals
 */

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }
    return email.length > 0;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('password')
  .validate(function(password) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }
    return password.length > 0;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value) {
    var self = this;
    return this.constructor.findOneAsync({ email: value })
      .then(function(user) {
        if (user) {
          if (self.id === user.id) {
            return true;
          }
          return false;
        }
        return true;
      })
      .catch(function(err) {
        throw err;
      });
  }, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length > 0;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    // Handle new/update passwords
    if (!this.isModified('password')) {
      return next();
    }

    if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
      return next(new Error('Invalid password'));
    }

    // Make salt with a callback
    this.makeSalt((saltErr, salt) => {
      if (saltErr) {
        return next(saltErr);
      }
      this.salt = salt;
      this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
        if (encryptErr) {
          return next(encryptErr);
        }
        this.password = hashedPassword;
        return next();
      });
    });

    return null;
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate(password, callback) {
    if(!this.password){
      if(!callback)
        return false;

      return callback('Password field does not exist.');
    }

    if (!callback) {
      return this.password === this.encryptPassword(password);
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if (err) {
        return callback(err);
      }

      if (this.password === pwdGen) {
        return callback(null, true);
      } else {
        return callback(null, false);
      }
    });
    return null;
  },

  /**
   * Make salt
   *
   * @param {Number} byteSize Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt(byteSize, callback) {
    var defaultByteSize = 16;

    if (typeof arguments[0] === 'function') {
      callback = arguments[0];
      byteSize = defaultByteSize;
    } else if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    if (!byteSize) {
      byteSize = defaultByteSize;
    }

    if (!callback) {
      return crypto.randomBytes(byteSize).toString('hex');
    }

    return crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        return callback(err);
      } else {
        return callback(null, salt.toString('hex'));
      }
    });
  },

  makePasswordToken(byteSize, callback){
    var defaultByteSize = 16;
    if(typeof arguments[0] === 'function'){
      callback = arguments[0];
      byteSize = defaultByteSize;
    }else if(typeof arguments[1] === 'function'){
      callback = arguments[1];
    }
    if(!byteSize){
      byteSize = defaultByteSize;
    }

    if(!callback){
      this.passwordToken = this.encryptPassword(this.makeSalt());
      return this;
    }
    // Make forgot password token with a callback
    this.makeSalt((saltErr, salt) => {
      if (saltErr) {
        return callback(saltErr);
      }
      this.passwordToken = salt;
      this.encryptPassword(this.passwordToken, (encryptErr, hashedPassword) => {
        if (encryptErr) {
          return callback(encryptErr);
        }
        this.passwordToken = hashedPassword;
        return callback(this);
      });
    });

    return null;
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword(password, callback) {
    if (!password || !this.salt) {
      return null;
    }

    var defaultIterations = 100000;
    var defaultKeyLength = 64;
    var salt = new Buffer(this.salt, 'hex');

    if (!callback) {
      // Provides a synchronous Password-Based Key Derivation Function 2 (PBKDF2) implementation.
      // <https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest>
      return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, 'sha512')
                   .toString('hex');
    }

    // Provides an asynchronous Password-Based Key Derivation Function 2 (PBKDF2) implementation.
    // <https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2_password_salt_iterations_keylen_digest_callback>
    return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, 'sha512', (err, key) => {
      if (err) {
        return callback(err);
      } else {
        return callback(null, key.toString('hex'));
      }
    });
  }

};


UserSchema.plugin(mongoosastic);
var User = mongoose.model('User', UserSchema);
User.createMapping({
  "settings": {
    "analysis": {
      "analyzer": {
        "kr_analyzer": {
          "type": "custom",
          "tokenizer": "kr_tokenizer",
          "filter": ["trim", "lowercase","english_stop", "en_snow", "kr_filter"]
        }
      },
      "filter": {
        "en_snow": {
          "type": "snowball",
          "language": "English"
        },
        "english_stop": {
          "type":       "stop",
          "stopwords":  "_english_"
        }
      }
    }
  },
  "mappings": {
    "user": {
      "name email": { // all fields
        "analyzer": "kr_analyzer",
        "search_analyzer": "kr_analyzer"
      }
    }
  }
}, (err, mapping) => {
  if(err){
    console.log('error creating mapping (you can safely ignore this)');
    console.log(err);
  }else {
    console.log('mapping created!');
    console.log(mapping);
  }
  return null;
});

export default User;
