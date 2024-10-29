import type { Kysely, Transaction } from 'kysely';
import type { ZestyFinanceDB, AccountSelectable } from '../zesty-finance-db.types.js';
import { zestyFinanceDb } from '../../db/index.js';
import AccountRepository from './account.repository.js';

const get = async (
  id: number,
  db: Kysely<ZestyFinanceDB> = zestyFinanceDb
): Promise<AccountSelectable[]> => {
  const accounts = await AccountRepository.get(id, db);

  return accounts;
};

export default {
  get,
}