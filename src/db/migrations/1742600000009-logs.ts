import { Kysely, sql } from 'kysely';

export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .createTable('logs').ifNotExists()
    .addColumn('id', 'uuid', col => col.primaryKey().defaultTo(sql`uuid_generate_v7()`))
    .addColumn('account_id', 'uuid')
    .addColumn('actor_id', 'uuid')
    .addColumn('action', 'varchar(100)', col => col.notNull())
    .addColumn('resource', 'varchar(100)')
    .addColumn('resource_id', 'text')
    .addColumn('metadata', 'jsonb')
    .addColumn('ip_address', 'text')
    .addColumn('user_agent', 'text')
    .addColumn('created_at', 'timestamp', col => col.notNull().defaultTo(sql`(now() at time zone 'utc')`))
    .addColumn('updated_at', 'timestamp', col => col.notNull().defaultTo(sql`(now() at time zone 'utc')`))
    .execute();

  await db.schema
    .alterTable('logs')
    .addForeignKeyConstraint('logs_account_id_fk', ['account_id'], 'accounts', ['id'], fk => fk.onUpdate('cascade').onDelete('set null'))
    .execute();

  await db.schema
    .alterTable('logs')
    .addForeignKeyConstraint('logs_actor_id_fk', ['actor_id'], 'accounts', ['id'], fk => fk.onUpdate('cascade').onDelete('set null'))
    .execute();

  await sql`
    CREATE OR REPLACE TRIGGER set_updated_at
    BEFORE UPDATE ON logs
    FOR EACH ROW
    WHEN (OLD IS DISTINCT FROM NEW)
    EXECUTE FUNCTION set_updated_at();
  `.execute(db);
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema.dropTable('logs').ifExists().execute();
};
