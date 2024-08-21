import { Router } from 'express';
import AuthRoutes from './auth/AuthRoutes.mjs';
import AccountsController from './AccountsController.mjs';

const router = Router();
router.use('/auth', AuthRoutes);

router.get('/', AccountsController.get);
router.post('/', AccountsController.create);

export default router;