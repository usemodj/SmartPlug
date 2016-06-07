'use strict';

var express = require('express');
var controller = require('./taxonomy.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

//router.post('/list', controller.list);
router.post('/position', controller.position);
router.post('/objectId', controller.objectId);

module.exports = router;
