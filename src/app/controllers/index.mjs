import { Router } from 'express';
import AccountRoutes from './account/index.mjs';

const router = Router();

router.use('/account', AccountRoutes);

export default router;