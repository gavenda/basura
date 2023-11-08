export const getValue = (data: any, path: string, defaultValue?: any): any => {
  const value = path
    .split(/[.[\]]/)
    .filter(Boolean)
    .reduce((value, key) => (value as any)?.[key], data as any);

  return value !== undefined ? value : defaultValue;
};
