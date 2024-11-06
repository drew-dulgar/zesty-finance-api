import type { Request, Response, NextFunction } from 'express';

import logger from '../../app/lib/logger.js';
import { IS_PRODUCTION } from '../../config/env.js';

const errorHandlerMiddleware = (error: any, req: Request, res: Response, next: NextFunction): void => {
  // log error?

  logger.error(error);
  
  if (IS_PRODUCTION) {
    res.status(500).json({
      status: 500,
      message: 'Whoops, looks like something went wrong!'
    });

  } else {
    res.status(500).json({
      status: 500,
      error: error?.message || '',
      stack: (error?.stack || '').split('\n')
    });
  }
}

export default errorHandlerMiddleware;