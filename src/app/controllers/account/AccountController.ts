import type { Request, Response, NextFunction } from 'express';

const get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('account data retrieved');
    res.send({
      authenticated: req.authenticated,
      authorized: req.authorized.actions || {},
      account: req.account
    });
  } catch (error) {
    next(error);
  }
};

export default {
  get,
}
