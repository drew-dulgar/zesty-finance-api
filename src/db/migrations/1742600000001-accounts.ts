import { type Kysely, sql } from 'kysely';

// better-auth user table — renamed to 'accounts'
export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .createTable('accounts')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`uuid_generate_v7()`),
    )
    .addColumn('username', 'text')
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('email_verified', 'boolean', (col) =>
      col.notNull().defaultTo(false),
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('image', 'text')
    .addColumn('first_name', 'text')
    .addColumn('last_name', 'text')
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`(now() at time zone 'utc')`),
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`(now() at time zone 'utc')`),
    )
    .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema.dropTable('accounts').ifExists().execute();
};
