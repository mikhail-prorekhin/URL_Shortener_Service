const MAX_LENGTH_CODE = 12;

export function idToShortCode(decimal: bigint): string {
  const base: bigint = BigInt(62); // 10 digits + 52 letters
  const characters: string =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  let result: string = '';
  let number: bigint = decimal;

  while (number > 0) {
    const remainder: number = Number(number % base);
    result = characters[remainder] + result;
    number = BigInt(number / base);
  }

  while (result.length < MAX_LENGTH_CODE) {
    result = '0'.repeat(MAX_LENGTH_CODE - result.length) + result;
  }

  if (result.length > MAX_LENGTH_CODE) {
    throw new Error(
      'The decimal number is too large to fit in maximum characters.',
    );
  }

  return result;
}
