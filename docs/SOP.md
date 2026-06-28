# 👑 The Solo Founder SOP (Standard Operating Procedure)

Menjadi *Solo Developer* berarti kamu adalah seluruh isi perusahaan: CEO, Programmer, QA Tester, dan Marketer. Perasaan kewalahan, berantakan, dan bingung harus mengerjakan apa dulu adalah hal yang **100% normal** di dunia *Indie Hacking*.

Kunci untuk bertahan dan sukses bukanlah bekerja lebih keras, melainkan **Disiplin Pergantian Topi (*Hat Switching*)**. Jangan pernah melakukan *coding*, *testing*, dan *marketing* di waktu yang bersamaan.

Berikut adalah SOP (*Standard Operating Procedure*) untuk mengatur kekacauan ini.

---

## 1. Sistem "Lima Topi" (The Five Hats)

Saat kamu bekerja, tentukan topi apa yang sedang kamu pakai. Jangan mencampur aduk pekerjaan antar topi.

### 🎨 Topi Designer (Fokus: UI/UX & Estetika)
*Kapan dipakai: Sebelum menulis kode fitur baru atau saat merombak visual.*
- **SOP:** Jangan memikirkan kode, error, atau database. Fokus memikirkan bagaimana user berinteraksi dengan data keuangan mereka. Tentukan susunan, warna, *spacing*, dan rasa (feel).
- **Aturan:** Pikirkan/gambar desainnya dulu, baru pakai Topi Developer untuk mewujudkannya. Hindari mendesain *sambil* mengoding.

### 🛠️ Topi Developer (Fokus: Membangun Logika & Integrasi)
*Kapan dipakai: Saat mengubah desain menjadi kode, menulis logika finansial, atau memperbaiki bug.*
- **SOP:** Jangan pedulikan marketing atau mencoba mengubah desain tiba-tiba di tengah jalan. Fokus menerjemahkan desain menjadi barisan kode yang berfungsi.
- **Aturan:** Kerjakan satu komponen/fitur sampai selesai. Jangan melompat ke fitur lain sebelum yang satu ini selesai.

### 🕵️ Topi QA / Tester (Fokus: Menghancurkan Aplikasi)
*Kapan dipakai: Setelah fitur selesai dibuat, atau 1 hari sebelum rilis.*
- **SOP:** Jangan perbaiki kode saat pakai topi ini! Tugasmu adalah mencari celah: input angka negatif, hapus kategori yang masih punya transaksi, coba currency edge cases.
- **Aturan:** Catat semua error di `error_backlog.md`. Jangan langsung di-fix saat itu juga (nanti kelelahan).

### 🚀 Topi Marketer & Sales (Fokus: Membawa Pengguna Masuk)
*Kapan dipakai: Mencari Beta Tester, menulis postingan Twitter/Reddit, bikin video TikTok.*
- **SOP:** Jangan buka Visual Studio Code! Berpikirlah seperti pengguna. Buat materi promosi berdasarkan masalah yang dipecahkan aplikasi (bukan fitur teknisnya).
- **Aturan:** Target harian/mingguan (misal: "Hari ini harus dapat 5 beta tester baru").

### 👔 Topi CEO / Product Manager (Fokus: Strategi & Keputusan)
*Kapan dipakai: Senin pagi (Planning) atau saat membaca Feedback User.*
- **SOP:** Melihat gambaran besar (`ROADMAP_100M.md`). Memutuskan fitur apa yang dibuang, fitur apa yang dipertahankan, dan strategi harga.
- **Aturan:** Setiap keputusan harus melewati filter: *"Apakah fitur ini membantu user melihat siapa mereka secara finansial?"*

---

## 2. Ritme Kerja Mingguan (Weekly Rhythm)

Agar tidak *burnout* dan bingung "hari ini ngapain?", gunakan jadwal baku ini:

- **Senin - Rabu (Build Days):** Pakai Topi Developer. Fokus bikin fitur baru atau mengubah desain. Abaikan hal lain.
- **Kamis (Bug Squashing Day):** Tetap Topi Developer, tapi DILARANG bikin fitur baru. Fokus 100% menghabiskan daftar error di `error_backlog.md`.
- **Jumat (QA & Release Day):** 
  1. Pakai Topi QA: Jalankan tes secara manual.
  2. Jika lulus, *Build* AAB/APK.
  3. Upload ke Google Play Console.
- **Sabtu - Minggu (Marketing & Rest):** Pakai Topi Marketer. Cari *beta tester*, balas email/komentar, kumpulkan *feedback*, lalu istirahat.

---

## 3. SOP Rilis Versi Baru (Release Protocol)

Setiap kali kamu mau merilis versi baru ke Play Store, wajib ikuti urutan ini:
1. **QA Test:** Selesaikan tes manual (terutama currency math dan transaction CRUD).
2. **Version Bump:** Naikkan versi di `package.json`, `app.json`, dan `changelog.ts`.
3. **Write Notes:** Tambahkan catatan rilis di `CHANGELOG.md`.
4. **Compile:** Build via EAS or local Gradle.
5. **Upload & Distribute:** Upload AAB ke Play Console dan beri tahu Beta Tester bahwa ada update baru.

---

## 4. SOP Menghadapi Feedback Beta Tester

Saat *Beta Tester* melapor (*"Mas, tombol ini nggak jalan"* atau *"Kayaknya lebih bagus kalau warnanya merah"*):
1. **Jangan langsung di-coding!** Ucapkan terima kasih.
2. Masukkan ke `error_backlog.md` (jika itu bug) atau `upcoming_idea.md` (jika itu saran fitur).
3. Evaluasi saat kamu memakai "Topi CEO": *Apakah saran ini sejalan dengan filosofi Antyo Finance?* Jika tidak, buang. Jika ya, masukkan ke antrean tugas minggu depan.
