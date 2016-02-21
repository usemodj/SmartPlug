'use strict';

var express = require('express');
var controller = require('./blog.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/tag/:tag', controller.tagBlogs);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.post('/updateBlog', auth.hasRole('admin'), controller.updateBlog); //multiple file upload
router.post('/:id/removeFile', auth.isAuthenticated(), controller.removeFile);
router.post('/:id/comment', auth.isAuthenticated(), controller.addComment);
router.delete('/:id/comment/:comment_id', auth.isAuthenticated(), controller.deleteComment);
router.post('/:id/comment/:comment_id', auth.isAuthenticated(), controller.saveComment); //edit comment
router.get('/search/:terms', controller.search); //Elasticsearch full-text search

module.exports = router;
