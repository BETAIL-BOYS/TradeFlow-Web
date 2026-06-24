/**
 * Validates whether a given string is a properly formatted Stellar public key.
 *
 * A valid Stellar ed25519 public key:
 * - Starts with the letter 'G'
 * - Is exactly 56 characters long
 * - Uses the Stellar base32 alphabet (A-Z, 2-7)
 *
 * For bulletproof validation, consider using `@stellar/stellar-sdk`'s
 * `StrKey.isValidEd25519PublicKey()` which performs additional checksum verification.
 *
 * @param key - The string to validate
 * @returns True if the string is a valid Stellar public key
 */
export function isValidStellarPublicKey(key: string): boolean {
  if (!key || typeof key !== 'string') return false;

  if (key.length !== 56 || key[0] !== 'G') return false;

  const stellarKeyRegex = /^G[A-Z2-7]{55}$/;
  if (!stellarKeyRegex.test(key)) return false;

  return true;
}
