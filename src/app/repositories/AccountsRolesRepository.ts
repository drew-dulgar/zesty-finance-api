import type { AccountRoleSelectable } from './zesty-finance-db.js';
import { zestyFinanceDb } from '../../db/index.js';

const getByAccountId = (accountId: string): Promise<Pick<AccountRoleSelectable, 'id' | 'label'>[]> => {
  return zestyFinanceDb
    .selectFrom('accounts_roles')
    .innerJoin('account_roles', 'account_roles.id', 'accounts_roles.account_role_id')
    .select(['account_roles.id', 'account_roles.label'])
    .where('accounts_roles.account_id', '=', accountId)
    .where('account_roles.is_active', '=', true)
    .where('account_roles.is_deleted', '=', false)
    .execute();
};

export default { getByAccountId };
