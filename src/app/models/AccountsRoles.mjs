import { Model } from 'objection';
import { Account, AccountRole } from './index';

class AccountsRoles extends Model {
  static tableName = 'accounts_roles';

  static relationMappings = () => ({
    account: {
      relation: Model.BelongsToOneRelation,
      modelClass: Account,
      join: {
        from: `${AccountsRoles}.account_id`,
        to: `${Account.tableName}.id`
      }
    },
    role: {
      relation: Model.BelongsToOneRelation,
      modelClass: Account,
      join: {
        from: `${AccountsRoles}.account_role_id`,
        to: `${AccountRole.tableName}.id`
      }
    }
  });
}

export default AccountsRoles;