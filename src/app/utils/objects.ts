import { mapKeys, camelCase, snakeCase } from 'lodash-es';

export const selectableToCamel = <Selectable, SelectableCamel>(selectable: Selectable): SelectableCamel => (
  mapKeys(selectable, (v: any, k: string) => camelCase(k))
);

export const camelToSelectable = <SelectableCamel, Selectable>(selectableCamel: SelectableCamel): Selectable => (
  mapKeys(selectableCamel, (v: any, k: string) => snakeCase(k))
);