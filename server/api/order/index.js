'use strict';

var express = require('express');
var controller = require('./order.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.hasRole('user'), controller.index);
router.get('/:id', auth.hasRole('user'), controller.show);
router.post('/', auth.hasRole('user'), controller.create);
router.put('/:id', auth.hasRole('user'), controller.update);
router.patch('/:id', auth.hasRole('user'), controller.update);
router.delete('/:id', auth.hasRole('user'), controller.destroy);

router.post('/:id/state', auth.hasRole('user'), controller.state);
router.post('/:id/address', auth.hasRole('user'), controller.address);
router.post('/:id/shipping', auth.hasRole('user'), controller.shipping);
router.post('/:id/payment', auth.hasRole('user'), controller.payment);
router.post('/:id/confirm', auth.hasRole('user'), controller.confirm);
router.post('/updatePayment', auth.hasRole('user'), controller.updatePayment);

module.exports = router;
