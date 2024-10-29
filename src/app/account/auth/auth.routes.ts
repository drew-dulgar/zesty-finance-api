import { Router } from 'express';
import AuthController from './auth.controller.js';

const router = Router();

router.post('/', AuthController.authenticate);
router.delete('/', AuthController.logout);

export default router;