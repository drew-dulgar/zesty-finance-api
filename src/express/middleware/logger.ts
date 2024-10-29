import type { IRequest, IResponse, INextFunction } from '../index.js';
import logger from '../../config/logger.js';

const loggerMiddleware = (req: IRequest, res: IResponse, next: INextFunction): void => {
  res.on('finish', () => {
    logger.http(`${req.method} ${req.originalUrl} [${res.statusCode}]`);
  });

  next();
};

export default loggerMiddleware;