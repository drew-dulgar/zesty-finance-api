import { Model } from 'objection';
import { Account } from './index.mjs';

class AccountPlan extends Model {
  static tableName = 'account_plans';

  static relationMappings = () => ({
    accounts: {
      relation: Model.HasManyRelation,
      modelClass: Account,
      join: {
        from: `${AccountPlan.tableName}.id`,
        to: `${Account.tableName}.account_plan_id`
      }
    },
  });
}


export default AccountPlan;