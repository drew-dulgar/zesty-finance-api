import type { BetterAuthOptions } from 'better-auth';
import logger from '../app/lib/logger.js';
import {
  AccountProviderRepository,
  AccountRepository,
  AccountVerificationRepository,
  DocumentRepository,
  SessionRepository,
} from '../app/repositories/index.js';
import { emptyStringToNull } from '../app/utils/sanitize.js';

const databaseHooks: BetterAuthOptions['databaseHooks'] = {
  user: {
    create: {
      before: async (user) => {
        return {
          data: {
            ...user,
            email: emptyStringToNull(user.email.toLocaleLowerCase()),
            username: emptyStringToNull(user.username),
            is_active: true,
          } as Record<string, unknown>,
        };
      },
      after: async (user) => {
        await AccountRepository.logs
          .create(user.id, { actor_id: user.id })
          .catch((e) => logger.error('user.create.after hook error:', e));

        await DocumentRepository.getActive()
          .then((docs) =>
            DocumentRepository.recordAcceptances(
              user.id,
              docs.map((d) => d.id),
            ),
          )
          .catch((e) =>
            logger.error('user.create.after document acceptance error:', e),
          );
      },
    },
    update: {
      before: async (user) => {
        return {
          data: {
            ...user,
            ...(user.email !== undefined && {
              email: emptyStringToNull(user.email),
            }),
            ...(user.username !== undefined && {
              username: emptyStringToNull(user.username),
            }),
          } as Record<string, unknown>,
        };
      },
      after: async (user) => {
        await AccountRepository.logs
          .update(user.id, { actor_id: user.id })
          .catch((e) => logger.error('user.update.after hook error:', e));
      },
    },
    delete: {
      after: async (user) => {
        await AccountRepository.logs
          .remove(user.id, { actor_id: user.id })
          .catch((e) => logger.error('user.delete.after hook error:', e));
      },
    },
  },
  session: {
    create: {
      before: async (session) => {
        const account = await AccountRepository.get({
          select: ['is_active', 'is_deleted'],
          where: { id: session.userId },
        }).executeTakeFirst();

        if (!account?.is_active || account?.is_deleted) {
          throw new Error('Account is not active.');
        }

        return { data: session };
      },
      after: async (session) => {
        await Promise.all([
          SessionRepository.logs.login(session.userId, {
            actor_id: session.userId,
          }),
          AccountRepository.trackSignIn(session.userId),
        ]).catch((e) => logger.error('session.create.after hook error:', e));
      },
    },
    update: {
      after: async (session) => {
        await SessionRepository.logs
          .refreshSession(session.userId, { actor_id: session.userId })
          .catch((e) => logger.error('session.update.after hook error:', e));
      },
    },
    delete: {
      after: async (session) => {
        await SessionRepository.logs
          .logout(session.userId, { actor_id: session.userId })
          .catch((e) => logger.error('session.delete.after hook error:', e));
      },
    },
  },
  account: {
    create: {
      after: async (account) => {
        await AccountProviderRepository.logs
          .create(account.id, account.id, account.providerId, {
            actor_id: account.id,
          })
          .catch((e) => logger.error('account.create.after hook error:', e));
      },
    },
    update: {
      after: async (account) => {
        await AccountProviderRepository.logs
          .update(account.id, account.id, account.providerId, {
            actor_id: account.id,
          })
          .catch((e) => logger.error('account.update.after hook error:', e));
      },
    },
    delete: {
      after: async (account) => {
        await AccountProviderRepository.logs
          .remove(
            account.id,
            account.id,
            (account as Record<string, unknown>).providerId as string,
            {
              actor_id: account.id,
            },
          )
          .catch((e) => logger.error('account.delete.after hook error:', e));
      },
    },
  },
  verification: {
    create: {
      after: async (verification) => {
        await AccountVerificationRepository.logs
          .create(verification.id, verification.value)
          .catch((e) =>
            logger.error('verification.create.after hook error:', e),
          );
      },
    },
    delete: {
      after: async (verification) => {
        await AccountVerificationRepository.logs
          .remove(verification.id, verification.value)
          .catch((e) =>
            logger.error('verification.delete.after hook error:', e),
          );
      },
    },
  },
};

export default databaseHooks;
