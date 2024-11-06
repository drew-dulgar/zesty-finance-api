import type { Request, Response, NextFunction } from 'express';

import logger from '../../app/lib/logger.js';

const loggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.on('finish', () => {
    logger.http(`${req.method} ${req.originalUrl} [${res.statusCode}]`);
  });

  next();
};

export default loggerMiddleware;