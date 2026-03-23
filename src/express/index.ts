import type { Application } from 'express';

import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../config/auth.js';
import {initializeRoutes, initializeAuthorizedRoutes} from '../app/controllers/routes.js';
import {
  corsMiddleware,
  error404Middleware,
  errorHandlerMiddleware,
  inputValidationMiddleware,
  accountMiddleware,
  authorizeMiddleware,
  loggerMiddleware,
  requestContextMiddleware,
} from './middleware/index.js';

const initializeApplication = () => {
  const app: Application = express();

  app.use(corsMiddleware);

  app.use(requestContextMiddleware);

  app.all('/auth/*', toNodeHandler(auth));

  app.use(express.json());

  app.use(loggerMiddleware);

  app.use(initializeRoutes());

  app.use(accountMiddleware);

  app.use(authorizeMiddleware);

  app.use(initializeAuthorizedRoutes());

  app.use(inputValidationMiddleware);

  app.use(error404Middleware);

  app.use(errorHandlerMiddleware);

  return app;
};

export default initializeApplication;


