import { type Kysely, sql } from 'kysely';

export const up = async (db: Kysely<any>): Promise<void> => {
  await sql`CREATE TYPE account_history_field AS ENUM ('email', 'username')`.execute(
    db,
  );

  await db.schema
    .createTable('account_history')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`uuid_generate_v7()`),
    )
    .addColumn('account_id', 'uuid', (col) => col.notNull())
    .addColumn('field', sql`account_history_field`, (col) => col.notNull())
    .addColumn('value', 'text')
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`(now() at time zone 'utc')`),
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`(now() at time zone 'utc')`),
    )
    .execute();

  await db.schema
    .alterTable('account_history')
    .addForeignKeyConstraint(
      'account_history_account_id_fk',
      ['account_id'],
      'accounts',
      ['id'],
      (fk) => fk.onUpdate('cascade').onDelete('cascade'),
    )
    .execute();

  await sql`
    CREATE OR REPLACE TRIGGER set_updated_at
    BEFORE UPDATE ON account_history
    FOR EACH ROW
    WHEN (OLD IS DISTINCT FROM NEW)
    EXECUTE FUNCTION set_updated_at();
  `.execute(db);
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema.dropTable('account_history').ifExists().execute();
  await sql`DROP TYPE IF EXISTS account_history_field`.execute(db);
};
