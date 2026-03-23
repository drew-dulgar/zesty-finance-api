import type { BetterAuthOptions } from 'better-auth';
import { sql } from 'kysely';
import { zestyFinanceDb } from '../db/index.js';
import { LogRepository } from '../app/repositories/index.js';
import { emptyStringToNull } from '../app/utils/sanitize.js';

const log = (entry: Parameters<typeof LogRepository.insert>[0]) =>
  LogRepository.insert(entry).catch(() => {});

const databaseHooks: BetterAuthOptions['databaseHooks'] = {
  user: {
    create: {
      before: async (user) => {
        return {
          data: {
            ...user,
            email: emptyStringToNull(user.email) as string,
            username: emptyStringToNull(user.username as string),
            is_active: true,
          },
        };
      },
      after: async (user, context) => {
        const actorId = context?.context?.session?.user?.id ?? user.id;
        await log({ action: 'create', resource: 'account', resource_id: user.id, account_id: user.id, actor_id: actorId });
      },
    },
    update: {
      before: async (user) => {
        return {
          data: {
            ...user,
            ...(user.email !== undefined && { email: emptyStringToNull(user.email as string) as string }),
            ...(user.username !== undefined && { username: emptyStringToNull(user.username as string) }),
          },
        };
      },
      after: async (user, context) => {
        const actorId = context?.context?.session?.user?.id ?? user.id as string;
        await log({ action: 'update', resource: 'account', resource_id: user.id as string, account_id: user.id as string, actor_id: actorId });
      },
    },
    delete: {
      after: async (user, context) => {
        const actorId = context?.context?.session?.user?.id ?? user.id as string;
        await log({ action: 'delete', resource: 'account', resource_id: user.id as string, account_id: user.id as string, actor_id: actorId });
      },
    },
  },
  session: {
    create: {
      before: async (session) => {
        const account = await zestyFinanceDb
          .selectFrom('accounts')
          .select(['is_active', 'is_deleted'])
          .where('id', '=', session.userId)
          .executeTakeFirst();

        if (!account?.is_active || account?.is_deleted) {
          throw new Error('Account is not active.');
        }

        return { data: session };
      },
      after: async (session, context) => {
        const actorId = context?.context?.session?.user?.id ?? session.userId;
        await Promise.all([
          log({ action: 'login', resource: 'session', account_id: session.userId, actor_id: actorId }),
          zestyFinanceDb
            .updateTable('accounts')
            .set(eb => ({
              sign_in_count: eb('sign_in_count', '+', 1),
              sign_in_at: sql`(now() at time zone 'utc')`,
            }))
            .where('id', '=', session.userId)
            .execute()
            .catch(() => {}),
        ]);
      },
    },
    update: {
      after: async (session, context) => {
        const actorId = context?.context?.session?.user?.id ?? session.userId;
        await log({ action: 'refresh_session', resource: 'session', account_id: session.userId, actor_id: actorId });
      },
    },
    delete: {
      after: async (session, context) => {
        const actorId = context?.context?.session?.user?.id ?? session.userId;
        await log({ action: 'logout', resource: 'session', account_id: session.userId, actor_id: actorId });
      },
    },
  },
  account: {
    create: {
      after: async (account, context) => {
        const actorId = context?.context?.session?.user?.id ?? account.userId;
        await log({ action: 'link_provider', resource: 'account_provider', resource_id: account.id, account_id: account.userId, actor_id: actorId, metadata: { provider_id: account.providerId } });
      },
    },
    update: {
      after: async (account, context) => {
        const actorId = context?.context?.session?.user?.id ?? account.userId as string;
        await log({ action: 'update_provider', resource: 'account_provider', resource_id: account.id, account_id: account.userId as string, actor_id: actorId, metadata: { provider_id: account.providerId } });
      },
    },
    delete: {
      after: async (account, context) => {
        const actorId = context?.context?.session?.user?.id ?? account.userId as string;
        await log({ action: 'unlink_provider', resource: 'account_provider', resource_id: account.id, account_id: account.userId as string, actor_id: actorId, metadata: { provider_id: (account as any).providerId } });
      },
    },
  },
  verification: {
    create: {
      after: async (verification, context) => {
        const actorId = context?.context?.session?.user?.id ?? null;
        await log({ action: 'request_verification', resource: 'account_verification', resource_id: verification.id, account_id: verification.identifier, actor_id: actorId });
      },
    },
    delete: {
      after: async (verification, context) => {
        const actorId = context?.context?.session?.user?.id ?? null;
        await log({ action: 'delete_verification', resource: 'account_verification', resource_id: verification.id, account_id: verification.identifier, actor_id: actorId });
      },
    },
  },
};

export default databaseHooks;
