import { Router } from 'express';
import AuthRoutes from './auth/routes.js';
import AccountController from './AccountController.js';

const router = Router();
router.use('/auth', AuthRoutes);

router.get('/', AccountController.get);
router.post('/', AccountController.create);

export default router;