import type { Kysely } from 'kysely';

export const up = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .alterTable('accounts')
    .addColumn('sign_in_count', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('sign_in_at', 'timestamp')
    .addColumn('is_active', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('is_deleted', 'boolean', (col) => col.notNull().defaultTo(false))
    .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema
    .alterTable('accounts')
    .dropColumn('sign_in_count')
    .dropColumn('sign_in_at')
    .dropColumn('is_active')
    .dropColumn('is_deleted')
    .execute();
};
