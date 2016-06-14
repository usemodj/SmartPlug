'use strict';

import User from './user.model';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import paginate from 'node-paginate-anything';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function respondWith(res, statusCode) {
  statusCode = statusCode || 200;
  return function() {
    res.status(statusCode).end();
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  var clientLimit = req.query.clientLimit;
  var email = req.query.email;
  var role = req.query.role;
  var active = req.query.active;
  var where = {};
  if(email) where.email = email;
  if(role) where.role = role;
  if(active || active === false) where.active = active;

  User.countAsync(where)
  .then(count => {
      if(count === 0){
        return [];
      }
      var totalItems = count;
      var maxRangeSize = clientLimit;
      var queryParams = paginate(req, res, totalItems, maxRangeSize);

      return User.where(where).limit(queryParams.limit).skip(queryParams.skip).sort('-created_at').findAsync('-salt -password');
  }).then(users => {
    res.status(200).json(users);
  })
  .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.saveAsync()
    .spread(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  User.findByIdAsync(userId)
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  User.findByIdAndRemoveAsync(req.params.id)
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findByIdAsync(userId)
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.saveAsync()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

export function updateUser(req, res, next){
  var user = req.body.user;
  User.findByIdAndUpdateAsync(user._id, {
    role: user.role,
    active: user.active
  }, {new: true})
  .then(user => {
    res.status(200).json(user);
  })
  .catch(err => {
    res.status(500).json(err.message || err);
  });
}
/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  User.findOneAsync({ _id: userId }, '-salt -password')
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
  res.redirect('/');
}

/**
 * Get forgot password token
 */
export function getForgotPasswordToken(req, res, next){
  var email = req.query.email;
  console.log(email);
  User.findOneAsync({email: email})
    .then(user => {
      if (!user) {
        return res.status(404).json('Your email is not registered.');
      }
      if(user.provider !== 'local'){
        return res.status(404).json(`Your email is connected with social site: ${user.provider}.`);
      }
      user.makePasswordToken(user => {
        user.saveAsync();
        res.json( user);
      });
    })
    .catch(err => {
      //console.log(err.message);
      res.status(500).json(err.message);
    });
}

export function resetPasswordByToken(req, res, next){
  var body = req.body;
  var email = body.email;
  var password = body.password;
  var passwordToken = body.passwordToken;

  User.findOneAsync({
    email: email,
    passwordToken: passwordToken
  })
  .then(user => {
    if (!user) {
      return res.status(404).json('Your email or token is invalid.');
    }
    user.password = password;
    user.passwordToken = undefined;
    return user.saveAsync();
  })
  .then(user => {
    res.status(200).send();
  })
  .catch(err => {
    res.status(500).json(err.message);

  });
}
