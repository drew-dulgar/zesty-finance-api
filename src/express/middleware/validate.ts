import type { Request, Response, NextFunction } from 'express';
import type { ZodTypeAny } from 'zod';
import { z } from 'zod';

type ValidateSchemas = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

const validate = (schemas: ValidateSchemas) => (req: Request, res: Response, next: NextFunction): void => {
  const errors: Record<string, string[]> = {};

  for (const key of ['body', 'query', 'params'] as const) {
    const schema = schemas[key];
    if (!schema) continue;

    const parsed = schema.safeParse(req[key]);
    if (!parsed.success) {
      Object.assign(errors, z.flattenError(parsed.error).fieldErrors);
    } else {
      req[key] = parsed.data;
    }
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json({ error: errors });
    return;
  }

  next();
};

export default validate;
