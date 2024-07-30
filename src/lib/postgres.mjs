import pg from 'pg';

// Zesty Db connection
import {
  DB_CONNECTIONS
} from './env.mjs';

const { ZESTY_DB } = DB_CONNECTIONS;

const clients = {
  zestyDb: new pg.Pool({
    host: ZESTY_DB.host,
    port: ZESTY_DB.port,
    database: ZESTY_DB.database,
    user: ZESTY_DB.user,
    password: ZESTY_DB.password
  })
};

export { clients };