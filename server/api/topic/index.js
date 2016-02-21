'use strict';

import * as auth from '../../auth/auth.service';

var express = require('express');
var controller = require('./topic.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/tag/:tag', controller.tagTopics);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.post('/post', auth.isAuthenticated(), controller.addPost);
router.delete('/:id/posts/:post_id', auth.isAuthenticated(), controller.deletePost);
router.post('/:id/posts/:post_id', auth.isAuthenticated(), controller.updatePost);
router.post('/:id/posts/:post_id/removeFile', auth.isAuthenticated(), controller.removeFile);

module.exports = router;
