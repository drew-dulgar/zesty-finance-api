import { Router } from 'express';
import { NPM_PACKAGE_VERSION } from './config/env.mjs';
import routes from './controllers/routes.mjs';

const router = Router();

router.use(routes);

routes.get('/health', (request, response, next) => {
  response.status(200).json({
    version: NPM_PACKAGE_VERSION,
  });
})

export default router;