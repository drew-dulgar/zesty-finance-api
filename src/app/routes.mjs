import { Router } from 'express';

import routes from './controllers/index.mjs';
import AppController from './controllers/AppController.mjs';

const initializeRoutes = () => {
  // these are routes that should not run through session or authorization middleware
  const router = Router();

  router.get('/health', AppController.health);
  router.get('/favicon.ico', AppController.favicon);

  return router;
};

const initializeAuthorizedRoutes = () => {
  const router = Router();

  router.use(routes);

  return router;
};


export {
  initializeRoutes,
  initializeAuthorizedRoutes
};