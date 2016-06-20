'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.post('/updateUser', auth.hasRole('admin'), controller.updateUser);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.get('/token/forgotPassword', controller.getForgotPasswordToken);
router.put('/token/resetPassword', controller.resetPasswordByToken);
router.get('/token/mailForgotPasswordToken', controller.mailForgotPasswordToken);

export default router;
