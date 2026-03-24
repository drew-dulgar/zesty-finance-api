import type { Generated, Insertable, Selectable, Updateable } from 'kysely';

// Sessions — better-auth session table
export interface SessionsTable {
  id: Generated<string>;
  expires_at: Date | string;
  token: string;
  ip_address: string | null;
  user_agent: string | null;
  account_id: string;
  created_at: Generated<Date | string>;
  updated_at: Generated<Date | string>;
}

export type SessionSelectable = Selectable<SessionsTable>;
export type SessionInsertable = Insertable<SessionsTable>;
export type SessionUpdateable = Updateable<SessionsTable>;

// Account Providers — better-auth OAuth provider links
export interface AccountProvidersTable {
  id: Generated<string>;
  provider_account_id: string;
  provider_id: string;
  account_id: string;
  access_token: string | null;
  refresh_token: string | null;
  id_token: string | null;
  access_token_expires_at: Date | string | null;
  refresh_token_expires_at: Date | string | null;
  scope: string | null;
  password: string | null;
  created_at: Generated<Date | string>;
  updated_at: Generated<Date | string>;
}

export type AccountProviderSelectable = Selectable<AccountProvidersTable>;
export type AccountProviderInsertable = Insertable<AccountProvidersTable>;
export type AccountProviderUpdateable = Updateable<AccountProvidersTable>;

// Account Verifications — better-auth email verification tokens
export interface AccountVerificationsTable {
  id: Generated<string>;
  identifier: string;
  value: string;
  expires_at: Date | string;
  created_at: Generated<Date | string>;
  updated_at: Generated<Date | string>;
}

export type AccountVerificationSelectable = Selectable<AccountVerificationsTable>;
export type AccountVerificationInsertable = Insertable<AccountVerificationsTable>;
export type AccountVerificationUpdateable = Updateable<AccountVerificationsTable>;

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
export type AccountRoleInsertable = Insertable<AccountRolesTable>;
export type AccountRoleUpdateable = Updateable<AccountRolesTable>;

// Accounts Roles — many-to-many junction: accounts ↔ account_roles
export interface AccountsRolesTable {
  account_id: string;
  account_role_id: string;
  created_at: Generated<Date | string>;
  updated_at: Generated<Date | string>;
}

export type AccountsRoleSelectable = Selectable<AccountsRolesTable>;
export type AccountsRoleInsertable = Insertable<AccountsRolesTable>;
export type AccountsRoleUpdateable = Updateable<AccountsRolesTable>;

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
export type AccountHistoryUpdateable = Updateable<AccountHistoryTable>;

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
export type LogUpdateable = Updateable<LogsTable>;

export interface ZestyFinanceDB {
  accounts: AccountsTable;
  account_history: AccountHistoryTable;
  account_plans: AccountPlansTable;
  account_providers: AccountProvidersTable;
  account_roles: AccountRolesTable;
  account_verifications: AccountVerificationsTable;
  accounts_roles: AccountsRolesTable;
  logs: LogsTable;
  sessions: SessionsTable;
};
