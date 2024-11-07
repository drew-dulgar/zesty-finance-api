
import type { Request, Response, NextFunction } from 'express';

import AccountService from '../../app/services/AccountService.js';

const accountMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

  req.authenticated = false;
  req.account = null;

  if (req?.session?.account?.id) {
    req.authenticated = true;

    const account = await AccountService.getWithPlanAndRoles(req.session.account.id);

    if (account) {
      req.account = account;
    }
  }

  next();
};

export default accountMiddleware;