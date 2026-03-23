import { Kysely, sql } from 'kysely';

export const up = async (db: Kysely<any>): Promise<void> => {
  await sql`
    CREATE OR REPLACE FUNCTION track_account_field_changes()
    RETURNS TRIGGER AS $$
    BEGIN
      IF TG_OP = 'INSERT' THEN
        IF NEW.email IS NOT NULL THEN
          INSERT INTO account_history (account_id, field, value)
          VALUES (NEW.id, 'email', NEW.email);
        END IF;

        IF NEW.username IS NOT NULL THEN
          INSERT INTO account_history (account_id, field, value)
          VALUES (NEW.id, 'username', NEW.username);
        END IF;
      ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.email IS DISTINCT FROM NEW.email THEN
          INSERT INTO account_history (account_id, field, value)
          VALUES (NEW.id, 'email', NEW.email);
        END IF;

        IF OLD.username IS DISTINCT FROM NEW.username THEN
          INSERT INTO account_history (account_id, field, value)
          VALUES (NEW.id, 'username', NEW.username);
        END IF;
      END IF;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `.execute(db);

  await sql`
    CREATE OR REPLACE TRIGGER track_account_field_changes
    AFTER INSERT OR UPDATE ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION track_account_field_changes();
  `.execute(db);
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await sql`DROP TRIGGER IF EXISTS track_account_field_changes ON accounts`.execute(db);
  await sql`DROP FUNCTION IF EXISTS track_account_field_changes`.execute(db);
};
