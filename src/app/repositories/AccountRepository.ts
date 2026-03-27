import type { Kysely, SelectExpression, Transaction } from 'kysely';
import { sql } from 'kysely';
import { requestContext } from '../../app/lib/requestContext.js';

import { zestyFinanceDb } from '../../db/index.js';
import LogRepository from './LogRepository.js';
import type {
  AccountInsertable,
  AccountSelectable,
  AccountUpdateable,
  ZestyFinanceDB,
} from './zesty-finance-db.js';

type AccountWhere = {
  id?: string;
  email?: string;
  username?: string;
  emailVerified?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
};

const defaultLogValues = () => ({
  resource: 'account',
  actor_id: requestContext.getStore()?.actorId ?? null,
});

export const logs = {
  create: (id: string, { ...rest } = {}) =>
    LogRepository.insert({
      ...defaultLogValues(),
      action: 'create',
      resource_id: id,
      account_id: id,
      ...rest,
    }),
  update: (id: string, { ...rest } = {}) =>
    LogRepository.insert({
      ...defaultLogValues(),
      action: 'update',
      resource_id: id,
      account_id: id,
      ...rest,
    }),
  remove: (id: string, { ...rest } = {}) =>
    LogRepository.insert({
      ...defaultLogValues(),
      action: 'delete',
      resource_id: id,
      account_id: id,
      ...rest,
    }),
  resetPassword: (id: string, { ...rest } = {}) =>
    LogRepository.insert({
      ...defaultLogValues(),
      action: 'reset_password',
      resource_id: id,
      account_id: id,
      ...rest,
    }),
  verifyEmail: (id: string, { ...rest } = {}) =>
    LogRepository.insert({
      ...defaultLogValues(),
      action: 'verify_email',
      resource_id: id,
      account_id: id,
      ...rest,
    }),
};

const get = (
  {
    select = [
      'id',
      'username',
      'email',
      'email_verified',
      'name',
      'image',
      'first_name',
      'last_name',
      'sign_in_count',
      'sign_in_at',
      'is_active',
      'is_deleted',
      'created_at',
      'updated_at',
    ],
    where = {},
    limit,
    offset,
  }: {
    select?: SelectExpression<ZestyFinanceDB, 'accounts'>[];
    where?: AccountWhere;
    limit?: number;
    offset?: number;
  },
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
) => {
  let query = db.selectFrom('accounts').select(select);

  if (typeof where.id !== 'undefined') {
    query = query.where('id', '=', where.id);
  }

  if (typeof where.email !== 'undefined') {
    query = query.where('email', '=', where.email);
  }

  if (typeof where.username !== 'undefined') {
    query = query.where('username', '=', where.username);
  }

  if (typeof where.emailVerified !== 'undefined') {
    query = query.where('email_verified', '=', where.emailVerified);
  }

  if (typeof where.isActive !== 'undefined') {
    query = query.where('is_active', '=', where.isActive);
  }

  if (typeof where.isDeleted !== 'undefined') {
    query = query.where('is_deleted', '=', where.isDeleted);
  }

  if (typeof limit !== 'undefined') {
    query = query.limit(limit);
  }

  if (typeof offset !== 'undefined') {
    query = query.offset(offset);
  }

  return query;
};

const isUsernameTaken = async (
  username: string,
  excludeId: string,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
): Promise<boolean> => {
  const result = await db
    .selectFrom('accounts')
    .select('id')
    .where(sql`lower(username)`, '=', username.toLowerCase())
    .where('id', '!=', excludeId)
    .limit(1)
    .executeTakeFirst();
  return result !== undefined;
};

const insert = async (
  values: AccountInsertable,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
): Promise<AccountSelectable> => {
  const result = await db
    .insertInto('accounts')
    .values(values)
    .returningAll()
    .executeTakeFirstOrThrow();
  await logs.create(result.id);
  return result;
};

const update = async (
  id: string,
  values: AccountUpdateable,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
) => {
  const result = await db
    .updateTable('accounts')
    .set(values)
    .where('id', '=', id)
    .execute();
  await logs.update(id);
  return result;
};

const trackSignIn = (
  id: string,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
) => {
  return db
    .updateTable('accounts')
    .set((eb) => ({
      sign_in_count: eb('sign_in_count', '+', 1),
      sign_in_at: sql`(now() at time zone 'utc')`,
    }))
    .where('id', '=', id)
    .execute();
};

const remove = async (
  id: string,
  softDelete = true,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
) => {
  const result = softDelete
    ? await db
        .updateTable('accounts')
        .set({ is_deleted: true })
        .where('id', '=', id)
        .execute()
    : await db.deleteFrom('accounts').where('id', '=', id).execute();
  await logs.remove(id);
  return result;
};

export default {
  get,
  isUsernameTaken,
  insert,
  update,
  trackSignIn,
  remove,
  logs,
};
