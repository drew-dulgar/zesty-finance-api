import type { Request, Response, NextFunction } from 'express';

import { set } from 'lodash-es';
import joi from 'joi';

const inputValidationMiddleware = (error: any, req: Request, res: Response, next: NextFunction): void => {
  if (error instanceof joi.ValidationError) {

    const validationErrors = {};

    for (const errorDetail of error?.details || []) {
      set(validationErrors, errorDetail.path.join('.'), errorDetail.message)
    }
    
    res.send({
      validationErrors,
    })
  } else {
    next(error);
  }
}

export default inputValidationMiddleware;