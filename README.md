# 🛒 Platform E-Commerce ELOQO

> **Modern. Skalabel. Real-time.**
>
> Solusi e-commerce *enterprise-grade* dengan arsitektur monolitik terdistribusi, dirancang untuk performa tinggi, keamanan maksimal, dan pengalaman pengguna yang mulus. Karya Anak Bangsa untuk UMKM Indonesia.

<div align="center">
  <img src="public/assets/logo.png" alt="Banner Eloqo" width="200" />
>>>>>>> 80238e1cff5bb254d5bd715b8a53fbcf4b4036cb
</div>

## 📖 Tentang Proyek Ini

**Eloqo** bukan sekadar toko online biasa. Ini adalah ekosistem perdagangan digital yang dibangun di atas fondasi teknologi modern untuk menjamin **Skabilitas**, **Keamanan**, dan **Keandalan**.

Platform ini mengintegrasikan **Advanced Admin Dashboard** untuk manajemen operasional yang kompleks dengan **Lazy-loaded User Interface** yang cepat, menciptakan sinergi sempurna antara *Back-Office* dan *Storefront*.

### 💎 Keunggulan Kompetitif
- **🚀 High-Performance Architecture**: Dibangun dengan **Next.js 14 App Router** dan **React Server Components (RSC)** untuk rendering ultra-cepat dan SEO optimal.
- **�️ Enterprise-Grade Security**: Dilengkapi dengan **Rate Limiting Middleware**, **JWT Authentication (HTTP-Only Cookies)**, dan **Role-Based Access Control (RBAC)** untuk melindungi data sensitif.
- **📊 Streaming Data Pipeline**: Satu-satunya platform di kelasnya yang mendukung ekspor laporan (PDF/CSV) menggunakan metode **Streaming**, memungkinkan unduhan jutaan baris data tanpa membebani memori server (OOM Protection).
- **⚡ Concurrency Control**: Sistem antrean cerdas untuk operasi massal (Bulk Print Label) dengan mekanisme **Idempotency** (SHA-256 Checksums) untuk mencegah duplikasi data transaksi.
- **📱 Omni-Channel Experience**: Desain responsif adaptif yang memberikan pengalaman *Native App-like* di semua perangkat.

---

## 🌟 Fitur Unggulan & Analisis Teknis

### 1. 🛍️ Storefront Berkinerja Tinggi (Frontend)
- **Persisten State Management**: Menggunakan **Zustand** dengan `JSON Storage Persistence` untuk menjaga integritas keranjang belanja pengguna meskipun browser ditutup.
- **Optimized Asset Delivery**: Implementasi **Advanced Lazy Loading** dan **Image Optimization** (WebP conversion) mengurangi *First Contentful Paint (FCP)* secara signifikan.
- **Interactive UX**: Lightbox galeri produk dengan dukungan *gestures* (cubit zoom, geser) dan animasi transisi halus menggunakan `framer-motion`.

### 2. 🔧 Manajemen Back-Office Canggih (Backend)
- **Strategic Database Indexing**: Skema Prisma didesain dengan indeks majemuk (`@@index`) pada kolom kritis (`userId`, `createdAt`, `orderId`) untuk menjamin query tetap cepat seiring bertambahnya data.
- **Audit Trail System**: Mencatat setiap tindakan sensitif (cetak label, ekspor data) ke dalam tabel `AuditLog` yang *immutable*, memudahkan pelacakan investigasi forensik digital.
- **Bulk Operations Engine**: Mesin pemrosesan batch untuk mengunggah ribuan produk dan mencetak ratusan label pengiriman sekaligus dengan validasi data real-time dan penanganan error parsial.
- **Real-time Event Bus**: Integrasi **Socket.io** untuk notifikasi pesanan instan, memungkinkan penjual merespons pesanan masuk dalam hitungan milidetik.

### 3. 📄 Pelaporan & Analitik (Reporting)
- **Memory-Efficient Export**: Menggunakan teknik *Node.js Streams* untuk pipa data langsung dari database ke respons HTTP klien.
    - **CSV**: Streaming baris demi baris.
    - **PDF**: Pembuatan dokumen on-the-fly dengan `pdfkit`.
- **Dasbor Statistik Visual**: Grafik interaktif untuk memantau *Revenue*, *Traffic*, dan *Conversion Rate* secara real-time.

---

## 🛠️ Arsitektur Teknologi (Tech Stack)

Kami menggunakan tumpukan teknologi (stack) yang telah teruji di industri untuk stabilitas jangka panjang.

### **Frontend Layer**
- **Core**: [Next.js 14](https://nextjs.org/) (React Framework)
- **Language**: TypeScript (Strict Typing)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) + HeadlessUI (Aksesibilitas Tinggi)
- **State**: Zustand (Atomic State)
- **Protocol**: WebSocket (Socket.io Client)

### **Backend Layer**
- **Runtime**: Node.js (V8 Engine)
- **Framework**: Express.js (REST API Standard)
- **ORM**: [Prisma](https://www.prisma.io/) (Type-safe Database Access)
- **Database**: MySQL (Relational Integrity)
- **DevOps**: Structured Logging (Winston), PM2 Ready

---

## 🚀 Instalasi & Penggunaan

Ikuti langkah-langkah berikut untuk menjalankan infrastruktur ini di lingkungan lokal Anda.

### Prasyarat Sistem
- Node.js (v18 LTS atau lebih baru)
- MySQL Database Server
- Dukungan npm/pnpm/yarn

### Langkah Deployment

1.  **Clone Repositori**
    ```bash
    git clone https://github.com/MattYudha/ecomere-eloco.git
    cd ecomere-eloco
    ```

2.  **Instalasi Dependensi (Monorepo-style)**
    ```bash
    # Instal dependensi Frontend
    npm install

    # Instal dependensi Backend Service
    cd server
    npm install
    cd ..
    ```

3.  **Konfigurasi Environment**
    Duplikasi `.env.example` menjadi `.env` di root dan folder server. Isi variabel kunci:
    - `DATABASE_URL`: String koneksi database MySQL.
    - `JWT_SECRET`: Kunci enkripsi token.
    - `CLOUDINARY_*`: Kredensial penyimpanan aset media.

4.  **Migrasi Skema Database**
    Sinkronisasi skema Prisma dengan database lokal:
    ```bash
    npx prisma generate --schema=./server/prisma/schema.prisma
    npx prisma db push --schema=./server/prisma/schema.prisma
    ```

5.  **Menjalankan Layanan**
    Jalankan kedua layanan secara paralel untuk komunikasi penuh.

    **Terminal A (API Server):**
    ```bash
    cd server
    node app.js
    ```

    **Terminal B (Storefront Client):**
    ```bash
    npm run dev
    ```

    Akses aplikasi melalui: [http://localhost:3000](http://localhost:3000)

---

## 📂 Peta Struktur Proyek

```
ecomere-eloco/
├── app/                  # Next.js App Router (Server & Client Components)
├── components/           # Pustaka Komponen Atomic Design
│   ├── admin/            # Widget Dashboard (ExportModal, Charts)
│   ├── ui/               # Primitif UI (OptimizedImage, Buttons)
├── lib/                  # Utilitas Bersama (API Facade, Formatters)
├── server/               # Microservice Backend
│   ├── middleware/       # Lapisan Keamanan (Auth, Rate Limit, Logs)
│   ├── prisma/           # Sumber Kebenaran Data (Schema)
│   ├── services/         # Logika Bisnis Terisolasi (ReportGen, LabelGen)
│   └── utils/            # Helper Teknis (Winston Logger, Crypto)
└── public/               # Aset Statis Publik
```

---

## 🤝 Berkontribusi

Kami mengundang pengembang berbakat untuk berkontribusi pada proyek open-source ini. Silakan buat *Pull Request* baru dengan perbaikan bug atau fitur baru.

## 📝 Lisensi

Didistribusikan di bawah lisensi MIT. Hak Cipta © 2025 Eloqo Team.

---

<div align="center">
  <p><b>Dibuat dengan Kebanggaan dan ❤️ oleh Tim Eloqo</b></p>
  <p><i>Memberdayakan UMKM Indonesia Go Digital</i></p>
</div>
