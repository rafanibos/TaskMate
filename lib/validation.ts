// Validasi input sederhana yang mengembalikan pesan dalam Bahasa Indonesia.

export function validateName(name: string): string | null {
  if (!name.trim()) return 'Nama tidak boleh kosong';
  if (name.trim().length < 2) return 'Nama minimal 2 karakter';
  return null;
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email tidak boleh kosong';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.trim())) return 'Format email tidak valid';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Kata sandi tidak boleh kosong';
  if (password.length < 6) return 'Kata sandi minimal 6 karakter';
  return null;
}

export function validateTaskTitle(title: string): string | null {
  if (!title.trim()) return 'Judul tugas tidak boleh kosong';
  if (title.trim().length < 3) return 'Judul minimal 3 karakter';
  return null;
}

export function validateDeadline(deadline: string): string | null {
  if (!deadline) return 'Tenggat waktu wajib diisi';
  return null;
}
