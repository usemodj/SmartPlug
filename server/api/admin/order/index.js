'use strict';

import * as auth from '../../../auth/auth.service';
var express = require('express');
var controller = require('./order.controller');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

router.post('/:id/state', auth.hasRole('admin'), controller.state);
router.post('/:id/paid', auth.hasRole('admin'), controller.paid);
router.post('/:id/shipped', auth.hasRole('admin'), controller.shipped);
router.get('/:id/stateChanges', auth.hasRole('admin'), controller.stateChanges);

module.exports = router;
