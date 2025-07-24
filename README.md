# SIMS PPOB REST API (Take Home Test)

Proyek ini dikembangkan sebagai bagian dari **Take Home Test** untuk posisi **Node.js Programmer (Express.js)**. REST API ini dibangun berdasarkan **Kontrak API (Swagger)** yang telah ditentukan oleh tim Nutech Integrasi.

📄 **Dokumentasi API (Swagger)**:  
https://api-doc-tht.nutech-integrasi.com/

---

## 🔧 Tech Stack

- Node.js + Express.js  
- PostgreSQL (Railway)  
- JWT Authentication  
- Multer (Upload File)  
- Joi (Request Validation)  
- Railway (Deployment)  

---

## 📦 API Endpoints

| Method | Endpoint              | Keterangan                              |
|--------|------------------------|------------------------------------------|
| POST   | `/registration`        | Registrasi user baru                    |
| POST   | `/login`               | Login user & mendapatkan token JWT      |
| GET    | `/profile`             | Mendapatkan detail profil user          |
| PUT    | `/profile/update`      | Update nama depan & belakang user       |
| PUT    | `/profile/image`       | Upload foto profil user                 |
| GET    | `/balance`             | Melihat saldo terakhir user             |
| POST   | `/topup`               | Melakukan Top Up saldo user             |
| GET    | `/banner`              | Menampilkan daftar banner (public)      |
| GET    | `/service`             | Menampilkan daftar layanan PPOB (public)|
| POST   | `/transaction`         | Melakukan transaksi pembayaran layanan  |
| GET    | `/transaction/history` | Melihat riwayat transaksi user          |

---

## 📂 Project Structure

sims-ppob-api/
├── controllers/ # Business logic (controller functions)
├── middlewares/ # JWT auth, upload handler, validation
├── models/ # Database connection & query helpers
├── routes/ # API route declarations
├── uploads/ # Folder penyimpanan file upload
├── utils/ # Helper utilities
├── database/ddl.sql # Database schema (DDL)
├── .env.example # Environment variables template
├── app.js # Entry point Express
├── package.json
└── README.md


---

## 🗄️ Database Schema

Struktur database tersedia pada file berikut:
database/ddl.sql


Berisi DDL untuk tabel:
- `users`
- `banners`
- `services`
- `transactions`

---

## ⚙️ Environment Variables

Konfigurasi disimpan di file `.env`. Template tersedia di:
.env.example


Contoh konfigurasi:

```env
PORT=3000
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
JWT_SECRET=your-secret-key

🚀 Deployment URL
API ini dideploy menggunakan Railway:
https://<your-railway-app>.railway.app/

📋 Cara Menjalankan Proyek
1. Clone repository:
git clone https://github.com/<username>/sims-ppob-api.git
cd sims-ppob-api

2.  Install dependencies:
npm install

3. Salin file .env.example menjadi .env lalu sesuaikan:
cp .env.example .env


Jalankan aplikasi:
node app.js


📄 Dokumentasi API (Swagger)
Seluruh spesifikasi API tersedia di:
https://api-doc-tht.nutech-integrasi.com/

Gunakan dokumentasi ini untuk melakukan testing dan validasi API secara end-to-end.

