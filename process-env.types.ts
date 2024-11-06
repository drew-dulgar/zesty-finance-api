declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_PORT?: number;
      APP_CACHE?: string;
      APP_LOG_LEVEL?: string;
      APP_ORIGIN_URL: string;
      SECRET_SESSION: string;
      NODE_ENV?: string;
      POLYGON_UR: string;
      POLYGON_API_KEY: string;
      ZESTY_FINANCE_DB_HOST: string;
      ZESTY_FINANCE_DB_PORT: number;
      ZESTY_FINANCE_DB_DATABASE: string;
      ZESTY_FINANCE_DB_USER: string;
      ZESTY_FINANCE_DB_PASSWORD: string;
      ZESTY_FINANCE_DB_POOLS: number;
    }
  }
}

export {};
