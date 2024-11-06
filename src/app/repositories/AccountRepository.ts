import type { Kysely, Transaction, SelectExpression } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import type { ZestyFinanceDB, AccountSelectable, AccountInsertable, AccountUpdateable } from './zesty-finance-db.js';
import type { Account } from '../services/AccountService.js';

import { zestyFinanceDb } from '../../db/index.js';
import { camelToSelectable } from '../utils/objects.js';

const get = (
  {
    select = ['id', 'username', 'email', 'email_verified', 'first_name', 'middle_name', 'last_name', 'is_deleted'],
    where = {},
    includes = {
      plan: false,
      roles: false,
    },
    limit,
    offset,
  }: {
    select?: SelectExpression<ZestyFinanceDB, "accounts">[];
    where?: Account;
    includes?: {
      plan: boolean,
      roles: boolean
    };
    limit?: number;
    offset?: number;
  },
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb
) => {
  let query = db
    .selectFrom('accounts')
    .select(select);

  if (includes.plan) {
    query = query.select((eb) => [
      jsonObjectFrom(
        eb.selectFrom('account_plans as plan')
          .select(['plan.id', 'plan.label'])
          .whereRef('plan.id', '=', 'accounts.account_plan_id')
          .where('plan.is_deleted', '=', false)
      ).as('plan')
    ]);
  }

  if (includes.roles) {

  }

  if (typeof where.id !== 'undefined') {
    query = query.where('id', '=', where.id);
  }

  if (typeof where.accountPlanId !== 'undefined') {
    query = query.where('account_plan_id', '=', where.accountPlanId);
  }

  if (typeof where.username !== 'undefined') {
    query = query.where('username', '=', where.username);
  }

  if (typeof where.email !== 'undefined') {
    query = query.where('email', '=', where.email);
  }

  if (typeof where.emailVerified !== 'undefined') {
    query = query.where('email_verified', '=', where.emailVerified);
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

const create = async (
  {
    accountPlanId = 0,
    username = null,
    email = '',
    emailVerified = false,
    salt = null,
    password = null,
    firstName = null,
    middleName = null,
    lastName = null,
    loginLast = null,
    loginAttempts = 0,
    loginLockedUntil = null
  }: Account,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb
): Promise<Partial<AccountSelectable>> => {

  const createdAt = new Date();

  const values = camelToSelectable<Account, AccountInsertable>({
    accountPlanId,
    username,
    email,
    emailVerified,
    salt,
    password,
    firstName,
    middleName,
    lastName,
    loginLast,
    loginAttempts,
    loginLockedUntil,
    isDeleted: false,
    createdAt: createdAt,
    updatedAt: createdAt
  });

  const query = await db
    .insertInto('accounts')
    .returning(['id'])
    .values(values)
    .executeTakeFirstOrThrow();

  return query;
}

const updateAuthenticateAttempt = async (
  accountId: number,
  account: Account = {},
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb
): Promise<void> => {

  const set: AccountUpdateable = {
    login_last: account.loginLast || null,
    login_attempts: account.loginAttempts || 0,
    login_locked_until: account.loginLockedUntil || null
  };

  const query = db
    .updateTable('accounts')
    .set(set)
    .where('id', '=', accountId)
    .limit(1);

  await query.executeTakeFirstOrThrow();
}

const updateEmailByAccountId = async (
  accountId: number,
  {
    email,
    emailVerified
  }: Account,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb
): Promise<Partial<AccountSelectable>> => {

  const query = db
    .updateTable('accounts')
    .set({
      email,
      email_verified: emailVerified,
    })
    .where('id', '=', accountId)
    .returning(['id', 'email', 'email_verified']);

  const response = await query.executeTakeFirstOrThrow();

  return response;
}

export default {
  get,
  create,
  updateEmailByAccountId,
  updateAuthenticateAttempt
};