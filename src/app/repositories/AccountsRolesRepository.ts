import type { Kysely, Transaction } from 'kysely';
import { requestContext } from '../../app/lib/requestContext.js';

import { zestyFinanceDb } from '../../db/index.js';
import LogRepository from './LogRepository.js';
import type {
  AccountRoleSelectable,
  AccountsRoleInsertable,
  AccountsRoleSelectable,
  AccountsRoleUpdateable,
  ZestyFinanceDB,
} from './zesty-finance-db.js';

type AccountsRolesKey = { accountId: string; accountRoleId: string };

const defaultLogValues = () => ({
  resource: 'account_role',
  actor_id: requestContext.getStore()?.actorId ?? null,
});

export const logs = {
  create: (accountId: string, accountRoleId: string, { ...rest } = {}) =>
    LogRepository.insert({
      ...defaultLogValues(),
      action: 'assign_role',
      resource_id: accountRoleId,
      account_id: accountId,
      ...rest,
    }),
  remove: (accountId: string, accountRoleId: string, { ...rest } = {}) =>
    LogRepository.insert({
      ...defaultLogValues(),
      action: 'unassign_role',
      resource_id: accountRoleId,
      account_id: accountId,
      ...rest,
    }),
};

const getByAccountId = (
  accountId: string,
): Promise<Pick<AccountRoleSelectable, 'id' | 'label'>[]> => {
  return zestyFinanceDb
    .selectFrom('accounts_roles')
    .innerJoin(
      'account_roles',
      'account_roles.id',
      'accounts_roles.account_role_id',
    )
    .select(['account_roles.id', 'account_roles.label'])
    .where('accounts_roles.account_id', '=', accountId)
    .where('account_roles.is_active', '=', true)
    .where('account_roles.is_deleted', '=', false)
    .execute();
};

const insert = async (
  values: AccountsRoleInsertable,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
): Promise<AccountsRoleSelectable> => {
  const result = await db
    .insertInto('accounts_roles')
    .values(values)
    .returningAll()
    .executeTakeFirstOrThrow();
  await logs.create(result.account_id, result.account_role_id);
  return result;
};

const update = (
  { accountId, accountRoleId }: AccountsRolesKey,
  values: AccountsRoleUpdateable,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
) => {
  return db
    .updateTable('accounts_roles')
    .set(values)
    .where('account_id', '=', accountId)
    .where('account_role_id', '=', accountRoleId)
    .execute();
};

const remove = async (
  { accountId, accountRoleId }: AccountsRolesKey,
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb,
) => {
  const result = await db
    .deleteFrom('accounts_roles')
    .where('account_id', '=', accountId)
    .where('account_role_id', '=', accountRoleId)
    .execute();
  await logs.remove(accountId, accountRoleId);
  return result;
};

export default { getByAccountId, insert, update, remove, logs };
