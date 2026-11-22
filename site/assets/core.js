/* core.js : briques communes du BIA de Saleem.
   Stockage local, barre de navigation, moteur de QCU, aides pour les ateliers (curseurs, glisser sur SVG). */
(function () {
  'use strict';
  var NS = 'bia-saleem:';

  /* ---------- Stockage local tolérant (navigation privée, quota) ---------- */
  var mem = {};
  function raw(key, val) {
    try {
      if (val === undefined) { var r = localStorage.getItem(NS + key); return r === null ? (mem[key] || null) : r; }
      if (val === null) { localStorage.removeItem(NS + key); delete mem[key]; return; }
      localStorage.setItem(NS + key, val);
    } catch (e) { if (val === undefined) return mem[key] || null; if (val === null) delete mem[key]; else mem[key] = val; }
  }
  function load(key, def) { try { var v = JSON.parse(raw(key)); return v == null ? def : v; } catch (e) { return def; } }
  function save(key, v) { raw(key, JSON.stringify(v)); }

  /* ---------- Petits outils DOM ---------- */
  function h(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(x, d) { if (!isFinite(x)) return '–'; return Number(x).toLocaleString('fr-FR', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }
  var SVGNS = 'http://www.w3.org/2000/svg';
  function svg(tag, attrs, parent) {
    var e = document.createElementNS(SVGNS, tag);
    for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

  /* ---------- Pages du site (une seule source pour la navigation et l'accueil) ---------- */
  var PAGES = [
    { id: 'meteo', ico: '☁️', name: 'Météorologie', desc: 'Atmosphère, altimétrie, vents, nuages, fronts, METAR et TAF.', open: true, q: 'met-', n: 45 },
    { id: 'aerodynamique', ico: '🪽', name: 'Aérodynamique', desc: 'Portance, décrochage, finesse, virage, stabilité et centrage.', open: true, q: 'aer-', n: 38 },
    { id: 'aeronefs', ico: '🛠️', name: 'Aéronefs et espace', desc: 'Structure, moteurs, instruments, hélicoptères, fusées.', open: false },
    { id: 'navigation', ico: '🧭', name: 'Navigation et réglementation', desc: 'Cap, vent, cartes, espaces aériens, sécurité des vols.', open: false },
    { id: 'histoire', ico: '🏛️', name: 'Histoire et culture', desc: 'Des Montgolfier à Ariane 6, pionniers et pionnières.', open: false },
    { id: 'anglais', ico: '🇬🇧', name: 'Anglais aéronautique', desc: 'Vocabulaire et phraséologie de l’épreuve facultative.', open: false },
    { id: 'avions', ico: '✈️', name: 'Avions et DR400', desc: 'Le Robin DR400 en détail, avions-écoles, check-lists.', open: false },
    { id: 'entrainement', ico: '🎯', name: 'BIA blanc', desc: '100 questions, 2 h 30, sans calculatrice.', open: false },
    { id: 'pilote', ico: '👨‍✈️', name: 'Devenir pilote', desc: 'ULM, planeur, PPL, ENAC, armée : âges, coûts, aides.', open: false }
  ];

  function topbar() {
    var cur = document.body.getAttribute('data-page') || 'home';
    var links = '<a href="/"' + (cur === 'home' ? ' aria-current="page"' : '') + '>Accueil</a>' +
      PAGES.filter(function (p) { return p.open; }).map(function (p) {
        return '<a href="/' + p.id + '/"' + (cur === p.id ? ' aria-current="page"' : '') + '>' + esc(p.name) + '</a>';
      }).join('');
    var bar = h('<header class="topbar"><div class="topbar-in">' +
      '<a class="brand" href="/"><img src="/icons/icon-192.png" alt=""><span>Le BIA de Saleem<small>BREVET D’INITIATION AÉRONAUTIQUE</small></span></a>' +
      '<nav class="topnav" aria-label="Sections">' + links + '</nav></div></header>');
    document.body.insertBefore(bar, document.body.firstChild);
    var tb = h('<button type="button" class="btn-theme"></button>');
    function paintTheme() { var d = document.documentElement.getAttribute('data-theme') === 'dark'; tb.textContent = d ? '☀️' : '🌙'; tb.setAttribute('aria-label', d ? 'Passer en mode clair' : 'Passer en mode sombre'); tb.title = tb.getAttribute('aria-label'); }
    tb.onclick = function () { var d = document.documentElement.getAttribute('data-theme') !== 'dark'; document.documentElement.setAttribute('data-theme', d ? 'dark' : 'light'); raw('theme', d ? 'dark' : 'light'); paintTheme(); };
    paintTheme(); bar.querySelector('.topbar-in').appendChild(tb);
    var curA = bar.querySelector('[aria-current]'), nav = bar.querySelector('.topnav');
    if (curA && nav.scrollWidth > nav.clientWidth) nav.scrollLeft = curA.offsetLeft + curA.offsetWidth - nav.clientWidth + 8;
    var skip = h('<a class="skip" href="#main">Aller au contenu</a>');
    document.body.insertBefore(skip, document.body.firstChild);
  }

  /* Sous-navigation : met en évidence la section visible */
  function subnav() {
    var links = [].slice.call(document.querySelectorAll('.subnav a'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          links.forEach(function (a) { a.classList.remove('on'); });
          map[e.target.id].classList.add('on');
          map[e.target.id].scrollIntoView({ block: 'nearest', inline: 'center' });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- Statistiques des questions ---------- */
  function stats() { return load('q', {}); }
  function record(id, ok) {
    var s = stats(), e = s[id] || { n: 0, ok: 0 };
    e.n++; if (ok) e.ok++; e.last = ok ? 1 : 0; e.t = Date.now();
    s[id] = e; save('q', s);
  }
  function mastery(ids) {
    var s = stats(), good = 0;
    ids.forEach(function (id) { if (s[id] && s[id].last === 1) good++; });
    return ids.length ? good / ids.length : 0;
  }

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ---------- Moteur de QCU ----------
     q = { id, q, c: [bonne, fausse, fausse, fausse], e: explication, t: thème, lvl: 'bia' | 'ppl' }
     La première proposition est la bonne ; l'ordre affiché est mélangé. */
  function quiz(el, bank, opts) {
    opts = opts || {};
    var mode = 'all', list = [], i = 0, score = 0, answered = 0;
    var filters = [['all', 'Toutes'], ['new', 'Jamais vues'], ['wrong', 'À revoir'], ['bia', 'Niveau BIA'], ['ppl', 'Au-delà du BIA']];
    function pick() {
      var s = stats();
      var l = bank.filter(function (q) {
        if (mode === 'new') return !s[q.id];
        if (mode === 'wrong') return s[q.id] && s[q.id].last === 0;
        if (mode === 'bia') return q.lvl !== 'ppl';
        if (mode === 'ppl') return q.lvl === 'ppl';
        return true;
      });
      list = shuffle(l); i = 0; score = 0; answered = 0;
    }
    function frame() {
      el.innerHTML = '';
      var f = h('<div class="seg" role="group" aria-label="Choisir les questions"></div>');
      filters.forEach(function (m) {
        var b = h('<button type="button">' + m[1] + '</button>');
        if (m[0] === mode) b.className = 'on';
        b.onclick = function () { mode = m[0]; pick(); frame(); };
        f.appendChild(b);
      });
      el.appendChild(f);
      var box = h('<div class="quiz" style="margin-top:10px"></div>');
      el.appendChild(box);
      show(box);
    }
    function show(box) {
      var m = mastery(bank.map(function (q) { return q.id; }));
      if (!list.length) {
        box.innerHTML = '<p>' + (mode === 'wrong' ? 'Aucune question à revoir : tout ce que tu as raté a été rattrapé. 👏' : 'Aucune question dans cette sélection.') + '</p>';
        return;
      }
      if (i >= list.length) {
        box.innerHTML = '<h3 style="margin-top:0">Série terminée</h3><p>Score : <b>' + score + ' / ' + answered + '</b>. Maîtrise du domaine : <b>' + Math.round(m * 100) + ' %</b> des questions réussies à la dernière tentative.</p>';
        var again = h('<button type="button" class="btn primary">Nouvelle série</button>');
        again.onclick = function () { pick(); show(box); };
        box.appendChild(again);
        if (opts.onDone) opts.onDone();
        return;
      }
      var q = list[i];
      var choices = shuffle(q.c.map(function (t, k) { return { t: t, ok: k === 0 }; }));
      box.innerHTML = '<div class="quiz-top"><span>Question ' + (i + 1) + ' / ' + list.length + ' · ' + esc(q.t || '') + '</span>' +
        '<span class="chip' + (q.lvl === 'ppl' ? ' ppl' : '') + '">' + (q.lvl === 'ppl' ? 'Au-delà du BIA' : 'Niveau BIA') + '</span></div>' +
        '<div class="scorebar" aria-hidden="true"><i style="width:' + Math.round(100 * i / list.length) + '%"></i></div>' +
        '<p class="quiz-q">' + q.q + '</p><div class="choices"></div><div class="quiz-nav"></div>';
      var cbox = box.querySelector('.choices'), nav = box.querySelector('.quiz-nav');
      choices.forEach(function (c, k) {
        var b = h('<button type="button" class="choice"><b>' + 'ABCD'[k] + '</b><span>' + c.t + '</span></button>');
        b.onclick = function () {
          [].forEach.call(cbox.children, function (x, j) { x.disabled = true; if (choices[j].ok) x.classList.add('right'); });
          if (!c.ok) b.classList.add('wrong');
          answered++; if (c.ok) score++;
          record(q.id, c.ok);
          var ex = h('<div class="expl"><strong class="' + (c.ok ? 'ok' : 'ko') + '">' + (c.ok ? 'Exact.' : 'Pas tout à fait.') + '</strong> ' + q.e + '</div>');
          box.insertBefore(ex, nav);
          var next = h('<button type="button" class="btn primary">' + (i + 1 < list.length ? 'Question suivante →' : 'Voir le score') + '</button>');
          next.onclick = function () { i++; show(box); box.scrollIntoView({ block: 'nearest' }); };
          nav.appendChild(next); next.focus({ preventScroll: true });
          if (opts.onAnswer) opts.onAnswer();
        };
        cbox.appendChild(b);
      });
    }
    pick(); frame();
  }

  /* ---------- Aides pour les ateliers ---------- */
  function slider(parent, o) {
    var id = 'r' + Math.random().toString(36).slice(2, 8);
    var w = h('<div class="ctrl"><label for="' + id + '"><span>' + o.label + '</span><output></output></label>' +
      '<input type="range" id="' + id + '" min="' + o.min + '" max="' + o.max + '" step="' + (o.step || 1) + '" value="' + o.value + '"></div>');
    var input = w.querySelector('input'), out = w.querySelector('output');
    function show() { out.textContent = o.fmt ? o.fmt(+input.value) : input.value; }
    input.addEventListener('input', function () { show(); if (o.onInput) o.onInput(+input.value); });
    show(); parent.appendChild(w);
    return { get: function () { return +input.value; }, set: function (v) { input.value = v; show(); }, el: input };
  }
  function seg(parent, items, value, onChange) {
    var w = h('<div class="seg" role="group"></div>'), cur = value;
    items.forEach(function (it) {
      var b = h('<button type="button">' + it[1] + '</button>');
      if (it[0] === value) b.className = 'on';
      b.setAttribute('aria-pressed', it[0] === value);
      b.onclick = function () { cur = it[0]; [].forEach.call(w.children, function (x) { x.className = ''; x.setAttribute('aria-pressed', 'false'); }); b.className = 'on'; b.setAttribute('aria-pressed', 'true'); onChange(cur); };
      w.appendChild(b);
    });
    parent.appendChild(w);
    return { get: function () { return cur; } };
  }
  /* readout(parent, [[clé, libellé], ...]) → set(clé, valeur, état) */
  function readout(parent, items) {
    var w = h('<div class="readout"></div>'), cells = {};
    items.forEach(function (it) { var d = h('<div><span>' + it[1] + '</span><b>–</b></div>'); cells[it[0]] = d; w.appendChild(d); });
    parent.appendChild(w);
    return function (k, v, state) { var d = cells[k]; d.querySelector('b').textContent = v; d.className = state || ''; };
  }
  /* Point glissable sur un SVG : fn reçoit les coordonnées dans le repère du SVG */
  function drag(svgEl, handle, fn) {
    var on = false;
    function pt(e) {
      var p = svgEl.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
      return p.matrixTransform(svgEl.getScreenCTM().inverse());
    }
    handle.classList.add('handle');
    handle.setAttribute('tabindex', '0');
    handle.addEventListener('pointerdown', function (e) { on = true; try { handle.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); fn(pt(e), 'start'); });
    handle.addEventListener('pointermove', function (e) { if (on) { e.preventDefault(); fn(pt(e), 'move'); } });
    function end(e) { if (on) { on = false; fn(pt(e), 'end'); } }
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  }
  /* Animation simple, arrêtée quand l'atelier sort de l'écran */
  function loop(fn) {
    var id = null, last = 0;
    function step(t) { var dt = last ? Math.min(0.05, (t - last) / 1000) : 0; last = t; if (fn(dt) !== false) id = requestAnimationFrame(step); else { id = null; last = 0; } }
    return { start: function () { if (!id) { last = 0; id = requestAnimationFrame(step); } }, stop: function () { if (id) cancelAnimationFrame(id); id = null; last = 0; } };
  }
  /* Construit la coque d'un atelier : renvoie {stage, ctrls} */
  function lab(mount, o) {
    var el = typeof mount === 'string' ? document.getElementById(mount) : mount;
    el.className = 'lab';
    el.innerHTML = '<div class="lab-head"><span class="num">' + o.num + '</span><h3>' + o.title + '</h3></div>' +
      '<p class="hint">' + o.hint + '</p><div class="lab-body"><div class="stage"></div><div class="ctrls"></div></div>' +
      (o.takeaway ? '<p class="takeaway">' + o.takeaway + '</p>' : '');
    return { el: el, stage: el.querySelector('.stage'), ctrls: el.querySelector('.ctrls') };
  }


  /* ---------- Dessin SVG : flèche, texte, effacement ---------- */
  function arrow(g, x1, y1, x2, y2, color, w) {
    var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    if (L < 2) return;
    var ux = dx / L, uy = dy / L, hs = Math.min(12, L * 0.4);
    svg('line', { x1: x1, y1: y1, x2: x2 - ux * hs * 0.6, y2: y2 - uy * hs * 0.6, stroke: color, 'stroke-width': w || 4, 'stroke-linecap': 'round' }, g);
    svg('path', { d: 'M' + x2 + ',' + y2 + ' L' + (x2 - ux * hs - uy * hs * 0.55) + ',' + (y2 - uy * hs + ux * hs * 0.55) + ' L' + (x2 - ux * hs + uy * hs * 0.55) + ',' + (y2 - uy * hs - ux * hs * 0.55) + 'Z', fill: color }, g);
  }
  function text(g, x, y, t, color, anchor, size, weight) {
    var e = svg('text', { x: x, y: y, fill: color || '#10203f', 'font-size': size || 14, 'font-weight': weight || 700, 'text-anchor': anchor || 'start', 'font-family': 'DM Sans, sans-serif' }, g);
    e.textContent = t; return e;
  }
  function clear(g) { while (g.firstChild) g.removeChild(g.firstChild); }
  function handle(svgEl, r) { var g = svg('g', {}, svgEl); svg('circle', { r: r || 20, class: 'ring' }, g); svg('circle', { r: 7, fill: '#f5a623' }, g); return g; }

  /* ---------- Atmosphère standard (utile à plusieurs ateliers) ---------- */
  function isa(hm) { // altitude en m → {T (K), P (Pa), rho}
    var T, P;
    if (hm <= 11000) { T = 288.15 - 0.0065 * hm; P = 101325 * Math.pow(T / 288.15, 5.2559); }
    else { T = 216.65; P = 22632 * Math.exp(-9.80665 * (hm - 11000) / (287.05 * T)); }
    return { T: T, P: P, rho: P / (287.05 * T) };
  }

  /* ---------- Sauvegarde : export et import de toute la progression ---------- */
  function exportData() {
    var d = {};
    try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k.indexOf(NS) === 0) d[k.slice(NS.length)] = localStorage.getItem(k); } } catch (e) { d = mem; }
    var blob = new Blob([JSON.stringify({ app: 'bia-saleem', date: new Date().toISOString(), data: d }, null, 2)], { type: 'application/json' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'bia-saleem-progression.json';
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function importData(file, done) {
    var r = new FileReader();
    r.onload = function () {
      try { var j = JSON.parse(r.result); if (j.app !== 'bia-saleem') throw 0; Object.keys(j.data).forEach(function (k) { raw(k, j.data[k]); }); done(true); }
      catch (e) { done(false); }
    };
    r.readAsText(file);
  }
  function resetData() {
    try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf(NS) === 0) localStorage.removeItem(k); }); } catch (e) {}
    mem = {};
  }

  window.BIA = { load: load, save: save, h: h, esc: esc, fmt: fmt, svg: svg, clamp: clamp, PAGES: PAGES, quiz: quiz, mastery: mastery, stats: stats,
    slider: slider, seg: seg, arrow: arrow, text: text, clear: clear, handle: handle, readout: readout, drag: drag, loop: loop, lab: lab, isa: isa, exportData: exportData, importData: importData, resetData: resetData };

  document.addEventListener('DOMContentLoaded', function () { topbar(); subnav(); });
})();
