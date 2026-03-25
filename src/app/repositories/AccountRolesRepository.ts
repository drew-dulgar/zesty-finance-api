import type { Kysely, SelectExpression, Transaction } from 'kysely';
import { requestContext } from '../../app/lib/requestContext.js';

import { zestyFinanceDb } from '../../db/index.js';
import LogRepository from './LogRepository.js';
import type {
  AccountRoleInsertable,
  AccountRoleSelectable,
  AccountRoleUpdateable,
  ZestyFinanceDB,
} from './zesty-finance-db.js';

type AccountRoleWhere = {
  id?: string;
  label?: string;
  isDefault?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
};

const defaultLogValues = () => ({
  resource: 'account_role',
  actor_id: requestContext.getStore()?.actorId ?? null,
});

export const logs = {
  create: (id: string, { ...rest } = {}) =>
    LogRepository.insert({
      ...defaultLogValues(),
      action: 'create',
      resource_id: id,
      account_id: null,
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
    select = [
      'id',
      'label',
      'description',
      'is_default',
      'is_active',
      'is_deleted',
      'created_at',
      'updated_at',
    ],
    where = {},
    limit,
    offset,
  }: {
    select?: SelectExpression<ZestyFinanceDB, 'account_roles'>[];
    where?: AccountRoleWhere;
    limit?: number;
    offset?: number;
  },
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
) => {
  let query = db.selectFrom('account_roles').select(select);

  if (typeof where.id !== 'undefined') {
    query = query.where('id', '=', where.id);
  }

  if (typeof where.label !== 'undefined') {
    query = query.where('label', '=', where.label);
  }

  if (typeof where.isDefault !== 'undefined') {
    query = query.where('is_default', '=', where.isDefault);
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

const insert = async (
  values: AccountRoleInsertable,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
): Promise<AccountRoleSelectable> => {
  const result = await db
    .insertInto('account_roles')
    .values(values)
    .returningAll()
    .executeTakeFirstOrThrow();
  await logs.create(result.id);
  return result;
};

const update = async (
  id: string,
  values: AccountRoleUpdateable,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
) => {
  const result = await db
    .updateTable('account_roles')
    .set(values)
    .where('id', '=', id)
    .execute();
  await logs.update(id);
  return result;
};

const remove = async (
  id: string,
  softDelete = true,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
) => {
  const result = softDelete
    ? await db
        .updateTable('account_roles')
        .set({ is_deleted: true })
        .where('id', '=', id)
        .execute()
    : await db.deleteFrom('account_roles').where('id', '=', id).execute();
  await logs.remove(id);
  return result;
};

export default { get, insert, update, remove, logs };
