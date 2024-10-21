export const getValue = <T>(data: T, path: string, defaultValue?: T): T | undefined => {
  const value = path
    .split(/[.[\]]/)
    .filter(Boolean)
    // @ts-expect-error hacky way to get deep value
    .reduce((value, key) => value?.[key], data);

  return value !== undefined ? value : defaultValue;
};
