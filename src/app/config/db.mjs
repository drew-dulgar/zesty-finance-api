import knex from 'knex';
import pg from 'pg';
import path from 'path';
import logger from './logger.mjs';
import {
  DB_CONNECTIONS
} from './env.mjs';

// override next date handling
const { types } = pg;

// always assume value coming from the database is GMT
const timezoneParser = (val) => new Date(val + 'Z').toUTCString();
const numericParser = (val) => parseFloat(val);

types.setTypeParser(types.builtins.TIMESTAMPTZ, timezoneParser);
types.setTypeParser(types.builtins.TIMESTAMP, timezoneParser);

types.setTypeParser(types.builtins.NUMERIC, numericParser);

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
    },
  })
}

clients.zestyDb.on('query', (knex) => {
  logger.info(knex.sql);
});

clients.zestyDb.on('query-error', (error, knex) => {
  logger.error(error);
});

export { clients };