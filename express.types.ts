import type { Account } from './src/app/services/AccountService.js';

declare module 'express-session' {
  interface SessionData {
    account?: Account;
  }
}

declare global {
  namespace Express {
    interface Request {
      account: Account | null;
      authenticated: boolean;
      authorized: {
        routes: string[];
      };
    }
  }
}
