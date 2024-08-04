import knex from 'knex';

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


export { clients };