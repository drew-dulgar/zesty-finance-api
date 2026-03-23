import type { Request, Response, NextFunction } from 'express';
import { requestContext } from '../../app/lib/requestContext.js';

const requestContextMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  requestContext.run(
    {
      ipAddress: req.ip ?? null,
      userAgent: req.headers['user-agent'] ?? null,
    },
    next,
  );
};

export default requestContextMiddleware;
