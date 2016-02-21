'use strict';

import * as auth from '../../../auth/auth.service';

var express = require('express');
var controller = require('./forum.controller');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.put('/updatePositions', auth.hasRole('admin'), controller.updatePositions);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
//router.get('/posts', auth.hasRole('admin'), controller.recentPosts);

module.exports = router;
