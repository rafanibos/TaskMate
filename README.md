# TaskMate

TaskMate adalah aplikasi mobile manajemen tugas untuk mahasiswa. Aplikasi ini membantu pengguna mengatur tugas kuliah, melihat tenggat waktu, dan memantau tugas yang sudah selesai. Semua teks antarmuka menggunakan Bahasa Indonesia.

Dibangun dengan React Native, Expo SDK 57, dan TypeScript.

## Fitur Utama

- **Autentikasi** — Daftar dan masuk dengan nama, email, dan kata sandi. Token disimpan aman menggunakan Expo SecureStore. Sesi tetap aktif setelah aplikasi ditutup dan dibuka kembali.
- **Beranda** — Menampilkan statistik tugas (tertunda, terlambat, selesai) dan daftar tenggat terdekat.
- **Manajemen Tugas** — Buat, ubah, hapus, dan tandai tugas selesai. Setiap tugas memiliki judul, deskripsi, tenggat waktu, dan prioritas (Rendah/Sedang/Tinggi).
- **Riwayat & Filter** — Lihat semua tugas, filter berdasarkan status (Semua, Belum, Riwayat selesai).
- **Kamera** — Ambil foto tugas atau catatan tulisan tangan. Termasuk permintaan izin kamera, pratinjau, ambil ulang, simpan, dan galeri foto tersimpan.
- **Profil** — Lihat ringkasan akun dan keluar (logout) dengan konfirmasi.

## Modul yang Dicakup

| Modul | Implementasi |
|-------|---------------|
| Modul 2 — Antarmuka Mobile | UI responsif, bottom navigation, komponen reusable (Button, Input, Card, Dialog), aksesibilitas |
| Modul 3 — Autentikasi | Registrasi, login, validasi input, SecureStore untuk token, protected screens, session clearing |
| Modul 4 — REST API | Axios, permintaan GET/POST/PUT/DELETE, DTO dan interface TypeScript, mock API service |
| Modul 5 — Secure API | Bearer token authentication, authorization headers, secure token handling |
| Modul 6 — Error Handling | Loading/success/error states, HTTP status codes, timeout, retry dengan backoff, AsyncStorage untuk offline |
| Modul 7 — Device Camera | Expo Camera: permissions, preview, capture, retake, simpan dan tampilkan foto |

## Teknologi

- **React Native** + **Expo SDK 57** (target Expo Go)
- **TypeScript** untuk type safety
- **Expo Router** untuk navigasi (tabs + stack)
- **Axios** untuk mock API service
- **AsyncStorage** untuk penyimpanan akun, tugas, dan foto
- **Expo SecureStore** untuk token autentikasi
- **Expo Camera** untuk pengambilan foto

## Instalasi

### Prasyarat

- Node.js 18 atau lebih baru
- npm
- Aplikasi **Expo Go** di perangkat Android (unduh dari Google Play Store)

### Langkah-langkah

1. **Unduh / kloning proyek ini**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Jalankan aplikasi**
   ```bash
   npx expo start
   ```

4. **Buka di perangkat Android**
   - Setelah Metro bundler berjalan, buka aplikasi **Expo Go** di ponsel Anda.
   - Pindai kode QR yang muncul di terminal atau browser.
   - Aplikasi akan terbuka di perangkat Anda.

## Cara Pakai

1. **Daftar akun baru** — Buka aplikasi, ketuk "Daftar di sini", isi nama, email, dan kata sandi.
2. **Masuk** — Gunakan email dan kata sandi yang sudah didaftarkan.
3. **Buat tugas** — Ketuk tombol "+" di Beranda atau halaman Tugas. Isi judul, deskripsi, tenggat, dan prioritas.
4. **Tandai selesai** — Ketuk lingkaran kosong di samping tugas.
5. **Ubah tugas** — Ketuk tombol "Ubah" pada kartu tugas.
6. **Hapus tugas** — Ketuk tombol "Hapus" dan konfirmasi.
7. **Lihat riwayat** — Buka tab Tugas, pilih filter "Riwayat".
8. **Foto tugas** — Buka tab Kamera, berikan izin, ambil foto, simpan atau ambil ulang.
9. **Keluar** — Buka tab Profil, ketuk "Keluar".

## Struktur Proyek

```
app/
├── _layout.tsx          # Root layout + auth gate
├── login.tsx            # Layar masuk
├── register.tsx         # Layar daftar
├── +not-found.tsx       # 404
└── (tabs)/
    ├── _layout.tsx      # Bottom tab navigation
    ├── index.tsx        # Beranda
    ├── tasks.tsx        # Daftar tugas + filter + riwayat
    ├── camera.tsx       # Kamera + galeri foto
    └── profile.tsx      # Profil + logout
components/
├── TaskCard.tsx         # Kartu tugas reusable
├── TaskForm.tsx         # Form tambah/ubah tugas
└── ui/
    ├── Button.tsx        # Tombol reusable
    ├── Input.tsx         # Input field reusable
    ├── index.tsx         # Card, EmptyState, LoadingOverlay, ConfirmDialog
    └── TaskBadges.tsx    # Badge prioritas dan deadline
contexts/
├── AuthContext.tsx      # State autentikasi global
└── TasksContext.tsx     # State tugas global
lib/
├── api.ts              # Mock API service dengan axios
├── crypto.ts           # Hash password & generate token
├── secureToken.ts      # Expo SecureStore untuk token
├── storage.ts          # AsyncStorage wrapper
└── validation.ts       # Validasi input
types/
├── index.ts            # DTO dan model TypeScript
└── env.d.ts            # Deklarasi environment
constants/
└── theme.ts            # Sistem warna dan spacing
```

## Catatan Keamanan

- Kata sandi **tidak** disimpan dalam plain text. Password di-hash sebelum disimpan di AsyncStorage.
- Token autentikasi disimpan di Expo SecureStore (penyimpanan aman perangkat).
- Sesi dihapus saat logout (SecureStore + AsyncStorage session dibersihkan).

## Verifikasi Kompatibilitas

Jalankan perintah berikut untuk memastikan semua dependency kompatibel dengan Expo SDK 57:
```bash
npx expo-doctor
```

## Menjalankan Demo (Presentasi)

1. Pastikan laptop dan ponsel Android terhubung ke jaringan yang sama.
2. Jalankan `npx expo start`.
3. Buka Expo Go di ponsel, pindai QR code.
4. Demo alur: Daftar → Masuk → Buat tugas → Tandai selesai → Foto tugas → Lihat riwayat → Keluar.
