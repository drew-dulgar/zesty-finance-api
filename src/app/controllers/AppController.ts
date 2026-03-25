import type { NextFunction, Request, Response } from 'express';
import { sql } from 'kysely';
import { NPM_PACKAGE_VERSION } from '../../config/env.js';
import { zestyFinanceDb } from '../../db/index.js';

type HealthResponse = {
  version?: string | null | Error;
  zestyFinanceDb?: boolean;
};

const health = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const response: HealthResponse = {};
  let error: boolean = false;

  try {
    response.version = NPM_PACKAGE_VERSION;
  } catch (e: unknown) {
    error = true;
    response.version = e instanceof Error ? e.message : String(e);
  }

  try {
    await zestyFinanceDb
      .selectNoFrom(sql<'ok'>` 'ok'`.as('status'))
      .executeTakeFirstOrThrow();
    response.zestyFinanceDb = true;
  } catch (_e) {
    error = true;
    response.zestyFinanceDb = false;
  }

  try {
    if (error) {
      res.status(500).json(response);
    } else {
      res.json(response);
    }
  } catch (err) {
    next(err);
  }
};

const favicon = async (_req: Request, res: Response) => {
  res.status(404).json({});
};

export default {
  health,
  favicon,
};
