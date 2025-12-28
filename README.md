# 🛒 ELOQO E-Commerce Platform

> **Modern. Scalable. Real-time.**
>
> A premium, full-featured e-commerce solution built for high performance and seamless user experience.

![Eloqo Banner](/assets/logo.png)

## 📖 About The Project

**Eloqo** is a cutting-edge e-commerce platform designed to provide a top-tier shopping experience for customers and a robust management system for administrators. Built with the latest web technologies, it ensures speed, security, and scalability.

Whether you're managing thousands of orders with our **Advanced Admin Dashboard** or browsing products with our **Lazy-loaded UI**, Eloqo delivers excellence.

### ✨ Key Selling Points
- **🚀 High Performance**: Optimized with Next.js 14 App Router, lazy loading images, and server-side rendering.
- **📊 Data-Driven Insights**: Real-time sales analytics, streaming PDF/CSV reports, and interactive charts.
- **⚡ Real-Time Capabilities**: Instant notifications for order updates via WebSocket (Socket.io).
- **🛡️ Secure & Robust**: structured logging usage, HTTP-only cookie authentication, and secure payment processing flows.
- **📱 Fully Responsive**: A unified experience across Desktop, Tablet, and Mobile devices.

---

## 🌟 Key Features

### 🛍️ Customer Experience
- **Modern UI/UX**: clean, glassmorphism-inspired design with smooth animations using `framer-motion`.
- **Advanced Product Gallery**: interactive lightboxes with zoom and swipe support.
- **Smart Cart & Checkout**: persistent cart state and streamlined checkout process.
- **Order Tracking**: real-time status updates from "Pending" to "Delivered".
- **User Reviews**: upload images and rate products with rich media support.

### 🔧 Admin Management
- **Statistics Dashboard**: visualize revenue, orders, and visitors at a glance.
- **Streaming Reports**: generate Sales Reports (PDF/CSV) for any date range without crashing the server, even with large datasets.
- **Order Management**: process orders, print shipping labels, and track courier status.
- **Bulk Operations**: upload thousands of products via CSV with validation.
- **Audit Logs**: track critical actions and system errors with structured logging (Winston).

---

## 🛠️ Technology Stack

Eloqo is built on a monolithic architecture utilizing a separate frontend and backend service for maximum flexibility.

### **Frontend**
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [TailwindCSS](https://tailwindcss.com/) + HeadlessUI
- **State Management**: Zustand
- **Real-time**: Socket.io Client
- **Utilities**: Framer Motion, React Hot Toast, React Icons

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (via [Prisma ORM](https://www.prisma.io/))
- **Logging**: Winston (Structured JSON Logs)
- **Reporting**: PDFKit (Streaming Generation)
- **File Storage**: Cloudinary

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18 or higher)
- MySQL Database
- npm or pnpm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/MattYudha/ecomere-eloco.git
    cd ecomere-eloco
    ```

2.  **Install Dependencies**
    ```bash
    # Install root/frontend dependencies
    npm install

    # Install server dependencies
    cd server
    npm install
    cd ..
    ```

3.  **Environment Setup**
    Create a `.env` file in `server/` and `root` based on `.env.example`.
    
    **Required Variables:**
    - `DATABASE_URL` (MySQL Connection String)
    - `JWT_SECRET`
    - `CLOUDINARY_CLOUD_NAME`, `API_KEY`, `API_SECRET`
    - `NEXT_PUBLIC_API_URL` (e.g., `http://localhost:3001`)

4.  **Database Migration**
    ```bash
    # Run from root
    npx prisma generate --schema=./server/prisma/schema.prisma
    npx prisma db push --schema=./server/prisma/schema.prisma
    ```

5.  **Run the Application**
    You need to run both the backend and frontend.

    **Terminal 1 (Backend):**
    ```bash
    cd server
    node app.js
    ```

    **Terminal 2 (Frontend):**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📂 Project Structure

```
ecomere-eloco/
├── app/                  # Next.js App Router pages
├── components/           # Reusable UI Components
│   ├── admin/            # Admin-specific components (ExportModal, etc.)
│   ├── ui/               # Core UI elements (OptimizedImage, Buttons)
├── context/              # Global Contexts (Auth, Theme)
├── hooks/                # Custom React Hooks
├── lib/                  # Utilities (API client, Formatters)
├── server/               # Express Backend Service
│   ├── controllers/      # Route logic
│   ├── middleware/       # Auth & Logging Middleware
│   ├── prisma/           # Database Schema
│   ├── routes/           # API Endpoints
│   ├── services/         # Business Logic (Email, Reports)
│   └── utils/            # Backend Helpers (Logger, Formatters)
└── public/               # Static Assets
```

## 🔍 Advanced Features Documentation

### 📄 Sales Reporting (Streaming)
We use a **streaming approach** for generating PDF and CSV reports. This ensures that even if you export 100,000 orders, the server memory remains stable.
- **PDF**: Generated using `pdfkit` and piped directly to the response.
- **CSV**: Generated row-by-row to avoid memory bloat.

### 📧 Structured Logging
All email events (Success/Failure) are logged to `server/logs/email.log` in **JSON format**. This allows for easy parsing and integration with log management tools like Datadog or ELK Stack.
- **View Logs**: Run `node server/view-logs.js email` to inspect recent delivery statuses.

### 📦 Bulk Upload
Admins can upload products via CSV. The system validates:
- Duplicate checking
- Category existence
- Image URL validation

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ❤️ by the Eloqo Team</p>
</div>
