
import type { Request, Response, NextFunction } from 'express';

import AccountService from '../../app/services/AccountService.js';

const accountMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

  req.authenticated = false;
  req.authorized = {
    routes: []
  };
  req.account = null;

  if (req?.session?.account?.id) {
    const account = await AccountService.getWithPlanAndRoles(req.session.account.id);

    if (account) {
      req.authenticated = true;
      req.account = account[0];
    }
  }

  next();

};

export default accountMiddleware;