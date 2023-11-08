import { getValue } from './object.js';

export const zip = <S1, S2>(firstCollection: Array<S1>, lastCollection: Array<S2>): Array<[S1, S2]> => {
  const length = Math.min(firstCollection.length, lastCollection.length);
  const zipped: Array<[S1, S2]> = [];

  for (let index = 0; index < length; index++) {
    zipped.push([firstCollection[index], lastCollection[index]]);
  }

  return zipped;
};

export const distinctByKey = <T>(array: any[], key: string): T[] => {
  var unique = [];
  var distinct = [];
  for (let i = 0; i < array.length; i++) {
    const value = getValue(array[i], key);
    if (!unique[value]) {
      distinct.push(array[i]);
      unique[value] = 1;
    }
  }
  return distinct;
};
