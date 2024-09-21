import path from 'path';
import dotenvx from '@dotenvx/dotenvx';
dotenvx.config({
  path: path.join('./.env.local')
});

export default ({
  development: {
    client: 'pg',
    connection: {
      host: process.env.ZESTY_DB_HOST,
      port: process.env.ZESTY_DB_PORT,
      database: process.env.ZESTY_DB_DATABASE,
      user: process.env.ZESTY_DB_USER,
      password: process.env.ZESTY_DB_PASSWORD,
    },
    migrations: {
      directory: path.join('./db/migrations')
    },
    seeds: {
      directory: path.join('./db/seeds')
    }
  }
});
