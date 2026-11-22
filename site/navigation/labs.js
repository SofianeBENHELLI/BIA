/* Ateliers interactifs du domaine Navigation. Repère : nord en haut, angles en degrés depuis le nord, sens horaire. */
(function () {
  'use strict';
  var B = window.BIA, S = B.svg, T = B.text, fmt = B.fmt, clamp = B.clamp, RAD = Math.PI / 180;
  function norm(a) { a = a % 360; return a < 0 ? a + 360 : a; }
  function d3(a) { a = Math.round(norm(a)); if (a === 0) a = 360; return String(a).padStart(3, '0'); }
  function vec(deg, len) { return [Math.sin(deg * RAD) * len, -Math.cos(deg * RAD) * len]; }

  /* =================== 1. Triangle des vitesses =================== */
  function triangle() {
    var L = B.lab('lab-triangle', { num: '1', title: 'Le triangle des vitesses', hint: 'Oriente ta route en faisant glisser la poignée orange. Règle le vent et ta vitesse propre : le dessin montre le cap à prendre et ta vitesse sol.', takeaway: 'Calcul exact par les vecteurs, comparé aux formules du BIA : Xmax = vent × 60 / Vp et X ≈ Xmax × sin(angle vent-route).' });
    var W = 600, H = 400, ax = 170, ay = 300, SC = 1.6;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Triangle des vitesses' }, L.stage);
    T(svg, 20, 28, 'N ↑', '#10203f', 'start', 16);
    var g = S('g', {}, svg), hnd = B.handle(svg);
    var st = { R: 60, wd: 330, ws: 20, vp: 100 };
    var ctl = L.ctrls;
    B.slider(ctl, { label: 'Vitesse propre Vp', min: 60, max: 180, step: 5, value: st.vp, fmt: function (v) { return v + ' kt'; }, onInput: function (v) { st.vp = v; draw(); } });
    B.slider(ctl, { label: 'Vent : d’où il vient', min: 0, max: 355, step: 5, value: st.wd, fmt: function (v) { return d3(v) + '°'; }, onInput: function (v) { st.wd = v; draw(); } });
    B.slider(ctl, { label: 'Vent : force', min: 0, max: 50, step: 1, value: st.ws, fmt: function (v) { return v + ' kt'; }, onInput: function (v) { st.ws = v; draw(); } });
    var set = B.readout(ctl, [['r', 'Route vraie'], ['h', 'Cap vrai à prendre'], ['x', 'Correction de dérive'], ['gs', 'Vitesse sol'], ['t', 'Temps pour 60 NM'], ['bia', 'Formule BIA']]);
    var verdict = B.h('<div class="verdict"></div>'); ctl.appendChild(verdict);
    function draw() {
      var wt = st.wd + 180, s = st.ws / st.vp * Math.sin((st.wd - st.R) * RAD);
      B.clear(g);
      // route
      var re = vec(st.R, 260);
      S('line', { x1: ax, y1: ay, x2: ax + re[0], y2: ay + re[1], stroke: '#5b6880', 'stroke-dasharray': '8 6', 'stroke-width': 2 }, g);
      T(g, ax + re[0] * 1.02, ay + re[1] * 1.02 - 6, 'route ' + d3(st.R) + '°', '#5b6880', 'middle', 12);
      if (Math.abs(s) >= 1) {
        verdict.className = 'verdict bad'; verdict.textContent = 'Vent trop fort pour cette vitesse : impossible de tenir la route.';
        hnd.setAttribute('transform', 'translate(' + (ax + re[0]) + ',' + (ay + re[1]) + ')'); return;
      }
      var X = Math.asin(s) / RAD, Hd = st.R + X;
      var gs = st.vp * Math.cos(X * RAD) + st.ws * Math.cos((wt - st.R) * RAD);
      var a = vec(Hd, st.vp * SC), w = vec(wt, st.ws * SC);
      B.arrow(g, ax, ay, ax + a[0], ay + a[1], '#2f6fde', 4);
      B.arrow(g, ax + a[0], ay + a[1], ax + a[0] + w[0], ay + a[1] + w[1], '#1f9d6a', 4);
      B.arrow(g, ax, ay, ax + a[0] + w[0], ay + a[1] + w[1], '#d64541', 4);
      T(g, ax + a[0] / 2 - 10, ay + a[1] / 2 - 10, 'cap, Vp', '#2f6fde', 'end', 12);
      T(g, ax + a[0] + w[0] / 2 + 8, ay + a[1] + w[1] / 2, 'vent', '#1f9d6a', 'start', 12);
      var gx = ax + (a[0] + w[0]) / 2, gy = ay + (a[1] + w[1]) / 2;
      T(g, gx + 10, gy + 18, 'route, Vs', '#d64541', 'start', 12);
      // manche à air : le vent vient de wd
      var wc = vec(st.wd, 60), w2 = vec(st.wd, 25);
      B.arrow(g, 520 + wc[0], 80 + wc[1], 520 + w2[0] * -0.2, 80 + w2[1] * -0.2, '#1f9d6a', 3);
      S('circle', { cx: 520, cy: 80, r: 62, fill: 'none', stroke: '#dde4ef' }, g);
      T(g, 520, 160, 'vent du ' + d3(st.wd) + '°', '#1f9d6a', 'middle', 12);
      hnd.setAttribute('transform', 'translate(' + (ax + re[0]) + ',' + (ay + re[1]) + ')');
      var xmax = st.ws * 60 / st.vp, xa = xmax * Math.sin((st.wd - st.R) * RAD);
      set('r', d3(st.R) + '°'); set('h', d3(Hd) + '°');
      set('x', (X >= 0 ? '+' : '−') + fmt(Math.abs(X)) + '° ' + (Math.abs(X) < 0.5 ? '' : X > 0 ? '(vers la droite)' : '(vers la gauche)'));
      set('gs', fmt(gs) + ' kt', gs < st.vp - 2 ? 'warn' : gs > st.vp + 2 ? 'good' : '');
      set('t', fmt(60 / gs * 60) + ' min');
      set('bia', 'Xmax ' + fmt(xmax) + '°, X ≈ ' + fmt(Math.abs(xa)) + '°');
      var head = st.ws * Math.cos((st.wd - st.R) * RAD);
      verdict.className = 'verdict'; verdict.textContent = (Math.abs(head) < 2 ? 'Vent de travers pur. ' : head > 0 ? 'Composante de vent de face : ' + fmt(head) + ' kt. ' : 'Composante de vent arrière : ' + fmt(-head) + ' kt. ') + (Math.abs(X) >= 1 ? 'Le vent vient de ' + (X > 0 ? 'droite' : 'gauche') + ' : on corrige en mettant le nez ' + fmt(Math.abs(X)) + '° vers la ' + (X > 0 ? 'droite' : 'gauche') + '.' : 'Pas de correction de dérive.');
    }
    B.drag(svg, hnd, function (p) { st.R = Math.round(norm(Math.atan2(p.x - ax, -(p.y - ay)) / RAD) / 5) * 5; draw(); });
    hnd.setAttribute('aria-label', 'Route, flèches pour tourner');
    hnd.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { st.R = norm(st.R + 5); draw(); e.preventDefault(); } if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { st.R = norm(st.R - 5); draw(); e.preventDefault(); } });
    draw();
  }

  /* =================== 2. Piste et vent =================== */
  function piste() {
    var L = B.lab('lab-piste', { num: '2', title: 'Quelle piste avec ce vent ?', hint: 'Fais tourner la piste avec la poignée orange et règle le vent. Lis le numéro de chaque extrémité, et les composantes de vent de face et de travers.', takeaway: 'Numéro = orientation magnétique / 10 ; l’autre bout vaut ± 18. Vent de face = vent × cos(angle) ; vent de travers = vent × sin(angle). Vent de travers démontré du DR400/180 : 22 kt.' });
    var W = 600, H = 400, cx = 300, cy = 200;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Piste et rose des vents' }, L.stage);
    S('circle', { cx: cx, cy: cy, r: 170, fill: '#8fc27a33', stroke: '#dde4ef' }, svg);
    ['N', 'E', 'S', 'O'].forEach(function (c, i) { var v = vec(i * 90, 185); T(svg, cx + v[0], cy + v[1] + 5, c, '#5b6880', 'middle', 14); });
    var rw = S('g', {}, svg), wind = S('g', {}, svg), hnd = B.handle(svg);
    var st = { q: 260, wd: 230, ws: 15, par: false };
    B.slider(L.ctrls, { label: 'Vent : d’où il vient', min: 0, max: 355, step: 5, value: st.wd, fmt: function (v) { return d3(v) + '°'; }, onInput: function (v) { st.wd = v; draw(); } });
    B.slider(L.ctrls, { label: 'Vent : force', min: 0, max: 35, step: 1, value: st.ws, fmt: function (v) { return v + ' kt'; }, onInput: function (v) { st.ws = v; draw(); } });
    B.seg(L.ctrls, [[false, 'Piste unique'], [true, 'Pistes parallèles']], false, function (v) { st.par = v; draw(); });
    var set = B.readout(L.ctrls, [['a', 'Extrémité 1'], ['b', 'Extrémité 2']]);
    var verdict = B.h('<div class="verdict"></div>'); L.ctrls.appendChild(verdict);
    function num(q) { var n = Math.round(norm(q) / 10); if (n === 0) n = 36; return String(n).padStart(2, '0'); }
    function comp(q) { var a = (st.wd - q) * RAD; return { h: st.ws * Math.cos(a), x: st.ws * Math.sin(a) }; }
    function draw() {
      B.clear(rw); B.clear(wind);
      var q1 = st.q, q2 = norm(st.q + 180), offs = st.par ? [-22, 22] : [0];
      offs.forEach(function (o, i) {
        var g = S('g', { transform: 'translate(' + cx + ',' + cy + ') rotate(' + q1 + ') translate(' + o + ',0)' }, rw);
        S('rect', { x: -16, y: -140, width: 32, height: 280, fill: '#3a4152' }, g);
        for (var k = -110; k <= 110; k += 30) S('rect', { x: -2, y: k, width: 4, height: 14, fill: '#fff' }, g);
        var lr = st.par ? (i === 0 ? 'L' : 'R') : '', lr2 = st.par ? (i === 0 ? 'R' : 'L') : '';
        T(g, 0, 128, num(q1) + lr, '#fff', 'middle', 14);
        var t2 = T(g, 0, -116, num(q2) + lr2, '#fff', 'middle', 14); t2.setAttribute('transform', 'rotate(180 0 -121)');
      });
      var a = vec(st.wd, 160), b = vec(st.wd, 60);
      B.arrow(wind, cx + a[0], cy + a[1], cx + b[0], cy + b[1], '#1f9d6a', 5);
      T(wind, cx + a[0], cy + a[1] - 8, d3(st.wd) + '° / ' + st.ws + ' kt', '#1f9d6a', 'middle', 13);
      var h = vec(q2, 150); hnd.setAttribute('transform', 'translate(' + (cx + h[0]) + ',' + (cy + h[1]) + ')');
      var c1 = comp(q1), c2 = comp(q2);
      function txt(c) { return (c.h >= 0 ? 'face ' : 'arrière ') + fmt(Math.abs(c.h)) + ' kt, travers ' + fmt(Math.abs(c.x)) + ' kt'; }
      set('a', 'piste ' + num(q1) + ' : ' + txt(c1), c1.h < 0 ? 'warn' : ''); set('b', 'piste ' + num(q2) + ' : ' + txt(c2), c2.h < 0 ? 'warn' : '');
      var best = c1.h >= c2.h ? [num(q1), c1] : [num(q2), c2];
      if (Math.abs(best[1].x) > 22) { verdict.className = 'verdict bad'; verdict.textContent = 'Piste ' + best[0] + ' face au vent, mais ' + fmt(Math.abs(best[1].x)) + ' kt de travers : au-delà des 22 kt démontrés du DR400/180. Cherche un autre terrain.'; }
      else { verdict.className = 'verdict good'; verdict.textContent = 'On choisit la piste ' + best[0] + ' : ' + (best[1].h > 0.5 ? fmt(best[1].h) + ' kt de vent de face' : 'vent de travers pur') + (Math.abs(best[1].x) > 0.5 ? ', ' + fmt(Math.abs(best[1].x)) + ' kt de travers venant de la ' + (best[1].x > 0 ? 'droite' : 'gauche') : '') + '. QFU ' + d3(best[0] === num(q1) ? q1 : q2) + '°.'; }
    }
    B.drag(svg, hnd, function (p) { st.q = Math.round(norm(Math.atan2(p.x - cx, -(p.y - cy)) / RAD + 180) / 10) * 10; draw(); });
    hnd.setAttribute('aria-label', 'Orientation de la piste, flèches pour tourner');
    hnd.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { st.q = norm(st.q + 10); draw(); e.preventDefault(); } if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { st.q = norm(st.q - 10); draw(); e.preventDefault(); } });
    draw();
  }

  /* =================== 3. Déclinaison et niveaux VFR =================== */
  function niveaux() {
    var L = B.lab('lab-niveaux', { num: '3', title: 'Route magnétique et niveau de croisière', hint: 'Règle la route vraie et la déclinaison, puis touche un niveau de croisière : est-il correct pour ta route magnétique ?', takeaway: 'Au-dessus de 3 000 ft sol en VFR : route magnétique de 000 à 179°, milliers impairs + 500 ft ; de 180 à 359°, milliers pairs + 500 ft. Au-dessus de l’altitude de transition, on parle en niveaux de vol (FL).' });
    var W = 600, H = 300, cx = 150, cy = 150;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Rose des routes magnétiques' }, L.stage);
    S('path', { d: 'M' + cx + ',' + (cy - 120) + ' A120,120 0 0 1 ' + cx + ',' + (cy + 120) + 'Z', fill: '#2f6fde22' }, svg);
    S('path', { d: 'M' + cx + ',' + (cy - 120) + ' A120,120 0 0 0 ' + cx + ',' + (cy + 120) + 'Z', fill: '#f5a62322' }, svg);
    T(svg, cx + 60, cy, 'impairs + 500', '#2f6fde', 'middle', 12); T(svg, cx - 60, cy, 'pairs + 500', '#b37400', 'middle', 12);
    T(svg, cx, cy - 128, '000', '#5b6880', 'middle', 11); T(svg, cx, cy + 138, '180', '#5b6880', 'middle', 11);
    var arr = S('g', {}, svg), info = S('g', {}, svg);
    var st = { rv: 95, dm: 2 };
    B.slider(L.ctrls, { label: 'Route vraie', min: 0, max: 355, step: 5, value: st.rv, fmt: function (v) { return d3(v) + '°'; }, onInput: function (v) { st.rv = v; draw(); } });
    B.slider(L.ctrls, { label: 'Déclinaison', min: -5, max: 5, step: 1, value: st.dm, fmt: function (v) { return v === 0 ? 'nulle' : Math.abs(v) + '° ' + (v > 0 ? 'Est' : 'Ouest'); }, onInput: function (v) { st.dm = v; draw(); } });
    var lv = B.h('<div class="seg" aria-label="Niveaux de croisière"></div>'); L.ctrls.appendChild(lv);
    var verdict = B.h('<div class="verdict">Touche un niveau.</div>'); L.ctrls.appendChild(verdict);
    var LEVELS = [3500, 4500, 5500, 6500, 'FL75', 'FL85', 'FL95', 'FL105'];
    function rm() { return norm(st.rv - st.dm); }
    function draw() {
      B.clear(arr); B.clear(info);
      var m = rm(), v = vec(m, 110);
      B.arrow(arr, cx, cy, cx + v[0], cy + v[1], '#d64541', 4);
      T(info, 330, 80, 'Route vraie ' + d3(st.rv) + '°', '#10203f', 'start', 16);
      T(info, 330, 110, (st.dm > 0 ? '− ' + st.dm + '° Est' : st.dm < 0 ? '+ ' + (-st.dm) + '° Ouest' : 'déclinaison nulle'), '#5b6880', 'start', 14);
      T(info, 330, 145, 'Route magnétique ' + d3(m) + '°', '#d64541', 'start', 18);
      T(info, 330, 180, m < 180 ? 'Niveaux impairs + 500 ft' : 'Niveaux pairs + 500 ft', m < 180 ? '#2f6fde' : '#b37400', 'start', 15);
      lv.innerHTML = '';
      LEVELS.forEach(function (l) {
        var ft = typeof l === 'number' ? l : +l.slice(2) * 100, odd = Math.floor(ft / 1000) % 2 === 1, ok = (m < 180) === odd;
        var b = B.h('<button type="button">' + (typeof l === 'number' ? fmt(l) + ' ft' : l) + '</button>');
        b.onclick = function () { verdict.className = 'verdict ' + (ok ? 'good' : 'bad'); verdict.textContent = (ok ? 'Correct : ' : 'Non : ') + (typeof l === 'number' ? fmt(l) + ' ft' : l) + ' correspond à des milliers ' + (odd ? 'impairs' : 'pairs') + ' + 500, pour une route magnétique ' + (odd ? 'de 000 à 179°.' : 'de 180 à 359°.'); };
        lv.appendChild(b);
      });
    }
    draw();
  }

  /* =================== 4. Espaces aériens =================== */
  var ZONES = [
    { id: 'P', x: [30, 80], y: [0, 3000], c: '#d64541', n: 'Zone P (interdite)', d: 'Interdite en permanence, par exemple au-dessus d’une centrale nucléaire. On la contourne.' },
    { id: 'R', x: [480, 570], y: [0, 4500], c: '#f5a623', n: 'Zone R (réglementée)', d: 'Accès réglementé quand elle est active (tirs, entraînement militaire). Se renseigner, souvent contact radio et autorisation nécessaires.' },
    { id: 'CTR', x: [230, 340], y: [0, 2000], c: '#2f6fde', n: 'CTR de classe D', d: 'Zone de contrôle autour de l’aérodrome, depuis le sol. Contact radio et clairance obligatoires avant d’entrer, transpondeur selon les cas.' },
    { id: 'TMA', x: [150, 420], y: [2000, 6500], c: '#5b8de8', n: 'TMA de classe D', d: 'Région de contrôle terminale, au-dessus de la CTR, pour les arrivées et départs. Clairance obligatoire en VFR.' },
    { id: 'E', x: [0, 600], y: [5500, 9000], c: '#9aa8c4', n: 'Espace de classe E', d: 'Contrôlé pour les vols aux instruments. En VFR, on y entre sans clairance ; on respecte les minima VMC.' },
    { id: 'G', x: [0, 600], y: [0, 5500], c: '#1f9d6a', n: 'Espace de classe G', d: 'Non contrôlé. Voir et éviter, minima VMC, pas de clairance. C’est là que vole souvent l’aviation légère près du sol.' }
  ];
  function espaces() {
    var L = B.lab('lab-espaces', { num: '4', title: 'Où suis-je, et qu’ai-je le droit de faire ?', hint: 'Fais glisser l’avion (poignée orange) dans la coupe de l’espace aérien. Exemple fictif inspiré d’une carte au 1/500 000.', takeaway: 'Avant chaque navigation, on trace sa route sur la carte au 1/500 000 et on note les espaces traversés, leurs plafonds, leurs planchers et leurs fréquences.' });
    var W = 600, H = 340, GY = 300, HMAX = 9000;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Coupe verticale de l’espace aérien' }, L.stage);
    var py = function (ft) { return GY - ft / HMAX * (GY - 20); };
    ZONES.slice().reverse().forEach(function (z) { if (z.id === 'G' || z.id === 'E') { S('rect', { x: z.x[0], y: py(z.y[1]), width: z.x[1] - z.x[0], height: py(z.y[0]) - py(z.y[1]), fill: z.c, opacity: 0.12 }, svg); } });
    ZONES.forEach(function (z) { if (z.id !== 'G' && z.id !== 'E') { S('rect', { x: z.x[0], y: py(z.y[1]), width: z.x[1] - z.x[0], height: py(z.y[0]) - py(z.y[1]), fill: z.c, opacity: 0.25, stroke: z.c, 'stroke-width': 2 }, svg); T(svg, (z.x[0] + z.x[1]) / 2, py(z.y[1]) + 16, z.id, z.c, 'middle', 14); } });
    T(svg, 590, py(8500), 'E', '#5b6880', 'end', 14); T(svg, 590, py(800), 'G', '#1f9d6a', 'end', 14);
    S('rect', { x: 0, y: GY, width: W, height: H - GY, fill: '#8fc27a' }, svg);
    S('rect', { x: 265, y: GY - 4, width: 40, height: 6, fill: '#3a4152' }, svg); T(svg, 285, GY + 20, 'aérodrome contrôlé', '#10203f', 'middle', 11);
    [0, 3000, 6000, 9000].forEach(function (a) { T(svg, 4, py(a) - 2, fmt(a) + ' ft', '#5b6880', 'start', 10); });
    var plane = S('g', {}, svg); S('path', { d: 'M-16,0 L12,-3 L16,0 L12,3Z M-2,-2 L3,-12 L7,-12 L5,-2Z', fill: '#10203f' }, plane);
    var hnd = B.handle(svg);
    var st = { x: 120, a: 2500 };
    var set = B.readout(L.ctrls, [['z', 'Espace'], ['a', 'Altitude']]);
    var verdict = B.h('<div class="verdict"></div>'); L.ctrls.appendChild(verdict);
    function zoneAt(x, a) { for (var i = 0; i < ZONES.length; i++) { var z = ZONES[i]; if (x >= z.x[0] && x <= z.x[1] && a >= z.y[0] && a < z.y[1]) return z; } return ZONES[ZONES.length - 1]; }
    function draw() {
      var y = py(st.a);
      plane.setAttribute('transform', 'translate(' + st.x + ',' + y + ')'); hnd.setAttribute('transform', 'translate(' + st.x + ',' + y + ')');
      var z = zoneAt(st.x, st.a);
      set('z', z.n, z.id === 'P' ? 'warn' : ''); set('a', fmt(st.a) + ' ft');
      verdict.className = 'verdict ' + (z.id === 'P' ? 'bad' : z.id === 'G' || z.id === 'E' ? 'good' : 'warn'); verdict.textContent = z.d;
    }
    B.drag(svg, hnd, function (p) { st.x = clamp(p.x, 10, 590); st.a = Math.round(clamp((GY - p.y) / (GY - 20) * HMAX, 500, 8800) / 100) * 100; draw(); });
    hnd.setAttribute('aria-label', 'Position de l’avion, flèches pour déplacer');
    hnd.addEventListener('keydown', function (e) { var d = { ArrowLeft: [-15, 0], ArrowRight: [15, 0], ArrowUp: [0, 300], ArrowDown: [0, -300] }[e.key]; if (d) { st.x = clamp(st.x + d[0], 10, 590); st.a = clamp(st.a + d[1], 500, 8800); draw(); e.preventDefault(); } });
    draw();
  }

  /* =================== 5. Feux de position, la nuit =================== */
  function feux() {
    var L = B.lab('lab-feux', { num: '5', title: 'La nuit : dans quel sens va cet avion ?', hint: 'Tu ne vois que ses feux. Rouge à gauche, vert à droite, blanc à l’arrière : déduis sa direction.', takeaway: 'Face à toi, tu vois son vert à ta gauche et son rouge à ta droite. De dos : rouge à gauche, vert à droite et le feu blanc arrière. Vu de côté : un seul feu de couleur.' });
    var W = 600, H = 260;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Ciel de nuit avec des feux d’avion' }, L.stage);
    S('rect', { width: W, height: H, fill: '#060b18' }, svg);
    for (var i = 0; i < 50; i++) S('circle', { cx: (i * 83) % W, cy: (i * 41) % 200, r: 0.8, fill: '#fff', opacity: 0.6 }, svg);
    S('rect', { x: 0, y: 220, width: W, height: 40, fill: '#0d1a12' }, svg);
    var lights = S('g', {}, svg);
    var CASES = [['vers toi', [['#1fd17a', -70], ['#ff4040', 70]]], ['s’éloigne de toi', [['#ff4040', -70], ['#1fd17a', 70], ['#ffffff', 0]]], ['va vers ta droite', [['#1fd17a', 0]]], ['va vers ta gauche', [['#ff4040', 0]]]];
    var score = 0, n = 0, cur;
    var box = B.h('<div class="choices"></div>'); L.ctrls.appendChild(box);
    var set = B.readout(L.ctrls, [['s', 'Score']]);
    var verdict = B.h('<div class="verdict">Quelle est sa direction ?</div>'); L.ctrls.appendChild(verdict);
    var next = B.h('<button type="button" class="btn primary">Un autre avion →</button>'); L.ctrls.appendChild(next);
    function q() {
      cur = CASES[Math.floor(Math.random() * 4)];
      B.clear(lights);
      var x0 = 200 + Math.random() * 200, y0 = 90 + Math.random() * 60;
      cur[1].forEach(function (l) { S('circle', { cx: x0 + l[1], cy: y0, r: 7, fill: l[0] }, lights); S('circle', { cx: x0 + l[1], cy: y0, r: 18, fill: l[0], opacity: 0.18 }, lights); });
      var flash = S('circle', { cx: x0, cy: y0 - 12, r: 4, fill: '#ff4040' }, lights);
      flash.innerHTML = '<animate attributeName="opacity" values="1;0;0;1" dur="1.2s" repeatCount="indefinite"/>';
      box.innerHTML = '';
      CASES.forEach(function (c, k) {
        var b = B.h('<button type="button" class="choice"><b>' + 'ABCD'[k] + '</b><span>Il ' + c[0] + '</span></button>');
        b.onclick = function () {
          [].forEach.call(box.children, function (x, j) { x.disabled = true; if (CASES[j] === cur) x.classList.add('right'); });
          n++; if (c === cur) score++; else b.classList.add('wrong');
          set('s', score + ' / ' + n);
          verdict.className = 'verdict ' + (c === cur ? 'good' : 'bad');
          verdict.textContent = { 'vers toi': 'Vert à ta gauche, rouge à ta droite : il te fait face. Attention, risque de collision : chacun oblique à droite.', 's’éloigne de toi': 'Rouge à gauche, vert à droite et le feu blanc arrière : tu le vois de dos.', 'va vers ta droite': 'Seul le vert est visible : tu vois son aile droite, il va vers ta droite.', 'va vers ta gauche': 'Seul le rouge est visible : tu vois son aile gauche, il va vers ta gauche.' }[cur[0]];
        };
        box.appendChild(b);
      });
    }
    next.onclick = q; set('s', '0 / 0'); q();
  }

  /* =================== 6. Calcul mental =================== */
  function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
  var GEN = [
    function () { var t = rnd([6, 12, 15, 20, 30, 45]), v = rnd([60, 80, 90, 100, 120, 150, 180]); return { q: 'Tu voles ' + t + ' minutes à ' + v + ' kt. Distance parcourue, en NM ?', a: v * t / 60, tol: 0, e: v + ' × ' + t + ' / 60 = ' + fmt(v * t / 60, (v * t) % 60 ? 1 : 0) + ' NM.' }; },
    function () { var v = rnd([60, 90, 120, 180]), d = rnd([15, 30, 45, 60, 90]); return { q: d + ' NM à ' + v + ' kt : combien de minutes ?', a: d * 60 / v, tol: 0, e: 'Fb = 60 / ' + v + ' = ' + fmt(60 / v, 2) + ' min/NM, donc ' + d + ' × ' + fmt(60 / v, 2) + ' = ' + fmt(d * 60 / v, 1) + ' min.' }; },
    function () { var f = rnd([1000, 1500, 2000, 3000, 5000, 10000]); return { q: f + ' ft, c’est environ combien de mètres ?', a: f * 0.3048, tol: 0.06, e: '1 ft ≈ 0,3 m : ' + f + ' ft ≈ ' + fmt(f * 0.3048) + ' m.' }; },
    function () { var k = rnd([50, 80, 100, 120, 150, 200]); return { q: k + ' kt, c’est environ combien de km/h ?', a: k * 1.852, tol: 0.05, e: '1 kt = 1,852 km/h : ' + k + ' kt ≈ ' + fmt(k * 1.852) + ' km/h. Astuce : × 2 moins 10 %.' }; },
    function () { var r = rnd([1, 3, 5, 7, 9, 11, 14, 18, 22, 25, 27, 30, 33, 36]), o = r > 18 ? r - 18 : r + 18; return { q: 'Piste ' + String(r).padStart(2, '0') + ' : quel est le numéro de l’autre extrémité ?', a: o, tol: 0, e: String(r).padStart(2, '0') + (r > 18 ? ' − 18' : ' + 18') + ' = ' + String(o).padStart(2, '0') + '.' }; },
    function () { var w = rnd([10, 15, 20, 30]), v = rnd([60, 100, 120, 150]); return { q: 'Vent ' + w + ' kt, vitesse propre ' + v + ' kt : dérive maximale Xmax, en degrés ?', a: w * 60 / v, tol: 0.05, e: 'Xmax = ' + w + ' × 60 / ' + v + ' = ' + fmt(w * 60 / v, 1) + '°.' }; },
    function () { var h = rnd([6, 8, 10, 14, 16, 22]), ete = Math.random() < 0.5; return { q: 'Il est ' + h + ' h UTC, en ' + (ete ? 'été' : 'hiver') + ' en France. Quelle heure légale (en heures) ?', a: (h + (ete ? 2 : 1)) % 24, tol: 0, e: (ete ? 'Été : UTC + 2' : 'Hiver : UTC + 1') + ', donc ' + ((h + (ete ? 2 : 1)) % 24) + ' h.' }; },
    function () { var fl = rnd([35, 55, 75, 95]); return { q: 'Isotherme 0 °C au FL' + fl + '. Température standard approximative 2 000 ft plus bas, en °C ?', a: 4, tol: 0, e: 'Environ 2 °C par 1 000 ft : 2 000 ft plus bas, il fait environ +4 °C.' }; }
  ];
  function calcul() {
    var L = B.lab('lab-calcul', { num: '🧮', title: 'Calcul mental du navigateur', hint: 'Tape ta réponse et valide. Arrondis raisonnables acceptés pour les conversions.', takeaway: 'Repères : 6 min = 1/10 h ; 1 ft ≈ 0,3 m ; 1 kt ≈ 1,85 km/h ; Fb = 60 / Vp ; réciproque d’une piste ± 18.' });
    L.stage.style.touchAction = 'auto';
    L.stage.innerHTML = '<form style="padding:16px" autocomplete="off"><p id="cm-q" style="font:700 19px/1.4 Manrope,sans-serif;color:var(--head);margin:0 0 12px"></p><input id="cm-a" type="text" inputmode="decimal" aria-label="Ta réponse" style="width:100%;font:700 22px DM Sans,sans-serif;padding:10px;border:2px solid var(--line);border-radius:12px"><button type="submit" class="btn primary" style="margin-top:10px;width:100%">Valider</button></form>';
    var form = L.stage.querySelector('form'), qEl = form.querySelector('#cm-q'), inp = form.querySelector('#cm-a');
    var best = B.load('nav-calc-best', 0), streak = 0, score = 0, n = 0, cur = null, answered = false;
    var set = B.readout(L.ctrls, [['s', 'Score'], ['r', 'Série en cours'], ['b', 'Meilleure série']]);
    var verdict = B.h('<div class="verdict">Prêt ?</div>'); L.ctrls.appendChild(verdict);
    function q() { cur = rnd(GEN)(); answered = false; qEl.textContent = cur.q; inp.value = ''; verdict.className = 'verdict'; verdict.textContent = 'À toi.'; upd(); }
    function upd() { set('s', score + ' / ' + n); set('r', String(streak), streak >= 5 ? 'good' : ''); set('b', String(best)); }
    form.onsubmit = function (e) {
      e.preventDefault();
      if (answered) { q(); inp.focus(); return; }
      var v = parseFloat(inp.value.replace(',', '.').replace(/[^\d.\-]/g, ''));
      if (isNaN(v)) { verdict.className = 'verdict warn'; verdict.textContent = 'Tape un nombre.'; return; }
      var ok = cur.tol ? Math.abs(v - cur.a) <= cur.a * cur.tol : Math.abs(v - cur.a) < 0.051 || Math.round(v) === Math.round(cur.a) && Math.abs(cur.a - Math.round(cur.a)) < 0.01;
      n++; answered = true;
      if (ok) { score++; streak++; if (streak > best) { best = streak; B.save('nav-calc-best', best); } } else streak = 0;
      verdict.className = 'verdict ' + (ok ? 'good' : 'bad'); verdict.textContent = (ok ? 'Exact. ' : 'Non. ') + cur.e + ' Appuie sur Valider pour la suivante.';
      upd();
    };
    q();
  }

  function init() { triangle(); piste(); niveaux(); espaces(); feux(); calcul(); B.quiz(document.getElementById('quiz'), window.QNAV || []); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
