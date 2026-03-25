import type { Kysely, SelectExpression, Transaction } from 'kysely';
import { requestContext } from '../../app/lib/requestContext.js';

import { zestyFinanceDb } from '../../db/index.js';
import LogRepository from './LogRepository.js';
import type {
  AccountVerificationInsertable,
  AccountVerificationSelectable,
  AccountVerificationUpdateable,
  ZestyFinanceDB,
} from './zesty-finance-db.js';

type AccountVerificationWhere = {
  id?: string;
  identifier?: string;
};

const defaultLogValues = () => ({
  resource: 'account_verification',
  actor_id: requestContext.getStore()?.actorId ?? null,
});

export const logs = {
  create: (id: string, identifier: string, { ...rest } = {}) =>
    LogRepository.insert({
      ...defaultLogValues(),
      action: 'request_verification',
      resource_id: id,
      account_id: identifier,
      ...rest,
    }),
  update: (id: string, accountId: string | null = null, { ...rest } = {}) =>
    LogRepository.insert({
      ...defaultLogValues(),
      action: 'update_verification',
      resource_id: id,
      account_id: accountId,
      ...rest,
    }),
  remove: (id: string, identifier: string | null = null, { ...rest } = {}) =>
    LogRepository.insert({
      ...defaultLogValues(),
      action: 'delete_verification',
      resource_id: id,
      account_id: identifier,
      ...rest,
    }),
};

const get = (
  {
    select = [
      'id',
      'identifier',
      'value',
      'expires_at',
      'created_at',
      'updated_at',
    ],
    where = {},
    limit,
    offset,
  }: {
    select?: SelectExpression<ZestyFinanceDB, 'account_verifications'>[];
    where?: AccountVerificationWhere;
    limit?: number;
    offset?: number;
  },
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
): Promise<AccountVerificationSelectable[]> => {
  let query = db.selectFrom('account_verifications').select(select);

  if (typeof where.id !== 'undefined') {
    query = query.where('id', '=', where.id);
  }

  if (typeof where.identifier !== 'undefined') {
    query = query.where('identifier', '=', where.identifier);
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
  values: AccountVerificationInsertable,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
): Promise<AccountVerificationSelectable> => {
  const result = await db
    .insertInto('account_verifications')
    .values(values)
    .returningAll()
    .executeTakeFirstOrThrow();
  await logs.create(result.id, result.identifier);
  return result;
};

const update = async (
  id: string,
  values: AccountVerificationUpdateable,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
) => {
  const result = await db
    .updateTable('account_verifications')
    .set(values)
    .where('id', '=', id)
    .execute();
  const updated = await db
    .selectFrom('account_verifications')
    .select('value')
    .where('id', '=', id)
    .executeTakeFirst();
  await logs.update(id, updated?.value ?? null);
  return result;
};

const remove = async (
  id: string,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
) => {
  const result = await db
    .deleteFrom('account_verifications')
    .where('id', '=', id)
    .execute();
  await logs.remove(id);
  return result;
};

export default { get, insert, update, remove, logs };
