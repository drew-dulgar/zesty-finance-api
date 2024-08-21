import { Router } from 'express';
import AccountsRoutes from './accounts/AccountsRoutes.mjs';

const router = Router();

router.use('/accounts', AccountsRoutes);

export default router;