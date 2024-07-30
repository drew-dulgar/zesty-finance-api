import dotenvx from '@dotenvx/dotenvx';

dotenvx.config();

// Export all environment vars needed throughout the app
export const APP_PORT = process.env.APP_PORT || 3000;

export const APP_CACHE = process.env.APP_CACHE === 'true' ? true : false;

export const ENVIRONMENT = process.env.NODE_ENV || 'development';

export const NPM_PACKAGE_VERSION = process.env.npm_package_version || null;

// Database connections
export const DB_CONNECTIONS = Object.freeze({
  ZESTY_DB: {
    host: process.env.ZESTY_DB_HOST,
    port: process.env.ZESTY_DB_PORT,
    database: process.env.ZESTY_DB_DATABASE,
    user: process.env.ZESTY_DB_USER,
    password: process.env.ZESTY_DB_PASSWORD
  },
});

// Polygon
export const POLYGON_URL = process.env.POLYGON_URL;
export const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

