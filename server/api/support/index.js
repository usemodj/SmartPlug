'use strict';

import * as auth from '../../auth/auth.service';
var express = require('express');
var controller = require('./support.controller');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

router.get('/tag/:tag', auth.isAuthenticated(), controller.tagSupports);
router.post('/updateSupport', auth.isAuthenticated(), controller.updateSupport); //multiple file upload
router.post('/:id/removeFile', auth.isAuthenticated(), controller.removeFile);
router.post('/:id/comment', auth.isAuthenticated(), controller.addComment);
router.delete('/:id/comment/:comment_id', auth.isAuthenticated(), controller.deleteComment);
router.post('/:id/comment/:comment_id', auth.isAuthenticated(), controller.saveComment); //edit comment
router.get('/search/:terms', auth.isAuthenticated(), controller.search); //Elasticsearch full-text search

module.exports = router;
