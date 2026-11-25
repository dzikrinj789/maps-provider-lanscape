# Lanskap Maps Service

Landing page statis (Bahasa Indonesia) yang memetakan lanskap penyedia maps service / maps API per **25 Nov 2026**:

- 28 penyedia dalam 6 kelompok (big tech & cloud, spesialis data peta, platform developer, GIS & analitik enterprise, open source & data terbuka, lokal Indonesia)
- 22 kategori layanan (basemap, styling, geocoding, POI, routing, matrix, isochrone, VRP, map matching, tol, traffic, elevasi, geofencing, hosting, self-host, mobile SDK, MCP, dll.)
- Matriks kemampuan yang bisa difilter dan diurutkan
- Link playground/demo yang sudah dicek, dikelompokkan per layanan
- **Playground langsung**: peta MapLibre + perbandingan geocoding, reverse geocoding, rute, dan isochrone dari banyak penyedia sekaligus (langsung dari browser, tanpa backend)
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
  playground.js     playground langsung: konfigurasi penyedia, endpoint, parser, peta
  styles.css        gaya visual
```

## Menjalankan secara lokal

Cukup buka `index.html` di browser, atau jalankan server statis:

```bash
python3 -m http.server 8080
# lalu buka http://localhost:8080
```

## Playground langsung

Semua request dikirim langsung dari browser pengunjung ke API penyedia. Peta memakai MapLibre GL JS 5.24.1 dari unpkg.

**Jalan tanpa key**

| Penyedia | Mode | Catatan |
|---|---|---|
| Nominatim (OSM) | geocoding, reverse | Dijalankan hanya saat tombol/klik (tanpa autocomplete), throttle 1 request/detik + cache, atribusi OSM |
| Photon (komoot) | geocoding, reverse | Demo publik, fair use |
| OSRM demo (`router.project-osrm.org`) | rute | Demo publik, fair use |
| Valhalla FOSSGIS (`valhalla1.openstreetmap.de`) | rute, isochrone | Demo publik, fair use |
| Stadia Maps | geocoding, rute | **Hanya dari `localhost`/`127.0.0.1`** (domain-based auth Stadia). Reverse & isochrone tetap 403 tanpa key. Di domain publik perlu API key atau domain terdaftar di akun Stadia |
| Basemap OpenFreeMap (Liberty, Positron), OSM Standard raster | peta | OSM raster hanya untuk pemakaian ringan (kebijakan tile OSMF) |

**Perlu API key** (diisi di panel *Kunci API*, disimpan hanya di `localStorage` browser, bisa dihapus dengan tombol *Hapus semua key*):
Google Maps Platform (Geocoding API + Routes API), Mapbox (Search Geocoding v6 + Directions + raster tiles), HERE (Geocoding/Reverse + Routing v8), TomTom (Search + Routing), Geoapify (Geocoding + Routing + Isoline), LocationIQ (Search/Reverse + Directions), MapTiler (Geocoding + style Streets), Azure Maps (Geocode/Reverse + Route), Stadia (reverse, isochrone, produksi), ArcGIS Location Platform (Geocode/Reverse + Route), GraphHopper (Routing), openrouteservice/HeiGIT (`api.heigit.org/openrouteservice/v2` directions + isochrones).

**Uji CORS (headless Chrome, 25 Nov 2026, origin `http://localhost`)**: semua endpoint tanpa key di atas mengembalikan data asli. Untuk endpoint ber-key, request dengan key tidak valid menghasilkan respons error yang *bisa dibaca* browser (artinya CORS diizinkan) untuk Google Geocoding & Routes, Mapbox Search, HERE, TomTom, Geoapify, LocationIQ, MapTiler, Azure, ArcGIS, GraphHopper, dan openrouteservice. **Mapbox Directions dan raster tiles gagal (TypeError) dengan token tidak valid**, jadi belum terbukti; kemungkinan respons error-nya saja yang tanpa header CORS. Parser hasil untuk penyedia ber-key ditulis dari dokumentasi resmi dan **belum diuji dengan key asli**; error per penyedia ditampilkan di kartunya tanpa mengganggu penyedia lain.

Mengubah penyedia: edit array `PROVIDERS` dan fungsi di objek `GEO`, `REV`, `ROUTE`, `ISO` dalam `assets/playground.js`.

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
- Server demo publik gratis punya batas fair use. Untuk trafik publik yang besar, pakai instance sendiri atau penyedia ber-key.
- Font: Figtree dan JetBrains Mono dari Google Fonts (fallback ke font sistem bila offline).
