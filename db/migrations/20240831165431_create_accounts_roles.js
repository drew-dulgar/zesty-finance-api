import { timestamps } from '../columns.mjs';

export const up = (knex) => knex.schema.createTable('accounts_rolesx', (table) => {
  table.integer('account_id').references('id').inTable('accountsx').onUpdate('cascade').onDelete('cascade');
  table.integer('account_role_id').references('id').inTable('account_rolesx').onUpdate('cascade').onDelete('cascade');
  timestamps(knex, table);
  table.unique(['account_id', 'account_role_id']);
});

export const down = (knex) => knex.schema.dropTableIfExists('accounts_rolesx');