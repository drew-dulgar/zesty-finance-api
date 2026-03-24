import { AsyncLocalStorage } from 'async_hooks';

type RequestContext = {
  ipAddress: string | null;
  userAgent: string | null;
  actorId?: string | null;
};

export const requestContext = new AsyncLocalStorage<RequestContext>();
