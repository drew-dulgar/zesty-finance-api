import { type Kysely, sql } from 'kysely';

export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .createTable('account_document_acceptances')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`uuid_generate_v7()`),
    )
    .addColumn('account_id', 'uuid', (col) => col.notNull())
    .addColumn('document_id', 'uuid', (col) => col.notNull())
    .addColumn('accepted_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`(now() at time zone 'utc')`),
    )
    .execute();

  await db.schema
    .alterTable('account_document_acceptances')
    .addForeignKeyConstraint(
      'account_document_acceptances_account_id_fk',
      ['account_id'],
      'accounts',
      ['id'],
      (fk) => fk.onUpdate('cascade').onDelete('cascade'),
    )
    .execute();

  await db.schema
    .alterTable('account_document_acceptances')
    .addForeignKeyConstraint(
      'account_document_acceptances_document_id_fk',
      ['document_id'],
      'documents',
      ['id'],
      (fk) => fk.onUpdate('cascade').onDelete('restrict'),
    )
    .execute();

  await db.schema
    .alterTable('account_document_acceptances')
    .addUniqueConstraint('account_document_acceptances_account_document_key', [
      'account_id',
      'document_id',
    ])
    .execute();

  await sql`
    CREATE INDEX account_document_acceptances_account_id_idx
    ON account_document_acceptances (account_id);
  `.execute(db);
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .dropTable('account_document_acceptances')
    .ifExists()
    .execute();
};
