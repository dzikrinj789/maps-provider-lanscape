# Lanskap Maps Service

Landing page statis (Bahasa Indonesia) yang memetakan lanskap penyedia maps service / maps API per **25 Nov 2026**:

- 28 penyedia dalam 6 kelompok (big tech & cloud, spesialis data peta, platform developer, GIS & analitik enterprise, open source & data terbuka, lokal Indonesia)
- 22 kategori layanan (basemap, styling, geocoding, POI, routing, matrix, isochrone, VRP, map matching, tol, traffic, elevasi, geofencing, hosting, self-host, mobile SDK, MCP, dll.)
- Matriks kemampuan yang bisa difilter dan diurutkan
- Link playground/demo yang sudah dicek, dikelompokkan per layanan
- Tren yang terlihat, lengkap dengan sumber

Tanpa framework dan tanpa build step: HTML + CSS + JavaScript biasa.

## Struktur

```
index.html          halaman utama (SEO meta, struktur section)
favicon.svg
robots.txt
.nojekyll           supaya GitHub Pages tidak memproses dengan Jekyll
assets/
  data.js           SEMUA data (penyedia, kategori, playground, tren, sumber)
  app.js            render & interaksi (filter, sort, tab, detail)
  styles.css        gaya visual
```

## Menjalankan secara lokal

Cukup buka `index.html` di browser, atau jalankan server statis:

```bash
python3 -m http.server 8080
# lalu buka http://localhost:8080
```

## Deploy

**Vercel**: import repo di vercel.com → Framework Preset: *Other* → tanpa build command, output directory `.` (root). Atau via CLI: `npx vercel` dari folder ini.

**GitHub Pages**: push ke GitHub → Settings → Pages → Source: *Deploy from a branch* → branch `main`, folder `/ (root)`.

Netlify / Cloudflare Pages juga bisa: publish directory = root, tanpa build command.

## Memperbarui data

Semua data ada di `assets/data.js` (objek `window.LANDSCAPE`). Situs menghitung angka hero, jumlah link, dan skor secara otomatis.

- `checkedAt`: tanggal pengecekan (format `YYYY-MM-DD`).
- `capabilities`: daftar kategori layanan. Urutannya menentukan arti string `caps`.
- `providers[]`:
  - `type`: salah satu kunci di `providerGroups`
  - `caps`: satu huruf per kategori, urut sesuai `capabilities`: `y` ada, `p` sebagian/bersyarat, `n` tidak ada, `c` cek (belum terverifikasi). Panjangnya harus sama dengan jumlah kategori.
  - `n`: catatan opsional per kategori, mis. `{ "toll": "..." }`
  - `free`: `ya` | `terbatas` | `cek`; `indo`: `kuat` | `ada` | `cek`
  - `play[]`: `{ t: judul, u: url, k: geocode|route|style|data|mcp, a: 0 tanpa akun | 1 perlu akun | 2 cek }`
- `trends[]`: `{ t: judul, d: deskripsi, s: url sumber }`
- `sources[]`: daftar URL sumber utama di footer.

Setelah mengubah link, cek ulang status HTTP, misalnya:

```bash
grep -o 'https\?://[^"]*' assets/data.js | sort -u | while read u; do
  echo "$(curl -s -L -o /dev/null -m 20 -w '%{http_code}' "$u") $u"; done
```

## Catatan

- Harga sengaja tidak dibahas; free tier hanya ditandai ada atau tidak.
- Sel bertanda **cek** belum terverifikasi dari dokumentasi resmi.
- Gaya visual (putih, aksen biru, label bernomor bergaris putus-putus, chip bergaya kode, satu pita gelap diagonal) terinspirasi dari landing page referensi, tanpa memakai logo atau merek pihak lain.
- Font: Figtree dan JetBrains Mono dari Google Fonts (fallback ke font sistem bila offline).
