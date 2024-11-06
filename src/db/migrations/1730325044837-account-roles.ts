import { Kysely, sql } from 'kysely';

export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .createTable('account_roles').ifNotExists()
    .addColumn('id', 'integer', col => col.primaryKey().generatedByDefaultAsIdentity())
    .addColumn('label', 'varchar(100)', col => col.notNull().unique())
    .addColumn('description', 'text')
    .addColumn('is_default', 'boolean', col => col.notNull().defaultTo(false))
    .addColumn('is_active', 'boolean', col => col.notNull().defaultTo(false))
    .addColumn('is_deleted', 'boolean', col => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamp', col => col.notNull().defaultTo(sql`(now() at time zone 'utc')`))
    .addColumn('updated_at', 'timestamp', col => col.notNull().defaultTo(sql`(now() at time zone 'utc')`))
    .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema.dropTable('account_roles').ifExists().execute();
};