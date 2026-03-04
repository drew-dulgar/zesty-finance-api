import { Kysely, sql } from 'kysely';

export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .createTable('account_email_verification').ifNotExists()
    .addColumn('account_id', 'integer', col => col.references('accounts.id').onUpdate('cascade').onDelete('cascade'))
    .addColumn('email', 'varchar(512)', col => col.notNull().unique())
    .addColumn('code', 'varchar(10)', col => col.notNull())
    .addColumn('verified', 'boolean', col => col.notNull().defaultTo(false))
    .addColumn('valid_until', 'timestamp', col => col.notNull().defaultTo(sql`(now() at time zone 'utc')`))
    .addColumn('created_at', 'timestamp', col => col.notNull().defaultTo(sql`(now() at time zone 'utc')`))
    .addColumn('updated_at', 'timestamp', col => col.notNull().defaultTo(sql`(now() at time zone 'utc')`))
    .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema.dropTable('account_email_verification').ifExists().execute();
};


