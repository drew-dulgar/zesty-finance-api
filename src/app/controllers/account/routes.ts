import { Router } from 'express';
import {
  updateProfileSchema,
  updateUsernameSchema,
} from 'zesty-finance-shared';
import { validate } from '../../../express/middleware/index.js';
import AccountController from './AccountController.js';
import documentsRouter from './documents/routes.js';

const router = Router();

router.get('/', AccountController.get);
router.patch(
  '/',
  validate({ body: updateProfileSchema }),
  AccountController.updateProfile,
);
router.patch(
  '/username',
  validate({ body: updateUsernameSchema }),
  AccountController.updateUsername,
);
router.use('/documents', documentsRouter);

export default router;
