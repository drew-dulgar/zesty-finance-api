
import pg from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { IS_DEVELOPMENT, ZESTY_FINANCE_DB } from '../config/env.js';
import { ZestyFinanceDB } from '../app/repositories/zesty-finance-db.js';
import logger from '../app/lib/logger.js';

const zestyFinancePool = new pg.Pool({
  host: ZESTY_FINANCE_DB.HOST,
  port: ZESTY_FINANCE_DB.PORT,
  database: ZESTY_FINANCE_DB.DATABASE,
  user: ZESTY_FINANCE_DB.USER,
  password: ZESTY_FINANCE_DB.PASSWORD,
  max: ZESTY_FINANCE_DB.POOLS
});

const zestyFinanceDialect = new PostgresDialect({
  pool: zestyFinancePool
});

const log = (event: any) => {
  const sql = event?.query?.sql || '';
  const duration = ((event?.queryDurationMillis || 0) / 1000).toFixed(5);
  const params = event?.query?.parameters || [];

  switch (event.level) {
    case 'error':
      logger.error(`zestyDbQuery(${duration}):${event.query.sql}`);

      logger.error({
        sql,
        duration,
        error: event.error,
        params: IS_DEVELOPMENT ? params : [],
      });
      break;
    case 'query':
      logger.info(`zestyDbQuery(${duration}):\n${event.query.sql}`);
      if (IS_DEVELOPMENT && params.length > 0) {
        logger.info(params);
      }

      break;
  }
}

const zestyFinanceDb = new Kysely<ZestyFinanceDB>({
  dialect: zestyFinanceDialect,
  log
});

export default zestyFinanceDb;
export { zestyFinanceDialect, zestyFinancePool }