import type { Kysely, Transaction, SelectExpression } from 'kysely';
import type { ZestyFinanceDB, AccountProviderSelectable, AccountProviderInsertable, AccountProviderUpdateable } from './zesty-finance-db.js';

import { zestyFinanceDb } from '../../db/index.js';
import { requestContext } from '../../app/lib/requestContext.js';
import LogRepository from './LogRepository.js';

type AccountProviderWhere = {
  id?: string;
  accountId?: string;
  providerId?: string;
  providerAccountId?: string;
};

const defaultLogValues = () => ({
  resource: 'account_provider',
  actor_id: requestContext.getStore()?.actorId ?? null,
});

export const logs = {
  create: (id: string, accountId: string, providerId: string, {...rest} = {}) =>
    LogRepository.insert({ ...defaultLogValues(), action: 'link_provider', resource_id: id, account_id: accountId, metadata: { provider_id: providerId }, ...rest }),
  update: (id: string, accountId: string | null = null, providerId: string | null = null, {...rest} = {}) =>
    LogRepository.insert({ ...defaultLogValues(), action: 'update_provider', resource_id: id, account_id: accountId, metadata: providerId ? { provider_id: providerId } : null, ...rest }),
  remove: (id: string, accountId: string | null = null, providerId: string | null = null, {...rest} = {}) =>
    LogRepository.insert({ ...defaultLogValues(), action: 'unlink_provider', resource_id: id, account_id: accountId, metadata: providerId ? { provider_id: providerId } : null, ...rest }),
};

const get = (
  {
    select = ['id', 'provider_account_id', 'provider_id', 'account_id', 'access_token', 'refresh_token', 'id_token', 'access_token_expires_at', 'refresh_token_expires_at', 'scope', 'created_at', 'updated_at'],
    where = {},
    limit,
    offset,
  }: {
    select?: SelectExpression<ZestyFinanceDB, 'account_providers'>[];
    where?: AccountProviderWhere;
    limit?: number;
    offset?: number;
  },
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb
): Promise<AccountProviderSelectable[]> => {
  let query = db.selectFrom('account_providers').select(select);

  if (typeof where.id !== 'undefined') {
    query = query.where('id', '=', where.id);
  }

  if (typeof where.accountId !== 'undefined') {
    query = query.where('account_id', '=', where.accountId);
  }

  if (typeof where.providerId !== 'undefined') {
    query = query.where('provider_id', '=', where.providerId);
  }

  if (typeof where.providerAccountId !== 'undefined') {
    query = query.where('provider_account_id', '=', where.providerAccountId);
  }

  if (typeof limit !== 'undefined') {
    query = query.limit(limit);
  }

  if (typeof offset !== 'undefined') {
    query = query.offset(offset);
  }

  return query.execute();
};

const insert = async (
  values: AccountProviderInsertable,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb
): Promise<AccountProviderSelectable> => {
  const result = await db.insertInto('account_providers').values(values).returningAll().executeTakeFirstOrThrow();
  await logs.create(result.id, result.account_id, result.provider_id);
  return result;
};

const update = async (
  id: string,
  values: AccountProviderUpdateable,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb
) => {
  const result = await db.updateTable('account_providers').set(values).where('id', '=', id).execute();
  await logs.update(id);
  return result;
};

const remove = async (
  id: string,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb
) => {
  const result = await db.deleteFrom('account_providers').where('id', '=', id).execute();
  await logs.remove(id);
  return result;
};

export default { get, insert, update, remove, logs };
