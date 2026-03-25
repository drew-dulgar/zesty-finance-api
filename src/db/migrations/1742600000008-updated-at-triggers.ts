import { type Kysely, sql } from 'kysely';

const tables = [
  'accounts',
  'sessions',
  'account_providers',
  'account_verifications',
  'account_plans',
  'account_roles',
  'accounts_roles',
];

export const up = async (db: Kysely<any>): Promise<void> => {
  await sql`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now() AT TIME ZONE 'utc';
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `.execute(db);

  for (const table of tables) {
    await sql`
      CREATE OR REPLACE TRIGGER set_updated_at
      BEFORE UPDATE ON ${sql.table(table)}
      FOR EACH ROW
      WHEN (OLD IS DISTINCT FROM NEW)
      EXECUTE FUNCTION set_updated_at();
    `.execute(db);
  }
};

export const down = async (db: Kysely<any>): Promise<void> => {
  for (const table of tables) {
    await sql`DROP TRIGGER IF EXISTS set_updated_at ON ${sql.table(table)}`.execute(
      db,
    );
  }

  await sql`DROP FUNCTION IF EXISTS set_updated_at`.execute(db);
};
