/*
 * Playground langsung: geocoding, reverse, rute, isochrone dari banyak penyedia.
 * Semua request dikirim langsung dari browser (tanpa backend).
 * Status CORS tiap endpoint diuji dari headless Chrome pada 25 Nov 2026 (lihat README).
 */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var enc = encodeURIComponent;
  var LOCAL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  var KEYSTORE = "mpl-keys-v1";
  var keys = {};
  try { keys = JSON.parse(localStorage.getItem(KEYSTORE) || "{}") || {}; } catch (e) { keys = {}; }

  /* ---------- polyline decoders ---------- */
  function decodePolyline(str, precision) {
    var idx = 0, lat = 0, lng = 0, out = [], f = Math.pow(10, precision);
    while (idx < str.length) {
      var b, shift = 0, result = 0;
      do { b = str.charCodeAt(idx++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
      lat += (result & 1) ? ~(result >> 1) : (result >> 1);
      shift = 0; result = 0;
      do { b = str.charCodeAt(idx++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
      lng += (result & 1) ? ~(result >> 1) : (result >> 1);
      out.push([lng / f, lat / f]);
    }
    return out;
  }
  // HERE flexible polyline
  var FLEX = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  function decodeFlex(s) {
    var i = 0;
    function next() { var r = 0, sh = 0, v; do { v = FLEX.indexOf(s[i++]); r += (v & 0x1f) * Math.pow(2, sh); sh += 5; } while (v & 0x20); return r; }
    function signed(v) { return v % 2 ? -Math.floor(v / 2) - 1 : v / 2; }
    next(); var h = next(); var prec = h & 15, third = (h >> 4) & 7, f = Math.pow(10, prec);
    var lat = 0, lng = 0, out = [];
    while (i < s.length) { lat += signed(next()); lng += signed(next()); if (third) signed(next()); out.push([lng / f, lat / f]); }
    return out;
  }
  window.__pgDecodeFlex = decodeFlex;

  /* ---------- providers ---------- */
  var PROVIDERS = [
    { id: "nominatim", name: "Nominatim (OSM)", color: "#1b659d", ops: ["geo", "rev"], attr: "Data © OpenStreetMap contributors (ODbL)", note: "Tanpa key · maks 1 request/detik" },
    { id: "photon", name: "Photon (komoot)", color: "#e07a1f", ops: ["geo", "rev"], attr: "Data © OpenStreetMap contributors", note: "Tanpa key · demo publik fair use" },
    { id: "osrm", name: "OSRM demo", color: "#2a9d5b", ops: ["route"], attr: "OSRM demo server · © OpenStreetMap", note: "Tanpa key · demo publik fair use" },
    { id: "valhalla", name: "Valhalla (FOSSGIS)", color: "#8a3ffc", ops: ["route", "iso"], attr: "Valhalla FOSSGIS · © OpenStreetMap", note: "Tanpa key · demo publik fair use" },
    { id: "stadia", name: "Stadia Maps", color: "#d62f7a", ops: ["geo", "rev", "route", "iso"], key: "stadia", localFree: true, localOps: ["geo", "route"], attr: "© Stadia Maps © OpenStreetMap", signup: "https://client.stadiamaps.com/signup/" },
    { id: "google", name: "Google Maps Platform", color: "#db3a34", ops: ["geo", "rev", "route"], key: "google", attr: "© Google", signup: "https://developers.google.com/maps/get-started" },
    { id: "mapbox", name: "Mapbox", color: "#111111", ops: ["geo", "rev", "route"], key: "mapbox", attr: "© Mapbox © OpenStreetMap", signup: "https://account.mapbox.com/auth/signup/", warn: "Uji CORS dengan token tidak valid: Search terbaca, Directions gagal. Dengan token asli belum diuji." },
    { id: "here", name: "HERE", color: "#00908a", ops: ["geo", "rev", "route"], key: "here", attr: "© HERE", signup: "https://platform.here.com/sign-up" },
    { id: "tomtom", name: "TomTom", color: "#c9a400", ops: ["geo", "rev", "route"], key: "tomtom", attr: "© TomTom", signup: "https://developer.tomtom.com/user/login" },
    { id: "geoapify", name: "Geoapify", color: "#5a6acf", ops: ["geo", "rev", "route", "iso"], key: "geoapify", attr: "Powered by Geoapify · © OpenStreetMap", signup: "https://myprojects.geoapify.com/register" },
    { id: "locationiq", name: "LocationIQ", color: "#0e7490", ops: ["geo", "rev", "route"], key: "locationiq", attr: "© LocationIQ © OpenStreetMap", signup: "https://my.locationiq.com/register" },
    { id: "maptiler", name: "MapTiler", color: "#7c5a2b", ops: ["geo", "rev"], key: "maptiler", attr: "© MapTiler © OpenStreetMap", signup: "https://cloud.maptiler.com/account/keys/" },
    { id: "azure", name: "Azure Maps", color: "#2f6fde", ops: ["geo", "rev", "route"], key: "azure", attr: "© Microsoft Azure Maps", signup: "https://learn.microsoft.com/en-us/azure/azure-maps/how-to-manage-account-keys" },
    { id: "arcgis", name: "ArcGIS Location Platform", color: "#3d7a2f", ops: ["geo", "rev", "route"], key: "arcgis", attr: "Powered by Esri", signup: "https://location.arcgis.com/sign-up/" },
    { id: "graphhopper", name: "GraphHopper", color: "#4b7f2c", ops: ["route"], key: "graphhopper", attr: "© GraphHopper © OpenStreetMap", signup: "https://graphhopper.com/dashboard/signup" },
    { id: "ors", name: "openrouteservice", color: "#b3541e", ops: ["route", "iso"], key: "ors", attr: "© openrouteservice.org by HeiGIT · © OpenStreetMap", signup: "https://account.heigit.org/signup" }
  ];
  var KEYLABEL = { stadia: "Stadia Maps API key", google: "Google Maps API key", mapbox: "Mapbox access token", here: "HERE API key", tomtom: "TomTom API key", geoapify: "Geoapify API key", locationiq: "LocationIQ access token", maptiler: "MapTiler API key", azure: "Azure Maps subscription key", arcgis: "ArcGIS API key", graphhopper: "GraphHopper API key", ors: "openrouteservice (HeiGIT) API key" };
  var byId = {}; PROVIDERS.forEach(function (p) { byId[p.id] = p; });
  function localOk(p) { return p.localFree && LOCAL && (!p.localOps || p.localOps.indexOf(mode) >= 0); }
  function available(p) { return !p.key || !!keys[p.key] || localOk(p); }
  function statusText(p) {
    if (!p.key) return p.note;
    if (keys[p.key]) return "Key tersimpan di browser";
    if (localOk(p)) return "Jalan tanpa key dari localhost; di domain publik perlu key atau domain terdaftar";
    if (p.localFree && LOCAL) return "Mode ini perlu API key (teruji: 403 tanpa key dari localhost)";
    return "Perlu API key (isi di panel Kunci API)";
  }

  /* ---------- fetch helpers ---------- */
  var lastNominatim = 0, nomCache = {};
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function getJSON(url, opt) {
    var ctl = new AbortController(); var t = setTimeout(function () { ctl.abort(); }, 20000);
    opt = opt || {}; opt.signal = ctl.signal;
    return fetch(url, opt).then(function (r) {
      return r.text().then(function (txt) {
        clearTimeout(t);
        var j = null; try { j = JSON.parse(txt); } catch (e) { /* not json */ }
        if (!r.ok) { var m = j && (j.error_message || j.message || (j.error && (j.error.message || j.error)) || j.error_description || (j.detailedError && j.detailedError.message)); throw new Error("HTTP " + r.status + (m ? ": " + (typeof m === "string" ? m : JSON.stringify(m)) : txt ? ": " + txt.slice(0, 120) : "")); }
        if (j === null) throw new Error("Respons bukan JSON");
        return j;
      });
    }, function (e) { clearTimeout(t); throw new Error(e.name === "AbortError" ? "Timeout 20 detik" : "Gagal terhubung (jaringan/CORS diblokir)"); });
  }
  function nominatim(url) {
    if (nomCache[url]) return Promise.resolve(nomCache[url]);
    var wait = Math.max(0, lastNominatim + 1100 - Date.now());
    lastNominatim = Date.now() + wait;
    return sleep(wait).then(function () { return getJSON(url, { headers: { "Accept-Language": "id" } }); }).then(function (j) { nomCache[url] = j; return j; });
  }

  /* ---------- geocoding ---------- */
  var C = { lat: -6.9175, lon: 107.6091 }; // bias Bandung
  var GEO = {
    nominatim: function (q, id) { return nominatim("https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=" + enc(q) + (id ? "&countrycodes=id" : "")).then(function (j) { return j.map(function (r) { return { label: r.display_name, lat: +r.lat, lon: +r.lon }; }); }); },
    photon: function (q) { return getJSON("https://photon.komoot.io/api/?limit=5&q=" + enc(q) + "&lat=" + C.lat + "&lon=" + C.lon).then(photonParse); },
    stadia: function (q, id) { return getJSON("https://api.stadiamaps.com/geocoding/v1/search?size=5&text=" + enc(q) + (id ? "&boundary.country=IDN" : "") + kq("stadia", "api_key")).then(peliasParse); },
    google: function (q, id) { return getJSON("https://maps.googleapis.com/maps/api/geocode/json?address=" + enc(q) + (id ? "&region=id&components=country:ID" : "") + "&key=" + enc(keys.google)).then(googleParse); },
    mapbox: function (q, id) { return getJSON("https://api.mapbox.com/search/geocode/v6/forward?limit=5&q=" + enc(q) + (id ? "&country=id" : "") + "&access_token=" + enc(keys.mapbox)).then(mapboxParse); },
    here: function (q, id) { return getJSON("https://geocode.search.hereapi.com/v1/geocode?limit=5&q=" + enc(q) + (id ? "&in=countryCode:IDN" : "") + "&apiKey=" + enc(keys.here)).then(hereParse); },
    tomtom: function (q, id) { return getJSON("https://api.tomtom.com/search/2/geocode/" + enc(q) + ".json?limit=5" + (id ? "&countrySet=ID" : "") + "&key=" + enc(keys.tomtom)).then(function (j) { return (j.results || []).map(function (r) { return { label: r.address && r.address.freeformAddress, lat: r.position.lat, lon: r.position.lon }; }); }); },
    geoapify: function (q, id) { return getJSON("https://api.geoapify.com/v1/geocode/search?limit=5&text=" + enc(q) + (id ? "&filter=countrycode:id" : "") + "&apiKey=" + enc(keys.geoapify)).then(geoapifyParse); },
    locationiq: function (q, id) { return getJSON("https://us1.locationiq.com/v1/search?format=json&limit=5&q=" + enc(q) + (id ? "&countrycodes=id" : "") + "&key=" + enc(keys.locationiq)).then(function (j) { return j.map(function (r) { return { label: r.display_name, lat: +r.lat, lon: +r.lon }; }); }); },
    maptiler: function (q, id) { return getJSON("https://api.maptiler.com/geocoding/" + enc(q) + ".json?limit=5" + (id ? "&country=id" : "") + "&key=" + enc(keys.maptiler)).then(function (j) { return (j.features || []).map(function (f) { return { label: f.place_name || f.text, lat: f.center[1], lon: f.center[0] }; }); }); },
    azure: function (q, id) { return getJSON("https://atlas.microsoft.com/geocode?api-version=2023-06-01&top=5&query=" + enc(q) + (id ? "&countryRegion=ID" : "") + "&subscription-key=" + enc(keys.azure)).then(azureParse); },
    arcgis: function (q, id) { return getJSON("https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&maxLocations=5&outFields=*&SingleLine=" + enc(q) + (id ? "&countryCode=IDN" : "") + "&token=" + enc(keys.arcgis)).then(function (j) { if (j.error) throw new Error(j.error.message); return (j.candidates || []).map(function (c) { return { label: c.address, lat: c.location.y, lon: c.location.x }; }); }); }
  };
  var REV = {
    nominatim: function (la, lo) { return nominatim("https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + la + "&lon=" + lo).then(function (r) { if (r.error) throw new Error(r.error); return [{ label: r.display_name, lat: +r.lat, lon: +r.lon }]; }); },
    photon: function (la, lo) { return getJSON("https://photon.komoot.io/reverse?lat=" + la + "&lon=" + lo).then(photonParse); },
    stadia: function (la, lo) { return getJSON("https://api.stadiamaps.com/geocoding/v1/reverse?size=3&point.lat=" + la + "&point.lon=" + lo + kq("stadia", "api_key")).then(peliasParse); },
    google: function (la, lo) { return getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + la + "," + lo + "&key=" + enc(keys.google)).then(googleParse); },
    mapbox: function (la, lo) { return getJSON("https://api.mapbox.com/search/geocode/v6/reverse?limit=3&longitude=" + lo + "&latitude=" + la + "&access_token=" + enc(keys.mapbox)).then(mapboxParse); },
    here: function (la, lo) { return getJSON("https://revgeocode.search.hereapi.com/v1/revgeocode?limit=3&at=" + la + "," + lo + "&apiKey=" + enc(keys.here)).then(hereParse); },
    tomtom: function (la, lo) { return getJSON("https://api.tomtom.com/search/2/reverseGeocode/" + la + "," + lo + ".json?key=" + enc(keys.tomtom)).then(function (j) { return (j.addresses || []).map(function (a) { var p = String(a.position).split(","); return { label: a.address && a.address.freeformAddress, lat: +p[0], lon: +p[1] }; }); }); },
    geoapify: function (la, lo) { return getJSON("https://api.geoapify.com/v1/geocode/reverse?limit=3&lat=" + la + "&lon=" + lo + "&apiKey=" + enc(keys.geoapify)).then(geoapifyParse); },
    locationiq: function (la, lo) { return getJSON("https://us1.locationiq.com/v1/reverse?format=json&lat=" + la + "&lon=" + lo + "&key=" + enc(keys.locationiq)).then(function (r) { return [{ label: r.display_name, lat: +r.lat, lon: +r.lon }]; }); },
    maptiler: function (la, lo) { return getJSON("https://api.maptiler.com/geocoding/" + lo + "," + la + ".json?limit=3&key=" + enc(keys.maptiler)).then(function (j) { return (j.features || []).map(function (f) { return { label: f.place_name || f.text, lat: f.center[1], lon: f.center[0] }; }); }); },
    azure: function (la, lo) { return getJSON("https://atlas.microsoft.com/reverseGeocode?api-version=2023-06-01&coordinates=" + lo + "," + la + "&subscription-key=" + enc(keys.azure)).then(azureParse); },
    arcgis: function (la, lo) { return getJSON("https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=json&location=" + lo + "," + la + "&token=" + enc(keys.arcgis)).then(function (j) { if (j.error) throw new Error(j.error.message); return [{ label: j.address && (j.address.LongLabel || j.address.Match_addr), lat: j.location.y, lon: j.location.x }]; }); }
  };
  function kq(k, param) { return keys[k] ? "&" + param + "=" + enc(keys[k]) : ""; }
  function photonParse(j) { return (j.features || []).map(function (f) { var p = f.properties || {}; var parts = [p.name, [p.street, p.housenumber].filter(Boolean).join(" "), p.district, p.city, p.state, p.country].filter(Boolean); var seen = {}; parts = parts.filter(function (x) { if (seen[x]) return false; seen[x] = 1; return true; }); return { label: parts.join(", "), lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0] }; }); }
  function peliasParse(j) { return (j.features || []).map(function (f) { return { label: f.properties.label || f.properties.name, lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0] }; }); }
  function googleParse(j) { if (j.status && j.status !== "OK" && j.status !== "ZERO_RESULTS") throw new Error(j.status + (j.error_message ? ": " + j.error_message : "")); return (j.results || []).slice(0, 5).map(function (r) { return { label: r.formatted_address, lat: r.geometry.location.lat, lon: r.geometry.location.lng }; }); }
  function mapboxParse(j) { return (j.features || []).map(function (f) { return { label: f.properties.full_address || f.properties.name, lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0] }; }); }
  function hereParse(j) { return (j.items || []).map(function (i) { return { label: i.title || (i.address && i.address.label), lat: i.position.lat, lon: i.position.lng }; }); }
  function geoapifyParse(j) { return (j.features || []).map(function (f) { return { label: f.properties.formatted, lat: f.properties.lat, lon: f.properties.lon }; }); }
  function azureParse(j) { return (j.features || []).map(function (f) { var a = f.properties && f.properties.address; return { label: (a && a.formattedAddress) || "", lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0] }; }); }

  /* ---------- routing ---------- */
  function vRoute(base, a, b, key) {
    var body = { locations: [{ lat: a[1], lon: a[0] }, { lat: b[1], lon: b[0] }], costing: "auto", units: "kilometers" };
    var url = base === "stadia" ? "https://api.stadiamaps.com/route/v1" + (keys.stadia ? "?api_key=" + enc(keys.stadia) : "") : "https://valhalla1.openstreetmap.de/route?json=" + enc(JSON.stringify(body));
    var p = base === "stadia" ? getJSON(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }) : getJSON(url);
    return p.then(function (j) { var t = j.trip; var coords = []; t.legs.forEach(function (l) { coords = coords.concat(decodePolyline(l.shape, 6)); }); return { dist: t.summary.length * 1000, dur: t.summary.time, coords: coords }; });
  }
  function osrmLike(j) { var r = j.routes && j.routes[0]; if (!r) throw new Error(j.message || j.code || "Tidak ada rute"); return { dist: r.distance, dur: r.duration, coords: r.geometry.coordinates }; }
  function pointsLike(j) { var r = j.routes && j.routes[0]; if (!r) throw new Error("Tidak ada rute"); var c = []; r.legs.forEach(function (l) { l.points.forEach(function (p) { c.push([p.longitude, p.latitude]); }); }); return { dist: r.summary.lengthInMeters, dur: r.summary.travelTimeInSeconds, coords: c }; }
  var ROUTE = {
    osrm: function (a, b) { return getJSON("https://router.project-osrm.org/route/v1/driving/" + a[0] + "," + a[1] + ";" + b[0] + "," + b[1] + "?overview=full&geometries=geojson").then(osrmLike); },
    valhalla: function (a, b) { return vRoute("fossgis", a, b); },
    stadia: function (a, b) { return vRoute("stadia", a, b); },
    google: function (a, b) {
      return getJSON("https://routes.googleapis.com/directions/v2:computeRoutes", { method: "POST", headers: { "Content-Type": "application/json", "X-Goog-Api-Key": keys.google, "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline" }, body: JSON.stringify({ origin: { location: { latLng: { latitude: a[1], longitude: a[0] } } }, destination: { location: { latLng: { latitude: b[1], longitude: b[0] } } }, travelMode: "DRIVE" }) })
        .then(function (j) { var r = j.routes && j.routes[0]; if (!r) throw new Error("Tidak ada rute"); return { dist: r.distanceMeters, dur: parseFloat(r.duration), coords: decodePolyline(r.polyline.encodedPolyline, 5) }; });
    },
    mapbox: function (a, b) { return getJSON("https://api.mapbox.com/directions/v5/mapbox/driving/" + a[0] + "," + a[1] + ";" + b[0] + "," + b[1] + "?overview=full&geometries=geojson&access_token=" + enc(keys.mapbox)).then(osrmLike); },
    here: function (a, b) { return getJSON("https://router.hereapi.com/v8/routes?transportMode=car&origin=" + a[1] + "," + a[0] + "&destination=" + b[1] + "," + b[0] + "&return=summary,polyline&apiKey=" + enc(keys.here)).then(function (j) { var r = j.routes && j.routes[0]; if (!r) throw new Error("Tidak ada rute"); var d = 0, t = 0, c = []; r.sections.forEach(function (s) { d += s.summary.length; t += s.summary.duration; c = c.concat(decodeFlex(s.polyline)); }); return { dist: d, dur: t, coords: c }; }); },
    tomtom: function (a, b) { return getJSON("https://api.tomtom.com/routing/1/calculateRoute/" + a[1] + "," + a[0] + ":" + b[1] + "," + b[0] + "/json?key=" + enc(keys.tomtom)).then(pointsLike); },
    geoapify: function (a, b) { return getJSON("https://api.geoapify.com/v1/routing?mode=drive&waypoints=" + a[1] + "," + a[0] + "|" + b[1] + "," + b[0] + "&apiKey=" + enc(keys.geoapify)).then(function (j) { var f = j.features && j.features[0]; if (!f) throw new Error("Tidak ada rute"); var g = f.geometry, c = g.type === "MultiLineString" ? [].concat.apply([], g.coordinates) : g.coordinates; return { dist: f.properties.distance, dur: f.properties.time, coords: c }; }); },
    locationiq: function (a, b) { return getJSON("https://us1.locationiq.com/v1/directions/driving/" + a[0] + "," + a[1] + ";" + b[0] + "," + b[1] + "?overview=full&geometries=geojson&key=" + enc(keys.locationiq)).then(osrmLike); },
    azure: function (a, b) { return getJSON("https://atlas.microsoft.com/route/directions/json?api-version=1.0&query=" + a[1] + "," + a[0] + ":" + b[1] + "," + b[0] + "&subscription-key=" + enc(keys.azure)).then(pointsLike); },
    arcgis: function (a, b) { return getJSON("https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve?f=json&returnRoutes=true&outSR=4326&directionsLengthUnits=esriNAUKilometers&stops=" + a[0] + "," + a[1] + ";" + b[0] + "," + b[1] + "&token=" + enc(keys.arcgis)).then(function (j) { if (j.error) throw new Error(j.error.message); var f = j.routes && j.routes.features && j.routes.features[0]; if (!f) throw new Error("Tidak ada rute"); var at = f.attributes || {}; return { dist: at.Total_Kilometers != null ? at.Total_Kilometers * 1000 : null, dur: at.Total_TravelTime != null ? at.Total_TravelTime * 60 : null, coords: [].concat.apply([], f.geometry.paths) }; }); },
    graphhopper: function (a, b) { return getJSON("https://graphhopper.com/api/1/route?profile=car&points_encoded=false&point=" + a[1] + "," + a[0] + "&point=" + b[1] + "," + b[0] + "&key=" + enc(keys.graphhopper)).then(function (j) { var p = j.paths && j.paths[0]; if (!p) throw new Error(j.message || "Tidak ada rute"); return { dist: p.distance, dur: p.time / 1000, coords: p.points.coordinates }; }); },
    ors: function (a, b) { return getJSON("https://api.heigit.org/openrouteservice/v2/directions/driving-car?api_key=" + enc(keys.ors) + "&start=" + a[0] + "," + a[1] + "&end=" + b[0] + "," + b[1]).then(function (j) { var f = j.features && j.features[0]; if (!f) throw new Error("Tidak ada rute"); var s = f.properties.summary; return { dist: s.distance, dur: s.duration, coords: f.geometry.coordinates }; }); }
  };

  /* ---------- isochrone ---------- */
  function vIso(stadia, c, min) {
    var body = { locations: [{ lat: c[1], lon: c[0] }], costing: "auto", contours: [{ time: min }], polygons: true };
    var p = stadia ? getJSON("https://api.stadiamaps.com/isochrone/v1" + (keys.stadia ? "?api_key=" + enc(keys.stadia) : ""), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }) : getJSON("https://valhalla1.openstreetmap.de/isochrone?json=" + enc(JSON.stringify(body)));
    return p.then(function (j) { if (!j.features) throw new Error("Respons tanpa poligon"); return j; });
  }
  var ISO = {
    valhalla: function (c, m) { return vIso(false, c, m); },
    stadia: function (c, m) { return vIso(true, c, m); },
    geoapify: function (c, m) { return getJSON("https://api.geoapify.com/v1/isoline?type=time&mode=drive&lat=" + c[1] + "&lon=" + c[0] + "&range=" + m * 60 + "&apiKey=" + enc(keys.geoapify)); },
    ors: function (c, m) { return getJSON("https://api.heigit.org/openrouteservice/v2/isochrones/driving-car", { method: "POST", headers: { "Content-Type": "application/json", Authorization: keys.ors }, body: JSON.stringify({ locations: [c], range: [m * 60] }) }); }
  };

  /* ---------- map ---------- */
  var BASEMAPS = [
    { id: "ofm-liberty", name: "OpenFreeMap Liberty (tanpa key)", style: function () { return "https://tiles.openfreemap.org/styles/liberty"; } },
    { id: "ofm-positron", name: "OpenFreeMap Positron (tanpa key)", style: function () { return "https://tiles.openfreemap.org/styles/positron"; } },
    { id: "osm", name: "OpenStreetMap Standard raster (tanpa key)", style: function () { return rasterStyle(["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], 256, '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>', 19); } },
    { id: "stadia", name: "Stadia Alidade Smooth", key: "stadia", localFree: true, style: function () { return "https://tiles.stadiamaps.com/styles/alidade_smooth.json" + (keys.stadia ? "?api_key=" + enc(keys.stadia) : ""); } },
    { id: "maptiler", name: "MapTiler Streets", key: "maptiler", style: function () { return "https://api.maptiler.com/maps/streets-v2/style.json?key=" + enc(keys.maptiler); } },
    { id: "mapbox", name: "Mapbox Streets (raster)", key: "mapbox", style: function () { return rasterStyle(["https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/512/{z}/{x}/{y}@2x?access_token=" + enc(keys.mapbox)], 512, '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', 22); } }
  ];
  function rasterStyle(tiles, size, attr, maxz) { return { version: 8, sources: { r: { type: "raster", tiles: tiles, tileSize: size, attribution: attr, maxzoom: maxz } }, layers: [{ id: "r", type: "raster", source: "r" }] }; }
  var NOTES = {
    "ofm-liberty": "Basemap: OpenFreeMap (gratis, tanpa key) · data © OpenStreetMap.",
    "ofm-positron": "Basemap: OpenFreeMap (gratis, tanpa key) · data © OpenStreetMap.",
    osm: "Basemap: tile.openstreetmap.org. Untuk pemakaian ringan saja sesuai kebijakan tile OSMF.",
    stadia: LOCAL ? "Stadia: dari localhost jalan tanpa key; di domain publik perlu key atau domain terdaftar." : "Stadia: perlu key atau domain terdaftar di akun Stadia.",
    maptiler: "MapTiler: memakai key kamu.",
    mapbox: "Mapbox: memakai token kamu (raster Static Tiles)."
  };

  var map = null, markers = [], overlays = { routes: { type: "FeatureCollection", features: [] }, iso: { type: "FeatureCollection", features: [] } };
  function addOverlays() {
    if (!map.getSource("pg-iso")) {
      map.addSource("pg-iso", { type: "geojson", data: overlays.iso });
      map.addLayer({ id: "pg-iso-fill", type: "fill", source: "pg-iso", paint: { "fill-color": ["get", "color"], "fill-opacity": 0.18 } });
      map.addLayer({ id: "pg-iso-line", type: "line", source: "pg-iso", paint: { "line-color": ["get", "color"], "line-width": 2 } });
    }
    if (!map.getSource("pg-routes")) {
      map.addSource("pg-routes", { type: "geojson", data: overlays.routes });
      map.addLayer({ id: "pg-routes-casing", type: "line", source: "pg-routes", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#ffffff", "line-width": 7 } });
      map.addLayer({ id: "pg-routes", type: "line", source: "pg-routes", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": ["get", "color"], "line-width": 4, "line-opacity": 0.9 } });
    }
  }
  function refresh() { if (!map) return; var a = map.getSource("pg-routes"), b = map.getSource("pg-iso"); if (a) a.setData(overlays.routes); if (b) b.setData(overlays.iso); }
  function clearMap() { markers.forEach(function (m) { m.remove(); }); markers = []; overlays.routes.features = []; overlays.iso.features = []; refresh(); }
  function marker(lon, lat, color, html, label) {
    if (!map) return;
    var el = document.createElement("div"); el.className = "pg-pin"; el.style.cssText = "width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.25);background:" + color;
    if (label) { el.textContent = label; el.style.cssText += ";width:24px;height:24px;color:#fff;font:600 12px/18px var(--font);text-align:center"; }
    var m = new maplibregl.Marker({ element: el }).setLngLat([lon, lat]);
    if (html) m.setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(html));
    m.addTo(map); markers.push(m); return m;
  }
  function fit(coords) {
    if (!map || !coords.length) return;
    var b = coords.reduce(function (bb, c) { return [Math.min(bb[0], c[0]), Math.min(bb[1], c[1]), Math.max(bb[2], c[0]), Math.max(bb[3], c[1])]; }, [180, 90, -180, -90]);
    if (b[0] === b[2] && b[1] === b[3]) map.flyTo({ center: [b[0], b[1]], zoom: 15 }); else map.fitBounds([[b[0], b[1]], [b[2], b[3]]], { padding: 60, maxZoom: 16, duration: 600 });
  }

  /* ---------- UI state ---------- */
  var mode = "geo";
  var MODES = [{ v: "geo", l: "Geocoding" }, { v: "rev", l: "Reverse" }, { v: "route", l: "Rute" }, { v: "iso", l: "Isochrone" }];
  var chosen = {}; // per mode selected providers
  var routePts = [], isoPt = [C.lon, C.lat], revPt = null;
  var PRESETS = { "bdg-jkt": [[107.6091, -6.9175], [106.8272, -6.1754]], bdg: [[107.6091, -6.9175], [107.6107, -6.8915]] };

  function provsFor(m) { return PROVIDERS.filter(function (p) { return p.ops.indexOf(m) >= 0; }); }
  function isChosen(p) { var c = chosen[mode] || {}; return c[p.id] !== undefined ? c[p.id] : available(p); }
  function renderProvs() {
    $("pg-provs").innerHTML = provsFor(mode).map(function (p) {
      var ok = available(p);
      return '<label class="prow' + (ok ? "" : " off") + '"><input type="checkbox" data-pid="' + p.id + '"' + (ok && isChosen(p) ? " checked" : "") + (ok ? "" : " disabled") + '><span class="dot" style="background:' + p.color + '"></span><span><span class="pn">' + esc(p.name) + '</span><span class="ps">' + esc(statusText(p)) + (p.warn ? " · " + esc(p.warn) : "") + (p.signup && !keys[p.key] ? ' · <a href="' + p.signup + '" target="_blank" rel="noopener noreferrer">daftar key</a>' : "") + "</span></span></label>";
    }).join("");
  }
  $("pg-provs").addEventListener("change", function (e) { var id = e.target.getAttribute("data-pid"); if (!id) return; chosen[mode] = chosen[mode] || {}; chosen[mode][id] = e.target.checked; });
  function active() { return provsFor(mode).filter(function (p) { return available(p) && isChosen(p); }); }

  function drawTabs() {
    $("pg-tabs").innerHTML = MODES.map(function (m) { return '<button type="button" role="tab" class="tab" aria-selected="' + (m.v === mode) + '" data-v="' + m.v + '">' + m.l + "</button>"; }).join("");
    ["geo", "rev", "route", "iso"].forEach(function (m) { $("pane-" + m).hidden = m !== mode; });
    renderProvs();
  }
  $("pg-tabs").addEventListener("click", function (e) { var b = e.target.closest("[data-v]"); if (!b) return; mode = b.getAttribute("data-v"); drawTabs(); });

  var fmtKm = function (m) { return m == null ? "–" : (m / 1000).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " km"; };
  var fmtDur = function (s) { if (s == null || isNaN(s)) return "–"; var h = Math.floor(s / 3600), mn = Math.round((s % 3600) / 60); return h ? h + " j " + mn + " mnt" : mn + " mnt"; };
  var fmtCo = function (la, lo) { return (+la).toFixed(5) + ", " + (+lo).toFixed(5); };

  function card(p, body, ms) { return '<div class="rcard" data-card="' + p.id + '"><div class="rh"><span class="rn"><span class="dot" style="background:' + p.color + '"></span>' + esc(p.name) + '</span><span class="ms">' + (ms == null ? "memuat…" : ms + " ms") + "</span></div>" + body + '<span class="attr">' + esc(p.attr) + "</span></div>"; }
  function setCard(p, html) { var el = document.querySelector('[data-card="' + p.id + '"]'); if (el) el.outerHTML = html; }
  function timed(fn) { var t0 = performance.now(); return fn().then(function (r) { return { ok: true, r: r, ms: Math.round(performance.now() - t0) }; }, function (e) { return { ok: false, e: e.message || String(e), ms: Math.round(performance.now() - t0) }; }); }

  var lastResults = {};
  function runGeo(kind) {
    var list = active(); if (!list.length) { $("pg-results").innerHTML = '<p class="muted">Pilih minimal satu penyedia.</p>'; return Promise.resolve(); }
    clearMap();
    var q = $("pg-q").value.trim(), id = $("pg-id").checked;
    if (kind === "geo" && !q) return Promise.resolve();
    if (kind === "rev") marker(revPt[0], revPt[1], "#121212", "Titik yang diklik");
    $("pg-results").innerHTML = list.map(function (p) { return card(p, '<p class="small muted">Menghubungi API…</p>', null); }).join("");
    var all = [];
    return Promise.all(list.map(function (p) {
      var fn = kind === "geo" ? function () { return GEO[p.id](q, id); } : function () { return REV[p.id](revPt[1], revPt[0]); };
      return timed(fn).then(function (res) {
        var body;
        if (!res.ok) body = '<p class="err small">' + esc(res.e) + "</p>";
        else if (!res.r.length) body = '<p class="small muted">Tidak ada hasil.</p>';
        else {
          lastResults[p.id] = res.r;
          body = "<ol>" + res.r.slice(0, 5).map(function (x, i) { return '<li><button type="button" data-fly="' + x.lon + "," + x.lat + '">' + esc(x.label || "(tanpa label)") + '</button><span class="co">' + fmtCo(x.lat, x.lon) + "</span></li>"; }).join("") + "</ol>";
          var top = res.r[0]; marker(top.lon, top.lat, p.color, "<b>" + esc(p.name) + "</b><br>" + esc(top.label || "")); all.push([top.lon, top.lat]);
        }
        setCard(p, card(p, body, res.ms));
      });
    })).then(function () { if (kind === "geo") fit(all); });
  }

  function runRoute() {
    var list = active();
    if (routePts.length < 2) { $("pg-results").innerHTML = '<p class="muted">Tentukan titik A dan B dulu (klik peta atau pakai preset).</p>'; return Promise.resolve(); }
    if (!list.length) return Promise.resolve();
    overlays.routes.features = []; overlays.iso.features = []; refresh();
    var a = routePts[0], b = routePts[1], rows = {};
    function table() {
      return '<div class="rcard rtable"><div class="rh"><span class="rn">Perbandingan rute (mobil)</span><span class="ms">A ' + fmtCo(a[1], a[0]) + " → B " + fmtCo(b[1], b[0]) + '</span></div><div class="table-wrap" style="border:0;margin:0"><table><thead><tr><th>Penyedia</th><th>Jarak</th><th>Durasi</th><th>Latensi</th><th>Status</th></tr></thead><tbody>' +
        list.map(function (p) { var r = rows[p.id]; return '<tr><td><span class="dot" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + p.color + ';margin-right:8px"></span>' + esc(p.name) + "</td><td>" + (r && r.ok ? fmtKm(r.r.dist) : "–") + "</td><td>" + (r && r.ok ? fmtDur(r.r.dur) : "–") + "</td><td>" + (r ? r.ms + " ms" : "…") + '</td><td style="text-align:left;white-space:normal" class="' + (r && !r.ok ? "err" : "") + '">' + (r ? (r.ok ? "OK" : esc(r.e)) : "memuat…") + "</td></tr>"; }).join("") +
        '</tbody></table></div><span class="attr">' + esc(list.map(function (p) { return p.attr; }).join(" · ")) + "</span></div>";
    }
    $("pg-results").innerHTML = table();
    var all = [a, b];
    return Promise.all(list.map(function (p) {
      return timed(function () { return ROUTE[p.id](a, b); }).then(function (res) {
        rows[p.id] = res;
        if (res.ok && res.r.coords && res.r.coords.length) { overlays.routes.features.push({ type: "Feature", properties: { color: p.color, pid: p.id }, geometry: { type: "LineString", coordinates: res.r.coords } }); all = all.concat(res.r.coords); refresh(); }
        $("pg-results").innerHTML = table();
      });
    })).then(function () { fit(all); });
  }

  function runIso() {
    var list = active(); if (!list.length) return Promise.resolve();
    var min = +$("pg-iso-min").value; overlays.iso.features = []; overlays.routes.features = []; refresh(); clearMarkersOnly(); marker(isoPt[0], isoPt[1], "#121212", "Pusat isochrone");
    $("pg-results").innerHTML = list.map(function (p) { return card(p, '<p class="small muted">Menghubungi API…</p>', null); }).join("");
    var all = [isoPt];
    return Promise.all(list.map(function (p) {
      return timed(function () { return ISO[p.id](isoPt, min); }).then(function (res) {
        var body;
        if (!res.ok) body = '<p class="err small">' + esc(res.e) + "</p>";
        else {
          var n = 0; (res.r.features || []).forEach(function (f) { if (!f.geometry || !/Polygon/.test(f.geometry.type)) return; n++; overlays.iso.features.push({ type: "Feature", properties: { color: p.color }, geometry: f.geometry }); var g = f.geometry.type === "Polygon" ? f.geometry.coordinates[0] : f.geometry.coordinates[0][0]; all = all.concat(g); });
          refresh(); body = '<p class="small">' + n + " poligon area " + min + " menit berkendara.</p>";
        }
        setCard(p, card(p, body, res.ms));
      });
    })).then(function () { fit(all); });
  }
  function clearMarkersOnly() { markers.forEach(function (m) { m.remove(); }); markers = []; }

  function drawRoutePts() {
    clearMarkersOnly();
    routePts.forEach(function (p, i) { marker(p[0], p[1], i ? "#db3a34" : "#1b659d", i ? "Titik B" : "Titik A", i ? "B" : "A"); });
    $("pg-route-pts").textContent = "A: " + (routePts[0] ? fmtCo(routePts[0][1], routePts[0][0]) : "–") + " · B: " + (routePts[1] ? fmtCo(routePts[1][1], routePts[1][0]) : "–");
  }

  $("pg-geo-run").addEventListener("click", function () { runGeo("geo"); });
  $("pg-q").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); runGeo("geo"); } });
  $("pg-route-run").addEventListener("click", runRoute);
  $("pg-route-reset").addEventListener("click", function () { routePts = []; overlays.routes.features = []; refresh(); drawRoutePts(); });
  document.querySelectorAll("[data-preset]").forEach(function (b) { b.addEventListener("click", function () { routePts = PRESETS[b.getAttribute("data-preset")].slice(); overlays.routes.features = []; refresh(); drawRoutePts(); fit(routePts); runRoute(); }); });
  $("pg-iso-run").addEventListener("click", runIso);
  $("pg-clear").addEventListener("click", function () { clearMap(); $("pg-results").innerHTML = ""; });
  $("pg-results").addEventListener("click", function (e) { var b = e.target.closest("[data-fly]"); if (b && map) { var c = b.getAttribute("data-fly").split(",").map(Number); map.flyTo({ center: c, zoom: 16 }); } });

  /* ---------- keys panel ---------- */
  function renderKeys() {
    var ks = Object.keys(KEYLABEL);
    $("pg-keygrid").innerHTML = ks.map(function (k) { var p = PROVIDERS.filter(function (x) { return x.key === k; })[0]; return '<label class="field">' + esc(KEYLABEL[k]) + ' <a href="' + p.signup + '" target="_blank" rel="noopener noreferrer">daftar / ambil key ↗</a><input type="password" autocomplete="off" spellcheck="false" data-key="' + k + '" value="' + esc(keys[k] || "") + '" placeholder="tempel key di sini"></label>'; }).join("");
    var n = ks.filter(function (k) { return keys[k]; }).length;
    $("pg-keycount").textContent = n + " key tersimpan";
  }
  $("pg-keys-save").addEventListener("click", function () {
    document.querySelectorAll("[data-key]").forEach(function (i) { var v = i.value.trim(); if (v) keys[i.getAttribute("data-key")] = v; else delete keys[i.getAttribute("data-key")]; });
    try { localStorage.setItem(KEYSTORE, JSON.stringify(keys)); } catch (e) { /* ignore */ }
    renderKeys(); renderProvs(); renderBasemaps();
  });
  $("pg-keys-clear").addEventListener("click", function () { keys = {}; try { localStorage.removeItem(KEYSTORE); } catch (e) { /* ignore */ } renderKeys(); renderProvs(); renderBasemaps(); });

  /* ---------- basemap ---------- */
  var bm = "ofm-liberty";
  function bmOk(b) { return !b.key || keys[b.key] || (b.localFree && LOCAL); }
  function renderBasemaps() {
    $("pg-basemap").innerHTML = BASEMAPS.map(function (b) { var ok = bmOk(b); return '<option value="' + b.id + '"' + (b.id === bm ? " selected" : "") + (ok ? "" : " disabled") + ">" + esc(b.name + (ok ? "" : " (perlu key)")) + "</option>"; }).join("");
    $("pg-map-note").textContent = NOTES[bm] || "";
  }
  $("pg-basemap").addEventListener("change", function (e) { bm = e.target.value; $("pg-map-note").textContent = NOTES[bm] || ""; if (map) map.setStyle(BASEMAPS.filter(function (b) { return b.id === bm; })[0].style()); });

  /* ---------- init ---------- */
  drawTabs(); renderKeys(); renderBasemaps();
  if (typeof maplibregl === "undefined") { $("pg-map").innerHTML = '<p class="small" style="padding:24px">MapLibre GL JS gagal dimuat dari CDN. Hasil teks tetap bisa dipakai.</p>'; return; }
  map = new maplibregl.Map({ container: "pg-map", style: BASEMAPS[0].style(), center: [C.lon, C.lat], zoom: 12, attributionControl: { compact: false }, cooperativeGestures: false });
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), "top-right");
  map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-left");
  map.on("style.load", function () { addOverlays(); refresh(); });
  map.on("error", function (e) { if (window.console) console.warn("Peta:", e && e.error && e.error.message); });
  map.on("click", function (e) {
    var c = [+e.lngLat.lng.toFixed(6), +e.lngLat.lat.toFixed(6)];
    if (mode === "rev") { revPt = c; $("pg-rev-pt").textContent = "Titik: " + fmtCo(c[1], c[0]); runGeo("rev"); }
    else if (mode === "route") { if (routePts.length >= 2) routePts = []; routePts.push(c); drawRoutePts(); if (routePts.length === 2) runRoute(); }
    else if (mode === "iso") { isoPt = c; $("pg-iso-pt").textContent = "Pusat: " + fmtCo(c[1], c[0]); clearMarkersOnly(); marker(c[0], c[1], "#121212", "Pusat isochrone"); }
  });
  window.__pg = { runGeo: runGeo, runRoute: runRoute, runIso: runIso, setMode: function (m) { mode = m; drawTabs(); }, setRoute: function (a, b) { routePts = [a, b]; drawRoutePts(); }, map: map };
})();
