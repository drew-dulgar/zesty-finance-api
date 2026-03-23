import { Kysely, sql } from 'kysely';

// better-auth session table — renamed to 'sessions'
export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .createTable('sessions').ifNotExists()
    .addColumn('id', 'uuid', col => col.primaryKey().defaultTo(sql`uuid_generate_v7()`))
    .addColumn('expires_at', 'timestamp', col => col.notNull())
    .addColumn('token', 'text', col => col.notNull().unique())
    .addColumn('ip_address', 'text')
    .addColumn('user_agent', 'text')
    .addColumn('account_id', 'uuid', col => col.notNull().references('accounts.id').onUpdate('cascade').onDelete('cascade'))
    .addColumn('created_at', 'timestamp', col => col.notNull().defaultTo(sql`(now() at time zone 'utc')`))
    .addColumn('updated_at', 'timestamp', col => col.notNull().defaultTo(sql`(now() at time zone 'utc')`))
    .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema.dropTable('sessions').ifExists().execute();
};
