import type { AuthorizedResponseType } from './src/app/lib/authorize.js';
import type { Account } from 'zesty-finance-shared';

declare global {
  namespace Express {
    interface Request {
      account: Account | null;
      authenticated: boolean;
      authorized: AuthorizedResponseType;
    }
  }
}
