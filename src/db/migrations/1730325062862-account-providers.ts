import { Kysely } from 'kysely';

export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .createTable('account_providers').ifNotExists()
    .addColumn('id', 'integer', col => col.primaryKey().generatedByDefaultAsIdentity())
    .addColumn('account_id', 'integer', col => col.references('accounts.id').notNull().onUpdate('cascade').onDelete('cascade'))
    .addColumn('type', 'varchar(255)', col => col.notNull())
    .addColumn('provider_account_id', 'varchar(255)', col => col.notNull())
    .addColumn('refresh_token', 'text')
    .addColumn('access_token', 'text')
    .addColumn('expires_at', 'timestamp')
    .addColumn('id_token', 'text')
    .addColumn('scope', 'text')
    .addColumn('session_state', 'text')
    .addColumn('token_type', 'text')
    .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema.dropTable('account_providers').ifExists().execute();
};