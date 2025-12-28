# 🛒 Platform E-Commerce ELOQO

> **Modern. Skalabel. Real-time.**
>
> Solusi e-commerce premium dengan fitur lengkap yang dibangun untuk performa tinggi dan pengalaman pengguna yang mulus. Karya Anak Bangsa.

![Banner Eloqo](public/assets/logo.png)

## 📖 Tentang Proyek Ini

**Eloqo** adalah platform e-commerce mutakhir yang dirancang untuk memberikan pengalaman belanja kelas atas bagi pelanggan dan sistem manajemen yang tangguh bagi administrator. Dibangun dengan teknologi web terbaru, platform ini menjamin kecepatan, keamanan, dan skalabilitas.

Baik Anda mengelola ribuan pesanan dengan **Dashboard Admin Canggih** kami atau menelusuri produk dengan **Antarmuka (UI) Lazy-loaded**, Eloqo menghadirkan keunggulan di setiap aspek.

### ✨ Keunggulan Utama
- **🚀 Performa Tinggi**: Dioptimalkan dengan Next.js 14 App Router, lazy loading gambar, dan server-side rendering (SSR).
- **📊 Wawasan Berbasis Data**: Analitik penjualan real-time, laporan streaming PDF/CSV, dan grafik interaktif.
- **⚡ Fitur Real-Time**: Notifikasi instan untuk pembaruan pesanan melalui WebSocket (Socket.io).
- **🛡️ Aman & Tangguh**: Menggunakan structured logging, autentikasi cookie HTTP-only, dan alur pemrosesan pembayaran yang aman.
- **📱 Responsif Sepenuhnya**: Pengalaman yang seragam dan optimal di Desktop, Tablet, dan Ponsel.

---

## 🌟 Fitur Unggulan

### 🛍️ Pengalaman Pelanggan (Customer Experience)
- **UI/UX Modern**: Desain bersih terinspirasi glassmorphism dengan animasi halus menggunakan `framer-motion`.
- **Galeri Produk Canggih**: Lightbox interaktif dengan dukungan zoom dan geser (swipe).
- **Keranjang & Checkout Pintar**: Status keranjang yang persisten dan proses checkout yang efisien.
- **Pelacakan Pesanan**: Pembaruan status real-time dari "Menunggu" hingga "Diterima".
- **Ulasan Pengguna**: Unggah gambar dan beri peringkat produk dengan dukungan media yang kaya.

### 🔧 Manajemen Admin
- **Dashboard Statistik**: Visualisasikan pendapatan, pesanan, dan pengunjung dalam sekilas.
- **Laporan Streaming**: Hasilkan Laporan Penjualan (PDF/CSV) untuk rentang tanggal berapa pun tanpa membebani server, bahkan dengan dataset besar.
- **Manajemen Pesanan**: Proses pesanan, cetak label pengiriman, dan lacak status kurir.
- **Operasi Massal (Bulk)**: Unggah ribuan produk via CSV dengan validasi otomatis.
- **Log Audit**: Lacak tindakan kritis dan kesalahan sistem dengan structured logging (Winston).

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

Eloqo dibangun di atas arsitektur monolitik yang menggunakan layanan frontend dan backend terpisah untuk fleksibilitas maksimal.

### **Frontend**
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Bahasa**: TypeScript
- **Styling**: [TailwindCSS](https://tailwindcss.com/) + HeadlessUI
- **Manajemen State**: Zustand
- **Real-time**: Socket.io Client
- **Utilitas**: Framer Motion, React Hot Toast, React Icons

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (via [Prisma ORM](https://www.prisma.io/))
- **Logging**: Winston (Structured JSON Logs)
- **Reporting**: PDFKit (Streaming Generation)
- **Penyimpanan File**: Cloudinary

---

## 🚀 Mulai Penggunaan (Getting Started)

Ikuti langkah-langkah ini untuk menjalankan proyek secara lokal.

### Prasyarat
- Node.js (v18 atau lebih baru)
- Database MySQL
- npm atau pnpm

### Instalasi

1.  **Clone repositori**
    ```bash
    git clone https://github.com/MattYudha/ecomere-eloco.git
    cd ecomere-eloco
    ```

2.  **Instal Dependensi**
    ```bash
    # Instal dependensi root/frontend
    npm install

    # Instal dependensi server
    cd server
    npm install
    cd ..
    ```

3.  **Pengaturan Environment**
    Buat file `.env` di `server/` dan `root` berdasarkan `.env.example`.
    
    **Variabel Wajib:**
    - `DATABASE_URL` (String Koneksi MySQL)
    - `JWT_SECRET`
    - `CLOUDINARY_CLOUD_NAME`, `API_KEY`, `API_SECRET`
    - `NEXT_PUBLIC_API_URL` (contoh: `http://localhost:3001`)

4.  **Migrasi Database**
    ```bash
    # Jalankan dari root
    npx prisma generate --schema=./server/prisma/schema.prisma
    npx prisma db push --schema=./server/prisma/schema.prisma
    ```

5.  **Jalankan Aplikasi**
    Anda perlu menjalankan backend dan frontend secara bersamaan.

    **Terminal 1 (Backend):**
    ```bash
    cd server
    node app.js
    ```

    **Terminal 2 (Frontend):**
    ```bash
    npm run dev
    ```

    Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

---

## 📂 Struktur Proyek

```
ecomere-eloco/
├── app/                  # Halaman Next.js App Router
├── components/           # Komponen UI yang dapat digunakan kembali
│   ├── admin/            # Komponen khusus Admin (ExportModal, dll.)
│   ├── ui/               # Elemen UI inti (OptimizedImage, Buttons)
├── context/              # Context Global (Auth, Theme)
├── hooks/                # Custom React Hooks
├── lib/                  # Utilitas (Klien API, Formatters)
├── server/               # Layanan Backend Express
│   ├── controllers/      # Logika Rute
│   ├── middleware/       # Middleware Auth & Logging
│   ├── prisma/           # Skema Database
│   ├── routes/           # Endpoint API
│   ├── services/         # Logika Bisnis (Email, Laporan)
│   └── utils/            # Helper Backend (Logger, Formatters)
└── public/               # Aset Statis
```

## 🔍 Dokumentasi Fitur Lanjutan

### 📄 Laporan Penjualan (Streaming)
Kami menggunakan **pendekatan streaming** untuk menghasilkan laporan PDF dan CSV. Hal ini memastikan memori server tetap stabil bahkan jika Anda mengekspor 100.000 pesanan.
- **PDF**: Progres dibuat menggunakan `pdfkit` dan dialirkan langsung ke respons.
- **CSV**: Dibuat baris demi baris untuk menghindari pembengkakan memori.

### 📧 Structured Logging
Semua kejadian email (Sukses/Gagal) dicatat ke `server/logs/email.log` dalam **format JSON**. Ini memudahkan parsing dan integrasi dengan alat manajemen log seperti Datadog atau ELK Stack.
- **Lihat Log**: Jalankan `node server/view-logs.js email` untuk memeriksa status pengiriman terbaru.

### 📦 Upload Massal (Bulk Upload)
Admin dapat mengunggah produk melalui CSV. Sistem melakukan validasi otomatis meliputi:
- Pengecekan duplikat
- Keberadaan kategori
- Validasi URL gambar

---

## 🤝 Kontribusi

Kontribusi adalah hal yang membuat komunitas open-source menjadi tempat yang luar biasa untuk belajar, mendapat inspirasi, dan berkreasi. Setiap kontribusi yang Anda berikan **sangat dihargai**.

1. Fork Proyek ini
2. Buat Feature Branch Anda (`git checkout -b fitur/FiturKeren`)
3. Commit Perubahan Anda (`git commit -m 'Menambahkan FiturKeren'`)
4. Push ke Branch (`git push origin fitur/FiturKeren`)
5. Buka Pull Request

## 📝 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.

---

<div align="center">
  <p>Dibuat dengan ❤️ oleh Tim Eloqo</p>
</div>
