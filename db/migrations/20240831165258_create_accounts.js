import { primaryKeyAsGeneratedIdentity, timestamp, timestamps, isActive, isDeleted } from '../columns.mjs';

export const up = (knex) => knex.schema.createTable('accountsx', (table) => {
  primaryKeyAsGeneratedIdentity(knex, table, 'id');
  table.integer('account_plan_id').references('id').inTable('account_plansx');
  table.string('username', 50).unique();
  table.string('email', 512).notNullable().unique();
  table.boolean('email_verified').notNullable().defaultTo(false);
  table.binary('password');
  table.binary('salt');
  table.string('first_name', 255);
  table.string('middle_name', 255);
  table.string('last_name', 255);
  timestamp(knex, table, 'last_login');
  isActive(knex, table);
  isDeleted(knex, table);
  timestamps(knex, table);
});

export const down = (knex) => knex.schema.dropTableIfExists('accountsx');