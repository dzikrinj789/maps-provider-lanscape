/*
 * Data lanskap penyedia maps service. Edit file ini untuk memperbarui situs.
 * caps: satu huruf per kategori, urut sesuai "capabilities":
 *   y = ada, p = sebagian/bersyarat, n = tidak ada, c = cek (belum terverifikasi)
 * play[].a: 0 = tanpa akun, 1 = perlu akun/API key, 2 = akun: cek
 * play[].k: geocode | route | style | data | mcp
 */
window.LANDSCAPE = {
  "checkedAt": "2026-11-25",
  "capabilities": [
    {
      "k": "basemap",
      "l": "Basemap/tiles",
      "g": "peta"
    },
    {
      "k": "style",
      "l": "Style editor",
      "g": "peta"
    },
    {
      "k": "static",
      "l": "Static map",
      "g": "peta"
    },
    {
      "k": "d3",
      "l": "3D/terrain",
      "g": "peta"
    },
    {
      "k": "imagery",
      "l": "Citra satelit",
      "g": "peta"
    },
    {
      "k": "geocode",
      "l": "Geocoding",
      "g": "cari"
    },
    {
      "k": "auto",
      "l": "Autocomplete",
      "g": "cari"
    },
    {
      "k": "poi",
      "l": "Data POI",
      "g": "cari"
    },
    {
      "k": "admin",
      "l": "Batas admin",
      "g": "cari"
    },
    {
      "k": "route",
      "l": "Routing",
      "g": "rute"
    },
    {
      "k": "matrix",
      "l": "Matrix",
      "g": "rute"
    },
    {
      "k": "iso",
      "l": "Isochrone",
      "g": "rute"
    },
    {
      "k": "vrp",
      "l": "Optimasi/VRP",
      "g": "rute"
    },
    {
      "k": "match",
      "l": "Map matching",
      "g": "rute"
    },
    {
      "k": "toll",
      "l": "Info tol",
      "g": "rute"
    },
    {
      "k": "traffic",
      "l": "Traffic",
      "g": "rute"
    },
    {
      "k": "elev",
      "l": "Elevasi",
      "g": "data"
    },
    {
      "k": "geofence",
      "l": "Geofencing",
      "g": "data"
    },
    {
      "k": "hosting",
      "l": "Hosting/tiling",
      "g": "data"
    },
    {
      "k": "self",
      "l": "Self-host",
      "g": "data"
    },
    {
      "k": "mobile",
      "l": "Mobile SDK",
      "g": "data"
    },
    {
      "k": "mcp",
      "l": "MCP/AI agent",
      "g": "data"
    }
  ],
  "capabilityGroups": [
    {
      "g": "peta",
      "l": "Tampilan peta",
      "d": "Tiles, styling, static map, 3D, citra."
    },
    {
      "g": "cari",
      "l": "Pencarian lokasi",
      "d": "Geocoding, autocomplete, POI, batas wilayah."
    },
    {
      "g": "rute",
      "l": "Rute & pergerakan",
      "d": "Routing, matrix, isochrone, VRP, tol, traffic."
    },
    {
      "g": "data",
      "l": "Data, platform & AI",
      "d": "Elevasi, geofencing, hosting, self-host, SDK, MCP."
    }
  ],
  "providerGroups": {
    "bigtech": "Big tech & cloud",
    "data": "Spesialis data peta",
    "dev": "Platform developer",
    "gis": "GIS & analitik enterprise",
    "os": "Open source & data terbuka",
    "lokal": "Lokal Indonesia"
  },
  "providerGroupDescriptions": {
    "bigtech": "Peta dari raksasa teknologi dan cloud. Cakupan luas, terikat ekosistem masing-masing.",
    "data": "Pemilik data jalan, traffic, dan POI sendiri. Menjual lewat API langsung dan lewat cloud.",
    "dev": "Fokus pengalaman developer: playground, style editor, free tier, banyak yang berbasis OSM.",
    "gis": "Untuk analisis spasial dan instansi: hosting layer, on-prem, integrasi data warehouse.",
    "os": "Komponen yang bisa di-host sendiri: geocoder, routing engine, renderer, format tile, data terbuka.",
    "lokal": "Sumber dan layanan yang fokus ke Indonesia. Masih sedikit dan belum banyak yang punya playground."
  },
  "playgroundKinds": {
    "geocode": "Geocoding & POI",
    "route": "Routing & traffic",
    "style": "Styling & basemap",
    "data": "Data, 3D & demo",
    "mcp": "MCP/AI agent"
  },
  "accessLabels": [
    "Tanpa akun",
    "Perlu akun/API key",
    "Akun: cek"
  ],
  "symbols": {
    "y": "✓",
    "p": "◐",
    "n": "–",
    "c": "cek"
  },
  "statusLabels": {
    "y": "Ada",
    "p": "Sebagian",
    "n": "Tidak",
    "c": "cek"
  },
  "providers": [
    {
      "id": "google",
      "name": "Google Maps Platform",
      "type": "bigtech",
      "os": false,
      "free": "ya",
      "indo": "kuat",
      "indoNote": "Cakupan jalan dan POI paling luas, jadi patokan konsumen.",
      "desc": "Paket terlengkap: Maps, Places, Routes, Route Optimization, Roads, 3D Tiles, plus tools agen AI.",
      "caps": "yyyyyyyypyynyypyynpnyy",
      "n": {
        "iso": "Tidak ada endpoint isochrone di daftar API.",
        "toll": "Routes API bisa memberi info tol; cakupan Indonesia cek.",
        "admin": "Boundaries untuk data-driven styling.",
        "hosting": "Datasets untuk data-driven styling.",
        "mcp": "Maps Experience agent tools (MCP + REST) dan Code Assist.",
        "d3": "Photorealistic 3D Tiles."
      },
      "docs": "https://developers.google.com/maps/documentation",
      "play": [
        {
          "t": "Demo Gallery",
          "u": "https://mapsplatform.google.com/resources/demo-gallery/",
          "k": "data",
          "a": 0
        },
        {
          "t": "Demo Photorealistic 3D Maps",
          "u": "https://mapsplatform.google.com/demos/3d-maps/",
          "k": "data",
          "a": 0
        },
        {
          "t": "Contoh Places Autocomplete",
          "u": "https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete",
          "k": "geocode",
          "a": 0
        },
        {
          "t": "Demo Address Validation",
          "u": "https://developers.google.com/maps/documentation/address-validation/demo",
          "k": "geocode",
          "a": 0
        },
        {
          "t": "Maps Experience agent tools (MCP)",
          "u": "https://developers.google.com/maps/ai/maps-experience-agent-tools",
          "k": "mcp",
          "a": 1
        }
      ]
    },
    {
      "id": "apple",
      "name": "Apple MapKit JS",
      "type": "bigtech",
      "os": false,
      "free": "terbatas",
      "indo": "cek",
      "indoNote": "cek",
      "desc": "MapKit JS dan Apple Maps Server API. Perlu keanggotaan Apple Developer Program.",
      "caps": "ypycyyyycypnnncpnnnnyn",
      "n": {
        "matrix": "ETA di Apple Maps Server API."
      },
      "docs": "https://developer.apple.com/documentation/mapkitjs",
      "play": [
        {
          "t": "Apple Maps web",
          "u": "https://maps.apple.com/",
          "k": "data",
          "a": 0
        }
      ]
    },
    {
      "id": "huawei",
      "name": "Huawei Petal Maps",
      "type": "bigtech",
      "os": false,
      "free": "cek",
      "indo": "cek",
      "indoNote": "cek",
      "desc": "Map Kit untuk peta, Site Kit untuk pencarian tempat, terutama untuk aplikasi di ekosistem HMS.",
      "caps": "ypcccyyycycccccccpnnyc",
      "docs": "https://developer.huawei.com/consumer/en/hms/huawei-MapKit/",
      "play": [
        {
          "t": "Petal Maps web",
          "u": "https://www.petalmaps.com/",
          "k": "data",
          "a": 0
        }
      ]
    },
    {
      "id": "aws",
      "name": "AWS Location Service",
      "type": "bigtech",
      "os": false,
      "free": "cek",
      "indo": "kuat",
      "indoNote": "Data GrabMaps di region ap-southeast-1/5 (8 negara SEA termasuk Indonesia). Dengan GrabMaps tidak ada tileset satelit, traffic, DEM.",
      "desc": "Jalur utama GrabMaps ke developer global: tiles, places, routes, matrix, geofencing, MCP lokal.",
      "caps": "ypypyyyycyyyyypypynnyy",
      "n": {
        "style": "Style bawaan; kustom lewat MapLibre.",
        "toll": "Opsi tol di Routes; dukungan untuk GrabMaps cek.",
        "traffic": "Tileset traffic, tidak tersedia untuk GrabMaps.",
        "mcp": "awslabs aws-location-mcp-server (jalan lokal, kredensial AWS).",
        "iso": "CalculateIsolines (bukan operasi GrabMaps)."
      },
      "docs": "https://docs.aws.amazon.com/location/latest/developerguide/GrabMaps.html",
      "play": [
        {
          "t": "Amazon Location Demo",
          "u": "https://location.aws.com/",
          "k": "data",
          "a": 0
        },
        {
          "t": "Amazon Location MCP server",
          "u": "https://awslabs.github.io/mcp/servers/aws-location-mcp-server",
          "k": "mcp",
          "a": 1
        }
      ]
    },
    {
      "id": "azure",
      "name": "Azure Maps",
      "type": "bigtech",
      "os": false,
      "free": "cek",
      "indo": "ada",
      "indoNote": "Tabel coverage: routing dan traffic real-time tersedia untuk Indonesia.",
      "desc": "Layanan maps di Azure: render, search, route, traffic. Tidak ada MCP resmi.",
      "caps": "ypycyyyycyyycccynccncn",
      "n": {
        "elev": "Layanan elevasi sudah dipensiunkan.",
        "mcp": "Hanya proyek komunitas (diarsipkan)."
      },
      "docs": "https://learn.microsoft.com/en-us/azure/azure-maps/",
      "play": [
        {
          "t": "Azure Maps Samples",
          "u": "https://samples.azuremaps.com/",
          "k": "data",
          "a": 2
        }
      ]
    },
    {
      "id": "here",
      "name": "HERE",
      "type": "data",
      "os": false,
      "free": "ya",
      "indo": "ada",
      "indoNote": "WeGo bisa dipakai di Indonesia; kedalaman data lokal cek.",
      "desc": "Kuat di logistik: routing truk, tour planning, traffic, plus MCP HERE Location Reasoning.",
      "caps": "yyypyyyycyyyyyyycyycyy",
      "n": {
        "toll": "Routing API mendukung biaya tol; cakupan Indonesia cek.",
        "vrp": "Tour Planning API.",
        "mcp": "HERE Location Reasoning (hlr.here.ai/mcp)."
      },
      "docs": "https://docs.here.com/",
      "play": [
        {
          "t": "HERE WeGo",
          "u": "https://wego.here.com/",
          "k": "data",
          "a": 0
        },
        {
          "t": "Routing API Reference Client",
          "u": "https://demo.routing.ext.here.com/",
          "k": "route",
          "a": 2
        },
        {
          "t": "HERE Style Editor",
          "u": "https://platform.here.com/style-editor/",
          "k": "style",
          "a": 1
        },
        {
          "t": "HERE Location Reasoning (MCP)",
          "u": "https://docs.here.com/location-reasoning/docs/hlroverview",
          "k": "mcp",
          "a": 1
        }
      ]
    },
    {
      "id": "tomtom",
      "name": "TomTom",
      "type": "data",
      "os": false,
      "free": "ya",
      "indo": "ada",
      "indoNote": "Traffic Index 2025 memuat kota Indonesia (Bandung #16 dunia, Jakarta #24).",
      "desc": "Spesialis traffic dan navigasi; API Explorer interaktif per layanan, Map Maker untuk styling.",
      "caps": "yyycyyyycyyycycycyccyy",
      "n": {
        "match": "Snap to Roads API.",
        "geofence": "Geofencing API.",
        "traffic": "Traffic API dan Traffic Index."
      },
      "docs": "https://docs.tomtom.com/",
      "play": [
        {
          "t": "Search API Explorer",
          "u": "https://docs.tomtom.com/search-api/api-explorer",
          "k": "geocode",
          "a": 2
        },
        {
          "t": "Routing API Explorer",
          "u": "https://docs.tomtom.com/routing-api/api-explorer",
          "k": "route",
          "a": 2
        },
        {
          "t": "Traffic API Explorer",
          "u": "https://docs.tomtom.com/traffic-api/api-explorer",
          "k": "route",
          "a": 2
        },
        {
          "t": "Map Display API Explorer",
          "u": "https://docs.tomtom.com/map-display-api/api-explorer",
          "k": "style",
          "a": 2
        },
        {
          "t": "Map Maker",
          "u": "https://docs.tomtom.com/map-maker/documentation/product-updates/create-branded-map",
          "k": "style",
          "a": 1
        },
        {
          "t": "Contoh Maps SDK JS",
          "u": "https://docs.tomtom.com/maps-sdk-js/examples",
          "k": "data",
          "a": 0
        },
        {
          "t": "TomTom Route Planner",
          "u": "https://plan.tomtom.com/",
          "k": "route",
          "a": 0
        },
        {
          "t": "Traffic Index Indonesia",
          "u": "https://www.tomtom.com/traffic-index/country/indonesia/",
          "k": "data",
          "a": 0
        },
        {
          "t": "TomTom Maps MCP",
          "u": "https://github.com/tomtom-international/tomtom-maps-mcp",
          "k": "mcp",
          "a": 1
        }
      ]
    },
    {
      "id": "grab",
      "name": "GrabMaps",
      "type": "data",
      "os": false,
      "free": "cek",
      "indo": "kuat",
      "indoNote": "500+ kota di 8 negara SEA; detail gang dan rute motor.",
      "desc": "Data peta SEA dari operasi Grab. Dijual lewat AWS dan Developer Portal sendiri (map, search, routing, geocoding, place) berbasis MapLibre.",
      "caps": "ypcccyyycyyccccccccccp",
      "n": {
        "style": "Style bernama, mis. urban-light-partner; kustom cek.",
        "mcp": "Dokumentasi punya bagian Agent Skills."
      },
      "docs": "https://developer.maps.grab.com/",
      "play": [
        {
          "t": "GrabMaps Developer Portal",
          "u": "https://developer.maps.grab.com/",
          "k": "data",
          "a": 1
        },
        {
          "t": "Quick Start (MapLibre)",
          "u": "https://developer.maps.grab.com/documentation/getting-started",
          "k": "style",
          "a": 1
        }
      ]
    },
    {
      "id": "mapbox",
      "name": "Mapbox",
      "type": "dev",
      "os": false,
      "free": "ya",
      "indo": "ada",
      "indoNote": "Cakupan global; kualitas POI lokal Indonesia cek.",
      "desc": "Patokan developer experience: Studio untuk styling, playground per API, tiling service, MCP resmi.",
      "caps": "yyyyyyyypyyyyycyycypyy",
      "n": {
        "admin": "Mapbox Boundaries (paket enterprise).",
        "self": "Mapbox Atlas untuk on-prem (enterprise).",
        "hosting": "Mapbox Tiling Service (MTS)."
      },
      "docs": "https://docs.mapbox.com/",
      "play": [
        {
          "t": "Mapbox Studio",
          "u": "https://studio.mapbox.com/",
          "k": "style",
          "a": 1
        },
        {
          "t": "Playground Geocoding",
          "u": "https://docs.mapbox.com/playground/geocoding/",
          "k": "geocode",
          "a": 2
        },
        {
          "t": "Playground Search Box",
          "u": "https://docs.mapbox.com/playground/search-box/suggest-retrieve/",
          "k": "geocode",
          "a": 2
        },
        {
          "t": "Playground Directions",
          "u": "https://docs.mapbox.com/playground/directions/",
          "k": "route",
          "a": 2
        },
        {
          "t": "Playground Matrix",
          "u": "https://docs.mapbox.com/playground/matrix/",
          "k": "route",
          "a": 2
        },
        {
          "t": "Playground Isochrone",
          "u": "https://docs.mapbox.com/playground/isochrone/",
          "k": "route",
          "a": 2
        },
        {
          "t": "Playground Map Matching",
          "u": "https://docs.mapbox.com/playground/map-matching/",
          "k": "route",
          "a": 2
        },
        {
          "t": "Playground Static Images",
          "u": "https://docs.mapbox.com/playground/static/",
          "k": "style",
          "a": 2
        },
        {
          "t": "Playground Tilequery",
          "u": "https://docs.mapbox.com/playground/tilequery/",
          "k": "data",
          "a": 2
        },
        {
          "t": "Mapbox MCP server",
          "u": "https://github.com/mapbox/mcp-server",
          "k": "mcp",
          "a": 1
        }
      ]
    },
    {
      "id": "maptiler",
      "name": "MapTiler",
      "type": "dev",
      "os": false,
      "free": "ya",
      "indo": "ada",
      "indoNote": "Berbasis OSM; kualitas mengikuti OSM Indonesia.",
      "desc": "Basemap, editor style, satelit, terrain, hosting data, dan MapTiler Server untuk self-host. Tanpa routing.",
      "caps": "yyyyyyyppnnnnnnnynyyyp",
      "n": {
        "mcp": "MCP hanya untuk dokumentasi, bukan layanan peta.",
        "self": "MapTiler Server/Data."
      },
      "docs": "https://docs.maptiler.com/",
      "play": [
        {
          "t": "MapTiler Cloud (Customize)",
          "u": "https://cloud.maptiler.com/maps/",
          "k": "style",
          "a": 1
        },
        {
          "t": "Contoh MapTiler SDK JS",
          "u": "https://docs.maptiler.com/sdk-js/examples/",
          "k": "data",
          "a": 0
        },
        {
          "t": "MapTiler Search",
          "u": "https://www.maptiler.com/search/",
          "k": "geocode",
          "a": 2
        },
        {
          "t": "MapTiler MCP (docs)",
          "u": "https://docs.maptiler.com/guides/developer/ai/mcp/",
          "k": "mcp",
          "a": 0
        }
      ]
    },
    {
      "id": "stadia",
      "name": "Stadia Maps",
      "type": "dev",
      "os": false,
      "free": "ya",
      "indo": "ada",
      "indoNote": "Berbasis OSM.",
      "desc": "Basemap tematik (termasuk Stamen), geocoding, routing Valhalla terkelola, elevasi, MCP resmi.",
      "caps": "ypyccyypcyyypynnyncppy",
      "n": {
        "route": "Berbasis Valhalla.",
        "self": "Stack inti open source (Valhalla, Pelias)."
      },
      "docs": "https://docs.stadiamaps.com/",
      "play": [
        {
          "t": "Galeri tema peta",
          "u": "https://docs.stadiamaps.com/themes/",
          "k": "style",
          "a": 0
        },
        {
          "t": "Stadia Maps MCP server",
          "u": "https://github.com/stadiamaps/stadiamaps-mcp-server-ts",
          "k": "mcp",
          "a": 1
        }
      ]
    },
    {
      "id": "geoapify",
      "name": "Geoapify",
      "type": "dev",
      "os": false,
      "free": "ya",
      "indo": "ada",
      "indoNote": "Berbasis OSM.",
      "desc": "Playground paling lengkap: geocoding, places, routing, route planner, isoline, map matching, static map, MCP.",
      "caps": "ypyncyyyyyyyyynncncnpy",
      "n": {
        "admin": "Boundaries API.",
        "mcp": "MCP remote, 15 tools."
      },
      "docs": "https://apidocs.geoapify.com/",
      "play": [
        {
          "t": "Semua playground",
          "u": "https://apidocs.geoapify.com/playground/",
          "k": "data",
          "a": 2
        },
        {
          "t": "Playground Geocoding",
          "u": "https://apidocs.geoapify.com/playground/geocoding/",
          "k": "geocode",
          "a": 2
        },
        {
          "t": "Playground Places",
          "u": "https://apidocs.geoapify.com/playground/places/",
          "k": "geocode",
          "a": 2
        },
        {
          "t": "Playground Routing",
          "u": "https://apidocs.geoapify.com/playground/routing/",
          "k": "route",
          "a": 2
        },
        {
          "t": "Playground Route Planner",
          "u": "https://apidocs.geoapify.com/playground/route-planner/",
          "k": "route",
          "a": 2
        },
        {
          "t": "Playground Isoline",
          "u": "https://apidocs.geoapify.com/playground/isoline/",
          "k": "route",
          "a": 2
        },
        {
          "t": "Playground Map Matching",
          "u": "https://apidocs.geoapify.com/playground/map-matching/",
          "k": "route",
          "a": 2
        },
        {
          "t": "Playground Static Maps",
          "u": "https://apidocs.geoapify.com/playground/static-maps/",
          "k": "style",
          "a": 2
        },
        {
          "t": "Geoapify MCP server",
          "u": "https://www.geoapify.com/mcp/",
          "k": "mcp",
          "a": 1
        }
      ]
    },
    {
      "id": "liq",
      "name": "LocationIQ",
      "type": "dev",
      "os": false,
      "free": "ya",
      "indo": "ada",
      "indoNote": "Berbasis OSM.",
      "desc": "Geocoding dan autocomplete, plus tiles, static map, directions, matrix.",
      "caps": "ycynnyypcyycccnnnnnnpc",
      "docs": "https://docs.locationiq.com/",
      "play": [
        {
          "t": "Sandbox Geocoding",
          "u": "https://locationiq.com/sandbox/geocoding/forward",
          "k": "geocode",
          "a": 2
        }
      ]
    },
    {
      "id": "radar",
      "name": "Radar",
      "type": "dev",
      "os": false,
      "free": "ya",
      "indo": "cek",
      "indoNote": "cek",
      "desc": "Fokus geofencing dan tracking, plus geocoding, search, maps, routing.",
      "caps": "yccnnyyycyycccncnynnyp",
      "n": {
        "mcp": "MCP hanya untuk dokumentasi.",
        "geofence": "Produk inti."
      },
      "docs": "https://docs.radar.com/",
      "play": [
        {
          "t": "Radar API demo",
          "u": "https://dashboard.radar.com/demo/api",
          "k": "geocode",
          "a": 2
        },
        {
          "t": "Radar docs MCP",
          "u": "https://docs.radar.com/mcp",
          "k": "mcp",
          "a": 0
        }
      ]
    },
    {
      "id": "esri",
      "name": "Esri ArcGIS Location Platform",
      "type": "gis",
      "os": false,
      "free": "ya",
      "indo": "ada",
      "indoNote": "Pemain utama di pemerintah/BUMN lewat Esri Indonesia.",
      "desc": "Ekosistem GIS lengkap: basemap, geocoding, routing/VRP, elevasi, hosting layer, on-prem via ArcGIS Enterprise.",
      "caps": "yyyyyyyyyyyyyccpypyyyp",
      "n": {
        "self": "Lewat ArcGIS Enterprise, bukan Location Platform.",
        "mcp": "MCP beta sejak 29 Jun 2026 (early access): geocoding, routing, elevasi, static maps.",
        "static": "Static Maps Service baru (rilis 2026).",
        "admin": "Konten boundary di Living Atlas."
      },
      "docs": "https://developers.arcgis.com/",
      "play": [
        {
          "t": "Sample ArcGIS Maps SDK for JS",
          "u": "https://developers.arcgis.com/javascript/latest/sample-code/",
          "k": "data",
          "a": 0
        },
        {
          "t": "Vector Tile Style Editor",
          "u": "https://developers.arcgis.com/vector-tile-style-editor/",
          "k": "style",
          "a": 2
        },
        {
          "t": "ArcGIS Location Platform",
          "u": "https://location.arcgis.com/",
          "k": "data",
          "a": 1
        },
        {
          "t": "Pengumuman MCP beta",
          "u": "https://www.esri.com/arcgis-blog/products/platform/developers/mcp-support-beta-and-arcgis-static-maps-service-in-arcgis-location-platform-release",
          "k": "mcp",
          "a": 1
        }
      ]
    },
    {
      "id": "carto",
      "name": "CARTO",
      "type": "gis",
      "os": false,
      "free": "terbatas",
      "indo": "cek",
      "indoNote": "Platform analitik; data mengikuti sumber pelanggan.",
      "desc": "Analitik spasial di atas data warehouse: Builder, tiling, routing/isoline, self-hosted, MCP.",
      "caps": "yycpcycppycynnnnnnyyny",
      "n": {
        "mcp": "CARTO MCP Server: data, Builder map, workflow, SQL spasial."
      },
      "docs": "https://docs.carto.com/",
      "play": [
        {
          "t": "CARTO Builder (trial)",
          "u": "https://carto.com/signup",
          "k": "data",
          "a": 1
        },
        {
          "t": "CARTO Basemaps",
          "u": "https://carto.com/basemaps",
          "k": "style",
          "a": 0
        },
        {
          "t": "CARTO MCP Server",
          "u": "https://docs.carto.com/carto-for-agents/mcp-server",
          "k": "mcp",
          "a": 1
        }
      ]
    },
    {
      "id": "ors",
      "name": "openrouteservice",
      "type": "os",
      "os": true,
      "free": "ya",
      "indo": "ada",
      "indoNote": "Berbasis OSM.",
      "desc": "Routing, isochrone, matrix, optimasi (VROOM), elevasi, POI. Klien lama ditutup 16 Nov 2026, diganti routing.heigit.org.",
      "caps": "nnnnnyyynyyyypnnynnynp",
      "n": {
        "mcp": "Hanya konektor komunitas, belum resmi.",
        "vrp": "Optimasi berbasis VROOM."
      },
      "docs": "https://giscience.github.io/openrouteservice/",
      "play": [
        {
          "t": "Web client ORS baru",
          "u": "https://routing.heigit.org/",
          "k": "route",
          "a": 0
        },
        {
          "t": "Dashboard/Playground API",
          "u": "https://playground.heigit.org/",
          "k": "route",
          "a": 1
        }
      ]
    },
    {
      "id": "valhalla",
      "name": "Valhalla",
      "type": "os",
      "os": true,
      "free": "ya",
      "indo": "ada",
      "indoNote": "Berbasis OSM.",
      "desc": "Routing engine open source: rute multimoda, matrix, isochrone, map matching, elevasi.",
      "caps": "nnnnnnnnnyyyyynpynnycn",
      "n": {
        "traffic": "Bisa memakai data traffic jika disuplai.",
        "vrp": "optimized_route."
      },
      "docs": "https://valhalla.github.io/valhalla/",
      "play": [
        {
          "t": "Valhalla demo (FOSSGIS)",
          "u": "https://valhalla.openstreetmap.de/",
          "k": "route",
          "a": 0
        }
      ]
    },
    {
      "id": "osrm",
      "name": "OSRM",
      "type": "os",
      "os": true,
      "free": "ya",
      "indo": "ada",
      "indoNote": "Berbasis OSM.",
      "desc": "Routing engine open source yang sangat cepat: route, table (matrix), match, trip.",
      "caps": "nnnnnnnnnyynpynnnnnynn",
      "n": {
        "vrp": "Endpoint trip (TSP sederhana)."
      },
      "docs": "https://github.com/Project-OSRM/osrm-backend",
      "play": [
        {
          "t": "OSRM demo",
          "u": "https://map.project-osrm.org/",
          "k": "route",
          "a": 0
        }
      ]
    },
    {
      "id": "gh",
      "name": "GraphHopper",
      "type": "os",
      "os": true,
      "free": "ya",
      "indo": "ada",
      "indoNote": "Berbasis OSM.",
      "desc": "Routing engine open source plus API terkelola: matrix, isochrone, route optimization, map matching.",
      "caps": "nnnnnypnnyyyyyccpnnycc",
      "docs": "https://docs.graphhopper.com/openapi",
      "play": [
        {
          "t": "GraphHopper Maps",
          "u": "https://graphhopper.com/maps/",
          "k": "route",
          "a": 0
        }
      ]
    },
    {
      "id": "nominatim",
      "name": "Nominatim (OSM)",
      "type": "os",
      "os": true,
      "free": "ya",
      "indo": "ada",
      "indoNote": "Mengikuti kelengkapan alamat OSM Indonesia.",
      "desc": "Geocoder resmi OSM. Instance publik punya kebijakan pemakaian ketat (tanpa autocomplete); self-host untuk produksi.",
      "caps": "nnnnnynppnnnnnnnnnnynn",
      "n": {
        "admin": "Bisa mengembalikan poligon wilayah.",
        "auto": "Dilarang di instance publik."
      },
      "docs": "https://nominatim.org/release-docs/latest/",
      "play": [
        {
          "t": "Nominatim UI (cari)",
          "u": "https://nominatim.openstreetmap.org/ui/search.html",
          "k": "geocode",
          "a": 0
        },
        {
          "t": "Nominatim UI (reverse)",
          "u": "https://nominatim.openstreetmap.org/ui/reverse.html",
          "k": "geocode",
          "a": 0
        }
      ]
    },
    {
      "id": "photon",
      "name": "Photon (komoot)",
      "type": "os",
      "os": true,
      "free": "ya",
      "indo": "ada",
      "indoNote": "Berbasis OSM.",
      "desc": "Geocoder open source dengan search-as-you-type, demo publik fair use.",
      "caps": "nnnnnyypnnnnnnnnnnnynn",
      "docs": "https://github.com/komoot/photon",
      "play": [
        {
          "t": "Photon demo",
          "u": "https://photon.komoot.io/",
          "k": "geocode",
          "a": 0
        }
      ]
    },
    {
      "id": "protomaps",
      "name": "Protomaps / PMTiles",
      "type": "os",
      "os": true,
      "free": "ya",
      "indo": "ada",
      "indoNote": "Berbasis OSM.",
      "desc": "Basemap open source dalam satu file PMTiles, bisa di-host di storage biasa tanpa tile server.",
      "caps": "ypnnnnnnnnnnnnnnnnyypn",
      "docs": "https://docs.protomaps.com/",
      "play": [
        {
          "t": "Protomaps Basemaps viewer",
          "u": "https://maps.protomaps.com/",
          "k": "style",
          "a": 0
        },
        {
          "t": "PMTiles viewer",
          "u": "https://pmtiles.io/",
          "k": "data",
          "a": 0
        }
      ]
    },
    {
      "id": "maplibre",
      "name": "MapLibre + Maputnik",
      "type": "os",
      "os": true,
      "free": "ya",
      "indo": "ada",
      "indoNote": "Hanya renderer dan editor; datanya dari sumber lain.",
      "desc": "Renderer peta open source (web dan native) dan editor style Maputnik, dipakai juga oleh GrabMaps.",
      "caps": "pynpnnnnnnnnnnnnnnnyyn",
      "n": {
        "basemap": "Renderer, bukan penyedia data."
      },
      "docs": "https://maplibre.org/",
      "play": [
        {
          "t": "Maputnik (editor style)",
          "u": "https://maplibre.org/maputnik/",
          "k": "style",
          "a": 0
        },
        {
          "t": "Contoh MapLibre GL JS",
          "u": "https://maplibre.org/maplibre-gl-js/docs/examples/",
          "k": "style",
          "a": 0
        }
      ]
    },
    {
      "id": "overture",
      "name": "Overture Maps",
      "type": "os",
      "os": true,
      "free": "ya",
      "indo": "ada",
      "indoNote": "Places, bangunan, divisi admin global termasuk Indonesia; kualitas lokal cek.",
      "desc": "Dataset terbuka (places, buildings, divisions, transportation), bukan API.",
      "caps": "pnnpnnnyynnnnnnnnnnpnn",
      "docs": "https://docs.overturemaps.org/",
      "play": [
        {
          "t": "Overture Explorer (Bandung)",
          "u": "https://explore.overturemaps.org/#15/-6.9147/107.6098",
          "k": "data",
          "a": 0
        }
      ]
    },
    {
      "id": "big",
      "name": "Ina-Geoportal (BIG)",
      "type": "lokal",
      "os": false,
      "free": "ya",
      "indo": "kuat",
      "indoNote": "Sumber resmi peta dasar dan batas wilayah.",
      "desc": "Geoportal nasional Badan Informasi Geospasial: peta dasar RBI, batas wilayah, DEMNAS. Portal data, bukan API developer.",
      "caps": "ynccccncynnnnnnnpnnnnn",
      "n": {
        "elev": "DEMNAS; akses cek."
      },
      "docs": "https://big.go.id/",
      "play": [
        {
          "t": "Ina-Geoportal",
          "u": "https://tanahair.indonesia.go.id/portal-web/",
          "k": "data",
          "a": 0
        }
      ]
    },
    {
      "id": "poindt",
      "name": "POINDT (OSM Indonesia)",
      "type": "lokal",
      "os": false,
      "free": "cek",
      "indo": "cek",
      "indoNote": "Fokus Indonesia; kualitas belum diuji.",
      "desc": "Inisiatif Perkumpulan OSM Indonesia dan Kathmandu Living Labs (2025): style, geocoding, search, routing mobil/motor/jalan, VRS.",
      "caps": "yycccyyycyccyccccccccc",
      "docs": "https://openstreetmap.or.id/poindt/",
      "play": []
    },
    {
      "id": "vibri",
      "name": "Vibri Maps",
      "type": "lokal",
      "os": false,
      "free": "cek",
      "indo": "cek",
      "indoNote": "Tile custom Indonesia; kualitas belum diuji.",
      "desc": "Pemain lokal kecil: maps, route, autocomplete, geolokasi, tileserver.",
      "caps": "yccccyyccycccccccccccc",
      "docs": "https://maps.vibri.id/",
      "play": []
    }
  ],
  "trends": [
    {
      "t": "MCP ada di mana-mana",
      "d": "Google (Maps Experience agent tools), HERE (Location Reasoning), Mapbox, TomTom, Geoapify, CARTO, Stadia, dan AWS sudah punya MCP resmi. Esri masuk beta Juni 2026; MapTiler dan Radar punya MCP untuk dokumentasi.",
      "s": "https://docs.here.com/location-reasoning/docs/hlroverview"
    },
    {
      "t": "Data lokal dijual lewat cloud",
      "d": "GrabMaps tersedia di AWS Location Service sejak 31 Mar 2026 (region Singapura dan Malaysia), juga lewat Loqate dan Snowflake, sambil membuka Developer Portal sendiri.",
      "s": "https://aws.amazon.com/about-aws/whats-new/2026/03/amazon-location-service-grabmaps/"
    },
    {
      "t": "Stack open source makin matang",
      "d": "MapLibre jadi renderer standar (GrabMaps pun memakainya), Valhalla menggerakkan Stadia, PMTiles memungkinkan basemap tanpa tile server, Overture merilis POI dan batas admin terbuka.",
      "s": "https://developer.maps.grab.com/documentation/getting-started"
    },
    {
      "t": "Playground self-serve jadi standar",
      "d": "Mapbox punya playground per API, Geoapify untuk hampir semua layanan, TomTom API Explorer, HERE Routing reference client. Developer bisa mencoba sebelum bicara dengan sales.",
      "s": "https://docs.mapbox.com/playground/"
    },
    {
      "t": "Konsolidasi layanan lama",
      "d": "Klien lama openrouteservice ditutup 16 Nov 2026 dan API pindah ke api.heigit.org; Azure Maps sudah memensiunkan layanan elevasi.",
      "s": "https://heigit.org/changes-in-the-openrouteservice-universe/"
    },
    {
      "t": "Pemain lokal mulai muncul",
      "d": "POINDT (OSM Indonesia dan Kathmandu Living Labs, 2025) dan Vibri Maps menawarkan peta, geocoding, dan routing khusus Indonesia, tapi belum ada playground publik.",
      "s": "https://openstreetmap.or.id/poindt/"
    }
  ],
  "sources": [
    "https://docs.aws.amazon.com/location/latest/developerguide/GrabMaps.html",
    "https://aws.amazon.com/about-aws/whats-new/2026/03/amazon-location-service-grabmaps/",
    "https://grabmaps.grab.com/resources/2025-year-in-review-building-the-map-that-moves-southeast-asia-and-beyond",
    "https://developer.maps.grab.com/",
    "https://developers.google.com/maps/ai/maps-experience-agent-tools",
    "https://docs.here.com/location-reasoning/docs/hlroverview",
    "https://www.esri.com/arcgis-blog/products/platform/developers/mcp-support-beta-and-arcgis-static-maps-service-in-arcgis-location-platform-release",
    "https://docs.carto.com/carto-for-agents/mcp-server",
    "https://www.geoapify.com/mcp/",
    "https://docs.maptiler.com/guides/developer/ai/mcp/",
    "https://heigit.org/changes-in-the-openrouteservice-universe/",
    "https://learn.microsoft.com/en-us/azure/azure-maps/routing-coverage",
    "https://www.tomtom.com/traffic-index/country/indonesia/",
    "https://openstreetmap.or.id/poindt/",
    "https://maps.vibri.id/"
  ]
};
