export const emptyStringToNull = (value: unknown): string | null =>
  typeof value === 'string' && value !== '' ? value : null;
