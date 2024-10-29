import type { IRequest, IResponse, INextFunction } from '../express/index.js';
import { NPM_PACKAGE_VERSION } from '../config/env.js';
import { zestyFinanceDb } from '../db/index.js'
import { sql } from 'kysely';

type HealthResponse = {
  version?: string | null | Error;
  zestyFinanceDb?: boolean;
}

const health = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
  const response: HealthResponse = {};
  let error: boolean = false;

  try {
    response.version = NPM_PACKAGE_VERSION;
  } catch (e: any) {
    error = true;
    response.version = e.message;
  }

  try {
    await zestyFinanceDb.selectNoFrom(sql<'ok'>` 'ok'`.as('status')).executeTakeFirstOrThrow();
    response.zestyFinanceDb = true;
  } catch (e) {
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

const favicon = async (req, res, next) => {
  res.status(404).json({});
};

export default {
  health,
  favicon
};