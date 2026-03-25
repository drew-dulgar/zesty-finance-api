import { type Kysely, sql } from 'kysely';

export const up = async (db: Kysely<any>): Promise<void> => {
  // accounts.email and sessions.token are already indexed via their UNIQUE constraints

  // accounts: unique constraint on username
  await sql`ALTER TABLE accounts ADD CONSTRAINT accounts_username_key UNIQUE (username)`.execute(
    db,
  );

  // sessions: look up all sessions for an account
  await sql`CREATE INDEX sessions_account_id_idx ON sessions (account_id)`.execute(
    db,
  );

  // account_providers: look up all providers linked to an account
  await sql`CREATE INDEX account_providers_account_id_idx ON account_providers (account_id)`.execute(
    db,
  );

  // account_providers: OAuth callback lookup by provider + provider's account id
  await sql`CREATE INDEX account_providers_provider_idx ON account_providers (provider_id, provider_account_id)`.execute(
    db,
  );

  // account_verifications: look up verification tokens by identifier (email)
  await sql`CREATE INDEX account_verifications_identifier_idx ON account_verifications (identifier)`.execute(
    db,
  );
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await sql`ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_username_key`.execute(
    db,
  );
  await sql`DROP INDEX IF EXISTS sessions_account_id_idx`.execute(db);
  await sql`DROP INDEX IF EXISTS account_providers_account_id_idx`.execute(db);
  await sql`DROP INDEX IF EXISTS account_providers_provider_idx`.execute(db);
  await sql`DROP INDEX IF EXISTS account_verifications_identifier_idx`.execute(
    db,
  );
};
