import type { Request, Response, NextFunction } from 'express';

import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../../config/auth.js';
import { AccountsRolesRepository } from '../../app/repositories/index.js';

const accountMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

  req.authenticated = false;
  req.account = null;

  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });

  if (session?.user) {
    req.authenticated = true;
    const roles = await AccountsRolesRepository.getByAccountId(session.user.id);
    req.account = { ...session.user, roles };
  }

  next();
};

export default accountMiddleware;
