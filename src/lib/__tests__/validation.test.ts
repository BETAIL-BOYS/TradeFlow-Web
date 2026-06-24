import { isValidStellarPublicKey } from '../validation';

describe('isValidStellarPublicKey', () => {
  const VALID_KEY = 'GBBHPLX4LBHS5JPC4FBDHD4YDZSZJZG7VQMIY6RDZT6HRJ5QJ5N6KFGH';

  test('returns true for valid Stellar public key', () => {
    expect(isValidStellarPublicKey(VALID_KEY)).toBe(true);
  });

  test('returns false for string not starting with G', () => {
    expect(isValidStellarPublicKey('A' + VALID_KEY.slice(1))).toBe(false);
  });

  test('returns false for string shorter than 56 characters', () => {
    expect(isValidStellarPublicKey('GBBHPLX4LBHS5JPC4FBDHD4YDZSZJZG7VQMIY6RDZT6HRJ5QJ5N6KF')).toBe(
      false
    );
  });

  test('returns false for string longer than 56 characters', () => {
    expect(isValidStellarPublicKey(VALID_KEY + 'A')).toBe(false);
  });

  test('returns false for empty string', () => {
    expect(isValidStellarPublicKey('')).toBe(false);
  });

  test('returns false for non-string input', () => {
    expect(isValidStellarPublicKey(null as any)).toBe(false);
    expect(isValidStellarPublicKey(undefined as any)).toBe(false);
  });

  test('returns false for key with invalid base32 characters', () => {
    const invalidKey = 'GBBHPLX4LBHS5JPC4FBDHD4YDZSZJZG7VQMIY6RDZT6HRJ5QJ5N6KFGI';
    expect(isValidStellarPublicKey(invalidKey)).toBe(false);
  });

  test('returns true for another valid Stellar public key', () => {
    expect(
      isValidStellarPublicKey('GBBD67IF633ZHJ2CCYBT6RILOY7Y6S6M5SOW2S2ZQRAGI7XRYB2TOC6S')
    ).toBe(true);
  });
});
