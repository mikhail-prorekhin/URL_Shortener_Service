const MAX_LENGTH_CODE = 7;

export function idToShortCode(decimal: number): string {
  const base: number = 36; // 10 digits + 26 letters
  const characters: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let result: string = '';
  let number: number = decimal;

  while (number > 0) {
    const remainder: number = number % base;
    result = characters[remainder] + result;
    number = Math.floor(number / base);
  }

  while (result.length < MAX_LENGTH_CODE) {
    result = '0' + result;
  }

  if (result.length > MAX_LENGTH_CODE) {
    throw new Error(
      'The decimal number is too large to fit in maximum characters.',
    );
  }

  return result;
}
