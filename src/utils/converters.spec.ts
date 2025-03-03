import { idToShortCode } from './converters';

describe('idToShortCode', () => {
  test('converts small bigint to base62 string', () => {
    const input = 12345n;
    const output = idToShortCode(input);
    expect(output).toBe('0000000003D7');
  });

  test('converts large bigint to base62 string', () => {
    const input = 9876543210123456789n;
    const output = idToShortCode(input);
    expect(output).toBe('0BlafhneO193');
  });

  test('converts zero to base62 string', () => {
    const input = 0n;
    const output = idToShortCode(input);
    expect(output).toBe('000000000000');
  });

  test('throws error for bigint exceeding max length', () => {
    const input = 123456789012345678901234567890n;
    expect(() => idToShortCode(input)).toThrow(
      'The decimal number is too large to fit in maximum characters.',
    );
  });
});
