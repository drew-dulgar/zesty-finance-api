import { Router } from 'express';
import AuthController from './AuthController.mjs';

const router = Router();

router.post('/', AuthController.authenticate);
router.delete('/', AuthController.logout);


export default router;