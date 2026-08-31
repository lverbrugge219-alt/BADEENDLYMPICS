/**
 * Cryptographic utilities for password hashing & verification using SHA-256 (Web Crypto API)
 */

export async function hashPassword(password: string): Promise<string> {
  if (!password) return '';
  const trimmed = password.trim();

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(trimmed);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback if subtle crypto is somehow not available
  let hash = 0;
  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'legacy_' + Math.abs(hash).toString(16);
}

export function isSha256Hash(val: string | undefined | null): boolean {
  if (!val || typeof val !== 'string') return false;
  return /^[a-f0-9]{64}$/i.test(val.trim());
}

/**
 * Verifies if an input password matches either a SHA-256 hash or legacy plaintext.
 */
export async function verifyPassword(
  inputPassword: string,
  storedHashOrPlain: string | undefined | null
): Promise<boolean> {
  if (!inputPassword || !storedHashOrPlain) return false;
  const trimmedInput = inputPassword.trim();
  const trimmedStored = storedHashOrPlain.trim();

  if (isSha256Hash(trimmedStored)) {
    const inputHash = await hashPassword(trimmedInput);
    return inputHash.toLowerCase() === trimmedStored.toLowerCase();
  }

  // Backwards compatibility for previously stored plaintext passwords
  return trimmedInput === trimmedStored;
}
