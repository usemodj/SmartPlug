'use strict';

import * as auth from '../../../auth/auth.service';

var express = require('express');
var controller = require('./topic.controller');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.post('/post', auth.isAuthenticated(), controller.addPost);
router.delete('/:id/posts/:post_id', auth.isAuthenticated(), controller.deletePost);
router.post('/:id/posts/:post_id', auth.isAuthenticated(), controller.updatePost);
router.post('/:id/posts/:post_id/removeFile', auth.isAuthenticated(), controller.removeFile);

module.exports = router;
