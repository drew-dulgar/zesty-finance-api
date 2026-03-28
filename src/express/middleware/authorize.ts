import type { NextFunction, Request, Response } from 'express';

import authorize, { validRoutes } from '../../app/lib/authorize.js';
import { IS_DEVELOPMENT } from '../../config/env.js';
import error404Middleware from '../middleware/error404.js';

const authorizeMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { path, method } = req;
  req.authorized = authorize(req);

  // If '*' is a key in authorized.routes, the user has wildcard access (e.g. admin).
  // Use '*' as the lookup key so the wildcard grant matches any route.
  const route =
    typeof req.authorized.routes['*'] === 'undefined' ? path : '*';
  const methods = req.authorized.routes?.[route] || [];

  // user is authenticated, send 'em on through
  if (
    req.authorized.routes[route] &&
    (methods.includes('*') || methods.includes(method))
  ) {
    return next();
  }

  // route really doesn't exist - 404 handler
  if (
    typeof validRoutes?.[route] === 'undefined' ||
    !validRoutes[route].includes(method)
  ) {
    return error404Middleware(req, res, next);
  }

  if (req.authenticated) {
    res.status(403).json({
      authenticated: req.authenticated,
      authorized: false,
    });
    return;
  }

  // In prod: return 404 (anti-enumeration — don't reveal the route exists to unauthenticated users).
  // In dev: return 401 so it's obvious the request is failing due to missing authentication.
  if (IS_DEVELOPMENT) {
    res.status(401).json({
      authenticated: false,
      authorized: false,
    });
    return;
  }
  return error404Middleware(req, res, next);
};

export default authorizeMiddleware;
