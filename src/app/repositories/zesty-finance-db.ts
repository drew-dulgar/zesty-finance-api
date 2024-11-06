import type { Generated, Insertable, Selectable, Updateable } from 'kysely';

// Account
export interface AccountsTable {
  id: Generated<number>;
  account_plan_id: number;
  username: string | null;
  email: string;
  email_verified: Generated<boolean>;
  salt: Buffer | null;
  password: Buffer | null;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  login_last: Generated<Date | string | null>;
  login_attempts: number;
  login_locked_until: Generated<Date | string | null>;
  is_deleted: Generated<boolean>;
  created_at: Generated<Date | string>;
  updated_at: Generated<Date | string>;
};

export type AccountSelectable = Selectable<AccountsTable>;
export type AccountInsertable = Insertable<AccountsTable>;
export type AccountUpdateable = Updateable<AccountsTable>;

// Account Plans
export interface AccountPlansPlanJson {
  portfolios: number;
}

export interface AccountPlansTable {
  id: Generated<number>;
  label: string;
  description: string | null;
  plan: Generated<AccountPlansPlanJson>;
  price_monthly: number | null;
  price_yearly: number | null;
  is_default: Generated<boolean>;
  is_active: Generated<boolean>;
  is_deleted: Generated<boolean>;
  created_at: Generated<Date | string>;
  updated_at: Generated<Date | string>;
}

export type AccountPlanSelectable = Selectable<AccountPlansTable>;
export type AccountPlanInsertable = Insertable<AccountPlansTable>;
export type AccountPlanUpdateable = Updateable<AccountPlansTable>;


export interface ZestyFinanceDB {
  accounts: AccountsTable;
  account_plans: AccountPlansTable;
};