'use strict';

import * as auth from '../../auth/auth.service';
var express = require('express');
var controller = require('./cart.controller');

var router = express.Router();

router.get('/', auth.hasRole('user'), controller.index);
router.get('/checkout', auth.hasRole('user'), controller.checkout);
router.get('/:id', auth.hasRole('user'), controller.show);
router.post('/', auth.hasRole('user'), controller.create);
//router.put('/:id', auth.hasRole('user'), controller.update);
router.put('/', auth.hasRole('user'), controller.update);
router.patch('/:id', auth.hasRole('user'), controller.update);
router.delete('/:id', auth.hasRole('user'), controller.destroy);

module.exports = router;
