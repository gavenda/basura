/** Drops null, undefined, false and empty strings, so optional parts can be listed inline. */
export const compact = <T>(items: (T | null | undefined | false | '' | 0)[]): T[] => {
  return items.filter(Boolean) as T[];
};
