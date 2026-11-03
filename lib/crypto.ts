// Hash password sederhana berbasis FNV-1a.
// Ini BUKAN kriptografi yang aman untuk produksi, namun memenuhi syarat
// "tidak menyimpan password dalam plain text" untuk aplikasi demo ini.
// Produksi seharusnya menggunakan bcrypt/argon2 di sisi server.

export function hashPassword(password: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < password.length; i++) {
    hash ^= password.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  // normalisasi ke unsigned hex
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function generateId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  ).toUpperCase();
}

export function generateToken(): string {
  return (
    'tm_' +
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2) +
    Date.now().toString(36)
  );
}
