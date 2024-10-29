
import type { IRequest, IResponse, INextFunction } from '../index.js';
import authorize from '../../config/authorize.js';

const authorizeMiddleware = async (req: IRequest, res: IResponse, next: INextFunction): Promise<any> => {

  next();
  /*
  const { user, originalUrl, method } = req;
  const authorized = authorize(user?.account);

  if (!req?.user) {
    req.user = {};
  }

  req.authenticated = authorized.authenticated;
  req.authorized = {
    routes: authorized.routes,
    actions: authorized.actions
  };

  const route = typeof req.authorized.routes['*'] === 'undefined' ? originalUrl : '*';
  const methods = req.authorized.routes?.[route] || [];

  // has access
  if (
    // user is authenticated
    (req.authorized.routes[route] && (methods.includes('*') || methods.includes(method))
    // route doesn't actually exist so we want to send 'em on to the 404 handler
    || (typeof validRoutes?.[route] === 'undefined' || !validRoutes[route].includes(method))
  )) {
    return next();
  }

  if (req.user.authenticated) {
    return res.status(403).json({
      authorized: false
    });
  }

  return res.status(401).json({
    authenticated: false,
  });
  */
};

export default authorizeMiddleware;