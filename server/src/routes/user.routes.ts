import express from 'express';
import * as UserController from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.get('/', requireAuth, UserController.getUserFromSession);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

export default router;
