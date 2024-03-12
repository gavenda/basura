import { getValue } from './object';

export const zip = <S1, S2>(firstCollection: Array<S1>, lastCollection: Array<S2>): Array<[S1, S2]> => {
  const length = Math.min(firstCollection.length, lastCollection.length);
  const zipped: Array<[S1, S2]> = [];

  for (let index = 0; index < length; index++) {
    zipped.push([firstCollection[index], lastCollection[index]]);
  }

  return zipped;
};

export const distinctByKey = <T>(array: T[], key: string): T[] => {
  const unique = new Map<string, number>();
  const distinct = [];
  for (let i = 0; i < array.length; i++) {
    const value = getValue(array[i], key);

    if (!value) break;
    if (!unique.has(String(value))) {
      distinct.push(array[i]);
      unique.set(String(value), 1);
    }
  }
  return distinct;
};
