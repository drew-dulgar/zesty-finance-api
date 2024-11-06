import { Kysely, sql } from 'kysely';

export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .createTable('accounts_roles').ifNotExists()
    .addColumn('id', 'integer', col => col.primaryKey().generatedByDefaultAsIdentity())
    .addColumn('account_id', 'integer', col => col.references('accounts.id').notNull().onUpdate('cascade').onDelete('cascade'))
    .addColumn('account_role_id', 'integer', col => col.references('account_roles.id').notNull().onUpdate('cascade').onDelete('cascade'))
    .addColumn('created_at', 'timestamp', col => col.notNull().defaultTo(sql`(now() at time zone 'utc')`))
    .addColumn('updated_at', 'timestamp', col => col.notNull().defaultTo(sql`(now() at time zone 'utc')`))
    .addUniqueConstraint('accounts_roles_account_id_account_role_id', ['account_id', 'account_role_id'])
    .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema.dropTable('accounts_roles').ifExists().execute();
};