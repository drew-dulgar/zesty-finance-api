import type { Account } from 'zesty-finance-shared';
import type { AuthorizedResponseType } from './src/app/lib/authorize.js';

declare global {
  namespace Express {
    interface Request {
      account: Account | null;
      authenticated: boolean;
      authorized: AuthorizedResponseType;
    }
  }
}
