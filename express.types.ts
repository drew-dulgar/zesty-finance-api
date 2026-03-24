import type { AuthorizedResponseType } from './src/app/lib/authorize.js';
import type { AccountRole } from 'zesty-finance-shared';

export type BetterAuthUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  roles?: AccountRole[];
};

declare global {
  namespace Express {
    interface Request {
      account: BetterAuthUser | null;
      authenticated: boolean;
      authorized: AuthorizedResponseType;
    }
  }
}
