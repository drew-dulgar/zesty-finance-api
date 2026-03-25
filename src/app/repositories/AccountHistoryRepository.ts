import type { Kysely, SelectExpression, Transaction } from 'kysely';
import { requestContext } from '../../app/lib/requestContext.js';

import { zestyFinanceDb } from '../../db/index.js';
import LogRepository from './LogRepository.js';
import type {
  AccountHistoryInsertable,
  AccountHistorySelectable,
  AccountHistoryUpdateable,
  ZestyFinanceDB,
} from './zesty-finance-db.js';

type AccountHistoryWhere = {
  id?: string;
  accountId?: string;
  field?: 'email' | 'username';
};

const defaultLogValues = () => ({
  resource: 'account_history',
  actor_id: requestContext.getStore()?.actorId ?? null,
});

export const logs = {
  create: (id: string, accountId: string, { ...rest } = {}) =>
    LogRepository.insert({
      ...defaultLogValues(),
      action: 'create',
      resource_id: id,
      account_id: accountId,
      ...rest,
    }),
  update: (id: string, { ...rest } = {}) =>
    LogRepository.insert({
      ...defaultLogValues(),
      action: 'update',
      resource_id: id,
      account_id: null,
      ...rest,
    }),
  remove: (id: string, { ...rest } = {}) =>
    LogRepository.insert({
      ...defaultLogValues(),
      action: 'delete',
      resource_id: id,
      account_id: null,
      ...rest,
    }),
};

const get = (
  {
    select = ['id', 'account_id', 'field', 'value', 'created_at', 'updated_at'],
    where = {},
    limit,
    offset,
  }: {
    select?: SelectExpression<ZestyFinanceDB, 'account_history'>[];
    where?: AccountHistoryWhere;
    limit?: number;
    offset?: number;
  },
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
): Promise<AccountHistorySelectable[]> => {
  let query = db.selectFrom('account_history').select(select);

  if (typeof where.id !== 'undefined') {
    query = query.where('id', '=', where.id);
  }

  if (typeof where.accountId !== 'undefined') {
    query = query.where('account_id', '=', where.accountId);
  }

  if (typeof where.field !== 'undefined') {
    query = query.where('field', '=', where.field);
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
  values: AccountHistoryInsertable,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
): Promise<AccountHistorySelectable> => {
  const result = await db
    .insertInto('account_history')
    .values(values)
    .returningAll()
    .executeTakeFirstOrThrow();
  await logs.create(result.id, result.account_id);
  return result;
};

const update = async (
  id: string,
  values: AccountHistoryUpdateable,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
) => {
  const result = await db
    .updateTable('account_history')
    .set(values)
    .where('id', '=', id)
    .execute();
  await logs.update(id);
  return result;
};

const remove = async (
  id: string,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
) => {
  const result = await db
    .deleteFrom('account_history')
    .where('id', '=', id)
    .execute();
  await logs.remove(id);
  return result;
};

export default { get, insert, update, remove, logs };
