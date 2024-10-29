
import { AccountPlan } from '../models/index';
import BaseService from './BaseService';

class AccountPlanService extends BaseService {
  get({
    id,
    isActive,
    isDeleted = false,
    isDefault
  } = {}) {
    const query = AccountPlan.query();

    if (typeof id !== 'undefined') {
      if (Array.isArray(id)) {
        query.where(`${AccountPlan.tableName}.id`, id);
      } else {
        query.whereIn(`${AccountPlan.tableName}.id`, id);
      }
    }

    if (typeof isActive !== 'undefined') {
      query.where(`${AccountPlan.tableName}.is_active`, isActive);
    }

    if (typeof isDeleted !== 'undefined') {
      query.where(`${AccountPlan.tableName}.is_deleted`, isDeleted);
    }

    if (typeof isDefault !== 'undefined') {
      query.where(`${AccountPlan.tableName}.is_default`, isDefault);
    }

    return query;
  }

  getOne(id) {
    return this.get().findById(id);
  }
}

export default new AccountPlanService();