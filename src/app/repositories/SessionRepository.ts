import type { Kysely, Transaction, SelectExpression } from 'kysely';
import type { ZestyFinanceDB, SessionSelectable, SessionInsertable, SessionUpdateable } from './zesty-finance-db.js';

import { zestyFinanceDb } from '../../db/index.js';
import { requestContext } from '../../app/lib/requestContext.js';
import LogRepository from './LogRepository.js';

type SessionWhere = {
  id?: string;
  token?: string;
  accountId?: string;
};

const defaultLogValues = () => ({
  resource: 'session',
  actor_id: requestContext.getStore()?.actorId ?? null,
});

export const logs = {
  login: (accountId: string, {...rest} = {}) =>
    LogRepository.insert({ ...defaultLogValues(), action: 'login', account_id: accountId, ...rest }),
  refreshSession: (accountId: string, {...rest} = {}) =>
    LogRepository.insert({ ...defaultLogValues(), action: 'refresh_session', account_id: accountId, ...rest }),
  logout: (accountId: string, {...rest} = {}) =>
    LogRepository.insert({ ...defaultLogValues(), action: 'logout', account_id: accountId, ...rest }),
};

const get = (
  {
    select = ['id', 'expires_at', 'token', 'ip_address', 'user_agent', 'account_id', 'created_at', 'updated_at'],
    where = {},
    limit,
    offset,
  }: {
    select?: SelectExpression<ZestyFinanceDB, 'sessions'>[];
    where?: SessionWhere;
    limit?: number;
    offset?: number;
  },
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb
): Promise<SessionSelectable[]> => {
  let query = db.selectFrom('sessions').select(select);

  if (typeof where.id !== 'undefined') {
    query = query.where('id', '=', where.id);
  }

  if (typeof where.token !== 'undefined') {
    query = query.where('token', '=', where.token);
  }

  if (typeof where.accountId !== 'undefined') {
    query = query.where('account_id', '=', where.accountId);
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
  values: SessionInsertable,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb
): Promise<SessionSelectable> => {
  const result = await db.insertInto('sessions').values(values).returningAll().executeTakeFirstOrThrow();
  await logs.login(result.account_id);
  return result;
};

const update = async (
  id: string,
  values: SessionUpdateable,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb
) => {
  const result = await db.updateTable('sessions').set(values).where('id', '=', id).execute();
  await logs.refreshSession(id);
  return result;
};

const remove = async (
  id: string,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb
) => {
  const result = await db.deleteFrom('sessions').where('id', '=', id).execute();
  await logs.logout(id);
  return result;
};

export default { get, insert, update, remove, logs };
