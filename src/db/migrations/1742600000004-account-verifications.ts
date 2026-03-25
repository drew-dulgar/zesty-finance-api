import { type Kysely, sql } from 'kysely';

// better-auth verification table — renamed to 'account_verifications'
export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .createTable('account_verifications')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`uuid_generate_v7()`),
    )
    .addColumn('identifier', 'text', (col) => col.notNull())
    .addColumn('value', 'text', (col) => col.notNull())
    .addColumn('expires_at', 'timestamp', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`(now() at time zone 'utc')`),
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`(now() at time zone 'utc')`),
    )
    .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema.dropTable('account_verifications').ifExists().execute();
};
