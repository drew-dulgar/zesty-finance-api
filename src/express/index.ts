import { toNodeHandler } from 'better-auth/node';
import type { Application } from 'express';
import express from 'express';
import {
  initializeAuthorizedRoutes,
  initializeRoutes,
} from '../app/controllers/routes.js';
import { auth } from '../config/auth.js';
import {
  accountMiddleware,
  authorizeMiddleware,
  corsMiddleware,
  error404Middleware,
  errorHandlerMiddleware,
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

  app.use(error404Middleware);

  app.use(errorHandlerMiddleware);

  return app;
};

export default initializeApplication;
