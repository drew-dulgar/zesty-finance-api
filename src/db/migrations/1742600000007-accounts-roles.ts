import { type Kysely, sql } from 'kysely';

// Many-to-many: accounts ↔ account_roles
export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .createTable('accounts_roles')
    .ifNotExists()
    .addColumn('account_id', 'uuid', (col) => col.notNull())
    .addColumn('account_role_id', 'uuid', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`(now() at time zone 'utc')`),
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`(now() at time zone 'utc')`),
    )
    .addPrimaryKeyConstraint('accounts_roles_pk', [
      'account_id',
      'account_role_id',
    ])
    .addForeignKeyConstraint(
      'accounts_roles_account_id_fk',
      ['account_id'],
      'accounts',
      ['id'],
      (fk) => fk.onUpdate('cascade').onDelete('cascade'),
    )
    .addForeignKeyConstraint(
      'accounts_roles_account_role_id_fk',
      ['account_role_id'],
      'account_roles',
      ['id'],
      (fk) => fk.onUpdate('cascade').onDelete('cascade'),
    )
    .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema.dropTable('accounts_roles').ifExists().execute();
};
