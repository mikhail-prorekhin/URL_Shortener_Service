import { idToShortCode } from './converters';

describe('idToShortCode', () => {
  it('should convert a decimal number to base-36 string', () => {
    expect(idToShortCode(12345)).toBe('00009IX');
    expect(idToShortCode(0)).toBe('0000000');
  });

  it('should throw an error if the number exceeds 10 characters in base-36', () => {
    const largeNumber = 78364164097;
    try {
      idToShortCode(largeNumber);
      fail();
    } catch (error) {
      expect((error as Error).message).toBe(
        'The decimal number is too large to fit in maximum characters.',
      );
    }
  });
});
