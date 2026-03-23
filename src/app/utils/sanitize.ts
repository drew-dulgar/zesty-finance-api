export const emptyStringToNull = (value: string | null | undefined): string | null =>
  value === '' ? null : (value ?? null);
