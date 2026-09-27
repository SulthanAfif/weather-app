## Belajar Frontend Development.

## Live Demo

https://weather-app-chi-ruddy-86.vercel.app/

---

# Weather App

Aplikasi cuaca modern yang menampilkan informasi cuaca real-time dan prakiraan 5 hari ke depan. Dibuat menggunakan **HTML, CSS, dan JavaScript** murni + OpenWeatherMap API.

---

## Fitur

- Cari cuaca berdasarkan nama kota
- **Prakiraan cuaca 5 hari** ke depan
- Tombol **Lokasi Saya** (Geolocation)
- Ganti satuan suhu **°C / °F**
- Background berubah sesuai kondisi cuaca
- Menampilkan suhu, kondisi, kelembapan, angin, dan tekanan udara
- Dark Mode (tersimpan otomatis)
- Riwayat pencarian terakhir (maksimal 5 kota)
- Loading indicator & error handling
- Tampilan responsif (HP & Desktop)

---

## Tech Stack

- HTML5
- CSS3 (CSS Variables, Gradient Background, Dark Mode)
- JavaScript (Fetch API, Async/Await, Geolocation, localStorage)
- OpenWeatherMap API

---

## Cara Menjalankan

1. Clone repository ini:
   ```bash
   git clone https://github.com/SulthanAfif/weather-app.git

---

## Cara Mendapatkan API Key (Gratis)

- Daftar di https://openweathermap.org
- Login → masuk ke menu API keys
- Copy API Key yang muncul
- Tempel di file script.js (ganti teks MASUKKAN_API_KEY_KAMU_DI_SINI)
```
Catatan: API Key baru biasanya butuh waktu 10–30 menit sebelum aktif.
```

---

## Struktur File
```
weather-app/
├── index.html      # Struktur halaman
├── style.css       # Tampilan, dark mode, & background dinamis
├── script.js       # Logika aplikasi + API
└── README.md       # Dokumentasi
```

---

## Cara Menggunakan

- Ketik nama kota (contoh: Jakarta, Bandung, Tokyo, London)
- Tekan tombol Cari
- Atau klik ikon 📍 untuk memakai lokasi saat ini
- Klik tombol °C / °F untuk ganti satuan suhu
- Klik ikon bulan/matahari untuk Dark Mode
- Klik salah satu kota di riwayat pencarian untuk mencari ulang

---

## Pengembangan Selanjutnya (Ide)

- Animasi transisi cuaca yang lebih halus
- Grafik suhu per jam
- Notifikasi cuaca ekstrem
- PWA (bisa diinstall di HP)

