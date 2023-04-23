import { MediaFormat } from '@anilist/gql/types.js';

export const trimIndent = (str: string): string => {
  return str.replace(/^ +/gm, '');
};

export const truncate = (str: string, n: number) => {
  return str.length > n ? str.slice(0, n - 1) + '...' : str;
};

export const isBlank = (str: string) => {
  return !str || /^\s*$/.test(str);
};

export const isNotBlank = (str: string) => !isBlank(str);

export const appendIfNotMax = (str: string, append: string, max: number): string => {
  const sum = str.length + append.length;
  if (sum < max) {
    return str + append;
  }
  return str;
};

export const truncateParagraph = (str: string, n: number): string => {
  return dropNotParagraph(truncate(str, n).trim());
};

export const dropNotParagraph = (str: string): string => {
  const lastChar = str.charAt(str.length - 1);
  if (!(lastChar === '.' || lastChar === '\n')) {
    return dropLastWhile(str, (x) => x !== '\n');
  }
  return str;
};

export const dropLastWhile = (array: string, predicate: (el: string) => boolean): string => {
  let offset = array.length;
  while (0 < offset && predicate(array[offset - 1])) offset--;
  return array.slice(0, offset);
};

export const charCount = (str: string, char: string): number => {
  return str.split(char).length - 1;
};

export const zip = <S1, S2>(firstCollection: Array<S1>, lastCollection: Array<S2>): Array<[S1, S2]> => {
  const length = Math.min(firstCollection.length, lastCollection.length);
  const zipped: Array<[S1, S2]> = [];

  for (let index = 0; index < length; index++) {
    zipped.push([firstCollection[index], lastCollection[index]]);
  }

  return zipped;
};

export const titleCase = (str: string): string => {
  // https://stackoverflow.com/a/32589289
  // Modified for enums, won't work with usual things that have underscores.
  var splitStr = str.toLowerCase().replaceAll('_', ' ').split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
};

export const htmlToMarkdown = (str: string): string => {
  return str
    .replaceAll('<b>', '**')
    .replaceAll('</b>', '**')
    .replaceAll('<u>', '__')
    .replaceAll('</u>', '__')
    .replaceAll('<i>', '*')
    .replaceAll('</i>', '*')
    .replaceAll('<br>', '\n');
};

export const inStatement = (amount: number): string => {
  let str = 'IN (';
  for (let i = 0; i < amount; i++) {
    str += '?, ';
  }
  str = str.slice(0, str.length - 2);
  str += ')';
  return str;
};

export const toStars = (score: number = 0): string => {
  if (score >= 90) {
    // 5 star
    return '★'.repeat(5);
  } else if (score >= 70 && score <= 89) {
    // 4 star
    return '★'.repeat(4);
  } else if (score >= 50 && score <= 69) {
    // 3 star
    return '★'.repeat(3);
  } else if (score >= 30 && score <= 49) {
    // 2 star
    return '★'.repeat(2);
  } else if (score >= 1 && score <= 29) {
    // 1 star
    return '★'.repeat(1);
  }
  return '';
};

export const mediaFormatDisplay = (format: MediaFormat) => {
  switch (format) {
    case MediaFormat.MANGA:
      return 'Manga';
    case MediaFormat.MOVIE:
      return 'Movie';
    case MediaFormat.MUSIC:
      return 'Music';
    case MediaFormat.NOVEL:
      return 'Novel';
    case MediaFormat.ONA:
      return 'ONA';
    case MediaFormat.ONE_SHOT:
      return 'Oneshot';
    case MediaFormat.OVA:
      return 'OVA';
    case MediaFormat.SPECIAL:
      return 'Special';
    case MediaFormat.TV:
      return 'TV';
    case MediaFormat.TV_SHORT:
      return 'TV Short';
    default:
      return '-';
  }
};

type GetIndexedField<T, K> = K extends keyof T ? T[K] : K extends `${number}` ? ('0' extends keyof T ? undefined : number extends keyof T ? T[number] : undefined) : undefined;

type FieldWithPossiblyUndefined<T, Key> = GetFieldType<Exclude<T, undefined>, Key> | Extract<T, undefined>;

type IndexedFieldWithPossiblyUndefined<T, Key> = GetIndexedField<Exclude<T, undefined>, Key> | Extract<T, undefined>;

export type GetFieldType<T, P> = P extends `${infer Left}.${infer Right}`
  ? Left extends keyof T
    ? FieldWithPossiblyUndefined<T[Left], Right>
    : Left extends `${infer FieldKey}[${infer IndexKey}]`
    ? FieldKey extends keyof T
      ? FieldWithPossiblyUndefined<IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>, Right>
      : undefined
    : undefined
  : P extends keyof T
  ? T[P]
  : P extends `${infer FieldKey}[${infer IndexKey}]`
  ? FieldKey extends keyof T
    ? IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>
    : undefined
  : undefined;

export function getValue<TData, TPath extends string, TDefault = GetFieldType<TData, TPath>>(
  data: TData,
  path: TPath,
  defaultValue?: TDefault
): GetFieldType<TData, TPath> | TDefault {
  const value = path
    .split(/[.[\]]/)
    .filter(Boolean)
    .reduce<GetFieldType<TData, TPath>>((value, key) => (value as any)?.[key], data as any);

  return value !== undefined ? value : (defaultValue as TDefault);
}

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

export const toIntColor = (color: string): number => {
  switch (color) {
    case 'blue':
      return 4044018;
    case 'purple':
      return 12608511;
    case 'green':
      return 5032529;
    case 'orange':
      return 15697946;
    case 'red':
      return 14758707;
    case 'pink':
      return 12608511;
    case 'gray':
      return 16555478;
    default:
      return 0;
  }
};
