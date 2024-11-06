import { Kysely, sql } from 'kysely';

export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .createTable('account_plans').ifNotExists()
    .addColumn('id', 'integer', col => col.primaryKey().generatedByDefaultAsIdentity())
    .addColumn('label', 'varchar(100)', col => col.notNull().unique())
    .addColumn('description', 'text')
    .addColumn('plan', 'jsonb', col => col.notNull().defaultTo('{}'))
    .addColumn('price_monthly', 'decimal(12, 2)')
    .addColumn('price_yearly', 'decimal(12, 2)')
    .addColumn('is_default', 'boolean', col => col.notNull().defaultTo(false))
    .addColumn('is_active', 'boolean', col => col.notNull().defaultTo(false))
    .addColumn('is_deleted', 'boolean', col => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamp', col => col.notNull().defaultTo(sql`(now() at time zone 'utc')`))
    .addColumn('updated_at', 'timestamp', col => col.notNull().defaultTo(sql`(now() at time zone 'utc')`))
    .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema.dropTable('account_plans').ifExists().execute();
};