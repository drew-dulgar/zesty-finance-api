import type { NextFunction, Request, Response } from 'express';

import logger from '../../app/lib/logger.js';
import { IS_PRODUCTION } from '../../config/env.js';

const errorHandlerMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // log error?

  logger.error(error);

  if (IS_PRODUCTION) {
    res.status(500).json({
      status: 500,
      message: 'Whoops, looks like something went wrong!',
    });
  } else {
    const message = error instanceof Error ? error.message : '';
    const stack = error instanceof Error ? (error.stack ?? '') : '';
    res.status(500).json({
      status: 500,
      error: message,
      stack: stack.split('\n'),
    });
  }
};

export default errorHandlerMiddleware;
