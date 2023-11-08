export const inStatement = (amount: number): string => {
  let str = 'IN (';
  for (let i = 0; i < amount; i++) {
    str += '?, ';
  }
  str = str.slice(0, str.length - 2);
  str += ')';
  return str;
};
