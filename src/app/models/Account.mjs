import { Model } from 'objection';
import { AccountPlan, AccountRole, AccountsRoles } from './index.mjs';
import { AccountPlanService } from '../services/index.mjs';

class Account extends Model {
  static tableName = 'accounts';

  static relationMappings = () => ({
    accountRoles: {
      relation: Model.ManyToManyRelation,
      modelClass: AccountRole,
      join: {
        from: `${Account.tableName}.id`,
        through: {
          from: `${AccountsRoles.tableName}.account_id`,
          to: `${AccountsRoles.tableName}.account_role_id`
        },
        to: `${AccountRole.tableName}.id`
      }
    },
    accountPlan: {
      relation: Model.BelongsToOneRelation,
      modelClass: AccountPlan,
      join: {
        from: `${Account.tableName}.account_plan_id`,
        to: `${AccountPlan.tableName}.id`
      }
    },
  });

  cleanData() {
    if (typeof this.email !== 'undefined') {
      this.email = (this.email || '').trim() || null;
    }

    if (typeof this.username !== 'undefined') {
      this.username = (this.email || '').trim() || null;
    }

    if (typeof this.first_name !== 'undefined') {
      this.first_name = (this.first_name || '').trim() || null;
    }

    if (typeof this.middle_name !== 'undefined') {
      this.middle_name = (this.first_name || '').trim() || null;
    }

    if (typeof this.last_name !== 'undefined') {
      this.last_name = (this.last_name || '').trim() || null;
    }
  }

  async $beforeInsert() {
    this.cleanData();
    this.created_at = new Date().toUTCString();

    // attach the default plan if applicable
    if (!this.account_plan_id) {
      const defaultAccountPlan = await AccountPlanService.get({
        isActive: true,
        isDefault: true,
      })
        .limit(1)
        .first();

      if (defaultAccountPlan) {
        this.account_plan_id = defaultAccountPlan.id;
      }
    }
  }

  async $afterInsert() {
    // attach the default roles if applicable

  }

  $beforeUpdate() {
    this.cleanData();

    // dont trigger an update to the date if all we are doing is updating the last login attribute
    if (!(Object.keys(this).length === 1 && this.last_login)) {
      this.updated_at = new Date().toUTCString();
    }
  }
}


export default Account;