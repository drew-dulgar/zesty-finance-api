import { Kysely, sql } from 'kysely';
import { json, text } from 'stream/consumers';

export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .createTable('sessions').ifNotExists()
    .addColumn('sid', 'varchar', col => col.notNull().primaryKey())
    .addColumn('sess', 'jsonb', col => col.notNull().defaultTo('{}'))
    .addColumn('expire', 'timestamp(6)', col => col.notNull())
    .execute();

  await db.schema
    .createIndex('IDX_sessions_expire')
    .on('sessions')
    .column('expire')
    .execute()
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema.dropTable('sessions').ifExists().execute();
};
