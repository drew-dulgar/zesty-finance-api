import { Router } from 'express';
import AppController from './AppController.js';
import AccountRoutes from './account/routes.js';

const initializeRoutes = () => {
  // these are routes that should not run through session or authorization middleware
  const router = Router();

  router.get('/health', AppController.health);
  router.get('/favicon.ico', AppController.favicon);

  return router;
};

const initializeAuthorizedRoutes = () => {
  const router = Router();

  router.use('/account', AccountRoutes);

  return router;
};


export {
  initializeRoutes,
  initializeAuthorizedRoutes
};