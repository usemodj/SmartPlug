'use strict';

import * as auth from '../../../auth/auth.service';
var express = require('express');
var controller = require('./support.controller');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

router.get('/tag/:tag', auth.hasRole('admin'), controller.tagSupports);
router.post('/updateSupport', auth.hasRole('admin'), controller.updateSupport); //multiple file upload
router.post('/:id/removeFile', auth.hasRole('admin'), controller.removeFile);
router.post('/:id/comment', auth.hasRole('admin'), controller.addComment);
router.delete('/:id/comment/:comment_id', auth.hasRole('admin'), controller.deleteComment);
router.post('/:id/comment/:comment_id', auth.hasRole('admin'), controller.saveComment); //edit comment
router.get('/search/:terms', auth.hasRole('admin'), controller.search); //Elasticsearch full-text search

router.post('/:id/close', auth.hasRole('user'), controller.close); //close ticket

module.exports = router;
