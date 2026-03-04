import { Router } from 'express';
import AccountController from './AccountController.js';

const router = Router();

router.get('/', AccountController.get);
router.post('/', AccountController.create);

export default router;