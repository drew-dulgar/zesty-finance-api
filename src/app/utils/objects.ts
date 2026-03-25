import { camelCase, mapKeys, snakeCase } from 'lodash-es';

export const selectableToCamel = <Selectable, SelectableCamel>(
  selectable: Selectable,
): SelectableCamel =>
  mapKeys(selectable, (_v: unknown, k: string) => camelCase(k));

export const camelToSelectable = <SelectableCamel, Selectable>(
  selectableCamel: SelectableCamel,
): Selectable =>
  mapKeys(selectableCamel, (_v: unknown, k: string) => snakeCase(k));
