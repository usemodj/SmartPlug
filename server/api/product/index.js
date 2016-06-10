'use strict';

import * as auth from '../../auth/auth.service';
var express = require('express');
var controller = require('./product.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/list', auth.hasRole('admin'), controller.list); //Admin
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

router.get('/:id/view', controller.view);
router.post('/clone', auth.hasRole('admin'), controller.clone);

module.exports = router;
