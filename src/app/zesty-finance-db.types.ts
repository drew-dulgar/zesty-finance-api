import { AccountTable, AccountSelectable, AccountInsertable, AccountUpdateable } from './account/account.table.types.js';

export { 
  AccountTable,
  AccountSelectable,
  AccountInsertable,
  AccountUpdateable,
};

export interface ZestyFinanceDB {
  accounts: AccountTable;
}