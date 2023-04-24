import { MediaFormat } from '@anilist/gql/types.js';

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
