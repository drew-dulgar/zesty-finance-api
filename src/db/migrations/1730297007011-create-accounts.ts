import { Kysely, sql } from 'kysely';

export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
  .createTable('accounts').ifNotExists()
  .addColumn('id', 'integer', (col) => col.primaryKey().generatedByDefaultAsIdentity())
  .addColumn('username', 'varchar(50)', col => col.unique())
  .addColumn('email', 'varchar(512)', col => col.notNull().unique())
  .addColumn('email_verified', 'boolean', col => col.notNull().defaultTo(false))
  .addColumn('salt', 'bytea')
  .addColumn('password', 'bytea')
  .addColumn('first_name', 'varchar(255)')
  .addColumn('middle_name', 'varchar(255)')
  .addColumn('last_name', 'varchar(255)')
  .addColumn('locked_until', 'timestamp')
  .addColumn('is_deleted', 'boolean', col => col.notNull().defaultTo(false))
  .addColumn('created_at', 'timestamp', col => col.notNull().defaultTo(sql`(now() at time zone 'utc')`))
  .addColumn('updated_at', 'timestamp', col => col.notNull().defaultTo(sql`(now() at time zone 'utc')`))


  .execute()
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema.dropTable('accounts').ifExists().cascade().execute();
};
