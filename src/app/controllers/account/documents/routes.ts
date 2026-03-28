import { Router } from 'express';
import AccountDocumentsController from './AccountDocumentsController.js';

const router = Router();

router.get('/', AccountDocumentsController.get);
router.post('/accept', AccountDocumentsController.accept);

export default router;
