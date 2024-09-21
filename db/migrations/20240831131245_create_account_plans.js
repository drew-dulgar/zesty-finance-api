import { primaryKeyAsGeneratedIdentity, timestamps, isActive, isDeleted, isDefault } from '../columns.mjs';

export const up = (knex) => knex.schema.createTable('account_plansx', (table) => {
  primaryKeyAsGeneratedIdentity(knex, table, 'id');
  table.string('label', 100).unique().notNullable();
  table.text('description');
  table.jsonb('plan').notNullable().defaultTo('{}');
  table.decimal('price_monthly', 12, 2).nullable();
  table.decimal('price_yearly', 12, 2).nullable();
  isActive(knex, table);
  isDeleted(knex, table);
  isDefault(knex, table);
  timestamps(knex, table);
});

export const down = (knex) => knex.schema.dropTableIfExists('account_plansx');
