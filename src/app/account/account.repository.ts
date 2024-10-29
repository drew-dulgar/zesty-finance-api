import type { Kysely } from 'kysely';
import type { ZestyFinanceDB, AccountSelectable } from '../zesty-finance-db.types.js';

const get = async (
  id: number,
  db: Kysely<ZestyFinanceDB>
): Promise<AccountSelectable[]> => {
  
  const accounts = await db
    .selectFrom('accounts')
    .where('id', '=', id)
    .selectAll('accounts')
    .execute();

  return accounts;
};

export default { 
  get
};