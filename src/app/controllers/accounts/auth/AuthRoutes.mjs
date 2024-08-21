import { Router } from 'express';
import passport from 'passport';
import AuthController from './AuthController.mjs';

const router = Router();

router.post('/', AuthController.authenticate);


export default router;