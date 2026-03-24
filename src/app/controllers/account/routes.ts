import { Router } from 'express';
import { updateUserSchema, updateUsernameSchema } from 'zesty-finance-shared';
import { validate } from '../../../express/middleware/index.js';
import AccountController from './AccountController.js';

const router = Router();

router.get('/', AccountController.get);
router.patch('/', validate({ body: updateUserSchema }), AccountController.updateProfile);
router.patch('/username', validate({ body: updateUsernameSchema }), AccountController.updateUsername);

export default router;
