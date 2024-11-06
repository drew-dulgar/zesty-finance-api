import type { Application } from 'express';

import express from 'express';
import {initializeRoutes, initializeAuthorizedRoutes} from '../app/controllers/routes.js';
import {
  corsMiddleware, 
  error404Middleware, 
  errorHandlerMiddleware,
  inputValidationMiddleware,
  sessionMiddleware,
  accountMiddleware,
  authorizeMiddleware,
  loggerMiddleware,
} from './middleware/index.js';

const initializeApplication = () => {
  const app: Application = express();

  app.use(corsMiddleware);

  app.use(express.json());

  app.use(loggerMiddleware);

  app.use(initializeRoutes());

  app.use(sessionMiddleware);

  app.use(accountMiddleware);
 
  app.use(authorizeMiddleware);

  app.use(initializeAuthorizedRoutes());

  app.use(inputValidationMiddleware);

  app.use(error404Middleware);

  app.use(errorHandlerMiddleware);

  return app;
};

export default initializeApplication;


