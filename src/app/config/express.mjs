
import express from 'express';
import session from 'express-session';
import { ConnectSessionKnexStore } from 'connect-session-knex';
import cors from 'cors';
import {initializeRoutes, initializeAuthorizedRoutes} from '../routes.mjs';
import passport from './passport.mjs';
import logger from './logger.mjs';
import { ENVIRONMENT, APP_ORIGIN_URL, SECRET_SESSION } from './env.mjs';
import { clients } from './db.mjs';
import authorizeMiddleware from '../middleware/authorize.mjs';
import loggerMiddleware from '../middleware/logger.mjs';

const isProduction = ENVIRONMENT === 'production';
let app;

const initializeApp = () => {
  app = express();

  app.use(cors({
    origin: APP_ORIGIN_URL,
    methods: ['POST', 'PUT', 'PATCH', 'GET', 'DELETE', 'OPTIONS', 'HEAD'],
    credentials: true,
  }));

  app.use(express.json());

  app.use(loggerMiddleware);

  app.use(initializeRoutes());

  // Session handling
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

  app.use(authorizeMiddleware);

  app.use(initializeAuthorizedRoutes())

  app.use((req, res) => {
    res.status(404).json({
      status: 404,
      message: 'The requested resource could not be found.'
    })
  })

  // Final error handler
  app.use((error, request, response, next) => {
    // log error?
    logger.error(error);

    if (ENVIRONMENT === 'production') {
      response.status(500).json({
        status: 500,
        message: 'Whoops, looks like something went wrong!'
      });

    } else {
      response.status(500).json({
        status: 500,
        error: error?.message || '',
        stack: (error?.stack || '').split('\n'),
      });
    }
  });

  return app;
};

export default app;
export { initializeApp };