
import type { Request, Response, NextFunction } from 'express';

import authorize, { validRoutes } from '../../app/lib/authorize.js';
import error404Middleware from '../middleware/error404.js';

const authorizeMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { originalUrl, method } = req;
  req.authorized = authorize(req);

  const route = typeof req.authorized.routes['*'] === 'undefined' ? originalUrl : '*';
  const methods = req.authorized.routes?.[route] || [];

  // user is authenticated, send 'em on through
  if (req.authorized.routes[route] && (methods.includes('*') || methods.includes(method))) {
    return next();
  }

  // 404 handler
  if (typeof validRoutes?.[route] === 'undefined' || !validRoutes[route].includes(method)) {
    return error404Middleware(req, res, next);
  }

  if (req.authenticated) {
    return res.status(403).json({
      authenticated: req.authenticated,
      authorized: false
    });
  }

  return res.status(401).json({
    authenticated: req.authenticated,
  });
};

export default authorizeMiddleware;