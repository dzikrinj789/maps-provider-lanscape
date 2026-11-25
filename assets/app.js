(function () {
  "use strict";
  var D = window.LANDSCAPE;
  if (!D) { console.error("data.js tidak termuat"); return; }
  var CAPS = D.capabilities, P = D.providers, SYM = D.symbols, LBL = D.statusLabels;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var host = function (u) { return u.replace(/^https?:\/\//, "").split("/")[0]; };
  var capIdx = {}; CAPS.forEach(function (c, i) { capIdx[c.k] = i; });
  var cap = function (p, k) { return p.caps[capIdx[k]] || "c"; };
  var score = function (p, g) { return CAPS.reduce(function (s, c, i) { if (g && c.g !== g) return s; var v = p.caps[i]; return s + (v === "y" ? 1 : v === "p" ? 0.5 : 0); }, 0); };
  var fmt = function (n) { return String(n).replace(".", ","); };
  var ext = ' target="_blank" rel="noopener noreferrer"';
  var groupKeys = Object.keys(D.providerGroups);
  var kindKeys = Object.keys(D.playgroundKinds);
  var totalLinks = P.reduce(function (s, p) { return s + p.play.length; }, 0);
  var nMcp = P.filter(function (p) { return cap(p, "mcp") === "y"; }).length;
  var nNoAcc = P.filter(function (p) { return p.play.some(function (l) { return l.a === 0; }); }).length;
  var d = new Date(D.checkedAt + "T00:00:00");
  var checked = d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  // Hero
  $("checked-chip").textContent = "Lanskap maps service \u00b7 dicek " + checked;
  var stats = [[P.length, "penyedia dipetakan", groupKeys.length + " kelompok"], [totalLinks, "link playground & demo", nNoAcc + " penyedia bisa dicoba tanpa akun"], [CAPS.length, "kategori layanan", "dari basemap sampai MCP"], [nMcp, "MCP layanan peta resmi", "plus Esri beta"]];
  $("hero-stats").innerHTML = stats.map(function (s) { return '<div class="stat"><b>' + s[0] + "</b><div><strong>" + esc(s[1]) + "</strong><span>" + esc(s[2]) + "</span></div></div>"; }).join("");
  var steps = ["Kenali pemainnya", "Lihat layanan yang ditawarkan", "Bandingkan di matriks", "Coba playground-nya", "Baca trennya"];
  var anchors = ["#pemain", "#layanan", "#matriks", "#coba", "#tren"];
  $("steps").innerHTML = steps.map(function (s, i) { return '<li><span class="mono">0' + (i + 1) + '</span><strong><a href="' + anchors[i] + '" style="color:inherit;text-decoration:none">' + esc(s) + "</a></strong></li>"; }).join("");
  $("n-caps").textContent = CAPS.length;
  $("n-links").textContent = totalLinks;

  // Groups + detail
  var sel = P[0].id;
  function renderGroups() {
    $("groups").innerHTML = groupKeys.map(function (g) {
      var list = P.filter(function (p) { return p.type === g; });
      return '<div class="card"><div class="card-head"><h3>' + esc(D.providerGroups[g]) + '</h3><span class="count">' + list.length + ' penyedia</span></div><p>' + esc(D.providerGroupDescriptions[g]) + '</p><div class="chips">' +
        list.map(function (p) { return '<button type="button" class="chip' + (p.id === sel ? " is-on" : "") + '" data-prov="' + p.id + '">' + esc(p.name) + "</button>"; }).join("") + "</div></div>";
    }).join("");
  }
  function renderDetail() {
    var p = P.filter(function (x) { return x.id === sel; })[0] || P[0];
    var opts = P.map(function (x) { return '<option value="' + x.id + '"' + (x.id === p.id ? " selected" : "") + ">" + esc(x.name) + "</option>"; }).join("");
    var capsOn = CAPS.filter(function (c) { var v = cap(p, c.k); return v === "y" || v === "p"; });
    var notes = p.n ? Object.keys(p.n) : [];
    $("detail").innerHTML =
      '<div class="detail-head"><div><div class="kicker">' + esc(D.providerGroups[p.type]) + (p.os ? " \u00b7 open source" : "") + "</div><h3>" + esc(p.name) + '</h3></div><label class="field" style="min-width:240px">Penyedia<select id="detail-select">' + opts + "</select></label></div>" +
      "<p>" + esc(p.desc) + "</p>" +
      '<dl class="props"><dt>Free tier</dt><dd>' + esc(p.free) + "</dd><dt>Indonesia</dt><dd>" + esc(p.indo + (p.indoNote !== "cek" ? " \u00b7 " + p.indoNote : "")) + "</dd><dt>Kemampuan</dt><dd>" + fmt(score(p)) + " dari " + CAPS.length + ' kategori</dd><dt>Dokumentasi</dt><dd><a href="' + esc(p.docs) + '"' + ext + ">" + esc(host(p.docs)) + "</a></dd></dl>" +
      '<p class="sub">Layanan yang tersedia</p><div class="chips">' + capsOn.map(function (c) { return '<span class="tool">' + SYM[cap(p, c.k)] + " " + esc(c.l) + "</span>"; }).join("") + "</div>" +
      (notes.length ? '<p class="sub">Catatan</p><div class="notes">' + notes.map(function (k) { var c = CAPS[capIdx[k]]; return '<div class="note"><b>' + esc(c ? c.l : k) + "</b><span>" + esc(LBL[cap(p, k)]) + " \u00b7 " + esc(p.n[k]) + "</span></div>"; }).join("") + "</div>" : "") +
      (p.play.length ? '<p class="sub">Coba</p><div class="chips">' + p.play.map(function (l) { return '<a class="chip" style="color:var(--accent)" href="' + esc(l.u) + '"' + ext + ">" + esc(l.t) + " \u2197</a>"; }).join("") + "</div>" : '<p class="small">Belum ada playground publik.</p>');
    $("detail-select").addEventListener("change", function (e) { select(e.target.value, false); });
  }
  function select(id, scroll) { sel = id; renderGroups(); renderDetail(); if (scroll) $("detail").scrollIntoView({ behavior: "smooth", block: "start" }); }
  $("groups").addEventListener("click", function (e) { var b = e.target.closest("[data-prov]"); if (b) select(b.getAttribute("data-prov"), true); });

  // Tabs helper
  function tabs(el, items, value, onChange) {
    function draw() {
      el.innerHTML = items.map(function (it) { return '<button type="button" role="tab" class="tab" aria-selected="' + (it.v === value) + '" data-v="' + it.v + '">' + esc(it.l) + (it.n != null ? '<span class="n">' + it.n + "</span>" : "") + "</button>"; }).join("");
    }
    el.addEventListener("click", function (e) { var b = e.target.closest("[data-v]"); if (!b) return; value = b.getAttribute("data-v"); draw(); onChange(value); });
    draw();
  }
  var GRP_ITEMS = D.capabilityGroups.map(function (g) { return { v: g.g, l: g.l }; });

  // Services
  var svc = "rute";
  function renderSvc() {
    var g = D.capabilityGroups.filter(function (x) { return x.g === svc; })[0];
    $("svc-desc").textContent = g ? g.d : "";
    $("svc-cards").innerHTML = CAPS.filter(function (c) { return c.g === svc; }).map(function (c) {
      var full = P.filter(function (p) { return cap(p, c.k) === "y"; });
      var part = P.filter(function (p) { return cap(p, c.k) === "p"; });
      return '<div class="card"><div class="card-head"><h3>' + esc(c.l) + '</h3><span class="count accent">' + full.length + " \u2713 \u00b7 " + part.length + ' \u25d0</span></div><div class="chips">' +
        full.map(function (p) { return '<span class="tool">' + esc(p.name) + "</span>"; }).join("") + "</div></div>";
    }).join("");
  }
  tabs($("svc-tabs"), GRP_ITEMS, svc, function (v) { svc = v; renderSvc(); });

  // Matrix
  var mx = { grp: "rute", sortKey: "total", dir: -1 };
  $("f-type").innerHTML = '<option value="all">Semua kelompok</option>' + groupKeys.map(function (g) { return '<option value="' + g + '">' + esc(D.providerGroups[g]) + "</option>"; }).join("");
  $("f-cap").innerHTML = '<option value="all">Semua layanan</option>' + CAPS.map(function (c) { return '<option value="' + c.k + '">' + esc(c.l) + "</option>"; }).join("");
  var RANK = { y: 3, p: 2, c: 1, n: 0 };
  function renderMatrix() {
    var t = $("f-type").value, fc = $("f-cap").value, q = $("f-q").value.trim().toLowerCase();
    var list = P.filter(function (p) {
      return (t === "all" || p.type === t) && (fc === "all" || cap(p, fc) === "y" || cap(p, fc) === "p") &&
        (!$("f-play").checked || p.play.length > 0) && (!$("f-free").checked || p.free === "ya") && (!$("f-os").checked || p.os) &&
        (!$("f-indo").checked || p.indo === "kuat") && (!q || p.name.toLowerCase().indexOf(q) >= 0);
    });
    var k = mx.sortKey;
    list.sort(function (a, b) {
      var r;
      if (k === "name") r = a.name.localeCompare(b.name, "id");
      else if (k === "total") r = score(a) - score(b);
      else if (k === "grp") r = score(a, mx.grp) - score(b, mx.grp);
      else r = RANK[cap(a, k)] - RANK[cap(b, k)];
      return r * mx.dir || a.name.localeCompare(b.name, "id");
    });
    var gc = CAPS.filter(function (c) { return c.g === mx.grp; });
    var cols = [{ k: "name", l: "Penyedia" }].concat(gc.map(function (c) { return { k: c.k, l: c.l }; }), [{ k: "grp", l: "Skor kelompok" }, { k: "total", l: "Total" }]);
    var th = cols.map(function (c) { var s = mx.sortKey === c.k ? (mx.dir > 0 ? "ascending" : "descending") : "none"; return '<th scope="col" aria-sort="' + s + '"><button type="button" data-sort="' + c.k + '">' + esc(c.l) + "</button></th>"; }).join("");
    var rows = list.map(function (p) {
      return '<tr><td><button type="button" data-prov="' + p.id + '" title="Lihat detail">' + esc(p.name) + "</button></td>" +
        gc.map(function (c) { var v = cap(p, c.k); var note = p.n && p.n[c.k] ? ' title="' + esc(p.n[c.k]) + '"' : ""; return '<td class="' + v + '"' + note + ">" + SYM[v] + "</td>"; }).join("") +
        '<td class="num">' + fmt(score(p, mx.grp)) + '</td><td class="num">' + fmt(score(p)) + "</td></tr>";
    }).join("");
    $("matrix").innerHTML = "<thead><tr>" + th + "</tr></thead><tbody>" + rows + "</tbody>";
    $("mx-count").textContent = list.length + " dari " + P.length + " penyedia";
  }
  tabs($("mx-tabs"), GRP_ITEMS, mx.grp, function (v) { mx.grp = v; if (CAPS[capIdx[mx.sortKey]]) mx.sortKey = "grp"; renderMatrix(); });
  ["f-type", "f-cap", "f-play", "f-free", "f-os", "f-indo"].forEach(function (id) { $(id).addEventListener("change", renderMatrix); });
  $("f-q").addEventListener("input", renderMatrix);
  $("matrix").addEventListener("click", function (e) {
    var s = e.target.closest("[data-sort]");
    if (s) { var k = s.getAttribute("data-sort"); if (mx.sortKey === k) mx.dir = -mx.dir; else { mx.sortKey = k; mx.dir = k === "name" ? 1 : -1; } renderMatrix(); return; }
    var p = e.target.closest("[data-prov]"); if (p) select(p.getAttribute("data-prov"), true);
  });

  // Try
  var kind = "geocode";
  var ACC = D.accessLabels;
  function renderTry() {
    var only = $("f-noacc").checked;
    var items = [];
    P.forEach(function (p) { p.play.forEach(function (l) { if (l.k === kind && (!only || l.a === 0)) items.push({ p: p, l: l }); }); });
    $("try-cards").innerHTML = items.map(function (it) {
      return '<a class="card" href="' + esc(it.l.u) + '"' + ext + '><span class="p">' + esc(it.p.name) + '</span><span class="t">' + esc(it.l.t) + ' \u2197</span><span class="h">' + esc(host(it.l.u)) + '</span><span class="tool' + (it.l.a === 0 ? " acc0" : "") + '" style="align-self:flex-start">' + esc(ACC[it.l.a]) + "</span></a>";
    }).join("") || '<p class="muted">Tidak ada link yang cocok dengan filter ini.</p>';
  }
  tabs($("try-tabs"), kindKeys.map(function (k) { return { v: k, l: D.playgroundKinds[k], n: P.reduce(function (s, p) { return s + p.play.filter(function (l) { return l.k === k; }).length; }, 0) }; }), kind, function (v) { kind = v; renderTry(); });
  $("f-noacc").addEventListener("change", renderTry);

  // Trends + sources
  $("trends").innerHTML = D.trends.map(function (t, i) { return '<div class="trend"><span class="mono">0' + (i + 1) + "</span><h3>" + esc(t.t) + "</h3><p>" + esc(t.d) + '</p><a href="' + esc(t.s) + '"' + ext + ">Sumber: " + esc(host(t.s)) + " \u2197</a></div>"; }).join("");
  $("sources").innerHTML = D.sources.map(function (s) { return '<a class="tool" href="' + esc(s) + '"' + ext + ">" + esc(host(s)) + "</a>"; }).join("");
  $("method").textContent = "Metodologi: semua link playground dan dokumentasi dicek pada " + checked + " (HTTP 200, atau 403 karena situs memblokir bot). Kemampuan diisi dari dokumentasi resmi tiap penyedia; sel bertanda cek belum terverifikasi. Harga sengaja tidak dibahas; free tier hanya ditandai ada atau tidak. Data ada di assets/data.js. Playground langsung memanggil API penyedia dari browser kamu; key (jika diisi) hanya disimpan di localStorage.";

  renderGroups(); renderDetail(); renderSvc(); renderMatrix(); renderTry();
})();
