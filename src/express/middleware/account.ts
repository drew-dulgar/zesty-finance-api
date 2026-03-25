import { fromNodeHeaders } from 'better-auth/node';
import type { NextFunction, Request, Response } from 'express';
import { requestContext } from '../../app/lib/requestContext.js';
import { AccountsRolesRepository } from '../../app/repositories/index.js';
import { auth } from '../../config/auth.js';

const accountMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const ctx = requestContext.getStore();
    req.authenticated = false;
    req.account = null;

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session?.user) {
      req.authenticated = true;
      const roles = await AccountsRolesRepository.getByAccountId(
        session.user.id,
      );
      req.account = { ...session.user, roles };

      if (ctx) {
        ctx.actorId = session.user.id;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default accountMiddleware;
