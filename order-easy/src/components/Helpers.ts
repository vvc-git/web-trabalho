export const formatNumberWithTwoDigits = (number: number): string =>
  number < 10 ? `0${number}` : String(number);
