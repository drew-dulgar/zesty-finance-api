export const NODE_ENV = process.env.NODE_ENV || 'production';
export const IS_DEVELOPMENT = NODE_ENV !== 'production';
export const IS_PRODUCTION = NODE_ENV === 'production';

// Export all environment vars needed throughout the app
export const APP_PORT = process.env.APP_PORT || 3000;
export const APP_CACHE = process.env.APP_CACHE === 'true' ? true : false;
export const APP_LOG_LEVEL = process.env.APP_LOG_LEVEL || 'error';
export const APP_ORIGIN_URL = process.env.APP_ORIGIN_URL;

export const SECRET_SESSION = process.env.SECRET_SESSION;

export const NPM_PACKAGE_VERSION = process.env.npm_package_version || null;

// Database connections
export const ZESTY_FINANCE_DB = Object.freeze({
  HOST: process.env.ZESTY_FINANCE_DB_HOST,
  PORT: process.env.ZESTY_FINANCE_DB_PORT,
  DATABASE: process.env.ZESTY_FINANCE_DB_DATABASE,
  USER: process.env.ZESTY_FINANCE_DB_USER,
  PASSWORD: process.env.ZESTY_FINANCE_DB_PASSWORD,
  POOLS: process.env.ZESTY_FINANCE_DB_POOLS
});

// Polygon
export const POLYGON_URL = process.env.POLYGON_URL;
export const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
