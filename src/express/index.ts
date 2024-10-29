
import type { Request, Response, NextFunction, Application } from 'express';
import type { AccountSelectable } from '../app/zesty-finance-db.types.js';

export interface IRequest extends Request {
  user?: {
    account: AccountSelectable;
  }
  authenticated?: boolean;
  authorized?: {
    routes: string[];
  }
}

export interface IResponse extends Response {};
export interface INextFunction extends NextFunction {};

import express from 'express';
import session from 'express-session';
import cors from 'cors';
import {initializeRoutes, initializeAuthorizedRoutes} from '../app/app.routes.js';

import logger from '../config/logger.js';
import { IS_PRODUCTION, APP_ORIGIN_URL, SECRET_SESSION } from '../config/env.js';
import authorizeMiddleware from './middleware/authorize.js';
import loggerMiddleware from './middleware/logger.js';

const initializeApplication = () => {
  const app: Application = express();

  app.use(cors({
    origin: APP_ORIGIN_URL,
    methods: ['POST', 'PUT', 'PATCH', 'GET', 'DELETE', 'OPTIONS', 'HEAD'],
    credentials: true
  }));

  app.use(express.json());

  app.use(loggerMiddleware);

  app.use(initializeRoutes());

  // Session handling
  /*
  const sessionStore = new ConnectSessionKnexStore({
    knex: clients.zestyDb,
    tableName: 'sessions'
  });

  app.use(session({
    store: sessionStore,
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: '/',
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : false,
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    },
    rolling: true
  }));

  app.use(passport.session());
  */
 
  app.use(authorizeMiddleware);

  app.use(initializeAuthorizedRoutes())

  app.use((req, res) => {
    res.status(404).json({
      status: 404,
      message: 'The requested resource could not be found.'
    })
  })

  // Final error handler
  app.use((error: any, req: IRequest, res: IResponse, next: INextFunction): void => {
    // log error?
    logger.error(error);

    if (IS_PRODUCTION) {
      res.status(500).json({
        status: 500,
        message: 'Whoops, looks like something went wrong!'
      });

    } else {
      res.status(500).json({
        status: 500,
        error: error?.message || '',
        stack: (error?.stack || '').split('\n')
      });
    }
  });

  return app;
};

export default initializeApplication;


