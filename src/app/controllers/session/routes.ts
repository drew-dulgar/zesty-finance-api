import { Router } from 'express';
import SessionController from './SessionController.js';

const router = Router();

router.post('/', SessionController.login);
router.delete('/', SessionController.logout);

export default router;