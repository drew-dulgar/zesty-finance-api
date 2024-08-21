import { Model } from 'objection';
import { Account, AccountsRoles } from './index.mjs';

class AccountRole extends Model {
  static tableName = 'account_roles';

  static relationMappings = () => ({
    accounts: {
      relation: Model.ManyToManyRelation,
      modelClass: Account,
      join: {
        from: `${AccountRole.tableName}.id`,
        through: {
          from: `${AccountsRoles.tableName}.account_role_id`,
          to: `${AccountsRoles.tableName}.account_id`
        },
        to: `${Account.tableName}.id`
      }
    },
  });
}

export default AccountRole;