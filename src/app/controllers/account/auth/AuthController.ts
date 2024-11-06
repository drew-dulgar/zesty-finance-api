import type { Request, Response, NextFunction } from 'express';

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {

  } catch (error) {
    next(error);
  }
}

const logout = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

export default {
  authenticate,
  logout
}