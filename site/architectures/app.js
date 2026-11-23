/* Architectures d'avions : configurateur en trois vues (dessus, profil, face), fiches par famille, quiz photo. */
(function () {
  'use strict';
  var B = window.BIA, S = B.svg, D = window.ARCHI, P = window.MYTH_PHOTOS;
  var NAMES = {};
  window.MYTHIQUES.forEach(function (a) { NAMES[a.id] = a.n; });
  window.FLOTTE.forEach(function (a) { NAMES[a.id] = a.n; });
  var FAM = {}; D.forEach(function (f) { FAM[f.k] = f; });
  function opt(k, v) { return FAM[k].o.filter(function (o) { return o.v === v; })[0]; }
  var C = { fus: '#10203f', wing: '#2a4a85', wing2: '#4d6fb0', eng: '#5b6880', glass: '#9ec3ff', acc: '#f5a623', prop: '#f5a62399', gear: '#1d2433', ground: '#8aa0c0' };

  /* ---------- Visionneuse photo ---------- */
  var dlg = document.getElementById('photo');
  function showPhoto(id) {
    var p = P[id]; if (!p) return;
    dlg.innerHTML = '<div class="fiche-img"><img src="/mythiques/photos/' + p.f + '" alt="' + B.esc(NAMES[id] || id) + '"><button type="button" class="close-x" aria-label="Fermer">✕</button><div class="credit">Photo : ' + B.esc(p.a) + ' · ' + B.esc(p.l) + ' · <a href="' + p.u + '" target="_blank" rel="noopener">source</a></div></div><div class="fiche-body"><h2>' + B.esc(NAMES[id] || id) + '</h2></div>';
    dlg.querySelector('.close-x').onclick = function () { dlg.close(); };
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  function thumbs(o) {
    var h = '<div class="thumbs">' + o.m.filter(function (id) { return P[id]; }).map(function (id) {
      return '<button type="button" class="thumb" data-id="' + id + '"><img src="/mythiques/photos/' + P[id].f + '" alt="" loading="lazy"><span>' + B.esc(NAMES[id] || id) + '</span></button>';
    }).join('') + '</div>';
    if (o.x.length) h += '<p class="small">Aussi : ' + o.x.map(B.esc).join(', ') + '.</p>';
    return h;
  }
  function wireThumbs(root) { [].forEach.call(root.querySelectorAll('.thumb'), function (b) { b.onclick = function () { showPhoto(b.getAttribute('data-id')); }; }); }
  function card(f, o) {
    return '<p class="eyebrow" style="color:var(--sky);margin:0">' + f.t + '</p><h3 style="margin:2px 0 6px">' + o.l + '</h3><p style="margin:0 0 8px">' + o.p + '</p>' +
      '<div class="pm"><div><b>Avantages</b><ul>' + o.plus.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div><div><b>Inconvénients</b><ul>' + o.moins.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div></div>' +
      (o.m.length || o.x.length ? '<b>Modèles emblématiques</b>' + thumbs(o) : '');
  }

  /* ---------- Dessin de l'avion en trois vues ---------- */
  function poly(g, pts, attrs) { attrs.points = pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '); return S('polygon', attrs, g); }
  function mirror(pts) { return pts.concat(pts.slice().reverse().map(function (p) { return [-p[0], p[1]]; })); }
  function txt(g, x, y, t, anchor, size, color) { var e = S('text', { x: x, y: y, 'font-size': size || 12, 'font-weight': 700, fill: color || '#5b6880', 'text-anchor': anchor || 'start', 'font-family': 'DM Sans, sans-serif' }, g); e.textContent = t; return e; }

  function nEng(st) { return st.mot === 'aucun' ? 0 : +st.nbm || 1; }

  // Vue de dessus : repère centré en x = 0, nez en y = 20, queue en y = 262
  function topView(g, st) {
    var fly = st.plan === 'volante', boom = st.emp === 'bipoutre', n = nEng(st);
    var wingY = st.plan === 'delta' ? 80 : st.plan === 'inversee' ? 150 : 105;
    // aile(s)
    function wing(dy, fill, op) {
      var a = { fill: fill, opacity: op || 1 };
      if (st.plan === 'droite') poly(g, mirror([[0, wingY + dy], [215, wingY + 4 + dy], [215, wingY + 42 + dy], [0, wingY + 52 + dy]]), a);
      else if (st.plan === 'elliptique') { a.d = 'M0,' + (wingY - 2 + dy) + ' C150,' + (wingY - 2 + dy) + ' 225,' + (wingY + 10 + dy) + ' 225,' + (wingY + 26 + dy) + ' C225,' + (wingY + 42 + dy) + ' 150,' + (wingY + 56 + dy) + ' 0,' + (wingY + 56 + dy) + ' C-150,' + (wingY + 56 + dy) + ' -225,' + (wingY + 42 + dy) + ' -225,' + (wingY + 26 + dy) + ' C-225,' + (wingY + 10 + dy) + ' -150,' + (wingY - 2 + dy) + ' 0,' + (wingY - 2 + dy) + 'Z'; S('path', a, g); }
      else if (st.plan === 'fleche') poly(g, mirror([[0, wingY + dy], [205, wingY + 105 + dy], [205, wingY + 125 + dy], [0, wingY + 70 + dy]]), a);
      else if (st.plan === 'inversee') poly(g, mirror([[0, wingY + dy], [195, wingY - 70 + dy], [195, wingY - 48 + dy], [0, wingY + 58 + dy]]), a);
      else if (st.plan === 'delta') poly(g, mirror([[0, wingY + dy], [165, 232 + dy], [0, 232 + dy]]), a);
      else if (st.plan === 'geovar') {
        poly(g, mirror([[0, wingY + dy], [200, wingY + 30 + dy], [200, wingY + 50 + dy], [0, wingY + 60 + dy]]), { fill: 'none', stroke: fill, 'stroke-dasharray': '6 5', 'stroke-width': 2 });
        poly(g, mirror([[0, wingY + dy], [120, wingY + 120 + dy], [110, wingY + 136 + dy], [0, wingY + 70 + dy]]), a);
        txt(g, 205, wingY + 20, 'déployée', 'start', 11); txt(g, 120, wingY + 152, 'repliée', 'start', 11);
      }
      else if (st.plan === 'allongement') poly(g, mirror([[0, wingY + 6 + dy], [285, wingY + 12 + dy], [285, wingY + 24 + dy], [0, wingY + 34 + dy]]), a);
    }
    if (fly) {
      poly(g, mirror([[0, 55], [270, 195], [258, 210], [195, 200], [135, 228], [72, 200], [0, 228]]), { fill: C.wing });
      S('path', { d: 'M-22,95 Q0,70 22,95Z', fill: C.glass }, g);
    } else {
      if (st.ailes !== 'mono') wing(14, C.wing2, 0.9);
      if (st.ailes === 'tri') wing(28, C.wing2, 0.7);
      wing(0, C.wing);
    }
    // canard
    if (st.emp === 'canard' && !fly) poly(g, mirror([[0, 58], [62, 74], [62, 84], [0, 84]]), { fill: C.wing });
    // fuselage
    if (!fly) {
      var tailEnd = boom ? 175 : 262;
      S('path', { d: 'M0,20 C14,24 14,48 13,80 L10,' + tailEnd + ' L-10,' + tailEnd + ' L-13,80 C-14,48 -14,24 0,20Z', fill: C.fus }, g);
      S('ellipse', { cx: 0, cy: 58, rx: 7, ry: 13, fill: C.glass }, g);
      if (boom) { S('rect', { x: -78, y: wingY + 20, width: 12, height: 262 - wingY - 20, rx: 5, fill: C.fus }, g); S('rect', { x: 66, y: wingY + 20, width: 12, height: 262 - wingY - 20, rx: 5, fill: C.fus }, g); }
      // empennage horizontal
      var hasStab = ['classique', 't', 'cruciforme', 'double', 'triple', 'bipoutre'].indexOf(st.emp) >= 0;
      if (hasStab && !(st.plan === 'delta' && st.emp === 'classique' && false)) {
        if (boom) S('rect', { x: -72, y: 236, width: 144, height: 18, rx: 3, fill: C.wing }, g);
        else poly(g, mirror([[0, 232], [72, 246], [72, 258], [0, 262]]), { fill: C.wing });
      }
      if (st.emp === 'v' || st.emp === 'y') poly(g, mirror([[0, 234], [52, 252], [52, 262], [0, 262]]), { fill: C.wing2 });
      if (st.emp === 'double') { S('rect', { x: -26, y: 214, width: 5, height: 46, fill: C.fus }, g); S('rect', { x: 21, y: 214, width: 5, height: 46, fill: C.fus }, g); }
      if (st.emp === 'triple') { S('rect', { x: -74, y: 236, width: 5, height: 24, fill: C.fus }, g); S('rect', { x: 69, y: 236, width: 5, height: 24, fill: C.fus }, g); }
    }
    // moteurs
    var pod = function (x, y, w, l) { S('rect', { x: x - w / 2, y: y, width: w, height: l, rx: w / 2, fill: C.eng }, g); };
    var propH = function (x, y, r) { S('line', { x1: x - r, y1: y, x2: x + r, y2: y, stroke: C.acc, 'stroke-width': 4, 'stroke-linecap': 'round' }, g); };
    if (st.mot === 'nez' && !fly) propH(0, 17, 40);
    if (st.mot === 'propulsif' && !fly) propH(0, (boom ? 178 : 265), 40);
    var xs = n >= 4 ? [-150, -78, 78, 150] : n === 3 ? [-78, 78] : n === 2 ? [-78, 78] : n === 1 ? [] : [];
    if (st.mot === 'ailetp') {
      if (boom) xs = [-72, 72];
      xs.forEach(function (x) { var ly = wingY + (st.plan === 'fleche' ? Math.abs(x) * 0.5 : st.plan === 'delta' ? Math.abs(x) * 0.9 : 2); pod(x, ly - 26, 14, 60); propH(x, ly - 28, 26); });
      if (n === 1) propH(0, 17, 40);
    }
    if (st.mot === 'sousaile') {
      if (n === 1) xs = [0];
      if (st.plan === 'delta') xs = n >= 4 ? [-62, -44, 44, 62] : [-50, 50];
      xs.forEach(function (x) { var ly = st.plan === 'delta' ? 200 : wingY + (st.plan === 'fleche' ? Math.abs(x) * 0.5 : 0); pod(x, ly - 18, 13, 42); });
    }
    if (st.mot === 'arriere') { pod(-21, 195, 12, 40); pod(21, 195, 12, 40); if (n >= 3) pod(0, 205, 10, 40); }
    if (st.mot === 'fuselage') {
      S('rect', { x: -19, y: 96, width: 6, height: 30, rx: 2, fill: C.eng }, g); S('rect', { x: 13, y: 96, width: 6, height: 30, rx: 2, fill: C.eng }, g);
      if (n >= 2) { S('circle', { cx: -5, cy: 262, r: 5, fill: C.eng }, g); S('circle', { cx: 5, cy: 262, r: 5, fill: C.eng }, g); } else S('circle', { cx: 0, cy: 262, r: 6, fill: C.eng }, g);
    }
    if (st.mot === 'dessus') {
      if (fly) { [-60, -28, 28, 60].slice(0, Math.max(2, n)).forEach(function (x) { S('ellipse', { cx: x, cy: 135, rx: 10, ry: 20, fill: C.eng }, g); }); }
      else { pod(-17, 185, 13, 45); pod(17, 185, 13, 45); }
    }
  }

  // Profil : nez à gauche (x = 22), queue à droite (x = 278), axe du fuselage y = 100, sol y = 162
  function sideView(g, st) {
    var fly = st.plan === 'volante', boom = st.emp === 'bipoutre', n = nEng(st), GY = 162;
    var wy = { haute: 86, mediane: 99, basse: 112, parasol: 62 }[st.pos];
    var wx0 = st.plan === 'delta' ? 80 : 95, wx1 = st.plan === 'delta' ? 225 : st.plan === 'fleche' ? 175 : 150;
    function wingS(y) { S('path', { d: 'M' + wx0 + ',' + y + ' Q' + (wx0 + 12) + ',' + (y - 5) + ' ' + (wx0 + 40) + ',' + (y - 3) + ' L' + wx1 + ',' + (y + 1) + ' L' + (wx0 + 40) + ',' + (y + 3) + ' Q' + (wx0 + 8) + ',' + (y + 4) + ' ' + wx0 + ',' + y + 'Z', fill: C.wing }, g); }
    if (fly) {
      S('path', { d: 'M40,100 Q120,82 250,98 L262,103 Q150,108 40,100Z', fill: C.wing }, g);
      S('path', { d: 'M70,93 Q90,84 110,90 Z', fill: C.glass }, g);
    } else {
      var tail = boom ? 190 : 270;
      S('path', { d: 'M22,100 C24,86 46,86 70,87 L' + (tail - 10) + ',92 L' + tail + ',96 L' + tail + ',104 L70,113 C46,114 24,113 22,100Z', fill: C.fus }, g);
      S('path', { d: 'M48,88 Q62,74 84,86Z', fill: C.glass }, g);
      if (boom) S('rect', { x: 130, y: 96, width: 148, height: 6, rx: 3, fill: C.fus }, g);
      // dérive(s)
      var noFin = st.emp === 'v' || st.emp === 'y';
      if (!noFin) poly(g, [[234, 93], [258, 52], [276, 52], [276, 96]], { fill: C.fus });
      else poly(g, [[230, 95], [262, 62], [276, 62], [276, 97]], { fill: C.wing2 });
      if (st.emp === 'y') poly(g, [[246, 104], [262, 128], [272, 128], [274, 104]], { fill: C.fus });
      var stabY = { classique: 98, double: 98, triple: 98, bipoutre: 98, t: 52, cruciforme: 74 }[st.emp];
      if (stabY != null) S('rect', { x: 238, y: stabY - 2, width: 40, height: 5, rx: 2, fill: C.wing }, g);
      if (st.emp === 'canard') S('rect', { x: 40, y: 94, width: 26, height: 4, rx: 2, fill: C.wing }, g);
    }
    // ailes
    if (!fly) {
      if (st.ailes === 'mono') {
        wingS(wy);
        if (st.pos === 'parasol') { S('line', { x1: 105, y1: 64, x2: 100, y2: 88, stroke: C.fus, 'stroke-width': 2 }, g); S('line', { x1: 130, y1: 64, x2: 135, y2: 88, stroke: C.fus, 'stroke-width': 2 }, g); }
        if (st.pos === 'haute' && ['droite', 'allongement'].indexOf(st.plan) >= 0 && st.mot === 'nez') S('line', { x1: 120, y1: 88, x2: 100, y2: 110, stroke: C.fus, 'stroke-width': 2 }, g);
      } else {
        var ys = st.ailes === 'bi' ? [68, 114] : [64, 90, 116];
        ys.forEach(function (y, i) { var o = (i === 0 ? -8 : 0); var save = wx0; wx0 += o; wingS(y); wx0 = save; });
        S('line', { x1: 112, y1: ys[0], x2: 114, y2: ys[ys.length - 1], stroke: C.fus, 'stroke-width': 2 }, g);
        S('line', { x1: 140, y1: ys[0], x2: 142, y2: ys[ys.length - 1], stroke: C.fus, 'stroke-width': 2 }, g);
      }
    }
    // moteurs
    function propV(x, y, r) { S('line', { x1: x, y1: y - r, x2: x, y2: y + r, stroke: C.acc, 'stroke-width': 4, 'stroke-linecap': 'round' }, g); }
    function podS(x, y, l, hgt) { S('rect', { x: x, y: y - hgt / 2, width: l, height: hgt, rx: hgt / 2, fill: C.eng }, g); }
    if (st.mot === 'nez' && !fly) propV(18, 100, 30);
    if (st.mot === 'propulsif' && !fly) propV(boom ? 194 : 282, 100, 26);
    if (st.mot === 'ailetp' && n >= 1) { var py = st.pos === 'haute' ? wy + 2 : wy - 2; podS(wx0 - 14, py, 52, 13); propV(wx0 - 16, py, 22); }
    if (st.mot === 'sousaile' && n >= 1) podS(wx0 - 8, wy + 12, 44, 13);
    if (st.mot === 'arriere') podS(186, 88, 46, 13);
    if (st.mot === 'fuselage') { S('rect', { x: 268, y: 95, width: 14, height: 10, rx: 2, fill: C.eng }, g); S('rect', { x: 92, y: 98, width: 26, height: 10, rx: 2, fill: C.eng }, g); }
    if (st.mot === 'dessus') { if (fly) podS(150, 88, 60, 10); else podS(196, 82, 44, 13); }
    if (st.mot === 'arriere' && n >= 3 && !fly) podS(232, 60, 40, 11);
    // sol et train
    S('line', { x1: 0, y1: GY, x2: 300, y2: GY, stroke: C.ground, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, g);
    var up = st.esc === 'rentrant';
    function wheel(x, r, ytop) { S('line', { x1: x, y1: ytop, x2: x, y2: GY - r, stroke: C.gear, 'stroke-width': 3 }, g); S('circle', { cx: x, cy: GY - r, r: r, fill: C.gear }, g); }
    if (st.train === 'flotteurs') {
      S('path', { d: 'M30,146 L210,146 L222,156 L46,158 Q28,156 30,146Z', fill: '#e8eef8', stroke: C.fus, 'stroke-width': 2 }, g);
      [70, 150].forEach(function (x) { S('line', { x1: x, y1: 112, x2: x, y2: 146, stroke: C.fus, 'stroke-width': 2 }, g); });
    } else if (st.train === 'patins') {
      S('path', { d: 'M10,152 Q20,158 40,158 L230,158', fill: 'none', stroke: C.fus, 'stroke-width': 3 }, g);
      [60, 150].forEach(function (x) { S('line', { x1: x, y1: 112, x2: x, y2: 158, stroke: C.fus, 'stroke-width': 2 }, g); });
    } else if (up) {
      txt(g, 150, 150, 'train rentré en vol', 'middle', 11);
    } else if (st.train === 'tricycle') { wheel(fly ? 75 : 52, 7, 108); wheel(fly ? 170 : 150, 9, fly ? 104 : 110); }
    else if (st.train === 'classique') { wheel(70, 10, 110); S('line', { x1: tail0(), y1: 104, x2: tail0() + 2, y2: GY - 4, stroke: C.gear, 'stroke-width': 3 }, g); S('circle', { cx: tail0() + 2, cy: GY - 4, r: 4, fill: C.gear }, g); }
    else if (st.train === 'tandem') { wheel(80, 9, 112); wheel(180, 9, 108); }
    function tail0() { return boom ? 262 : 262; }
    if (st.train === 'classique' && !up) txt(g, 170, 178, 'roulette de queue', 'middle', 10);
  }

  // Face : centre x = 150, axe y = 96, sol y = 162
  function frontView(g, st) {
    var fly = st.plan === 'volante', boom = st.emp === 'bipoutre', n = nEng(st), GY = 162;
    var wy = { haute: 84, mediane: 96, basse: 108, parasol: 62 }[st.pos];
    var span = st.plan === 'allongement' ? 145 : st.plan === 'delta' ? 100 : st.plan === 'geovar' ? 125 : 132;
    var dih = st.pos === 'basse' ? 6 : st.pos === 'haute' ? 1.5 : 2;
    if (st.plan === 'delta' || st.plan === 'volante') dih = st.pos === 'basse' ? 2 : 0;
    function wingF(y, d, sp) {
      var t = Math.tan(d * Math.PI / 180) * sp;
      poly(g, [[150 - sp, y - t], [150, y - 1], [150 + sp, y - t], [150 + sp, y - t + 5], [150, y + 4], [150 - sp, y - t + 5]], { fill: C.wing });
    }
    if (fly) {
      poly(g, [[10, 98], [150, 88], [290, 98], [290, 102], [150, 106], [10, 102]], { fill: C.wing });
      S('ellipse', { cx: 150, cy: 92, rx: 20, ry: 7, fill: C.fus }, g);
    } else {
      // dérives
      var fins = [];
      if (['classique', 't', 'cruciforme', 'canard', 'sans'].indexOf(st.emp) >= 0) fins = [[150, 0]];
      if (st.emp === 'double') fins = [[136, -10], [164, 10]];
      if (st.emp === 'triple') fins = [[150, 0], [95, 0], [205, 0]];
      if (boom) fins = [[88, 0], [212, 0]];
      fins.forEach(function (f) { poly(g, [[f[0] - 3, 92], [f[0] - 3 + f[1] * 0.4, 44], [f[0] + 3 + f[1] * 0.4, 44], [f[0] + 3, 92]], { fill: C.fus }); });
      var sy = { classique: 92, double: 92, triple: 92, bipoutre: 88, t: 44, cruciforme: 68 }[st.emp];
      if (sy != null) S('rect', { x: boom ? 88 : 95, y: sy - 2, width: boom ? 124 : 110, height: 4, fill: C.wing }, g);
      if (st.emp === 'v' || st.emp === 'y') { poly(g, [[146, 90], [110, 50], [116, 47], [150, 86]], { fill: C.wing2 }); poly(g, [[154, 90], [190, 50], [184, 47], [150, 86]], { fill: C.wing2 }); }
      if (st.emp === 'y') S('rect', { x: 147, y: 108, width: 6, height: 26, fill: C.fus }, g);
      if (st.emp === 'canard') S('rect', { x: 112, y: 92, width: 76, height: 3, fill: C.wing2 }, g);
      // ailes
      if (st.ailes === 'mono') wingF(wy, dih, span);
      else { (st.ailes === 'bi' ? [70, 114] : [64, 90, 116]).forEach(function (y) { wingF(y, 1, 120); }); [95, 205].forEach(function (x) { S('line', { x1: x, y1: st.ailes === 'bi' ? 70 : 64, x2: x, y2: 116, stroke: C.fus, 'stroke-width': 2 }, g); }); }
      if (st.pos === 'parasol' && st.ailes === 'mono') { S('line', { x1: 140, y1: 64, x2: 145, y2: 84, stroke: C.fus, 'stroke-width': 2 }, g); S('line', { x1: 160, y1: 64, x2: 155, y2: 84, stroke: C.fus, 'stroke-width': 2 }, g); }
      if (boom) { S('circle', { cx: 88, cy: 96, r: 7, fill: C.fus }, g); S('circle', { cx: 212, cy: 96, r: 7, fill: C.fus }, g); }
      // fuselage
      S('circle', { cx: 150, cy: 96, r: 16, fill: C.fus }, g);
      S('path', { d: 'M140,86 Q150,74 160,86Z', fill: C.glass }, g);
    }
    // moteurs
    var lift = function (x) { return Math.tan(dih * Math.PI / 180) * Math.abs(x - 150); };
    var xs = n >= 4 ? [62, 104, 196, 238] : n >= 2 ? [104, 196] : [];
    if (st.mot === 'nez' && !fly) S('circle', { cx: 150, cy: 96, r: 30, fill: C.prop }, g);
    if (st.mot === 'propulsif' && !fly) S('circle', { cx: 150, cy: 96, r: 26, fill: 'none', stroke: C.acc, 'stroke-width': 3, 'stroke-dasharray': '5 4' }, g);
    if (st.mot === 'ailetp') { if (boom) xs = [88, 212]; xs.forEach(function (x) { var y = wy - lift(x) + 3; S('circle', { cx: x, cy: y, r: 22, fill: C.prop }, g); S('circle', { cx: x, cy: y, r: 6, fill: C.eng }, g); }); if (n === 1) S('circle', { cx: 150, cy: 96, r: 30, fill: C.prop }, g); }
    if (st.mot === 'sousaile') { if (st.plan === 'delta') xs = n >= 4 ? [108, 126, 174, 192] : [118, 182]; (n === 1 ? [150] : xs).forEach(function (x) { S('circle', { cx: x, cy: wy - lift(x) + 14, r: 9, fill: C.eng }, g); }); }
    if (st.mot === 'arriere') { S('circle', { cx: 126, cy: 86, r: 8, fill: C.eng }, g); S('circle', { cx: 174, cy: 86, r: 8, fill: C.eng }, g); if (n >= 3) S('circle', { cx: 150, cy: 72, r: 7, fill: C.eng }, g); }
    if (st.mot === 'fuselage' && !fly) { S('rect', { x: 128, y: 96, width: 8, height: 12, rx: 2, fill: C.eng }, g); S('rect', { x: 164, y: 96, width: 8, height: 12, rx: 2, fill: C.eng }, g); }
    if (st.mot === 'dessus') { if (fly) { [126, 174].forEach(function (x) { S('ellipse', { cx: x, cy: 88, rx: 9, ry: 4, fill: C.eng }, g); }); } else { S('circle', { cx: 132, cy: 78, r: 8, fill: C.eng }, g); S('circle', { cx: 168, cy: 78, r: 8, fill: C.eng }, g); } }
    // sol et train
    S('line', { x1: 0, y1: GY, x2: 300, y2: GY, stroke: C.ground, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, g);
    var up = st.esc === 'rentrant';
    function wheel(x, r, ytop) { S('line', { x1: x, y1: ytop, x2: x, y2: GY - r, stroke: C.gear, 'stroke-width': 3 }, g); S('rect', { x: x - 4, y: GY - 2 * r, width: 8, height: 2 * r, rx: 3, fill: C.gear }, g); }
    if (st.train === 'flotteurs') { [112, 188].forEach(function (x) { S('rect', { x: x - 10, y: 142, width: 20, height: 16, rx: 7, fill: '#e8eef8', stroke: C.fus, 'stroke-width': 2 }, g); S('line', { x1: x, y1: 104, x2: x, y2: 142, stroke: C.fus, 'stroke-width': 2 }, g); }); }
    else if (st.train === 'patins') { [120, 180].forEach(function (x) { S('line', { x1: x, y1: 108, x2: x, y2: 158, stroke: C.fus, 'stroke-width': 2 }, g); S('rect', { x: x - 6, y: 156, width: 12, height: 4, fill: C.fus }, g); }); }
    else if (!up) {
      var my = st.pos === 'basse' ? wy + 4 : 108;
      if (st.train === 'tandem') { wheel(150, 9, 110); [150 - span + 8, 150 + span - 8].forEach(function (x) { S('line', { x1: x, y1: wy - lift(x) + 4, x2: x, y2: GY - 5, stroke: C.gear, 'stroke-width': 2 }, g); S('circle', { cx: x, cy: GY - 5, r: 5, fill: C.gear }, g); }); }
      else { wheel(fly ? 105 : 112, 9, fly ? 104 : my); wheel(fly ? 195 : 188, 9, fly ? 104 : my); if (st.train === 'tricycle') wheel(150, 7, 110); }
    }
  }

  function draw(svg, st) {
    B.clear(svg);
    var top = S('g', { transform: 'translate(300,6)' }, svg), side = S('g', { transform: 'translate(0,286)' }, svg), front = S('g', { transform: 'translate(300,286)' }, svg);
    S('rect', { x: 0, y: 0, width: 600, height: 282, fill: '#ffffff55' }, svg).parentNode.insertBefore(svg.lastChild, svg.firstChild);
    S('line', { x1: 300, y1: 292, x2: 300, y2: 470, stroke: '#c9d6ea' }, svg);
    S('line', { x1: 10, y1: 284, x2: 590, y2: 284, stroke: '#c9d6ea' }, svg);
    txt(svg, 10, 20, 'VUE DE DESSUS'); txt(svg, 10, 304, 'PROFIL'); txt(svg, 310, 304, 'FACE');
    topView(top, st); sideView(side, st); frontView(front, st);
  }

  /* ---------- Configurateur ---------- */
  function configurator() {
    var L = B.lab('lab-config', { num: '1', title: 'Assemble ton avion', hint: 'Choisis un vrai avion dans la liste, ou change une à une ses caractéristiques : les trois vues se redessinent et l’explication s’affiche dessous.', takeaway: 'Schémas simplifiés, pas à l’échelle. Une architecture est toujours un compromis : chaque choix apporte des avantages et se paie quelque part.' });
    L.stage.style.touchAction = 'auto';
    var svg = S('svg', { viewBox: '0 0 600 470', role: 'img', 'aria-label': 'Avion en vue de dessus, de profil et de face' }, L.stage);
    var st = B.load('archi-st', null) || JSON.parse(JSON.stringify(window.ARCHI_PRESETS[0][1]));
    var last = B.load('archi-last', 'pos'), segs = {};
    var sel = B.h('<div class="ctrl"><label for="preset"><span>Un avion réel</span></label><select id="preset" class="select"><option value="">Choisis un avion…</option>' + window.ARCHI_PRESETS.map(function (p, i) { return '<option value="' + i + '">' + p[0] + '</option>'; }).join('') + '</select></div>');
    L.ctrls.appendChild(sel);
    var photoBox = B.h('<div class="preset-photo"></div>'); L.ctrls.appendChild(photoBox);
    sel.querySelector('select').onchange = function () {
      var p = window.ARCHI_PRESETS[this.value]; if (!p) { photoBox.innerHTML = ''; return; }
      st = JSON.parse(JSON.stringify(p[1])); photoBox.innerHTML = P[p[2]] ? '<button type="button" class="thumb wide" data-id="' + p[2] + '"><img src="/mythiques/photos/' + P[p[2]].f + '" alt=""><span>' + B.esc(p[0]) + ' en photo</span></button>' : '';
      wireThumbs(photoBox); refresh();
    };
    D.forEach(function (f) {
      var w = B.h('<div class="ctrl"><label><span>' + f.t + '</span></label><div class="seg" role="group" aria-label="' + B.esc(f.t) + '"></div></div>');
      var box = w.querySelector('.seg');
      f.o.forEach(function (o) {
        var b = B.h('<button type="button" data-v="' + o.v + '">' + o.l + '</button>');
        b.onclick = function () { st[f.k] = o.v; last = f.k; sel.querySelector('select').value = ''; photoBox.innerHTML = ''; refresh(); };
        box.appendChild(b);
      });
      segs[f.k] = box; L.ctrls.appendChild(w);
    });
    var info = document.getElementById('archi-info');
    function refresh() {
      if (st.mot === 'aucun') st.nbm = '0'; else if (st.nbm === '0') st.nbm = '1';
      D.forEach(function (f) { [].forEach.call(segs[f.k].children, function (b) { var on = b.getAttribute('data-v') === st[f.k]; b.className = on ? 'on' : ''; b.setAttribute('aria-pressed', on); }); });
      segs.nbm.parentNode.style.display = st.mot === 'aucun' ? 'none' : '';
      segs.pos.parentNode.style.opacity = st.ailes === 'mono' && st.plan !== 'volante' ? 1 : 0.45;
      draw(svg, st);
      var f = FAM[last], o = opt(last, st[last]);
      if (o) { info.innerHTML = card(f, o); wireThumbs(info); }
      B.save('archi-st', st); B.save('archi-last', last);
    }
    refresh();
  }

  /* ---------- Toutes les architectures ---------- */
  function families() {
    var box = document.getElementById('familles');
    D.forEach(function (f, i) {
      var sec = B.h('<div class="card fam"><h3 style="margin-top:0">' + (i + 1) + '. ' + f.t + '</h3></div>');
      f.o.forEach(function (o) {
        var d = B.h('<details class="fam-opt"><summary><b>' + o.l + '</b><span>' + (o.m.filter(function (id) { return P[id]; }).length ? o.m.filter(function (id) { return P[id]; }).slice(0, 4).map(function (id) { return '<img src="/mythiques/photos/' + P[id].f + '" alt="" loading="lazy">'; }).join('') : '') + '</span></summary><div class="fam-body">' + card(f, o) + '</div></details>');
        sec.appendChild(d);
      });
      box.appendChild(sec);
    });
    wireThumbs(box);
  }

  /* ---------- Quiz : quelle architecture sur cette photo ? ---------- */
  var QTEXT = { ailes: 'Combien d’ailes ?', pos: 'Où est placée l’aile ?', plan: 'Quelle forme d’aile, vue de dessus ?', emp: 'Quel type d’empennage ?', mot: 'Où sont les moteurs ?', nbm: 'Combien de moteurs ?', train: 'Quel train d’atterrissage ?', esc: 'Train fixe ou rentrant ?' };
  function quiz() {
    var L = B.lab('lab-quiz', { num: '2', title: 'Quelle architecture sur cette photo ?', hint: 'Observe la photo et identifie la caractéristique demandée.', takeaway: 'Astuce : regarde d’abord où l’aile rejoint le fuselage, puis la queue, puis les roues.' });
    L.stage.style.touchAction = 'auto';
    var items = [];
    var SKIP = { esc: 1, nbm: 1 }, NO = { 'mot:b2': 1, 'mot:dc10': 1 };
    D.forEach(function (f) { if (SKIP[f.k]) return; f.o.forEach(function (o) { o.m.forEach(function (id) { if (P[id] && !NO[f.k + ':' + id]) items.push([f.k, o.v, id]); }); }); });
    var score = 0, n = 0, best = B.load('archi-quiz-best', 0);
    var set = B.readout(L.ctrls, [['s', 'Score'], ['b', 'Record sur 10']]);
    var verdict = B.h('<div class="verdict">Réponds à 10 questions.</div>'); L.ctrls.appendChild(verdict);
    set('b', best + ' / 10');
    function q() {
      if (n === 10) {
        if (score > best) { best = score; B.save('archi-quiz-best', best); }
        verdict.className = 'verdict ' + (score >= 7 ? 'good' : 'warn'); verdict.textContent = 'Série terminée : ' + score + ' / 10.';
        L.stage.innerHTML = '<div style="padding:16px"><p style="font:800 34px Manrope,sans-serif;margin:0">' + score + ' / 10</p><button type="button" class="btn primary" id="aq-again">Nouvelle série</button></div>';
        L.stage.querySelector('#aq-again').onclick = function () { score = 0; n = 0; q(); };
        set('s', score + ' / 10'); set('b', best + ' / 10'); return;
      }
      var it = items[Math.floor(Math.random() * items.length)], f = FAM[it[0]];
      var opts = f.o.filter(function (o) { return o.v !== it[1] && !(o.m.indexOf(it[2]) >= 0); });
      opts = B.shuffle(opts).slice(0, 3).concat([opt(it[0], it[1])]);
      opts = B.shuffle(opts);
      L.stage.innerHTML = '<div style="padding:12px"><img class="qphoto" src="/mythiques/photos/' + P[it[2]].f + '" alt="Photo d’avion"><p style="font-weight:700;margin:10px 0 6px">' + QTEXT[it[0]] + '</p><div class="choices"></div><p class="small" id="aq-fb"></p></div>';
      var box = L.stage.querySelector('.choices');
      opts.forEach(function (o, k) {
        var b = B.h('<button type="button" class="choice"><b>' + 'ABCD'[k] + '</b><span>' + o.l + '</span></button>');
        b.onclick = function () {
          var ok = o.v === it[1]; n++; if (ok) score++;
          [].forEach.call(box.children, function (x, j) { x.disabled = true; if (opts[j].v === it[1]) x.classList.add('ok'); });
          if (!ok) b.classList.add('ko');
          var good = opt(it[0], it[1]);
          L.stage.querySelector('#aq-fb').innerHTML = '<b>' + B.esc(NAMES[it[2]] || '') + '</b> : ' + good.l.toLowerCase() + '. ' + good.p;
          set('s', score + ' / ' + n);
          var nx = B.h('<button type="button" class="btn primary" style="margin-top:8px">' + (n === 10 ? 'Voir le score' : 'Photo suivante') + '</button>');
          nx.onclick = q; L.stage.firstChild.appendChild(nx);
        };
        box.appendChild(b);
      });
    }
    q();
  }

  function init() { configurator(); families(); quiz(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
