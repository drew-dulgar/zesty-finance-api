import type { Kysely, SelectExpression, Transaction } from 'kysely';
import { requestContext } from '../../app/lib/requestContext.js';
import { zestyFinanceDb } from '../../db/index.js';
import type { AccountPlan } from '../services/AccountPlanService.js';
import LogRepository from './LogRepository.js';
import type {
  AccountPlanInsertable,
  AccountPlanSelectable,
  AccountPlanUpdateable,
  ZestyFinanceDB,
} from './zesty-finance-db.js';

const defaultLogValues = () => ({
  resource: 'account_plan',
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
      'plan',
      'price_monthly',
      'price_yearly',
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
    select?: SelectExpression<ZestyFinanceDB, 'account_plans'>[];
    where?: AccountPlan;
    limit?: number;
    offset?: number;
  },
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
) => {
  let query = db.selectFrom('account_plans').select(select);

  if (typeof where.id !== 'undefined') {
    query = query.where('id', '=', where.id);
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
  values: AccountPlanInsertable,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
): Promise<AccountPlanSelectable> => {
  const result = await db
    .insertInto('account_plans')
    .values(values)
    .returningAll()
    .executeTakeFirstOrThrow();
  await logs.create(result.id);
  return result;
};

const update = async (
  id: string,
  values: AccountPlanUpdateable,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
) => {
  const result = await db
    .updateTable('account_plans')
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
        .updateTable('account_plans')
        .set({ is_deleted: true })
        .where('id', '=', id)
        .execute()
    : await db.deleteFrom('account_plans').where('id', '=', id).execute();
  await logs.remove(id);
  return result;
};

export default { get, insert, update, remove, logs };
