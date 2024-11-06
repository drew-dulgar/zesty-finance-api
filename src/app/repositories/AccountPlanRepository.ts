
import type { Kysely, Transaction, SelectExpression } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import type { ZestyFinanceDB, AccountPlanSelectable, AccountInsertable, AccountUpdateable } from './zesty-finance-db.js';
import type { AccountPlan } from '../services/AccountPlanService.js';

import { zestyFinanceDb } from '../../db/index.js';
import { camelToSelectable } from '../utils/objects.js';

const get = (
  {
    select = ['id', 'label', 'description', 'plan', 'price_monthly', 'price_yearly', 'is_default', 'is_active', 'is_deleted', 'created_at', 'updated_at'],
    where = {},
    limit,
    offset,
  }: {
    select?: SelectExpression<ZestyFinanceDB, "account_plans">[];
    where?: AccountPlan;
    limit?: number;
    offset?: number;
  },
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb
) => {
  let query = db
    .selectFrom('account_plans')
    .select(select);

    if (typeof where.id !== 'undefined') {
      query = query.where('id', '=', where.id);
    }

    if (typeof where.isDefault !== 'undefined') {
      query = query.where('is_default', '=', where.isDefault);
    }

    if (typeof where.isActive !== 'undefined') {
      query = query.where('is_active', '=', where.isActive);
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

  export default {
    get
  };