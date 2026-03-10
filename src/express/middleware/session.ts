import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { zestyFinancePool } from '../../db/zesty-finance-db.js';
import { IS_PRODUCTION, SECRET_SESSION } from '../../config/env.js';

const pgSession = connectPgSimple(session);

const sessionMiddleware = session({
  store: new pgSession({
    pool: zestyFinancePool,
    tableName : 'sessions'
  }),
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? 'strict' : 'lax',
    maxAge: 1 * 60 * 60 * 1000, // 1 hour
  },
  rolling: true
});

export default sessionMiddleware;

