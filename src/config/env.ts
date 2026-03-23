export const NODE_ENV = process.env.NODE_ENV || 'production';
export const IS_DEVELOPMENT = NODE_ENV !== 'production';
export const IS_PRODUCTION = NODE_ENV === 'production';

// Export all environment vars needed throughout the app
export const APP_PORT = process.env.APP_PORT || 3001;
export const APP_CACHE = process.env.APP_CACHE === 'true' ? true : false;
export const APP_LOG_LEVEL = process.env.APP_LOG_LEVEL || 'error';
export const APP_ORIGIN_URL = process.env.APP_ORIGIN_URL;

export const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
export const APP_BASE_URL = process.env.APP_BASE_URL;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID;
export const APPLE_CLIENT_SECRET = process.env.APPLE_CLIENT_SECRET;
export const APPLE_APP_BUNDLE_IDENTIFIER = process.env.APPLE_APP_BUNDLE_IDENTIFIER;

export const NPM_PACKAGE_VERSION = process.env.npm_package_version || null;

export const MAIL = Object.freeze({
  HOST: process.env.MAIL_HOST,
  PORT: Number(process.env.MAIL_PORT) || 587,
  USER: process.env.MAIL_USER,
  PASSWORD: process.env.MAIL_PASSWORD,
  FROM: process.env.MAIL_FROM,
});

// Database connections
export const ZESTY_FINANCE_DB = Object.freeze({
  HOST: process.env.ZESTY_FINANCE_DB_HOST,
  PORT: process.env.ZESTY_FINANCE_DB_PORT,
  DATABASE: process.env.ZESTY_FINANCE_DB_DATABASE,
  USER: process.env.ZESTY_FINANCE_DB_USER,
  PASSWORD: process.env.ZESTY_FINANCE_DB_PASSWORD,
  POOLS: process.env.ZESTY_FINANCE_DB_POOLS
});

