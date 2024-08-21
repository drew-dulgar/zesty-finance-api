
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import passport from './passport.mjs';
import routes from '../routes.mjs';
import { ENVIRONMENT, SECRET_SESSION } from './env.mjs';
import logger from './logger.mjs';

let app;

const initializeApp = () => {
  app = express();

  app.use(cors({
    origin: ENVIRONMENT === 'production' ? 'produrl' : 'http://localhost:5173',
    methods: ['POST', 'PUT', 'PATCH', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true,
  }));

  app.use(express.json());

  app.use(session({
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: '/',
      httpOnly: true,
      secure: ENVIRONMENT === 'production',
      sameSite: ENVIRONMENT === 'production' ? 'strict' : false,
      //maxAge: '',
    }
  }));

  app.use(passport.session());

  app.use(routes);

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