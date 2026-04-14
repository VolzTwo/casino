# 🎰 VirtualCasino — Siap Deploy ke Vercel (GRATIS)

## ✅ Cara Deploy (5 Menit)

### Step 1 — Install Node.js (jika belum)
Download dari https://nodejs.org (pilih LTS)

### Step 2 — Jalankan di lokal dulu (opsional)
```bash
npm install
npm start
# Buka http://localhost:3000
```

### Step 3 — Upload ke GitHub
1. Buat akun di https://github.com
2. Klik "New repository" → beri nama "virtual-casino"
3. Upload semua file ini ke repo tersebut

Cara upload via terminal:
```bash
git init
git add .
git commit -m "casino app"
git branch -M main
git remote add origin https://github.com/USERNAME/virtual-casino.git
git push -u origin main
```

### Step 4 — Deploy ke Vercel
1. Buka https://vercel.com → daftar gratis dengan GitHub
2. Klik "Add New Project"
3. Pilih repo "virtual-casino"
4. Biarkan semua setting default (otomatis detect React)
5. Klik "Deploy"
6. Tunggu ~1 menit → SELESAI! 🎉

URL kamu akan jadi seperti:
**https://virtual-casino-username.vercel.app**

---

## 📁 Struktur Project
```
virtual-casino/
├── public/
│   └── index.html          ← HTML utama + CSS animasi
├── src/
│   ├── index.js            ← Entry point React
│   ├── App.js              ← Root component + routing
│   ├── db.js               ← "Database" localStorage (pengganti SQLite)
│   ├── context/
│   │   └── AuthContext.js  ← Login state global
│   ├── components/
│   │   ├── UI.js           ← Toast, Coin, Card, BetControls
│   │   └── Sidebar.js      ← Menu navigasi
│   └── pages/
│       ├── AuthPages.js    ← Login & Register
│       ├── DashboardPage.js
│       ├── GamesPage.js    ← Slot, Wheel, Number
│       └── OtherPages.js   ← Deposit, Withdraw, History
├── vercel.json             ← Config routing SPA
├── package.json
└── .gitignore
```

## 🎮 Fitur
- ✅ Register / Login / Logout
- ✅ Dashboard + statistik
- ✅ 3 Game: Slot Machine, Spin Wheel, Tebak Angka
- ✅ Deposit & Withdraw koin
- ✅ Riwayat transaksi lengkap
- ✅ Data tersimpan di browser (localStorage)
- ✅ 100% gratis di Vercel — tanpa kartu kredit!

⚠️ Data tersimpan per browser. Jika ganti browser/device, data tidak terbawa.
Ini adalah game hiburan — bukan uang asli!
