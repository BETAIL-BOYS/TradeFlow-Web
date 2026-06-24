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

  // Basic checks
  if (key.length !== 56 || key[0] !== 'G') return false;

  // Base32 alphabet used by Stellar (RFC4648): A-Z2-7
  const base32Regex = /^G[A-Z2-7]{55}$/;
  if (!base32Regex.test(key)) return false;

  // Decode base32 to bytes and verify version byte + CRC16-XModem checksum.
  const decoded = base32Decode(key);
  if (!decoded) return false;

  // Expected decoded length: 35 bytes (1 version byte + 32 payload + 2 checksum)
  if (decoded.length !== 35) return false;

  const versionByte = decoded[0];
  const expectedVersion = 6 << 3; // ed25519 public key version byte
  if (versionByte !== expectedVersion) return false;

  const payload = decoded.slice(0, decoded.length - 2);
  const checksumBytes = decoded.slice(decoded.length - 2);
  const crc = crc16Xmodem(payload);
  // Stellar stores checksum little-endian
  const crcLow = crc & 0xff;
  const crcHigh = (crc >> 8) & 0xff;
  if (checksumBytes[0] !== crcLow || checksumBytes[1] !== crcHigh) return false;

  return true;
}

function base32Decode(s: string): Uint8Array | null {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const bytes: number[] = [];
  let bits = 0;
  let value = 0;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const idx = alphabet.indexOf(ch);
    if (idx === -1) return null;
    value = (value << 5) | idx;
    bits += 5;
    while (bits >= 8) {
      bits -= 8;
      bytes.push((value >> bits) & 0xff);
    }
  }

  return new Uint8Array(bytes);
}

function crc16Xmodem(bytes: Uint8Array | number[]): number {
  let crc = 0x0000;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= (bytes[i] & 0xff) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xffff;
    }
  }
  return crc & 0xffff;
}
