/* Ateliers interactifs du domaine Aérodynamique.
   Modèles pédagogiques simplifiés, calés sur le Robin DR400/180 quand c'est possible
   (S = 13,6 m², décrochage 105 / 99 / 95 km/h à 1 100 kg selon le manuel de vol, finesse 9,5). */
(function () {
  'use strict';
  var B = window.BIA, S = B.svg, fmt = B.fmt, clamp = B.clamp;
  var G = 9.81, SURF = 13.6, RAD = Math.PI / 180;

  /* Modèle d'aile : Cz linéaire jusqu'à l'incidence critique, puis chute. Volets : +ΔCz. */
  var ALPHA_C = 15, FLAPS = { 0: 0, 1: 0.19, 2: 0.34 };
  function cz(a, fl) {
    var d = FLAPS[fl || 0];
    if (a <= ALPHA_C) return 0.095 * (a + 1) + d;
    return 0.095 * (ALPHA_C + 1) + d - 0.07 * (a - ALPHA_C);
  }
  function cx(a, fl) {
    var c = cz(Math.min(a, ALPHA_C), fl), base = 0.035 + 0.075 * c * c + (fl ? 0.02 * fl : 0);
    return a <= ALPHA_C ? base : base + 0.045 * (a - ALPHA_C);
  }
  function arrow(g, x1, y1, x2, y2, color, w) {
    var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    if (L < 2) return;
    var ux = dx / L, uy = dy / L, hs = Math.min(12, L * 0.4);
    S('line', { x1: x1, y1: y1, x2: x2 - ux * hs * 0.6, y2: y2 - uy * hs * 0.6, stroke: color, 'stroke-width': w || 4, 'stroke-linecap': 'round' }, g);
    S('path', { d: 'M' + x2 + ',' + y2 + ' L' + (x2 - ux * hs - uy * hs * 0.55) + ',' + (y2 - uy * hs + ux * hs * 0.55) + ' L' + (x2 - ux * hs + uy * hs * 0.55) + ',' + (y2 - uy * hs - ux * hs * 0.55) + 'Z', fill: color }, g);
  }
  function label(g, x, y, t, color, anchor, size) {
    var e = S('text', { x: x, y: y, fill: color || '#10203f', 'font-size': size || 14, 'font-weight': 700, 'text-anchor': anchor || 'start', 'font-family': 'DM Sans, sans-serif' }, g);
    e.textContent = t; return e;
  }
  function clear(g) { while (g.firstChild) g.removeChild(g.firstChild); }
  /* Profil NACA 2412, corde unitaire, origine au quart avant */
  function profilePath(scale) {
    var m = 0.02, p = 0.4, t = 0.12, up = [], lo = [];
    for (var i = 0; i <= 40; i++) {
      var x = (1 - Math.cos(Math.PI * i / 40)) / 2;
      var yt = 5 * t * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x * x * x - 0.1015 * x * x * x * x);
      var yc = x < p ? m / (p * p) * (2 * p * x - x * x) : m / ((1 - p) * (1 - p)) * (1 - 2 * p + 2 * p * x - x * x);
      up.push([(x - 0.25) * scale, -(yc + yt) * scale]); lo.push([(x - 0.25) * scale, -(yc - yt) * scale]);
    }
    var d = 'M' + up.map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' L');
    d += ' L' + lo.reverse().map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' L') + 'Z';
    return d;
  }
  /* Silhouette de profil d'avion léger à aile basse (vue de côté), nez à gauche */
  function sideAircraft(g, x0, y0, k, color) {
    k = k || 1; color = color || '#10203f';
    var P = function (pts) { return pts.map(function (q) { return (x0 + q[0] * k).toFixed(1) + ',' + (y0 + q[1] * k).toFixed(1); }).join(' '); };
    S('polygon', { points: P([[0, -6], [30, -16], [120, -30], [175, -32], [200, -22], [420, -14], [455, -60], [478, -60], [470, -10], [470, 4], [200, 14], [40, 12], [0, 6]]), fill: color }, g);
    S('polygon', { points: P([[120, -30], [150, -50], [190, -50], [205, -24]]), fill: '#9ec3ff', stroke: color, 'stroke-width': 2 }, g); // verrière
    S('rect', { x: x0 + 150 * k, y: y0 + 6 * k, width: 120 * k, height: 8 * k, rx: 3, fill: '#2a4a85' }, g); // aile
    S('rect', { x: x0 + 420 * k, y: y0 - 16 * k, width: 60 * k, height: 6 * k, rx: 2, fill: '#2a4a85' }, g); // empennage
    S('rect', { x: x0 - 6 * k, y: y0 - 26 * k, width: 5 * k, height: 52 * k, rx: 2, fill: '#5b6880' }, g); // hélice
  }

  /* =================== 1. Soufflerie =================== */
  function soufflerie() {
    var L = B.lab('lab-soufflerie', { num: '1', title: 'La soufflerie : incidence, vitesse et décrochage',
      hint: 'Fais pivoter l’aile en glissant la poignée orange du bord de fuite. Cherche l’incidence qui fait décrocher, puis joue sur la vitesse et l’altitude.',
      takeaway: 'Modèle calé sur un DR400/180 (13,6 m²) : il décroche à 105 km/h à 1 100 kg volets rentrés, comme dans le manuel de vol. Le décrochage arrive toujours à la même incidence, quelle que soit la vitesse.' });
    var W = 600, H = 330, cxp = 280, cyp = 170, SC = 230;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Profil d’aile dans une soufflerie' }, L.stage);
    var flow = S('g', {}, svg), wake = S('g', {}, svg), wing = S('g', {}, svg), vec = S('g', {}, svg), ui = S('g', {}, svg);
    var prof = S('path', { d: profilePath(SC), fill: '#10203f' }, wing);
    var chord = S('line', { x1: -0.25 * SC, y1: 0, x2: 0.75 * SC, y2: 0, stroke: '#f5a623', 'stroke-width': 1.5, 'stroke-dasharray': '6 5' }, wing);
    var hnd = S('g', {}, svg);
    S('circle', { r: 20, class: 'ring' }, hnd); S('circle', { r: 7, fill: '#f5a623' }, hnd);
    var alpha = 5;
    var st = { V: 150, h: 0, m: 1000, fl: 0 };
    var ctl = L.ctrls;
    B.slider(ctl, { label: 'Vitesse', min: 60, max: 300, step: 1, value: st.V, fmt: function (v) { return v + ' km/h'; }, onInput: function (v) { st.V = v; draw(); } });
    B.slider(ctl, { label: 'Altitude', min: 0, max: 4000, step: 100, value: 0, fmt: function (v) { return fmt(v) + ' m'; }, onInput: function (v) { st.h = v; draw(); } });
    B.slider(ctl, { label: 'Masse de l’avion', min: 700, max: 1100, step: 10, value: st.m, fmt: function (v) { return v + ' kg'; }, onInput: function (v) { st.m = v; draw(); } });
    var flLab = B.h('<div class="small" style="font-weight:600;color:#10203f">Volets</div>'); ctl.appendChild(flLab);
    B.seg(ctl, [[0, 'Rentrés'], [1, 'Décollage'], [2, 'Atterrissage']], 0, function (v) { st.fl = v; draw(); });
    var set = B.readout(ctl, [['a', 'Incidence'], ['cz', 'Cz'], ['fz', 'Portance'], ['p', 'Poids'], ['vs', 'Vitesse de décrochage'], ['vp', 'Vitesse de palier à cette incidence']]);
    var verdict = B.h('<div class="verdict"></div>'); ctl.appendChild(verdict);
    var t0 = 0, anim = B.loop(function (dt) { t0 += dt; [].forEach.call(wake.children, function (c, i) { c.setAttribute('stroke-dashoffset', (-t0 * 60 - i * 7).toFixed(1)); }); return alpha > ALPHA_C; });

    function draw() {
      var a = alpha, c = cz(a, st.fl), rho = B.isa(st.h).rho, V = st.V / 3.6;
      var Fz = 0.5 * rho * SURF * V * V * c, P = st.m * G;
      var stalled = a > ALPHA_C;
      wing.setAttribute('transform', 'translate(' + cxp + ',' + cyp + ') rotate(' + a + ')');
      wake.setAttribute('transform', 'translate(' + cxp + ',' + cyp + ') rotate(' + a + ')');
      var te = [cxp + 0.75 * SC * Math.cos(a * RAD), cyp + 0.75 * SC * Math.sin(a * RAD)];
      hnd.setAttribute('transform', 'translate(' + te[0].toFixed(1) + ',' + te[1].toFixed(1) + ')');
      // filets d'air
      clear(flow);
      var dw = clamp(c, -0.3, 2.2) * 18;
      for (var i = 0; i < 9; i++) {
        var y = 30 + i * 34, near = Math.abs(y - cyp) < 60;
        var up = (y < cyp ? 1 : 0.6) * dw * (near ? 1 : 0.5);
        var d = 'M0,' + y + ' C' + (cxp - 120) + ',' + (y - up * 0.6) + ' ' + (cxp + 120) + ',' + (y + up * 0.8) + ' ' + W + ',' + (y + up * 1.6);
        S('path', { d: d, fill: 'none', stroke: stalled && y < cyp && y > cyp - 80 ? '#d6454155' : '#2f6fde55', 'stroke-width': 2 }, flow);
      }
      // sillage décroché
      clear(wake);
      if (stalled) {
        var k = Math.min(1, (a - ALPHA_C) / 5);
        for (var j = 0; j < 5; j++) {
          var cx0 = 0.05 * SC + j * 0.16 * SC, cy0 = -16 - j * (6 + 6 * k);
          S('circle', { cx: cx0, cy: cy0, r: 9 + j * 4, fill: 'none', stroke: '#d64541', 'stroke-width': 2, 'stroke-dasharray': '10 8', opacity: 0.4 + 0.5 * k }, wake);
        }
        anim.start();
      } else anim.stop();
      // vecteurs : portance (perpendiculaire au vent relatif, ici horizontal), traînée, poids
      clear(vec);
      var scale = 90 / P;
      arrow(vec, cxp, cyp, cxp, cyp - Math.max(0, Fz) * scale, '#1f9d6a', 5);
      arrow(vec, cxp, cyp, cxp, cyp + P * scale, '#5b6880', 4);
      var Fx = 0.5 * rho * SURF * V * V * cx(a, st.fl);
      arrow(vec, cxp, cyp, cxp + Fx * scale * 3, cyp, '#d64541', 4);
      label(vec, cxp + 10, cyp - Math.max(0, Fz) * scale - 6, 'Portance', '#1f9d6a');
      label(vec, cxp + 10, cyp + P * scale + 4, 'Poids', '#5b6880');
      label(vec, cxp + Fx * scale * 3 + 8, cyp + 18, 'Traînée ×3', '#d64541', 'start', 12);
      clear(ui);
      label(ui, 14, 22, 'Vent relatif →', '#2f6fde', 'start', 13);
      label(ui, W - 12, 22, 'α = ' + fmt(a, 1) + '°', stalled ? '#d64541' : '#10203f', 'end', 18);
      // lectures
      var cmax = cz(ALPHA_C, st.fl), vs = Math.sqrt(2 * P / (rho * SURF * cmax)) * 3.6;
      var vp = c > 0.02 ? Math.sqrt(2 * P / (rho * SURF * c)) * 3.6 : Infinity;
      set('a', fmt(a, 1) + '°', stalled ? 'warn' : '');
      set('cz', fmt(c, 2));
      set('fz', fmt(Fz / 10) + ' daN');
      set('p', fmt(P / 10) + ' daN');
      set('vs', fmt(vs) + ' km/h');
      set('vp', isFinite(vp) && vp < 999 ? fmt(vp) + ' km/h' : '–');
      var r = Fz / P;
      if (stalled) { verdict.className = 'verdict bad'; verdict.textContent = 'Décrochage : les filets d’air décollent de l’extrados, la portance s’effondre. Diminue l’incidence !'; }
      else if (r > 1.05) { verdict.className = 'verdict good'; verdict.textContent = 'Portance > poids : la trajectoire s’incurve vers le haut (' + fmt(r, 2) + ' fois le poids).'; }
      else if (r < 0.95) { verdict.className = 'verdict warn'; verdict.textContent = 'Portance < poids : l’avion s’enfonce. Il faut plus de vitesse ou plus d’incidence.'; }
      else { verdict.className = 'verdict good'; verdict.textContent = 'Portance = poids : vol en palier.'; }
    }
    B.drag(svg, hnd, function (pt) {
      var a = Math.atan2(pt.y - cyp, pt.x - cxp) / RAD;
      if (pt.x < cxp) a = a > 0 ? 180 - a : -180 - a;
      alpha = Math.round(clamp(a, -4, 22) * 2) / 2; draw();
    });
    hnd.addEventListener('keydown', function (e) { if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { alpha = clamp(alpha + 0.5, -4, 22); draw(); e.preventDefault(); } if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { alpha = clamp(alpha - 0.5, -4, 22); draw(); e.preventDefault(); } });
    hnd.setAttribute('aria-label', 'Incidence de l’aile, flèches pour régler');
    draw();
  }

  /* =================== 2. Polaire et finesse =================== */
  function polaire() {
    var L = B.lab('lab-polaire', { num: '2', title: 'La polaire : trouver la meilleure finesse',
      hint: 'Fais glisser le point orange le long de la polaire. La pente de la droite bleue issue de l’origine est la finesse : rends-la la plus raide possible.',
      takeaway: 'La finesse maximale de ce modèle (environ 9,8) est proche des 9,5 du manuel de vol du DR400/180. Avec du vent de face, on gagne à planer un peu plus vite que la vitesse de finesse maximale.' });
    var W = 600, H = 360, X0 = 60, Y0 = 310, XS = 2000, YS = 150; // Cx 0..0.26 ; Cz -0.3..1.75
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Polaire Cz en fonction de Cx' }, L.stage);
    var px = function (c) { return X0 + c * XS; }, py = function (c) { return Y0 - (c + 0.3) * YS + 0.3 * YS - 0.3 * YS; };
    py = function (c) { return Y0 - c * YS; };
    // axes
    S('line', { x1: X0, y1: 20, x2: X0, y2: Y0 + 40, stroke: '#5b6880' }, svg);
    S('line', { x1: X0, y1: Y0, x2: W - 10, y2: Y0, stroke: '#5b6880' }, svg);
    label(svg, X0 + 6, 30, 'Cz', '#5b6880'); label(svg, W - 14, Y0 - 8, 'Cx', '#5b6880', 'end');
    [0.5, 1, 1.5].forEach(function (v) { S('line', { x1: X0 - 4, y1: py(v), x2: X0, y2: py(v), stroke: '#5b6880' }, svg); label(svg, X0 - 8, py(v) + 5, fmt(v, 1), '#5b6880', 'end', 12); });
    [0.1, 0.2].forEach(function (v) { S('line', { x1: px(v), y1: Y0, x2: px(v), y2: Y0 + 4, stroke: '#5b6880' }, svg); label(svg, px(v), Y0 + 18, fmt(v, 1), '#5b6880', 'middle', 12); });
    var pts = [], d = '';
    for (var a = -4; a <= 20; a += 0.25) { var p = [px(cx(a, 0)), py(cz(a, 0)), a]; pts.push(p); d += (d ? ' L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1); }
    S('path', { d: d, fill: 'none', stroke: '#10203f', 'stroke-width': 3 }, svg);
    // finesse max
    var best = pts.reduce(function (b, q) { var f = cz(q[2], 0) / cx(q[2], 0); return f > b.f ? { f: f, a: q[2] } : b; }, { f: 0, a: 0 });
    var bx = px(cx(best.a, 0)), by = py(cz(best.a, 0));
    S('line', { x1: X0, y1: Y0, x2: X0 + (bx - X0) * 1.6, y2: Y0 + (by - Y0) * 1.6, stroke: '#1f9d6a', 'stroke-width': 2, 'stroke-dasharray': '6 6' }, svg);
    label(svg, bx + 8, by - 8, 'finesse max', '#1f9d6a', 'start', 12);
    var line = S('line', { x1: X0, y1: Y0, stroke: '#2f6fde', 'stroke-width': 3 }, svg);
    var hnd = S('g', {}, svg); S('circle', { r: 20, class: 'ring' }, hnd); S('circle', { r: 7, fill: '#f5a623' }, hnd);
    var stallMark = S('g', {}, svg);
    var A = 6, h = 1000, wind = 0;
    var ctl = L.ctrls;
    B.slider(ctl, { label: 'Hauteur au début du plané', min: 300, max: 3000, step: 100, value: h, fmt: function (v) { return fmt(v) + ' m'; }, onInput: function (v) { h = v; draw(); } });
    B.slider(ctl, { label: 'Vent (négatif = vent arrière)', min: -40, max: 40, step: 5, value: 0, fmt: function (v) { return v > 0 ? v + ' km/h de face' : v < 0 ? (-v) + ' km/h arrière' : 'nul'; }, onInput: function (v) { wind = v; draw(); } });
    var set = B.readout(ctl, [['a', 'Incidence'], ['f', 'Finesse'], ['v', 'Vitesse air'], ['vz', 'Taux de chute'], ['d', 'Distance au sol'], ['b', 'Finesse max']]);
    var bar = B.h('<div><div class="small">Distance parcourue (0 à 30 km)</div><div class="scorebar" style="height:12px"><i></i></div></div>'); ctl.appendChild(bar);
    function draw() {
      var c = cz(A, 0), k = cx(A, 0), f = c / k;
      var x = px(k), y = py(c);
      hnd.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')');
      line.setAttribute('x2', X0 + (x - X0) * 1.4); line.setAttribute('y2', Y0 + (y - Y0) * 1.4);
      clear(stallMark);
      if (A > ALPHA_C) label(stallMark, x + 10, y + 20, 'décroché', '#d64541', 'start', 13);
      var V = c > 0.05 ? Math.sqrt(2 * 1000 * G / (1.225 * SURF * c)) * 3.6 : NaN; // km/h, 1 000 kg
      var vz = V / f / 3.6; // m/s
      var t = h / vz, Vsol = V - wind, dist = Vsol / 3.6 * t / 1000;
      set('a', fmt(A, 1) + '°', A > ALPHA_C ? 'warn' : '');
      set('f', c > 0 ? fmt(f, 1) : '–', Math.abs(f - best.f) < 0.15 ? 'good' : '');
      set('v', isFinite(V) ? fmt(V) + ' km/h' : '–');
      set('vz', isFinite(vz) && c > 0 ? fmt(vz, 1) + ' m/s' : '–');
      set('d', isFinite(dist) && c > 0 ? fmt(dist, 1) + ' km' : '–');
      set('b', fmt(best.f, 1) + ' à ' + fmt(Math.sqrt(2 * 1000 * G / (1.225 * SURF * cz(best.a, 0))) * 3.6) + ' km/h');
      bar.querySelector('i').style.width = (c > 0 && isFinite(dist) ? clamp(dist / 30 * 100, 0, 100) : 0) + '%';
    }
    B.drag(svg, hnd, function (pt) {
      var bi = 0, bd = 1e9;
      pts.forEach(function (q, i) { var dd = (q[0] - pt.x) * (q[0] - pt.x) + (q[1] - pt.y) * (q[1] - pt.y); if (dd < bd) { bd = dd; bi = i; } });
      A = pts[bi][2]; draw();
    });
    hnd.addEventListener('keydown', function (e) { if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { A = clamp(A + 0.25, -4, 20); draw(); e.preventDefault(); } if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { A = clamp(A - 0.25, -4, 20); draw(); e.preventDefault(); } });
    hnd.setAttribute('aria-label', 'Point de fonctionnement sur la polaire');
    draw();
  }

  /* =================== 3. Virage =================== */
  function virage() {
    var L = B.lab('lab-virage', { num: '3', title: 'Le virage : inclinaison, facteur de charge et décrochage',
      hint: 'Incline l’avion en faisant glisser la poignée orange au bout de l’aile droite. Regarde la portance grandir, le poids apparent monter et la vitesse de décrochage augmenter.',
      takeaway: 'n = 1 / cos φ. Vs en virage = Vs × √n. Rayon = V² / (g · tan φ). Limite structurale du DR400 en catégorie normale : +3,8 g.' });
    var W = 600, H = 340, cx0 = 300, cy0 = 190;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Avion vu de l’arrière en virage' }, L.stage);
    S('line', { x1: 0, y1: cy0, x2: W, y2: cy0, stroke: '#2f6fde33', 'stroke-width': 2, 'stroke-dasharray': '8 8' }, svg);
    var plane = S('g', { opacity: 0.55 }, svg), vec = S('g', {}, svg);
    // avion vu de l'arrière
    S('rect', { x: -230, y: -6, width: 460, height: 10, rx: 5, fill: '#2a4a85' }, plane);
    S('circle', { cx: 0, cy: 0, r: 24, fill: '#10203f' }, plane);
    S('rect', { x: -60, y: -40, width: 120, height: 7, rx: 3, fill: '#2a4a85' }, plane);
    S('rect', { x: -4, y: -80, width: 8, height: 50, rx: 3, fill: '#10203f' }, plane);
    var hnd = S('g', {}, svg); S('circle', { r: 20, class: 'ring' }, hnd); S('circle', { r: 7, fill: '#f5a623' }, hnd);
    var phi = 30, V = 160, vs0 = 105;
    var ctl = L.ctrls;
    B.slider(ctl, { label: 'Vitesse', min: 90, max: 250, step: 5, value: V, fmt: function (v) { return v + ' km/h'; }, onInput: function (v) { V = v; draw(); } });
    var set = B.readout(ctl, [['phi', 'Inclinaison'], ['n', 'Facteur de charge'], ['vs', 'Vs en virage'], ['pa', 'Poids apparent (70 kg)'], ['r', 'Rayon'], ['t', 'Tour complet']]);
    var verdict = B.h('<div class="verdict"></div>'); ctl.appendChild(verdict);
    function draw() {
      var n = 1 / Math.cos(phi * RAD), vs = vs0 * Math.sqrt(n), v = V / 3.6;
      var R = v * v / (G * Math.tan(phi * RAD)), om = G * Math.tan(phi * RAD) / v / RAD;
      plane.setAttribute('transform', 'translate(' + cx0 + ',' + cy0 + ') rotate(' + phi + ')');
      var hx = cx0 + 230 * Math.cos(phi * RAD), hy = cy0 + 230 * Math.sin(phi * RAD);
      hnd.setAttribute('transform', 'translate(' + hx.toFixed(1) + ',' + hy.toFixed(1) + ')');
      clear(vec);
      var k = 80, Lz = Math.min(n, 2.2) * k;
      // portance perpendiculaire aux ailes : direction (sin φ, −cos φ) dans le repère écran
      var lx = cx0 + Lz * Math.sin(phi * RAD), ly = cy0 - Lz * Math.cos(phi * RAD);
      arrow(vec, cx0, cy0, lx, ly, '#1f9d6a', 5);
      S('line', { x1: lx, y1: ly, x2: lx, y2: cy0 - k, stroke: '#1f9d6a', 'stroke-dasharray': '4 4', 'stroke-width': 1.5 }, vec);
      arrow(vec, cx0, cy0, cx0, cy0 - k, '#1f9d6a88', 3);
      arrow(vec, cx0, cy0, lx, cy0, '#2f6fde', 3);
      arrow(vec, cx0, cy0, cx0, cy0 + k, '#5b6880', 4);
      label(vec, lx + (phi >= 0 ? 8 : -8), ly - 6, 'Portance = ' + fmt(n, 2) + ' × poids', '#1f9d6a', phi >= 0 ? 'start' : 'end', 13);
      label(vec, cx0 + 8, cy0 + k + 16, 'Poids', '#5b6880', 'start', 13);
      label(vec, lx + (phi >= 0 ? 6 : -6), cy0 + 4, phi ? 'fait tourner' : '', '#2f6fde', phi >= 0 ? 'start' : 'end', 12);
      set('phi', fmt(Math.abs(phi)) + '°');
      set('n', fmt(n, 2) + ' g', n > 3.8 ? 'warn' : '');
      set('vs', fmt(vs) + ' km/h', vs > V ? 'warn' : '');
      set('pa', fmt(70 * n) + ' kg');
      set('r', phi ? fmt(R) + ' m' : '∞');
      set('t', phi ? fmt(360 / om) + ' s' : '–');
      if (vs > V) { verdict.className = 'verdict bad'; verdict.textContent = 'Décrochage ! À cette inclinaison, l’avion décroche dès ' + fmt(vs) + ' km/h : tu voles trop lentement.'; }
      else if (n > 3.8) { verdict.className = 'verdict bad'; verdict.textContent = 'Au-delà de +3,8 g : limite structurale du DR400 dépassée.'; }
      else if (Math.abs(phi) > 45) { verdict.className = 'verdict warn'; verdict.textContent = 'Virage très serré : réservé à la voltige ou aux exercices encadrés. En école, on vire en général à 30° maximum.'; }
      else { verdict.className = 'verdict good'; verdict.textContent = 'Virage normal. Marge au décrochage : ' + fmt(V - vs) + ' km/h.'; }
    }
    B.drag(svg, hnd, function (pt) { phi = Math.round(clamp(Math.atan2(pt.y - cy0, pt.x - cx0) / RAD, -80, 80)); draw(); });
    hnd.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { phi = clamp(phi + 1, -80, 80); draw(); e.preventDefault(); } if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { phi = clamp(phi - 1, -80, 80); draw(); e.preventDefault(); } });
    hnd.setAttribute('aria-label', 'Inclinaison, flèches pour régler');
    draw();
  }

  /* =================== 4. Gouvernes, manche et palonnier =================== */
  function gouvernes() {
    var L = B.lab('lab-gouvernes', { num: '4', title: 'Le manche et le palonnier : les trois axes',
      hint: 'Fais glisser le manche (carré de gauche) et le palonnier. L’avion est vu de l’arrière, comme depuis la place du pilote. Observe les gouvernes, l’avion qui s’incline et la bille.',
      takeaway: 'Manche à gauche : aileron gauche levé, roulis à gauche. Manche en arrière : profondeur levée, le nez monte. Pied à gauche : direction à gauche. Pour virer proprement, on accompagne les ailerons au palonnier du même côté : la bille reste au centre.' });
    var W = 600, H = 330;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Commandes de vol et gouvernes' }, L.stage);
    // manche
    var pad = S('g', { transform: 'translate(20,40)' }, svg);
    S('rect', { x: 0, y: 0, width: 150, height: 150, rx: 14, fill: '#fff', stroke: '#dde4ef', 'stroke-width': 2 }, pad);
    S('line', { x1: 75, y1: 10, x2: 75, y2: 140, stroke: '#dde4ef' }, pad); S('line', { x1: 10, y1: 75, x2: 140, y2: 75, stroke: '#dde4ef' }, pad);
    label(pad, 75, -10, 'MANCHE', '#5b6880', 'middle', 12);
    label(pad, 75, 24, 'pousser', '#5b6880', 'middle', 11); label(pad, 75, 138, 'tirer', '#5b6880', 'middle', 11);
    var stick = S('g', {}, svg); S('circle', { r: 24, class: 'ring' }, stick); S('circle', { r: 10, fill: '#f5a623' }, stick);
    // palonnier
    var ped = S('g', { transform: 'translate(20,240)' }, svg);
    label(ped, 75, -8, 'PALONNIER', '#5b6880', 'middle', 12);
    S('rect', { x: 0, y: 0, width: 150, height: 30, rx: 15, fill: '#fff', stroke: '#dde4ef', 'stroke-width': 2 }, ped);
    label(ped, 4, 50, 'pied gauche', '#5b6880', 'start', 11); label(ped, 146, 50, 'pied droit', '#5b6880', 'end', 11);
    var pedH = S('g', {}, svg); S('circle', { r: 20, class: 'ring' }, pedH); S('circle', { r: 8, fill: '#f5a623' }, pedH);
    // avion vu de l'arrière
    var view = S('g', {}, svg), plane = S('g', {}, view);
    var ax = 400, ay = 170;
    var ailL = S('rect', { width: 60, height: 7, rx: 2, fill: '#f5a623' }, plane), ailR = S('rect', { width: 60, height: 7, rx: 2, fill: '#f5a623' }, plane);
    S('rect', { x: -180, y: -4, width: 360, height: 8, rx: 4, fill: '#2a4a85' }, plane);
    S('circle', { r: 22, fill: '#10203f' }, plane);
    S('rect', { x: -60, y: -42, width: 120, height: 6, rx: 3, fill: '#2a4a85' }, plane);
    var elev = S('rect', { x: -60, width: 120, height: 5, rx: 2, fill: '#f5a623' }, plane);
    S('rect', { x: -4, y: -90, width: 8, height: 50, rx: 3, fill: '#10203f' }, plane);
    var rud = S('polygon', { fill: '#f5a623' }, plane);
    // bille
    var ball = S('g', { transform: 'translate(400,300)' }, svg);
    S('path', { d: 'M-60,-14 Q0,10 60,-14', fill: 'none', stroke: '#10203f', 'stroke-width': 14, 'stroke-linecap': 'round', opacity: 0.12 }, ball);
    S('line', { x1: -9, y1: -14, x2: -9, y2: 6, stroke: '#10203f', 'stroke-width': 1.5 }, ball); S('line', { x1: 9, y1: -14, x2: 9, y2: 6, stroke: '#10203f', 'stroke-width': 1.5 }, ball);
    var ballC = S('circle', { r: 7, fill: '#10203f' }, ball);
    label(svg, 400, 326, 'bille', '#5b6880', 'middle', 11);
    var txt = S('g', {}, svg);
    var sx = 0, sy = 0, rp = 0, roll = 0, pitch = 0;
    var ctl = L.ctrls;
    var set = B.readout(ctl, [['r', 'Roulis'], ['t', 'Tangage'], ['l', 'Lacet']]);
    var verdict = B.h('<div class="verdict"></div>'); ctl.appendChild(verdict);
    var reset = B.h('<button type="button" class="btn">Lâcher les commandes</button>'); ctl.appendChild(reset);
    reset.onclick = function () { sx = sy = rp = 0; draw(); };
    var anim = B.loop(function (dt) {
      roll = clamp(roll + sx * 60 * dt, -60, 60);
      pitch = pitch + (sy * 20 - pitch) * Math.min(1, dt * 3);
      paint();
      return true;
    });
    function paint() {
      plane.setAttribute('transform', 'translate(' + ax + ',' + (ay - pitch) + ') rotate(' + roll + ')');
    }
    function draw() {
      stick.setAttribute('transform', 'translate(' + (95 + sx * 60) + ',' + (115 + sy * 60) + ')');
      pedH.setAttribute('transform', 'translate(' + (95 + rp * 60) + ',255)');
      // ailerons : manche à gauche (sx<0) → aileron gauche (écran gauche) levé
      var da = sx * 14;
      ailL.setAttribute('x', -175); ailL.setAttribute('y', -4 + da - 3);
      ailR.setAttribute('x', 115); ailR.setAttribute('y', -4 - da - 3);
      elev.setAttribute('y', -42 - sy * 12 - 2);
      var rx = rp * 18;
      rud.setAttribute('points', '-4,-88 4,-88 ' + (4 + rx) + ',-42 ' + (-4 + rx) + ',-42');
      // bille : décentrée si le pied ne suit pas les ailerons (lacet inverse) ; on « marche sur la bille »
      var slip = clamp((sx * 0.6 - rp) * 40, -50, 50);
      ballC.setAttribute('cx', slip.toFixed(1)); ballC.setAttribute('cy', (-2 + Math.abs(slip) * 0.12).toFixed(1));
      set('r', sx < -0.1 ? 'à gauche' : sx > 0.1 ? 'à droite' : 'neutre');
      set('t', sy > 0.1 ? 'le nez monte' : sy < -0.1 ? 'le nez baisse' : 'neutre');
      set('l', rp < -0.1 ? 'nez à gauche' : rp > 0.1 ? 'nez à droite' : 'neutre');
      if (Math.abs(sx) > 0.15 && Math.abs(slip) > 12) { verdict.className = 'verdict warn'; verdict.textContent = 'Virage dissymétrique : la bille est sortie. Lacet inverse : l’aileron abaissé traîne plus. Mets du pied du côté de la bille.'; }
      else if (Math.abs(sx) > 0.15) { verdict.className = 'verdict good'; verdict.textContent = 'Virage symétrique : ailerons et palonnier conjugués, la bille est au centre.'; }
      else if (Math.abs(slip) > 12) { verdict.className = 'verdict warn'; verdict.textContent = 'Palonnier seul : l’avion dérape et finit par s’incliner (roulis induit).'; }
      else { verdict.className = 'verdict'; verdict.textContent = 'Bouge le manche ou le palonnier.'; }
      anim.start();
    }
    B.drag(svg, stick, function (pt) { sx = clamp((pt.x - 95) / 60, -1, 1); sy = clamp((pt.y - 115) / 60, -1, 1); if (Math.abs(sx) < 0.08) sx = 0; if (Math.abs(sy) < 0.08) sy = 0; draw(); });
    B.drag(svg, pedH, function (pt) { rp = clamp((pt.x - 95) / 60, -1, 1); if (Math.abs(rp) < 0.08) rp = 0; draw(); });
    stick.setAttribute('aria-label', 'Manche, flèches pour bouger');
    stick.addEventListener('keydown', function (e) { var k = { ArrowLeft: [-0.2, 0], ArrowRight: [0.2, 0], ArrowUp: [0, -0.2], ArrowDown: [0, 0.2] }[e.key]; if (k) { sx = clamp(sx + k[0], -1, 1); sy = clamp(sy + k[1], -1, 1); draw(); e.preventDefault(); } });
    pedH.setAttribute('aria-label', 'Palonnier, flèches gauche et droite');
    pedH.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') { rp = clamp(rp - 0.2, -1, 1); draw(); e.preventDefault(); } if (e.key === 'ArrowRight') { rp = clamp(rp + 0.2, -1, 1); draw(); e.preventDefault(); } });
    draw(); paint();
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) anim.start(); else anim.stop(); }); }).observe(L.el);
  }

  /* =================== 5. Centrage =================== */
  function centrage() {
    var L = B.lab('lab-centrage', { num: '5', title: 'Le devis de masse et centrage',
      hint: 'Charge l’avion avec les curseurs : passagers, bagages, carburant. Le point rouge sur le diagramme doit rester dans l’enveloppe verte, du décollage jusqu’à l’atterrissage.',
      takeaway: 'Avion d’école fictif, chiffres pédagogiques : seuls le bras des bagages (1,90 m) et la masse maximale de 1 000 kg sont repris du DR400/140B (certificat de type EASA). Pour voler, on utilise le manuel de vol et la fiche de pesée de l’avion réel.' });
    var EMPTY = { m: 600, x: 0.36 }, ARMS = { av: 0.41, ar: 1.19, bag: 1.90, fuel: 1.12 }, MMAX = 1000, DENS = 0.72;
    var ENV = [[0.33, 550], [0.33, 800], [0.38, 1000], [0.56, 1000], [0.56, 550]];
    var W = 600, H = 420;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Avion chargé et diagramme de centrage' }, L.stage);
    // vue de côté
    var side = S('g', {}, svg);
    sideAircraft(side, 40, 90, 1.12, '#10203f');
    var X = function (arm) { return 40 + (195 + arm * 125) * 1.12 * 0.83; }; // position écran approximative d'un bras
    X = function (arm) { return 205 + arm * 118; };
    S('line', { x1: X(0), y1: 30, x2: X(0), y2: 150, stroke: '#5b6880', 'stroke-dasharray': '3 4' }, side);
    label(side, X(0) + 4, 26, 'référence', '#5b6880', 'start', 11);
    var loads = S('g', {}, svg), cgG = S('g', {}, svg);
    // diagramme
    var gx = 70, gy = 180, gw = 500, gh = 210, x0 = 0.25, x1 = 0.65, m0 = 500, m1 = 1100;
    var GX = function (x) { return gx + (x - x0) / (x1 - x0) * gw; }, GY = function (m) { return gy + gh - (m - m0) / (m1 - m0) * gh; };
    var chart = S('g', {}, svg);
    S('rect', { x: gx, y: gy, width: gw, height: gh, fill: '#fff', stroke: '#dde4ef' }, chart);
    S('polygon', { points: ENV.map(function (q) { return GX(q[0]) + ',' + GY(q[1]); }).join(' '), fill: '#1f9d6a22', stroke: '#1f9d6a', 'stroke-width': 2 }, chart);
    [0.3, 0.4, 0.5, 0.6].forEach(function (v) { label(chart, GX(v), gy + gh + 16, fmt(v, 2) + ' m', '#5b6880', 'middle', 11); });
    [600, 800, 1000].forEach(function (v) { label(chart, gx - 6, GY(v) + 4, v + ' kg', '#5b6880', 'end', 11); S('line', { x1: gx, y1: GY(v), x2: gx + gw, y2: GY(v), stroke: '#dde4ef' }, chart); });
    label(chart, gx + gw / 2, gy - 6, 'Masse en fonction du centrage (position du CG en arrière de la référence)', '#10203f', 'middle', 12);
    var path = S('g', {}, svg);
    var st = { av: 150, ar: 0, bag: 10, fuel: 110, burn: 0 };
    var ctl = L.ctrls;
    B.slider(ctl, { label: 'Places avant (pilote + passager)', min: 60, max: 200, step: 5, value: st.av, fmt: function (v) { return v + ' kg'; }, onInput: function (v) { st.av = v; draw(); } });
    B.slider(ctl, { label: 'Places arrière', min: 0, max: 200, step: 5, value: st.ar, fmt: function (v) { return v + ' kg'; }, onInput: function (v) { st.ar = v; draw(); } });
    B.slider(ctl, { label: 'Bagages', min: 0, max: 60, step: 5, value: st.bag, fmt: function (v) { return v + ' kg'; }, onInput: function (v) { st.bag = v; draw(); } });
    B.slider(ctl, { label: 'Carburant au départ', min: 10, max: 110, step: 5, value: st.fuel, fmt: function (v) { return v + ' L (' + fmt(v * DENS) + ' kg)'; }, onInput: function (v) { st.fuel = v; draw(); } });
    B.slider(ctl, { label: 'Carburant consommé en vol', min: 0, max: 100, step: 5, value: 0, fmt: function (v) { return v + ' L'; }, onInput: function (v) { st.burn = v; draw(); } });
    var set = B.readout(ctl, [['m', 'Masse au décollage'], ['x', 'Centrage au décollage'], ['m2', 'Masse actuelle'], ['x2', 'Centrage actuel']]);
    var verdict = B.h('<div class="verdict"></div>'); ctl.appendChild(verdict);
    function inside(x, m) {
      if (m > MMAX || m < 550) return m > MMAX ? 'lourd' : 'ok';
      var front = m <= 800 ? 0.33 : 0.33 + (m - 800) / 200 * 0.05;
      if (x < front) return 'avant'; if (x > 0.56) return 'arriere'; return 'ok';
    }
    function cg(fuelL) {
      var items = [[EMPTY.m, EMPTY.x], [st.av, ARMS.av], [st.ar, ARMS.ar], [st.bag, ARMS.bag], [Math.max(0, fuelL) * DENS, ARMS.fuel]];
      var m = 0, mo = 0; items.forEach(function (q) { m += q[0]; mo += q[0] * q[1]; });
      return { m: m, x: mo / m };
    }
    function draw() {
      var a = cg(st.fuel), b = cg(st.fuel - st.burn);
      clear(loads);
      [['av', st.av, '👤'], ['ar', st.ar, '👤'], ['bag', st.bag, '🧳'], ['fuel', st.fuel - st.burn, '⛽']].forEach(function (q) {
        if (q[1] <= 0) return;
        var x = X(ARMS[q[0]]);
        S('circle', { cx: x, cy: 76, r: 6 + Math.sqrt(q[1] * (q[0] === 'fuel' ? DENS : 1)) * 0.9, fill: q[0] === 'fuel' ? '#f5a62366' : '#2f6fde44', stroke: q[0] === 'fuel' ? '#f5a623' : '#2f6fde' }, loads);
        label(loads, x, 82, q[2], '#10203f', 'middle', 14);
      });
      clear(cgG);
      var cx = X(b.x);
      S('circle', { cx: cx, cy: 76, r: 11, fill: '#fff', stroke: '#d64541', 'stroke-width': 3 }, cgG);
      S('path', { d: 'M' + cx + ',65 A11,11 0 0 1 ' + (cx + 11) + ',76 L' + cx + ',76Z M' + cx + ',87 A11,11 0 0 1 ' + (cx - 11) + ',76 L' + cx + ',76Z', fill: '#d64541' }, cgG);
      label(cgG, cx, 118, 'CG', '#d64541', 'middle', 13);
      clear(path);
      S('line', { x1: GX(a.x), y1: GY(a.m), x2: GX(b.x), y2: GY(b.m), stroke: '#d64541', 'stroke-width': 2, 'stroke-dasharray': '5 4' }, path);
      S('circle', { cx: GX(a.x), cy: GY(a.m), r: 6, fill: '#fff', stroke: '#d64541', 'stroke-width': 2 }, path);
      S('circle', { cx: GX(clamp(b.x, x0, x1)), cy: GY(clamp(b.m, m0, m1)), r: 8, fill: '#d64541' }, path);
      set('m', fmt(a.m) + ' kg', a.m > MMAX ? 'warn' : '');
      set('x', fmt(a.x, 3) + ' m', inside(a.x, a.m) !== 'ok' ? 'warn' : '');
      set('m2', fmt(b.m) + ' kg');
      set('x2', fmt(b.x, 3) + ' m', inside(b.x, b.m) !== 'ok' ? 'warn' : '');
      var s1 = inside(a.x, a.m), s2 = inside(b.x, b.m);
      if (s1 === 'lourd') { verdict.className = 'verdict bad'; verdict.textContent = 'Trop lourd : ' + fmt(a.m) + ' kg pour 1 000 kg maximum. Décollage interdit : retire du carburant, des bagages ou un passager.'; }
      else if (s1 === 'arriere' || s2 === 'arriere') { verdict.className = 'verdict bad'; verdict.textContent = 'Centrage trop arrière' + (s1 === 'ok' ? ' en fin de vol' : '') + ' : avion instable, sortie de décrochage difficile. Avance la charge.'; }
      else if (s1 === 'avant' || s2 === 'avant') { verdict.className = 'verdict bad'; verdict.textContent = 'Centrage trop avant : la profondeur risque de manquer d’autorité à l’arrondi.'; }
      else { verdict.className = 'verdict good'; verdict.textContent = 'Dans l’enveloppe du décollage à l’atterrissage. Le réservoir étant derrière le CG, le centrage avance quand le carburant brûle.'; }
    }
    draw();
  }

  /* =================== 6. Stabilité longitudinale =================== */
  function tangage() {
    var L = B.lab('lab-tangage', { num: '6', title: 'Stable, neutre ou instable : déplace le centre de gravité',
      hint: 'Fais glisser le centre de gravité (poignée orange) le long du fuselage, puis envoie une rafale. Devant le foyer : l’avion revient seul. Derrière : il diverge. Active les commandes de vol électriques pour sauver un avion instable.',
      takeaway: 'Modèle qualitatif : l’oscillation suit θ″ = −k·marge·θ − c·θ′. La marge statique est la distance CG-foyer rapportée à la corde. Plus elle est grande, plus l’avion est stable et lourd aux commandes.' });
    var W = 600, H = 330, yA = 140, XN = 268, XW = 240, XT = 530, CH = 130;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Stabilité en tangage' }, L.stage);
    S('line', { x1: 0, y1: yA, x2: W, y2: yA, stroke: '#2f6fde33', 'stroke-dasharray': '8 8' }, svg);
    var body = S('g', {}, svg);
    sideAircraft(body, 40, yA, 1.1, '#10203f');
    body.setAttribute('opacity', 1);
    var marks = S('g', {}, body), forces = S('g', {}, body);
    var hnd = S('g', {}, svg); S('circle', { r: 20, class: 'ring' }, hnd); S('circle', { r: 8, fill: '#f5a623' }, hnd);
    // trace temporelle
    var tr = S('g', { transform: 'translate(20,250)' }, svg);
    S('rect', { x: 0, y: 0, width: 560, height: 70, rx: 8, fill: '#fff', stroke: '#dde4ef' }, tr);
    S('line', { x1: 0, y1: 35, x2: 560, y2: 35, stroke: '#dde4ef' }, tr);
    label(tr, 8, 14, 'assiette dans le temps', '#5b6880', 'start', 11);
    var trace = S('path', { fill: 'none', stroke: '#2f6fde', 'stroke-width': 2 }, tr);
    var xcg = 245, th = 0, om = 0, fbw = false, hist = [], lost = false;
    var ctl = L.ctrls;
    var gust = B.h('<button type="button" class="btn amber">💨 Rafale !</button>'); ctl.appendChild(gust);
    B.seg(ctl, [[false, 'Commandes classiques'], [true, 'Commandes de vol électriques']], false, function (v) { fbw = v; draw(); });
    var set = B.readout(ctl, [['m', 'Marge statique'], ['s', 'Comportement'], ['e', 'Effort au manche'], ['q', 'Empennage']]);
    var verdict = B.h('<div class="verdict"></div>'); ctl.appendChild(verdict);
    function margin() { return (XN - xcg) / CH; }
    var anim = B.loop(function (dt) {
      var m = margin(), k = 90 * m, c = 1.1;
      if (fbw) { k += 25; c += 6; }
      var acc = -k * th - c * om;
      om += acc * dt; th += om * dt;
      if (Math.abs(th) > 30) { th = Math.sign(th) * 30; om = 0; lost = true; }
      hist.push(th); if (hist.length > 280) hist.shift();
      paint();
      if (lost) return false;
      return !(Math.abs(th) < 0.05 && Math.abs(om) < 0.05 && hist.length > 30);
    });
    function paint() {
      body.setAttribute('transform', 'rotate(' + (-th * 0.6) + ' ' + xcg + ' ' + yA + ')');
      trace.setAttribute('d', hist.map(function (v, i) { return (i ? 'L' : 'M') + (i * 2) + ',' + (35 - v * 0.9).toFixed(1); }).join(' '));
      if (lost) { verdict.className = 'verdict bad'; verdict.textContent = 'Perte de contrôle : l’avion a divergé. Avance le centre de gravité ou active les commandes de vol électriques, puis relance une rafale.'; }
    }
    function draw() {
      var m = margin();
      hnd.setAttribute('transform', 'translate(' + xcg + ',' + yA + ')');
      clear(marks);
      S('line', { x1: XN, y1: yA - 50, x2: XN, y2: yA + 40, stroke: '#2f6fde', 'stroke-width': 2, 'stroke-dasharray': '4 3' }, marks);
      label(marks, XN + 4, yA - 54, 'foyer', '#2f6fde', 'start', 13);
      S('rect', { x: Math.min(xcg, XN), y: yA + 30, width: Math.abs(XN - xcg), height: 6, fill: m >= 0 ? '#1f9d6a' : '#d64541', rx: 3 }, marks);
      label(marks, xcg, yA + 56, 'CG', '#d64541', 'middle', 13);
      // équilibre : Lw + Lt = W et moments au CG nuls → Lt = W (xcg − XW) / (XT − XW)
      clear(forces);
      var lt = (xcg - XW) / (XT - XW); // fraction du poids
      arrow(forces, XW, yA, XW, yA - 60 * (1 - lt), '#1f9d6a', 4);
      label(forces, XW - 6, yA - 64 * (1 - lt) - 4, 'aile', '#1f9d6a', 'end', 12);
      arrow(forces, XT, yA - 20, XT, yA - 20 - clamp(lt * 300, -70, 70), lt < 0 ? '#d64541' : '#1f9d6a', 4);
      set('m', fmt(m * 100) + ' %', m < 0 ? 'warn' : m > 0.04 ? 'good' : '');
      set('s', m > 0.25 ? 'très stable' : m > 0.04 ? 'stable' : m > -0.02 ? 'neutre' : 'instable', m < -0.02 && !fbw ? 'warn' : '');
      set('e', m > 0.25 ? 'très lourd' : m > 0.1 ? 'normal' : m > 0 ? 'léger, avion vif' : 'quasi nul');
      set('q', lt < -0.005 ? 'pousse vers le bas' : lt > 0.005 ? 'porte vers le haut' : 'neutre');
      if (!lost) {
        if (m < -0.02 && !fbw) { verdict.className = 'verdict bad'; verdict.textContent = 'CG derrière le foyer : avion instable. Une rafale le fera diverger.'; }
        else if (m < -0.02) { verdict.className = 'verdict warn'; verdict.textContent = 'Instable par nature, mais le calculateur le stabilise : c’est le principe des avions de chasse modernes.'; }
        else if (m > 0.25) { verdict.className = 'verdict warn'; verdict.textContent = 'Centrage très avant : très stable mais lourd. À l’atterrissage, la profondeur peut manquer pour l’arrondi.'; }
        else { verdict.className = 'verdict good'; verdict.textContent = 'CG devant le foyer : l’avion revient seul à l’équilibre après une rafale.'; }
      }
    }
    gust.onclick = function () { lost = false; om = 25; anim.start(); draw(); };
    B.drag(svg, hnd, function (pt) { xcg = Math.round(clamp(pt.x, 200, 330)); th = 0; om = 0; lost = false; hist = []; paint(); draw(); });
    hnd.setAttribute('aria-label', 'Position du centre de gravité, flèches gauche et droite');
    hnd.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') { xcg = clamp(xcg - 3, 215, 330); draw(); e.preventDefault(); } if (e.key === 'ArrowRight') { xcg = clamp(xcg + 3, 215, 330); draw(); e.preventDefault(); } });
    draw(); paint();
  }

  /* =================== 7. Dièdre et stabilité latérale =================== */
  function diedre() {
    var L = B.lab('lab-diedre', { num: '7', title: 'Le dièdre : aile haute, aile basse et flèche',
      hint: 'Lève ou baisse le bout d’aile (poignée orange) pour régler le dièdre, choisis aile haute ou basse, ajoute de la flèche, puis envoie une rafale de côté.',
      takeaway: 'Modèle qualitatif : dièdre effectif ≈ dièdre géométrique + environ 5° pour une aile haute + environ 1° par 10° de flèche. Trop peu : l’inclinaison s’aggrave (instabilité spirale). Beaucoup trop : oscillations (roulis hollandais).' });
    var W = 600, H = 320, cx0 = 300, cy0 = 150;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Avion vu de face, dièdre réglable' }, L.stage);
    S('line', { x1: 0, y1: cy0, x2: W, y2: cy0, stroke: '#2f6fde33', 'stroke-dasharray': '8 8' }, svg);
    var plane = S('g', {}, svg);
    var hnd = S('g', {}, svg); S('circle', { r: 20, class: 'ring' }, hnd); S('circle', { r: 7, fill: '#f5a623' }, hnd);
    var tr = S('g', { transform: 'translate(20,245)' }, svg);
    S('rect', { x: 0, y: 0, width: 560, height: 66, rx: 8, fill: '#fff', stroke: '#dde4ef' }, tr);
    S('line', { x1: 0, y1: 33, x2: 560, y2: 33, stroke: '#dde4ef' }, tr);
    label(tr, 8, 14, 'inclinaison dans le temps', '#5b6880', 'start', 11);
    var trace = S('path', { fill: 'none', stroke: '#2f6fde', 'stroke-width': 2 }, tr);
    var gam = 6, high = false, sweep = 0, phi = 0, p = 0, hist = [];
    var ctl = L.ctrls;
    B.seg(ctl, [[false, 'Aile basse (DR400)'], [true, 'Aile haute (Cessna)']], false, function (v) { high = v; draw(); });
    B.slider(ctl, { label: 'Flèche', min: 0, max: 35, step: 1, value: 0, fmt: function (v) { return v + '°'; }, onInput: function (v) { sweep = v; draw(); } });
    var gust = B.h('<button type="button" class="btn amber">💨 Rafale latérale</button>'); ctl.appendChild(gust);
    var set = B.readout(ctl, [['g', 'Dièdre géométrique'], ['e', 'Dièdre effectif']]);
    var verdict = B.h('<div class="verdict"></div>'); ctl.appendChild(verdict);
    function eff() { return gam + (high ? 5 : 0) + sweep / 10; }
    var anim = B.loop(function (dt) {
      var e = eff(), k = 0.35 * e, c = Math.max(0.15, 1.6 - Math.max(0, e - 9) * 0.17);
      var acc = -k * phi - c * p;
      p += acc * dt; phi += p * dt;
      if (Math.abs(phi) > 60) { phi = Math.sign(phi) * 60; p = 0; }
      hist.push(phi); if (hist.length > 280) hist.shift();
      paint();
      return !(Math.abs(phi) < 0.1 && Math.abs(p) < 0.1 && hist.length > 40);
    });
    function paint() {
      plane.setAttribute('transform', 'translate(' + cx0 + ',' + cy0 + ') rotate(' + phi + ')');
      trace.setAttribute('d', hist.map(function (v, i) { return (i ? 'L' : 'M') + (i * 2) + ',' + (33 - v * 0.5).toFixed(1); }).join(' '));
    }
    function draw() {
      clear(plane);
      var wy = high ? -24 : 16, span = 230, tip = span * Math.tan(gam * RAD);
      // fuselage, verrière, dérive, empennage
      S('rect', { x: -6, y: -80, width: 12, height: 60, rx: 4, fill: '#10203f' }, plane);
      S('rect', { x: -70, y: -30, width: 140, height: 6, rx: 3, fill: '#2a4a85' }, plane);
      S('ellipse', { cx: 0, cy: 0, rx: 30, ry: 30, fill: '#10203f' }, plane);
      S('path', { d: 'M-18,-12 Q0,-34 18,-12Z', fill: '#9ec3ff' }, plane);
      // ailes (épaisseur réduite avec la flèche pour suggérer la perspective)
      var th = 9 - sweep / 8;
      S('path', { d: 'M-22,' + wy + ' L' + (-span) + ',' + (wy - tip) + ' L' + (-span) + ',' + (wy - tip + th) + ' L-22,' + (wy + th) + 'Z', fill: '#2a4a85' }, plane);
      S('path', { d: 'M22,' + wy + ' L' + span + ',' + (wy - tip) + ' L' + span + ',' + (wy - tip + th) + ' L22,' + (wy + th) + 'Z', fill: '#2a4a85' }, plane);
      S('rect', { x: -4, y: 24, width: 8, height: 20, fill: '#5b6880' }, plane);
      S('circle', { cx: 0, cy: 50, r: 7, fill: '#10203f' }, plane);
      hnd.setAttribute('transform', 'translate(' + (cx0 + span) + ',' + (cy0 + wy - tip + th / 2) + ')');
      var e = eff();
      set('g', fmt(gam) + '°');
      set('e', fmt(e, 1) + '°', e <= 0 ? 'warn' : e > 12 ? 'warn' : 'good');
      if (e <= 0) { verdict.className = 'verdict bad'; verdict.textContent = 'Pas d’effet dièdre : après une rafale, l’inclinaison reste ou s’aggrave (instabilité spirale).'; }
      else if (e > 12) { verdict.className = 'verdict warn'; verdict.textContent = 'Effet dièdre excessif : l’avion se redresse en oscillant, roulis hollandais possible. D’où l’anhédral des avions de ligne à aile haute en flèche.'; }
      else { verdict.className = 'verdict good'; verdict.textContent = 'Effet dièdre suffisant : l’avion se redresse seul après une rafale.'; }
      paint();
    }
    gust.onclick = function () { p = 40; hist = []; anim.start(); };
    B.drag(svg, hnd, function (pt) { var span = 230, wy = high ? -24 : 16; gam = Math.round(clamp(Math.atan2((cy0 + wy) - pt.y, span) / RAD, -10, 15)); draw(); });
    hnd.setAttribute('aria-label', 'Dièdre, flèches haut et bas');
    hnd.addEventListener('keydown', function (e) { if (e.key === 'ArrowUp') { gam = clamp(gam + 1, -10, 15); draw(); e.preventDefault(); } if (e.key === 'ArrowDown') { gam = clamp(gam - 1, -10, 15); draw(); e.preventDefault(); } });
    draw();
  }

  /* =================== 8. Montgolfière =================== */
  function montgolfiere() {
    var L = B.lab('lab-montgolfiere', { num: '8', title: 'La montgolfière : Archimède à l’œuvre',
      hint: 'Maintiens le bouton du brûleur pour chauffer l’air de l’enveloppe. Relâche : l’air refroidit. Le ballon cherche l’altitude où la poussée d’Archimède égale son poids.',
      takeaway: 'Force nette = (ρ air extérieur − ρ air chaud) × volume × g − poids. L’air se raréfie en altitude : la poussée diminue, d’où une altitude d’équilibre. Modèle simplifié en atmosphère standard.' });
    var W = 600, H = 360, top = 30, bottom = 320, HMAX = 5000;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Montgolfière' }, L.stage);
    S('rect', { x: 0, y: bottom, width: W, height: H - bottom, fill: '#8fc27a' }, svg);
    [0, 1000, 2000, 3000, 4000, 5000].forEach(function (a) { var y = bottom - a / HMAX * (bottom - top); S('line', { x1: 0, y1: y, x2: 40, y2: y, stroke: '#5b6880' }, svg); label(svg, 44, y + 4, fmt(a) + ' m', '#5b6880', 'start', 11); });
    var eqL = S('line', { x1: 380, x2: 600, stroke: '#1f9d6a', 'stroke-dasharray': '5 5', 'stroke-width': 2 }, svg);
    var eqT = label(svg, 596, 0, 'équilibre', '#1f9d6a', 'end', 11);
    var bal = S('g', {}, svg);
    var env = S('path', { d: 'M0,-120 C55,-120 70,-70 50,-40 C38,-22 22,-8 16,0 L-16,0 C-22,-8 -38,-22 -50,-40 C-70,-70 -55,-120 0,-120Z', fill: '#d64541' }, bal);
    S('path', { d: 'M0,-120 C20,-118 24,-60 6,0 L-6,0 C-24,-60 -20,-118 0,-120Z', fill: '#f5a623' }, bal);
    S('line', { x1: -16, y1: 0, x2: -12, y2: 18, stroke: '#5b6880' }, bal); S('line', { x1: 16, y1: 0, x2: 12, y2: 18, stroke: '#5b6880' }, bal);
    S('rect', { x: -14, y: 18, width: 28, height: 18, rx: 3, fill: '#8a5a2b' }, bal);
    var flame = S('path', { d: 'M0,2 C6,-8 3,-16 0,-24 C-3,-16 -6,-8 0,2Z', fill: '#f5a623', opacity: 0 }, bal);
    var st = { T: 60, V: 2500, m: 550, h: 0, vz: 0, burn: false };
    var ctl = L.ctrls;
    var burner = B.h('<button type="button" class="btn amber" style="min-height:56px;font-size:16px">🔥 Maintiens pour chauffer</button>'); ctl.appendChild(burner);
    B.slider(ctl, { label: 'Volume de l’enveloppe', min: 1500, max: 4000, step: 100, value: st.V, fmt: function (v) { return fmt(v) + ' m³'; }, onInput: function (v) { st.V = v; } });
    B.slider(ctl, { label: 'Masse totale (enveloppe, nacelle, passagers)', min: 300, max: 900, step: 10, value: st.m, fmt: function (v) { return v + ' kg'; }, onInput: function (v) { st.m = v; } });
    var set = B.readout(ctl, [['t', 'Air chaud'], ['r1', 'ρ extérieur'], ['r2', 'ρ air chaud'], ['f', 'Force nette'], ['h', 'Altitude'], ['e', 'Équilibre']]);
    function net(h) { var a = B.isa(h), ri = a.P / (287.05 * (st.T + 273.15)); return { F: (a.rho - ri) * st.V * G - st.m * G, ro: a.rho, ri: ri }; }
    function eqAlt() { if (net(0).F <= 0) return 0; var lo = 0, hi = 6000; if (net(hi).F > 0) return hi; for (var i = 0; i < 30; i++) { var mid = (lo + hi) / 2; if (net(mid).F > 0) lo = mid; else hi = mid; } return lo; }
    var anim = B.loop(function (dt) {
      st.T = clamp(st.T + (st.burn ? 6 : -0.8) * dt, 15, 120);
      var n = net(st.h), mass = st.m + st.V * n.ri;
      var acc = n.F / mass - 0.3 * st.vz;
      st.vz += acc * dt; st.h += st.vz * dt * 40; // temps accéléré
      if (st.h <= 0) { st.h = 0; if (st.vz < 0) st.vz = 0; }
      if (st.h > 6000) { st.h = 6000; st.vz = 0; }
      var y = bottom - Math.min(st.h, HMAX) / HMAX * (bottom - top) - 36;
      bal.setAttribute('transform', 'translate(300,' + y.toFixed(1) + ')');
      flame.setAttribute('opacity', st.burn ? 1 : 0);
      var e = eqAlt(), ye = bottom - Math.min(e, HMAX) / HMAX * (bottom - top);
      eqL.setAttribute('y1', ye); eqL.setAttribute('y2', ye); eqT.setAttribute('y', ye - 4);
      set('t', fmt(st.T) + ' °C');
      set('r1', fmt(n.ro, 3) + ' kg/m³'); set('r2', fmt(n.ri, 3) + ' kg/m³');
      set('f', (n.F >= 0 ? '+' : '') + fmt(n.F / 10) + ' daN', n.F >= 0 ? 'good' : 'warn');
      set('h', fmt(st.h) + ' m'); set('e', e > 0 ? fmt(e) + ' m' : 'au sol');
      return true;
    });
    function on(e) { st.burn = true; e.preventDefault(); }
    function off() { st.burn = false; }
    burner.addEventListener('pointerdown', on); burner.addEventListener('pointerup', off); burner.addEventListener('pointerleave', off); burner.addEventListener('pointercancel', off);
    burner.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') on(e); }); burner.addEventListener('keyup', off);
    burner.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) anim.start(); else anim.stop(); }); }).observe(L.el);
    else anim.start();
  }

  function init() {
    soufflerie(); polaire(); virage(); gouvernes(); centrage(); tangage(); diedre(); montgolfiere();
    B.quiz(document.getElementById('quiz'), window.QAERO || []);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
