import type { Kysely, Transaction, SelectExpression } from 'kysely';
import type { ZestyFinanceDB, AccountRoleSelectable } from './zesty-finance-db.js';

import { zestyFinanceDb } from '../../db/index.js';

type AccountRoleWhere = {
  id?: string;
  label?: string;
  isDefault?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
};

const get = (
  {
    select = ['id', 'label', 'description', 'is_default', 'is_active', 'is_deleted', 'created_at', 'updated_at'],
    where = {},
    limit,
    offset,
  }: {
    select?: SelectExpression<ZestyFinanceDB, 'account_roles'>[];
    where?: AccountRoleWhere;
    limit?: number;
    offset?: number;
  },
  db: Kysely<ZestyFinanceDB> | Transaction<ZestyFinanceDB> = zestyFinanceDb
) => {
  let query = db
    .selectFrom('account_roles')
    .select(select);

  if (typeof where.id !== 'undefined') {
    query = query.where('id', '=', where.id);
  }

  if (typeof where.label !== 'undefined') {
    query = query.where('label', '=', where.label);
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

export default { get };
