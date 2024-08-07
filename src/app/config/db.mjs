import knex from 'knex';
import logger from './logger.mjs';

// Zesty Db connection
import {
  DB_CONNECTIONS
} from './env.mjs';

const { ZESTY_DB } = DB_CONNECTIONS;

const clients = {
  zestyDb: knex({
    client: 'pg',
    connection: {
      host: ZESTY_DB.host,
      port: ZESTY_DB.port,
      database: ZESTY_DB.database,
      user: ZESTY_DB.user,
      password: ZESTY_DB.password,
      //ssl: ZESTY_DB_SSL ? { rejectUnauthorized: false } : false,
    }
  })
}

clients.zestyDb.on('query', (knex) => {
  logger.info(knex.sql);
});

clients.zestyDb.on('query-error', (error, knex) => {
  logger.error(error);
});

export { clients };