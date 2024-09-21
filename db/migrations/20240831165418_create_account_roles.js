import { primaryKeyAsGeneratedIdentity, timestamp, timestamps, isActive, isDeleted, isDefault } from '../columns.mjs';

export const up = (knex) => knex.schema.createTable('account_rolesx', (table) => {
    primaryKeyAsGeneratedIdentity(knex, table, 'id');
    table.string('label', 100).unique().notNullable();
    table.text('description');
    isActive(knex, table);
    isDeleted(knex, table);
    isDefault(knex, table);
});

export const down = (knex) => knex.schema.dropTableIfExists('account_rolesx');