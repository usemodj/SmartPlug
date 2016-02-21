'use strict';

var express = require('express');
var controller = require('./forum.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.get('/search/:terms', controller.search);
router.get('/posts/recent', controller.recentPosts);

module.exports = router;
