import { Router } from 'express';
import AuthRoutes from './auth/index.mjs';
import AccountController from './AccountController.mjs';

const router = Router();
router.use('/auth', AuthRoutes);

router.get('/', AccountController.get);
router.post('/', AccountController.create);

export default router;