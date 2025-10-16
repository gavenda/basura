export const trimIndent = (str: string): string => {
  return str.replace(/^ +/gm, '');
};

export const truncate = (str: string, n: number) => {
  return str.length > n ? str.slice(0, n - 3) + '...' : str;
};

export const isBlank = (str: string) => {
  return !str || /^\s*$/.test(str);
};

export const isNotBlank = (str: string) => !isBlank(str);

/**
 * Limits the input text to a maximum character length by only cutting
 * at paragraph breaks ('\\n\\n').
 *
 * @param {string} text The full input text.
 * @param {number} maxLength The maximum desired character length.
 * @returns {string} The truncated text, or the original text if it's shorter than maxLength.
 */
export const limitTextByParagraphs = (text: string, maxLength: number): string => {
  // 1. Check if the text is already short enough
  if (text.length <= maxLength) {
    return text;
  }

  // 2. Split the text into an array of paragraphs
  const paragraphs = text.split('\n\n');
  let limitedText = '';
  let currentLength = 0;

  // 3. Iterate through the paragraphs and accumulate them
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];

    // Separator is '\n\n' (2 characters) for all but the first paragraph
    const separatorLength = i > 0 ? 2 : 0;
    const paragraphWithSeparatorLength = paragraph.length + separatorLength;

    // 4. Check if adding this paragraph would exceed the max_length
    if (currentLength + paragraphWithSeparatorLength > maxLength) {
      // Stop here to enforce cutting only at the paragraph boundary
      break;
    }

    // 5. Accumulate the text
    // Add the separator for the next paragraph (except the first one)
    if (i > 0) {
      limitedText += '\n\n';
      currentLength += 2;
    }

    limitedText += paragraph;
    currentLength += paragraph.length;
  }

  // 6. Return the accumulated text, removing any leading/trailing whitespace
  return limitedText.trim();
};

export const titleCase = (str: string | undefined): string => {
  if (!str) return '';

  // https://stackoverflow.com/a/32589289
  // Modified for enums, won't work with usual things that have underscores.
  const splitStr = str.toLowerCase().replaceAll('_', ' ').split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
};
