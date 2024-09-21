export const primaryKeyAsGeneratedIdentity = (knex, table, columnName, type = 'int') => {
  table.specificType(columnName, `${type} PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY`);
  return table;
};

export const timestamp = (knex, table, columnName, defaultTo = "(now() at time zone 'utc')", useTz = false) => {
  return table.timestamp(columnName, { useTz }).defaultTo(knex.raw(defaultTo));
}

export const timestamps = (knex, table) => {
  timestamp(knex, table, 'created_at').notNullable();
  timestamp(knex, table, 'updated_at').notNullable();

  return table;
};

export const boolean = (knex, table, column) => {
  return table.boolean(column).notNullable().defaultTo(false);
};

export const isActive = (knex, table) => {
  return boolean(knex, table, 'is_active');
};

export const isDeleted = (knex, table) => {
  return boolean(knex, table, 'is_deleted');
}

export const isDefault = (knex, table) => {
  return boolean(knex, table, 'is_default');
}