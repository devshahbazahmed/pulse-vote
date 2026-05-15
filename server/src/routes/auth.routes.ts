import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/authenticate', authController.authenticatController);

router.post('/authenticate/sign-in', authController.signinController);

router.post('/authenticate/sign-up', authController.signupController);

router.get('/userinfo', authenticateUser, authController.userinfoController);

export default router;
