import type { Generated, Insertable, Selectable, Updateable } from 'kysely';

// Accounts — better-auth user table
export interface AccountsTable {
  id: Generated<string>;
  username: string | null;
  email: string;
  email_verified: Generated<boolean>;
  name: string;
  image: string | null;
  first_name: string | null;
  last_name: string | null;
  sign_in_count: Generated<number>;
  sign_in_at: Date | string | null;
  is_active: Generated<boolean>;
  is_deleted: Generated<boolean>;
  created_at: Generated<Date | string>;
  updated_at: Generated<Date | string>;
}

export type AccountSelectable = Selectable<AccountsTable>;
export type AccountInsertable = Insertable<AccountsTable>;
export type AccountUpdateable = Updateable<AccountsTable>;

// Account Plans
export interface AccountPlansPlanJson {
  portfolios: number;
}

export interface AccountPlansTable {
  id: Generated<string>;
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

// Account Roles — shared baseline list of roles
export interface AccountRolesTable {
  id: Generated<string>;
  label: string;
  description: string | null;
  is_default: Generated<boolean>;
  is_active: Generated<boolean>;
  is_deleted: Generated<boolean>;
  created_at: Generated<Date | string>;
  updated_at: Generated<Date | string>;
}

export type AccountRoleSelectable = Selectable<AccountRolesTable>;

// Accounts Roles — many-to-many junction: accounts ↔ account_roles
export interface AccountsRolesTable {
  account_id: string;
  account_role_id: string;
  created_at: Generated<Date | string>;
  updated_at: Generated<Date | string>;
}

export type AccountsRoleSelectable = Selectable<AccountsRolesTable>;
export type AccountsRoleInsertable = Insertable<AccountsRolesTable>;

// Account History — tracks changes to username and email fields
export interface AccountHistoryTable {
  id: Generated<string>;
  account_id: string;
  field: 'email' | 'username';
  value: string | null;
  created_at: Generated<Date | string>;
  updated_at: Generated<Date | string>;
}

export type AccountHistorySelectable = Selectable<AccountHistoryTable>;
export type AccountHistoryInsertable = Insertable<AccountHistoryTable>;

// Logs — generic activity log
export interface LogsTable {
  id: Generated<string>;
  account_id: string | null;
  actor_id: string | null;
  action: string;
  resource: string | null;
  resource_id: string | null;
  metadata: unknown | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: Generated<Date | string>;
  updated_at: Generated<Date | string>;
}

export type LogSelectable = Selectable<LogsTable>;
export type LogInsertable = Insertable<LogsTable>;

export interface ZestyFinanceDB {
  accounts: AccountsTable;
  account_plans: AccountPlansTable;
  account_roles: AccountRolesTable;
  accounts_roles: AccountsRolesTable;
  account_history: AccountHistoryTable;
  logs: LogsTable;
};
