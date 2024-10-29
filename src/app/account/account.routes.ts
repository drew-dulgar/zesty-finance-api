import { Router } from 'express';
import AuthRoutes from './auth/auth.routes.js';
import AccountController from './account.controller.js';

const router = Router();
router.use('/auth', AuthRoutes);

router.get('/', AccountController.get);
router.post('/', AccountController.create);

export default router;