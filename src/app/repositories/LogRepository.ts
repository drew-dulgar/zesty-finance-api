import type { Kysely, SelectExpression, Transaction } from 'kysely';
import { zestyFinanceDb } from '../../db/index.js';
import { requestContext } from '../lib/requestContext.js';
import type {
  LogInsertable,
  LogSelectable,
  LogUpdateable,
  ZestyFinanceDB,
} from './zesty-finance-db.js';

type LogWhere = {
  id?: string;
  accountId?: string;
  actorId?: string;
  action?: string;
  resource?: string;
  resourceId?: string;
};

const get = (
  {
    select = [
      'id',
      'account_id',
      'actor_id',
      'action',
      'resource',
      'resource_id',
      'metadata',
      'ip_address',
      'user_agent',
      'created_at',
      'updated_at',
    ],
    where = {},
    limit,
    offset,
  }: {
    select?: SelectExpression<ZestyFinanceDB, 'logs'>[];
    where?: LogWhere;
    limit?: number;
    offset?: number;
  },
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
): Promise<LogSelectable[]> => {
  let query = db.selectFrom('logs').select(select);

  if (typeof where.id !== 'undefined') {
    query = query.where('id', '=', where.id);
  }

  if (typeof where.accountId !== 'undefined') {
    query = query.where('account_id', '=', where.accountId);
  }

  if (typeof where.actorId !== 'undefined') {
    query = query.where('actor_id', '=', where.actorId);
  }

  if (typeof where.action !== 'undefined') {
    query = query.where('action', '=', where.action);
  }

  if (typeof where.resource !== 'undefined') {
    query = query.where('resource', '=', where.resource);
  }

  if (typeof where.resourceId !== 'undefined') {
    query = query.where('resource_id', '=', where.resourceId);
  }

  if (typeof limit !== 'undefined') {
    query = query.limit(limit);
  }

  if (typeof offset !== 'undefined') {
    query = query.offset(offset);
  }

  return query.execute();
};

const insert = (
  values: LogInsertable,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
): Promise<LogSelectable | undefined> => {
  const ctx = requestContext.getStore();
  return db
    .insertInto('logs')
    .values({
      ip_address: ctx?.ipAddress ?? null,
      user_agent: ctx?.userAgent ?? null,
      ...values,
    })
    .returningAll()
    .executeTakeFirst();
};

const update = (
  id: string,
  values: LogUpdateable,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
) => {
  return db.updateTable('logs').set(values).where('id', '=', id).execute();
};

const remove = (
  id: string,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
) => {
  return db.deleteFrom('logs').where('id', '=', id).execute();
};

export default { get, insert, update, remove };
