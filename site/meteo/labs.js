/* Ateliers interactifs du domaine Météorologie. Modèles pédagogiques simplifiés :
   atmosphère standard ISO 2533, 1 hPa ≈ 28 ft près du sol, adiabatiques 1 °C et 0,55 °C par 100 m, base des Cu ≈ 125 m × (T − Td). */
(function () {
  'use strict';
  var B = window.BIA, S = B.svg, T = B.text, fmt = B.fmt, clamp = B.clamp, RAD = Math.PI / 180, FT = 3.28084;

  /* =================== 1. Profil de l'atmosphère =================== */
  function isa() {
    var L = B.lab('lab-isa', { num: '1', title: 'Monte dans l’atmosphère',
      hint: 'Fais glisser la poignée orange vers le haut ou le bas pour changer d’altitude. Décale l’atmosphère du jour par rapport à la standard avec le curseur, et regarde où passe l’isotherme 0 °C.',
      takeaway: 'Modèle ISO 2533 : −6,5 °C par 1000 m jusqu’à 11 km, puis −56,5 °C. À 5 500 m, la pression a déjà diminué de moitié. Le jour réel est souvent plus chaud ou plus froid que le standard : on dit ISA + 10, ISA − 5…' });
    var W = 600, H = 380, X0 = 70, X1 = 570, Y0 = 350, Y1 = 20, HMAX = 13000, TMIN = -80, TMAX = 40;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Température en fonction de l’altitude' }, L.stage);
    var px = function (t) { return X0 + (t - TMIN) / (TMAX - TMIN) * (X1 - X0); }, py = function (h) { return Y0 - h / HMAX * (Y0 - Y1); };
    S('rect', { x: X0, y: py(HMAX), width: X1 - X0, height: py(11000) - py(HMAX), fill: '#2f6fde10' }, svg);
    T(svg, X1 - 6, py(12000), 'stratosphère', '#2f6fde', 'end', 12);
    T(svg, X1 - 6, py(10000), 'troposphère', '#5b6880', 'end', 12);
    S('line', { x1: X0, y1: py(11000), x2: X1, y2: py(11000), stroke: '#2f6fde', 'stroke-dasharray': '6 4' }, svg);
    T(svg, X0 + 6, py(11000) - 6, 'tropopause 11 km', '#2f6fde', 'start', 12);
    for (var h = 0; h <= 12000; h += 2000) { S('line', { x1: X0 - 4, y1: py(h), x2: X0, y2: py(h), stroke: '#5b6880' }, svg); T(svg, X0 - 8, py(h) + 4, fmt(h / 1000) + ' km', '#5b6880', 'end', 11); }
    for (var t = -60; t <= 40; t += 20) { S('line', { x1: px(t), y1: Y0, x2: px(t), y2: Y0 + 4, stroke: '#5b6880' }, svg); T(svg, px(t), Y0 + 18, t + ' °C', '#5b6880', 'middle', 11); }
    S('line', { x1: X0, y1: Y0, x2: X1, y2: Y0, stroke: '#5b6880' }, svg); S('line', { x1: X0, y1: Y0, x2: X0, y2: Y1, stroke: '#5b6880' }, svg);
    S('line', { x1: px(0), y1: Y0, x2: px(0), y2: Y1, stroke: '#5b688055', 'stroke-dasharray': '3 4' }, svg);
    function curve(dT) { var d = ''; for (var h = 0; h <= HMAX; h += 250) { var tt = B.isa(h).T - 273.15 + dT; d += (d ? ' L' : 'M') + px(tt).toFixed(1) + ',' + py(h).toFixed(1); } return d; }
    S('path', { d: curve(0), fill: 'none', stroke: '#2f6fde', 'stroke-width': 3 }, svg);
    var real = S('path', { fill: 'none', stroke: '#f5a623', 'stroke-width': 3, 'stroke-dasharray': '8 5' }, svg);
    var iso = S('g', {}, svg), mark = S('g', {}, svg), hnd = B.handle(svg);
    var alt = 3000, dT = 0;
    B.slider(L.ctrls, { label: 'Écart à l’atmosphère standard', min: -20, max: 20, value: 0, fmt: function (v) { return v === 0 ? 'ISA' : 'ISA ' + (v > 0 ? '+ ' : '− ') + Math.abs(v); }, onInput: function (v) { dT = v; draw(); } });
    var set = B.readout(L.ctrls, [['h', 'Altitude'], ['fl', 'En pieds'], ['t', 'Température standard'], ['tr', 'Température du jour'], ['p', 'Pression'], ['r', 'Densité de l’air']]);
    var note = B.h('<div class="verdict"></div>'); L.ctrls.appendChild(note);
    function draw() {
      var a = B.isa(alt), ts = a.T - 273.15, tr = ts + dT;
      real.setAttribute('d', curve(dT));
      B.clear(mark);
      S('line', { x1: X0, y1: py(alt), x2: X1, y2: py(alt), stroke: '#f5a623', 'stroke-width': 1.5 }, mark);
      S('circle', { cx: px(ts), cy: py(alt), r: 5, fill: '#2f6fde' }, mark);
      S('circle', { cx: px(tr), cy: py(alt), r: 5, fill: '#f5a623' }, mark);
      hnd.setAttribute('transform', 'translate(' + (X1 - 30) + ',' + py(alt).toFixed(1) + ')');
      // isotherme 0 °C du jour
      B.clear(iso);
      var h0 = (15 + dT) / 6.5 * 1000;
      if (h0 > 0 && h0 < 11000) { S('line', { x1: X0, y1: py(h0), x2: X1 - 60, y2: py(h0), stroke: '#d64541', 'stroke-dasharray': '4 4' }, iso); T(iso, px(0) + 6, py(h0) - 5, 'isotherme 0 °C : ' + fmt(h0) + ' m (FL' + String(Math.round(h0 * FT / 100)).padStart(3, '0') + ')', '#d64541', 'start', 12); }
      set('h', fmt(alt) + ' m');
      set('fl', fmt(Math.round(alt * FT / 100) * 100) + ' ft');
      set('t', fmt(ts, 1) + ' °C');
      set('tr', fmt(tr, 1) + ' °C', tr < 0 ? 'warn' : '');
      set('p', fmt(a.P / 100) + ' hPa');
      var rho = a.P / (287.05 * (tr + 273.15));
      set('r', fmt(rho / 1.225 * 100) + ' %');
      note.className = 'verdict';
      note.textContent = alt >= 11000 ? 'Au-dessus de la tropopause, la température ne baisse plus.' : tr < 0 && tr > -15 ? 'Entre 0 et −15 °C : zone de givrage si tu traverses un nuage.' : 'L’air est ' + fmt(100 - rho / 1.225 * 100) + ' % moins dense qu’au niveau de la mer standard : moins de portance et de puissance.';
    }
    B.drag(svg, hnd, function (pt) { alt = Math.round(clamp((Y0 - pt.y) / (Y0 - Y1) * HMAX, 0, 12500) / 100) * 100; draw(); });
    hnd.setAttribute('aria-label', 'Altitude, flèches haut et bas');
    hnd.addEventListener('keydown', function (e) { if (e.key === 'ArrowUp') { alt = clamp(alt + 250, 0, 12500); draw(); e.preventDefault(); } if (e.key === 'ArrowDown') { alt = clamp(alt - 250, 0, 12500); draw(); e.preventDefault(); } });
    draw();
  }

  /* =================== 2. Altimètre et calages =================== */
  function altimetre() {
    var L = B.lab('lab-altimetre', { num: '2', title: 'L’altimètre : QNH, QFE et niveau de vol',
      hint: 'Fais monter ou descendre l’avion avec la poignée orange. Change le calage de l’altimètre, puis vole vers une dépression sans recaler : où es-tu vraiment ?',
      takeaway: 'Approximation : 1 hPa ≈ 28 ft. Indication = altitude réelle + (calage − QNH) × 28 ft. Terrain fictif à 300 ft.' });
    var W = 600, H = 340, ELEV = 300, FTPX = 0.08; // ft par pixel inverse : 1 px = 12,5 ft
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Altimètre et avion au-dessus du relief' }, L.stage);
    var gy = 300, yOf = function (ft) { return gy - (ft - ELEV) * FTPX - 20; };
    S('rect', { x: 0, y: gy - 20, width: 360, height: H, fill: '#8fc27a' }, svg);
    S('path', { d: 'M150,' + (gy - 20) + ' L210,' + (gy - 140) + ' L260,' + (gy - 20) + 'Z', fill: '#6b8f5a' }, svg);
    T(svg, 205, gy - 146, 'colline 1 800 ft', '#3e5a33', 'middle', 11);
    T(svg, 20, gy, 'aérodrome 300 ft', '#10203f', 'start', 12);
    var plane = S('g', {}, svg);
    S('path', { d: 'M-26,0 L18,-4 L26,0 L18,4Z M-4,-2 L4,-18 L10,-18 L6,-2Z M-24,-2 L-20,-12 L-16,-12 L-16,-2Z', fill: '#10203f' }, plane);
    var hnd = B.handle(svg), bars = S('g', {}, svg);
    // cadran
    var dial = S('g', { transform: 'translate(470,170)' }, svg);
    S('circle', { r: 110, fill: '#10203f' }, dial); S('circle', { r: 100, fill: '#1c2639' }, dial);
    for (var i = 0; i < 10; i++) { var a = i * 36 * RAD; T(dial, Math.sin(a) * 80, -Math.cos(a) * 80 + 6, String(i), '#fff', 'middle', 18); S('line', { x1: Math.sin(a) * 92, y1: -Math.cos(a) * 92, x2: Math.sin(a) * 100, y2: -Math.cos(a) * 100, stroke: '#fff', 'stroke-width': 3 }, dial); }
    var win = S('rect', { x: 20, y: -12, width: 58, height: 24, rx: 3, fill: '#000' }, dial), winT = T(dial, 49, 5, '', '#f5a623', 'middle', 13);
    var nThou = S('line', { x1: 0, y1: 10, x2: 0, y2: -48, stroke: '#fff', 'stroke-width': 8, 'stroke-linecap': 'round' }, dial);
    var nHund = S('line', { x1: 0, y1: 14, x2: 0, y2: -88, stroke: '#fff', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, dial);
    S('circle', { r: 7, fill: '#f5a623' }, dial);
    T(dial, 0, 40, 'ALT ×100 ft', '#9aa8c4', 'middle', 10);
    var st = { truth: 2000, qnh: 1018, cal: 1018, low: false };
    var calSl;
    var ctl = L.ctrls;
    B.slider(ctl, { label: 'QNH du jour', min: 990, max: 1040, value: st.qnh, fmt: function (v) { return v + ' hPa'; }, onInput: function (v) { st.qnh = v; draw(); } });
    var tip = B.h('<div class="small" style="font-weight:600;color:var(--head)">Calage affiché dans la fenêtre</div>'); ctl.appendChild(tip);
    var segRow = B.h('<div class="seg"></div>'); ctl.appendChild(segRow);
    [['QNH', function () { return st.low ? st.qnh - 15 : st.qnh; }], ['QFE', function () { return Math.round((st.low ? st.qnh - 15 : st.qnh) - ELEV / 28); }], ['1013', function () { return 1013; }]].forEach(function (c) {
      var b = B.h('<button type="button">' + c[0] + '</button>'); b.onclick = function () { st.cal = c[1](); calSl.set(st.cal); draw(); }; segRow.appendChild(b);
    });
    calSl = B.slider(ctl, { label: 'Bouton de calage', min: 960, max: 1040, value: st.cal, fmt: function (v) { return v + ' hPa'; }, onInput: function (v) { st.cal = v; draw(); } });
    var low = B.h('<button type="button" class="btn amber">🌀 Voler vers une dépression (−15 hPa) sans recaler</button>'); ctl.appendChild(low);
    var set = B.readout(ctl, [['i', 'L’altimètre indique'], ['r', 'Altitude réelle'], ['hh', 'Hauteur sur le terrain']]);
    var verdict = B.h('<div class="verdict"></div>'); ctl.appendChild(verdict);
    function qnhHere() { return st.low ? st.qnh - 15 : st.qnh; }
    function ind() { return st.truth + (st.cal - qnhHere()) * 28; }
    function draw() {
      var i = ind();
      plane.setAttribute('transform', 'translate(110,' + yOf(st.truth).toFixed(1) + ')');
      hnd.setAttribute('transform', 'translate(110,' + yOf(st.truth).toFixed(1) + ')');
      B.clear(bars);
      S('line', { x1: 60, y1: yOf(st.truth), x2: 60, y2: gy - 20, stroke: '#1f9d6a', 'stroke-width': 3 }, bars);
      T(bars, 56, (yOf(st.truth) + gy - 20) / 2, 'réel', '#1f9d6a', 'end', 11);
      S('line', { x1: 300, y1: yOf(i), x2: 360, y2: yOf(i), stroke: '#f5a623', 'stroke-width': 3, 'stroke-dasharray': '6 4' }, bars);
      T(bars, 300, yOf(i) - 6, 'cru : ' + fmt(i) + ' ft', '#b37400', 'start', 12);
      var shown = Math.max(0, i);
      nHund.setAttribute('transform', 'rotate(' + (shown % 1000) / 1000 * 360 + ')');
      nThou.setAttribute('transform', 'rotate(' + (shown % 10000) / 10000 * 360 + ')');
      winT.textContent = st.cal;
      set('i', fmt(i) + ' ft');
      set('r', fmt(st.truth) + ' ft');
      set('hh', fmt(st.truth - ELEV) + ' ft', st.truth < 1800 + 300 && st.truth < i - 150 ? 'warn' : '');
      var c = qnhHere();
      if (st.low && Math.abs(st.cal - c) > 2) { verdict.className = 'verdict bad'; verdict.textContent = 'Méfiance en bas : la pression a baissé de 15 hPa, l’altimètre te croit ' + fmt((st.cal - c) * 28) + ' ft plus haut que tu n’es. Recale au QNH local (' + c + ' hPa).'; }
      else if (st.cal === 1013) { verdict.className = 'verdict'; verdict.textContent = 'Calage standard : l’altimètre indique le niveau de vol FL' + String(Math.round(i / 100)).padStart(3, '0') + '.'; }
      else if (Math.abs(st.cal - (c - ELEV / 28)) <= 1) { verdict.className = 'verdict'; verdict.textContent = 'Calage QFE : l’altimètre indique ta hauteur au-dessus de l’aérodrome.'; }
      else if (Math.abs(st.cal - c) <= 0) { verdict.className = 'verdict good'; verdict.textContent = 'Calage QNH : l’altimètre indique ton altitude au-dessus du niveau de la mer.'; }
      else { verdict.className = 'verdict warn'; verdict.textContent = 'Calage quelconque : l’indication n’est ni ton altitude ni ta hauteur.'; }
    }
    low.onclick = function () {
      if (st.low) { st.low = false; low.textContent = '🌀 Voler vers une dépression (−15 hPa) sans recaler'; draw(); return; }
      var keep = ind(); st.low = true; st.truth = keep - (st.cal - qnhHere()) * 28; // on garde la même indication : l'avion descend vraiment
      low.textContent = '↩ Revenir dans la zone de départ'; draw();
    };
    B.drag(svg, hnd, function (pt) { st.truth = Math.round(clamp(ELEV + (gy - 20 - pt.y) / FTPX, ELEV, 4500) / 50) * 50; draw(); });
    hnd.setAttribute('aria-label', 'Altitude de l’avion, flèches haut et bas');
    hnd.addEventListener('keydown', function (e) { if (e.key === 'ArrowUp') { st.truth = clamp(st.truth + 100, ELEV, 4500); draw(); e.preventDefault(); } if (e.key === 'ArrowDown') { st.truth = clamp(st.truth - 100, ELEV, 4500); draw(); e.preventDefault(); } });
    draw();
  }

  /* =================== 3. Vent autour des centres de pression =================== */
  function vent() {
    var L = B.lab('lab-vent', { num: '3', title: 'Isobares et vent : dépression ou anticyclone',
      hint: 'Déplace le centre de pression (poignée orange) sur la carte. Regarde le sens de rotation du vent, sa force près du centre, et la déviation au sol. Vérifie la loi de Buys-Ballot avec le petit personnage.',
      takeaway: 'Hémisphère Nord : dépression dans le sens inverse des aiguilles d’une montre, anticyclone dans le sens des aiguilles. Près du sol, le frottement dévie le vent d’environ 30° vers les basses pressions.' });
    var W = 600, H = 360;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Carte isobarique' }, L.stage);
    S('rect', { width: W, height: H, fill: '#f4f9ff' }, svg);
    var isoG = S('g', {}, svg), arrows = S('g', {}, svg), man = S('g', {}, svg), hnd = B.handle(svg, 24);
    var st = { x: 300, y: 180, type: 'D', sol: false, nord: true };
    B.seg(L.ctrls, [['D', 'Dépression'], ['A', 'Anticyclone']], 'D', function (v) { st.type = v; draw(); });
    B.seg(L.ctrls, [[false, 'Vent en altitude'], [true, 'Vent au sol']], false, function (v) { st.sol = v; draw(); });
    B.seg(L.ctrls, [[true, 'Hémisphère Nord'], [false, 'Hémisphère Sud']], true, function (v) { st.nord = v; draw(); });
    var verdict = B.h('<div class="verdict"></div>'); L.ctrls.appendChild(verdict);
    function wind(x, y) {
      var dx = x - st.x, dy = y - st.y, r = Math.hypot(dx, dy) || 1;
      var out = st.type === 'D' ? -1 : 1; // direction du gradient de pression vers l'extérieur (D) : hautes pressions dehors
      // vecteur tangent : dépression hémisphère Nord = sens antihoraire (à l'écran, y vers le bas)
      var sense = (st.type === 'D') === st.nord ? 1 : -1;
      var tx = dy / r * sense, ty = -dx / r * sense;
      // au sol : rotation de 30° vers les basses pressions
      if (st.sol) { var inx = -dx / r * (st.type === 'D' ? 1 : -1), iny = -dy / r * (st.type === 'D' ? 1 : -1); tx = tx * Math.cos(30 * RAD) + inx * Math.sin(30 * RAD); ty = ty * Math.cos(30 * RAD) + iny * Math.sin(30 * RAD); }
      var sp = clamp(2600 / (r + 40), 8, 42) * (st.sol ? 0.6 : 1) * (st.type === 'A' ? 0.6 : 1);
      return [tx * sp, ty * sp, out];
    }
    function draw() {
      B.clear(isoG); B.clear(arrows); B.clear(man);
      for (var k = 1; k <= 7; k++) {
        var r = k * 42 + k * k * 3;
        S('circle', { cx: st.x, cy: st.y, r: r, fill: 'none', stroke: '#5b6880', 'stroke-width': 1.2, opacity: 0.6 }, isoG);
        var p = st.type === 'D' ? 990 + k * 4 : 1036 - k * 4;
        T(isoG, st.x + r * 0.71, st.y - r * 0.71, p, '#5b6880', 'start', 10, 600);
      }
      T(isoG, st.x, st.y + 10, st.type, st.type === 'D' ? '#d64541' : '#2f6fde', 'middle', 30, 800);
      for (var gx = 40; gx < W; gx += 70) for (var gy = 35; gy < H; gy += 64) {
        if (Math.hypot(gx - st.x, gy - st.y) < 34) continue;
        var w = wind(gx, gy);
        B.arrow(arrows, gx - w[0] / 2, gy - w[1] / 2, gx + w[0] / 2, gy + w[1] / 2, st.sol ? '#1f9d6a' : '#2f6fde', 2.5);
      }
      // personnage Buys-Ballot à un point fixe
      var mx = st.x < W / 2 ? 500 : 100, my = 300, w2 = wind(mx, my), ang = Math.atan2(w2[1], w2[0]);
      S('circle', { cx: mx, cy: my, r: 16, fill: '#fff', stroke: '#10203f', 'stroke-width': 2 }, man);
      T(man, mx, my + 5, '🧍', '#10203f', 'middle', 16);
      var lx = mx + Math.cos(ang - Math.PI / 2) * 40, ly = my + Math.sin(ang - Math.PI / 2) * 40;
      T(man, lx, ly, 'D', '#d64541', 'middle', 13); T(man, mx, my + 32, 'dos au vent', '#5b6880', 'middle', 10);
      hnd.setAttribute('transform', 'translate(' + st.x + ',' + st.y + ')');
      verdict.className = 'verdict';
      verdict.textContent = (st.type === 'D' ? 'Dépression : ' : 'Anticyclone : ') + 'le vent tourne dans le sens ' + (((st.type === 'D') === st.nord) ? 'inverse des aiguilles d’une montre' : 'des aiguilles d’une montre') + '. ' + (st.sol ? 'Au sol, il est dévié vers les basses pressions et plus faible.' : 'En altitude, il suit les isobares.') + ' Dos au vent, basses pressions à ' + (st.nord ? 'gauche' : 'droite') + '.';
    }
    B.drag(svg, hnd, function (pt) { st.x = clamp(pt.x, 40, W - 40); st.y = clamp(pt.y, 40, H - 40); draw(); });
    hnd.setAttribute('aria-label', 'Centre de pression, flèches pour déplacer');
    hnd.addEventListener('keydown', function (e) { var d = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] }[e.key]; if (d) { st.x = clamp(st.x + d[0], 40, W - 40); st.y = clamp(st.y + d[1], 40, H - 40); draw(); e.preventDefault(); } });
    draw();
  }

  /* =================== 4. Ascendance, nuage et foehn =================== */
  function foehn() {
    var L = B.lab('lab-foehn', { num: '4', title: 'Le foehn : une bulle d’air franchit la montagne',
      hint: 'Règle la hauteur du sommet avec la poignée orange, la température et le point de rosée de l’air au départ. Suis la bulle : sèche, puis saturée, puis de nouveau sèche en redescendant.',
      takeaway: 'Air sec : −1 °C par 100 m. Air saturé : environ −0,55 °C par 100 m. Base du nuage ≈ 125 m × (T − Td). Côté sous le vent, l’air redescend sec et se réchauffe de 1 °C par 100 m : il arrive plus chaud qu’au départ.' });
    var W = 600, H = 340, base = 300, SC = 0.06; // px par m
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Coupe d’une montagne et trajet de l’air' }, L.stage);
    var sky = S('g', {}, svg), mount = S('path', { fill: '#6b8f5a' }, svg), cloud = S('g', {}, svg), path = S('g', {}, svg), labels = S('g', {}, svg);
    var hnd = B.handle(svg);
    var st = { hp: 3000, t: 20, td: 12 };
    B.slider(L.ctrls, { label: 'Température au départ', min: 0, max: 35, value: st.t, fmt: function (v) { return v + ' °C'; }, onInput: function (v) { st.t = v; if (st.td > v) st.td = v; draw(); } });
    var tdS = B.slider(L.ctrls, { label: 'Point de rosée au départ', min: -10, max: 30, value: st.td, fmt: function (v) { return v + ' °C'; }, onInput: function (v) { st.td = Math.min(v, st.t); draw(); } });
    var set = B.readout(L.ctrls, [['b', 'Base du nuage'], ['s', 'Au sommet'], ['a', 'À l’arrivée'], ['g', 'Gain de température']]);
    var verdict = B.h('<div class="verdict"></div>'); L.ctrls.appendChild(verdict);
    function draw() {
      if (st.td > st.t) { st.td = st.t; tdS.set(st.td); }
      var hp = st.hp, hc = 125 * (st.t - st.td), sat = hc < hp;
      var tBase = st.t - hc / 100, tTop = sat ? tBase - (hp - hc) * 0.55 / 100 : st.t - hp / 100, tEnd = tTop + hp / 100;
      var peakX = 300, yTop = base - hp * SC;
      mount.setAttribute('d', 'M40,' + base + ' L' + peakX + ',' + yTop + ' L560,' + base + 'Z');
      hnd.setAttribute('transform', 'translate(' + peakX + ',' + yTop.toFixed(1) + ')');
      B.clear(sky); S('rect', { x: 0, y: base, width: W, height: H - base, fill: '#8fc27a' }, sky);
      B.clear(cloud);
      if (sat) {
        var yc = base - hc * SC, xc1 = 40 + (peakX - 40) * hc / hp;
        S('path', { d: 'M' + (xc1 - 30) + ',' + yc + ' L' + peakX + ',' + (yTop - 14) + ' L' + (peakX + 20) + ',' + (yTop + 6) + ' L' + (xc1 + 10) + ',' + (yc + 2) + 'Z', fill: '#c9d3e6', stroke: '#9aa8c4' }, cloud);
        for (var i = 0; i < 6; i++) { var xr = xc1 - 20 + i * (peakX - xc1) / 6; S('line', { x1: xr, y1: yc + 6, x2: xr - 6, y2: yc + 22, stroke: '#2f6fde', 'stroke-width': 2 }, cloud); }
        S('line', { x1: 20, y1: yc, x2: peakX, y2: yc, stroke: '#2f6fde', 'stroke-dasharray': '4 4' }, cloud);
        T(cloud, 22, yc - 4, 'base ' + fmt(hc) + ' m', '#2f6fde', 'start', 11);
      }
      B.clear(path);
      B.arrow(path, 20, base - 6, peakX - 14, yTop - 18, '#f5a623', 3);
      B.arrow(path, peakX + 14, yTop - 18, 580, base - 6, '#d64541', 3);
      B.clear(labels);
      T(labels, 24, base + 22, fmt(st.t, 1) + ' °C', '#10203f', 'start', 13);
      T(labels, peakX, yTop - 26, fmt(tTop, 1) + ' °C', '#10203f', 'middle', 13);
      T(labels, 576, base + 22, fmt(tEnd, 1) + ' °C', '#d64541', 'end', 13);
      T(labels, 120, base - 10, 'versant au vent', '#ffffff', 'middle', 11);
      T(labels, 480, base - 10, 'versant sous le vent', '#ffffff', 'middle', 11);
      set('b', sat ? fmt(hc) + ' m' : 'pas de nuage');
      set('s', fmt(tTop, 1) + ' °C');
      set('a', fmt(tEnd, 1) + ' °C');
      set('g', '+' + fmt(tEnd - st.t, 1) + ' °C', tEnd - st.t > 0.5 ? 'good' : '');
      verdict.className = 'verdict' + (sat ? ' good' : '');
      verdict.textContent = sat ? 'L’air a condensé à ' + fmt(hc) + ' m : il pleut sur le versant au vent. En redescendant sec, il gagne ' + fmt(tEnd - st.t, 1) + ' °C : c’est l’effet de foehn.' : 'L’air n’atteint pas son point de rosée : pas de nuage, il redescend à la même température. Monte le sommet ou rapproche le point de rosée.';
    }
    B.drag(svg, hnd, function (pt) { st.hp = Math.round(clamp((base - pt.y) / SC, 400, 4200) / 50) * 50; draw(); });
    hnd.setAttribute('aria-label', 'Hauteur du sommet, flèches haut et bas');
    hnd.addEventListener('keydown', function (e) { if (e.key === 'ArrowUp') { st.hp = clamp(st.hp + 100, 400, 4200); draw(); e.preventDefault(); } if (e.key === 'ArrowDown') { st.hp = clamp(st.hp - 100, 400, 4200); draw(); e.preventDefault(); } });
    draw();
  }

  /* =================== 5. Classer les nuages =================== */
  function nuages() {
    var L = B.lab('lab-nuages', { num: '5', title: 'Range les dix nuages à leur étage',
      hint: 'Touche un nuage, puis touche l’étage où il se forme. Les bonnes réponses restent en place, les erreurs t’expliquent pourquoi.',
      takeaway: 'Cirro- : étage élevé, cristaux de glace. Alto- : étage moyen. Strato- et nimbo- : couches basses. Cumulus et cumulonimbus : développement vertical.' });
    var CL = [['Cirrus', 'Ci', 'haut'], ['Cirrocumulus', 'Cc', 'haut'], ['Cirrostratus', 'Cs', 'haut'], ['Altocumulus', 'Ac', 'moyen'], ['Altostratus', 'As', 'moyen'], ['Stratus', 'St', 'bas'], ['Stratocumulus', 'Sc', 'bas'], ['Nimbostratus', 'Ns', 'bas'], ['Cumulus', 'Cu', 'vert'], ['Cumulonimbus', 'Cb', 'vert']];
    var BANDS = [['haut', 'Étage élevé', 'au-dessus de 5 000 m environ'], ['moyen', 'Étage moyen', '2 000 à 7 000 m environ'], ['bas', 'Étage bas', 'du sol à 2 000 m environ'], ['vert', 'Développement vertical', 'du bas jusqu’à la tropopause']];
    var WHY = { haut: 'il est fait de cristaux de glace, très haut (préfixe cirro-)', moyen: 'le préfixe alto- désigne l’étage moyen', bas: 'c’est un nuage en couche de l’étage bas', vert: 'il naît de la convection et s’élève sur une grande épaisseur' };
    L.stage.style.touchAction = 'auto';
    L.stage.innerHTML = '<div style="padding:12px"><div class="seg" id="cl-cards" role="group" aria-label="Nuages à placer"></div><div id="cl-bands" style="display:grid;gap:8px;margin-top:12px"></div></div>';
    var cards = L.stage.querySelector('#cl-cards'), bands = L.stage.querySelector('#cl-bands');
    var sel = null, done = 0, errors = 0;
    var set = B.readout(L.ctrls, [['ok', 'Bien placés'], ['ko', 'Erreurs']]);
    var verdict = B.h('<div class="verdict">Touche un nuage pour commencer.</div>'); L.ctrls.appendChild(verdict);
    var again = B.h('<button type="button" class="btn">Recommencer</button>'); L.ctrls.appendChild(again);
    var zones = {};
    BANDS.forEach(function (b) {
      var z = B.h('<button type="button" class="card" style="text-align:left;cursor:pointer;min-height:64px;padding:10px"><b>' + b[1] + '</b> <span class="small">' + b[2] + '</span><div class="seg" style="margin-top:6px"></div></button>');
      z.onclick = function () { place(b[0]); };
      zones[b[0]] = z; bands.appendChild(z);
    });
    function build() {
      cards.innerHTML = ''; done = 0; errors = 0; sel = null;
      Object.keys(zones).forEach(function (k) { zones[k].querySelector('.seg').innerHTML = ''; });
      CL.slice().sort(function () { return Math.random() - 0.5; }).forEach(function (c) {
        var b = B.h('<button type="button">' + c[0] + ' <b>' + c[1] + '</b></button>');
        b.onclick = function () { [].forEach.call(cards.children, function (x) { x.classList.remove('on'); }); b.classList.add('on'); sel = { c: c, el: b }; verdict.className = 'verdict'; verdict.textContent = c[0] + ' : à quel étage ?'; };
        cards.appendChild(b);
      });
      upd();
    }
    function upd() { set('ok', done + ' / 10', done === 10 ? 'good' : ''); set('ko', String(errors), errors ? 'warn' : ''); }
    function place(k) {
      if (!sel) { verdict.className = 'verdict warn'; verdict.textContent = 'Choisis d’abord un nuage.'; return; }
      if (sel.c[2] === k) {
        sel.el.remove(); var chip = B.h('<span class="chip">' + sel.c[0] + '</span>'); zones[k].querySelector('.seg').appendChild(chip);
        done++; verdict.className = 'verdict good'; verdict.textContent = 'Exact : ' + sel.c[0] + ', ' + WHY[k] + '.';
        sel = null;
        if (done === 10) verdict.textContent = errors ? 'Les dix sont rangés, avec ' + errors + ' erreur(s). Recommence pour faire un sans-faute.' : 'Sans-faute ! Les dix genres de nuages sont à leur place.';
      } else { errors++; verdict.className = 'verdict bad'; verdict.textContent = 'Non : le ' + sel.c[0].toLowerCase() + ' n’est pas là. Indice : ' + WHY[sel.c[2]] + '.'; }
      upd();
    }
    again.onclick = build;
    build();
  }

  /* =================== 6. Fronts =================== */
  function front() {
    var L = B.lab('lab-front', { num: '6', title: 'Sous un front : qu’est-ce que tu vois du sol ?',
      hint: 'Déplace l’observateur (poignée orange) le long de la coupe. Le front avance de la gauche vers la droite : ce qui est à droite de l’observateur va lui arriver.',
      takeaway: 'Front chaud : Ci, Cs, As puis Ns et pluie continue, plafond qui baisse. Front froid : Cb, averses et orages, saute de vent, puis ciel de traîne lumineux avec cumulus et averses.' });
    var W = 600, H = 320, G = 270;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Coupe verticale d’un front' }, L.stage);
    var scene = S('g', {}, svg), obs = S('g', {}, svg), hnd = B.handle(svg);
    var st = { kind: 'chaud', x: 520 };
    B.seg(L.ctrls, [['chaud', 'Front chaud'], ['froid', 'Front froid']], 'chaud', function (v) { st.kind = v; draw(); });
    var set = B.readout(L.ctrls, [['c', 'Nuages au-dessus'], ['w', 'Temps']]);
    var verdict = B.h('<div class="verdict"></div>'); L.ctrls.appendChild(verdict);
    function zoneOf(x) {
      if (st.kind === 'chaud') {
        if (x > 470) return ['Cirrus', 'Beau temps, voile de cirrus en altitude : le front arrive.', 'good'];
        if (x > 400) return ['Cirrostratus', 'Halo autour du soleil, ciel laiteux. La pression baisse.', ''];
        if (x > 310) return ['Altostratus', 'Soleil « derrière un verre dépoli », plafond qui baisse.', 'warn'];
        if (x > 210) return ['Nimbostratus', 'Pluie continue, plafond bas, mauvaise visibilité : pas de vol VFR.', 'bad'];
        return ['Stratus, stratocumulus', 'Secteur chaud : air doux et humide, bruine possible.', 'warn'];
      }
      if (x > 330) return ['Stratocumulus', 'Secteur chaud, air doux et humide.', 'warn'];
      if (x > 250) return ['Cumulonimbus', 'Orages, grêle, averses violentes, rafales et saute de vent. Danger.', 'bad'];
      return ['Cumulus', 'Ciel de traîne : air froid, visibilité excellente, averses passagères.', 'good'];
    }
    function cloud(g, cx, cy, rx, ry, fill) { S('ellipse', { cx: cx, cy: cy, rx: rx, ry: ry, fill: fill || '#d9e2f0', stroke: '#b8c4d8' }, g); }
    function draw() {
      B.clear(scene);
      S('rect', { x: 0, y: G, width: W, height: H - G, fill: '#8fc27a' }, scene);
      if (st.kind === 'chaud') {
        S('path', { d: 'M150,' + G + ' L600,40 L600,' + G + 'Z', fill: '#2f6fde14' }, scene);
        S('path', { d: 'M0,40 L600,40 L150,' + G + ' L0,' + G + 'Z', fill: '#d6454112' }, scene);
        S('line', { x1: 150, y1: G, x2: 600, y2: 40, stroke: '#d64541', 'stroke-width': 3 }, scene);
        T(scene, 70, 70, 'air chaud', '#d64541', 'middle', 13); T(scene, 520, 230, 'air froid', '#2f6fde', 'middle', 13);
        for (var i = 0; i < 5; i++) cloud(scene, 500 + i * 18, 70 - i * 2, 30, 4, '#eef2f8');
        cloud(scene, 430, 110, 50, 8); cloud(scene, 350, 150, 70, 14, '#c9d3e6');
        cloud(scene, 260, 195, 90, 26, '#a9b6cc');
        for (var j = 0; j < 9; j++) S('line', { x1: 190 + j * 16, y1: 225, x2: 184 + j * 16, y2: 262, stroke: '#2f6fde', 'stroke-width': 1.5 }, scene);
        B.arrow(scene, 60, 140, 140, 120, '#d64541', 3);
        T(scene, 160, 290, 'front au sol', '#d64541', 'middle', 11);
      } else {
        S('path', { d: 'M0,' + G + ' L0,60 Q200,90 300,' + G + 'Z', fill: '#2f6fde14' }, scene);
        S('path', { d: 'M0,60 Q200,90 300,' + G, fill: 'none', stroke: '#2f6fde', 'stroke-width': 3 }, scene);
        T(scene, 80, 230, 'air froid', '#2f6fde', 'middle', 13); T(scene, 480, 90, 'air chaud', '#d64541', 'middle', 13);
        S('path', { d: 'M240,250 L250,120 Q260,40 300,36 L390,40 Q330,52 320,120 L330,250Z', fill: '#7d8aa3' }, scene);
        T(scene, 290, 150, 'Cb', '#fff', 'middle', 16);
        for (var k = 0; k < 6; k++) S('line', { x1: 255 + k * 12, y1: 252, x2: 249 + k * 12, y2: 268, stroke: '#2f6fde', 'stroke-width': 2 }, scene);
        cloud(scene, 100, 170, 34, 18); cloud(scene, 180, 190, 26, 14); cloud(scene, 450, 200, 90, 10, '#c9d3e6');
        B.arrow(scene, 60, 250, 150, 250, '#2f6fde', 3);
        T(scene, 300, 290, 'front au sol', '#2f6fde', 'middle', 11);
      }
      B.clear(obs);
      T(obs, st.x, G - 4, '🧍', '#10203f', 'middle', 22);
      hnd.setAttribute('transform', 'translate(' + st.x + ',' + (G + 16) + ')');
      var z = zoneOf(st.x);
      set('c', z[0]); set('w', z[2] === 'bad' ? 'mauvais' : z[2] === 'good' ? 'bon' : 'moyen', z[2] === 'bad' ? 'warn' : z[2] === 'good' ? 'good' : '');
      verdict.className = 'verdict ' + z[2]; verdict.textContent = z[1];
    }
    B.drag(svg, hnd, function (pt) { st.x = clamp(pt.x, 20, 580); draw(); });
    hnd.setAttribute('aria-label', 'Position de l’observateur, flèches gauche et droite');
    hnd.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') { st.x = clamp(st.x - 20, 20, 580); draw(); e.preventDefault(); } if (e.key === 'ArrowRight') { st.x = clamp(st.x + 20, 20, 580); draw(); e.preventDefault(); } });
    draw();
  }

  /* =================== 7. Heure UTC et heure légale =================== */
  function heure() {
    var L = B.lab('lab-heure', { num: '7', title: 'UTC et heure légale',
      hint: 'Tous les messages météo sont en UTC. Tourne la grande aiguille (poignée orange) ou utilise le curseur, choisis la saison, et lis l’heure à ta montre.',
      takeaway: 'France métropolitaine : UTC + 1 en hiver, UTC + 2 en été (du dernier dimanche de mars au dernier dimanche d’octobre).' });
    var W = 600, H = 300;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Horloges UTC et heure légale' }, L.stage);
    function clock(cx, title, color) {
      var g = S('g', { transform: 'translate(' + cx + ',150)' }, svg);
      S('circle', { r: 110, fill: '#fff', stroke: color, 'stroke-width': 6 }, g);
      for (var i = 1; i <= 12; i++) { var a = i * 30 * RAD; T(g, Math.sin(a) * 88, -Math.cos(a) * 88 + 6, String(i), '#10203f', 'middle', 15); }
      T(g, 0, -40, title, color, 'middle', 13);
      var dig = T(g, 0, 50, '', '#10203f', 'middle', 20, 800);
      var hh = S('line', { x1: 0, y1: 0, x2: 0, y2: -55, stroke: '#10203f', 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
      var mm = S('line', { x1: 0, y1: 0, x2: 0, y2: -85, stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
      S('circle', { r: 6, fill: '#10203f' }, g);
      return { hh: hh, mm: mm, dig: dig };
    }
    var u = clock(150, 'UTC', '#2f6fde'), l = clock(450, 'heure de Paris', '#f5a623');
    var hnd = B.handle(svg);
    var st = { min: 15 * 60, ete: true }, sl;
    sl = B.slider(L.ctrls, { label: 'Heure UTC', min: 0, max: 1425, step: 15, value: st.min, fmt: function (v) { return pad(Math.floor(v / 60)) + ':' + pad(v % 60) + ' UTC'; }, onInput: function (v) { st.min = v; draw(); } });
    B.seg(L.ctrls, [[false, 'Hiver (UTC+1)'], [true, 'Été (UTC+2)']], true, function (v) { st.ete = v; draw(); });
    var verdict = B.h('<div class="verdict"></div>'); L.ctrls.appendChild(verdict);
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function setC(c, m) { var h = Math.floor(m / 60) % 24, mi = m % 60; c.hh.setAttribute('transform', 'rotate(' + ((h % 12) * 30 + mi / 2) + ')'); c.mm.setAttribute('transform', 'rotate(' + mi * 6 + ')'); c.dig.textContent = pad(h) + ':' + pad(mi); }
    function draw() {
      var loc = (st.min + (st.ete ? 120 : 60)) % 1440;
      setC(u, st.min); setC(l, loc);
      var a = (st.min % 60) * 6 * RAD;
      hnd.setAttribute('transform', 'translate(' + (150 + Math.sin(a) * 85).toFixed(1) + ',' + (150 - Math.cos(a) * 85).toFixed(1) + ')');
      verdict.className = 'verdict';
      verdict.textContent = 'Un METAR de ' + pad(Math.floor(st.min / 60)) + pad(st.min % 60) + 'Z correspond à ' + pad(Math.floor(loc / 60)) + ' h ' + pad(loc % 60) + ' à Paris ' + (st.ete ? 'en été.' : 'en hiver.') + (st.min + (st.ete ? 120 : 60) >= 1440 ? ' Attention : c’est déjà le lendemain !' : '');
    }
    var lastA = null;
    B.drag(svg, hnd, function (pt, phase) {
      var a = Math.atan2(pt.x - 150, -(pt.y - 150)) / RAD; if (a < 0) a += 360;
      var m = Math.round(a / 6 / 15) * 15 % 60;
      if (phase === 'start') lastA = m;
      var h = Math.floor(st.min / 60);
      if (lastA !== null && lastA >= 45 && m <= 15) h = (h + 1) % 24;
      if (lastA !== null && lastA <= 15 && m >= 45) h = (h + 23) % 24;
      lastA = m; st.min = h * 60 + m; sl.set(st.min); draw();
    });
    hnd.setAttribute('aria-label', 'Aiguille des minutes UTC, flèches pour tourner');
    hnd.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { st.min = (st.min + 15) % 1440; sl.set(st.min); draw(); e.preventDefault(); } if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { st.min = (st.min + 1425) % 1440; sl.set(st.min); draw(); e.preventDefault(); } });
    draw();
  }

  /* =================== 8. Décodeur de METAR =================== */
  var WX = { MI: 'mince', BC: 'en bancs', PR: 'partiel', DR: 'chasse basse', BL: 'chasse haute', SH: 'averse de', TS: 'orage', FZ: 'se congelant', DZ: 'bruine', RA: 'pluie', SN: 'neige', SG: 'neige en grains', PL: 'granules de glace', GR: 'grêle', GS: 'grésil', BR: 'brume', FG: 'brouillard', FU: 'fumée', VA: 'cendres volcaniques', DU: 'poussière', SA: 'sable', HZ: 'brume sèche', SQ: 'grains', FC: 'trombe', UP: 'précipitation inconnue' };
  var CLD = { FEW: 'peu de nuages (1 à 2 octas)', SCT: 'nuages épars (3 à 4 octas)', BKN: 'nuages fragmentés (5 à 7 octas)', OVC: 'ciel couvert (8 octas)' };
  function decode(msg) {
    var g = msg.trim().toUpperCase().replace(/=$/, '').split(/\s+/), out = [], i = 0, r = { vis: null, ceil: null, cavok: false, t: null, td: null, wx: [] };
    if (g[i] === 'METAR' || g[i] === 'SPECI') { out.push([g[i], g[i] === 'METAR' ? 'observation régulière' : 'observation spéciale (changement important)']); i++; }
    if (/^[A-Z]{4}$/.test(g[i] || '')) { out.push([g[i], 'aérodrome (code OACI' + (g[i].indexOf('LF') === 0 ? ', France' : '') + ')']); i++; }
    var m;
    if ((m = /^(\d{2})(\d{2})(\d{2})Z$/.exec(g[i] || ''))) { out.push([g[i], 'le ' + +m[1] + ' du mois à ' + m[2] + ' h ' + m[3] + ' UTC']); i++; }
    if (g[i] === 'AUTO') { out.push(['AUTO', 'observation automatique, sans observateur']); i++; }
    for (; i < g.length; i++) {
      var s = g[i];
      if (s === 'RMK') { out.push(['RMK…', 'remarques locales']); break; }
      if ((m = /^(\d{3}|VRB)(\d{2,3})(G(\d{2,3}))?(KT|MPS)$/.exec(s))) { out.push([s, 'vent ' + (m[1] === 'VRB' ? 'de direction variable' : 'du ' + m[1] + '°') + ', ' + +m[2] + (m[5] === 'KT' ? ' kt' : ' m/s') + (m[4] ? ', rafales à ' + +m[4] + ' kt' : '') + (m[1] === '000' && +m[2] === 0 ? ' (calme)' : '')]); continue; }
      if ((m = /^(\d{3})V(\d{3})$/.exec(s))) { out.push([s, 'direction du vent variant entre ' + m[1] + '° et ' + m[2] + '°']); continue; }
      if (s === 'CAVOK') { r.cavok = true; r.vis = 10000; out.push([s, 'visibilité ≥ 10 km, pas de nuage sous 5 000 ft, ni Cb ni TCU, pas de phénomène significatif']); continue; }
      if ((m = /^(\d{4})(NDV)?$/.exec(s))) { var v = +m[1]; if (r.vis === null) r.vis = v; out.push([s, v === 9999 ? 'visibilité de 10 km ou plus' : 'visibilité ' + (v >= 1000 ? fmt(v / 1000, v % 1000 ? 1 : 0) + ' km' : v + ' m') + (r.vis !== v ? ' dans une direction' : '')]); continue; }
      if ((m = /^(\d{4})(N|NE|E|SE|S|SW|W|NW)$/.exec(s))) { out.push([s, 'visibilité minimale ' + +m[1] + ' m vers le ' + m[2]]); continue; }
      if ((m = /^R(\d{2}[LCR]?)\/([PM]?\d{4})/.exec(s))) { out.push([s, 'portée visuelle de piste ' + m[1] + ' : ' + +m[2].replace(/[PM]/, '') + ' m']); continue; }
      if ((m = /^([-+]|VC)?((MI|BC|PR|DR|BL|SH|TS|FZ)?)((DZ|RA|SN|SG|PL|GR|GS|BR|FG|FU|VA|DU|SA|HZ|SQ|FC|UP)+)$/.exec(s)) || /^([-+])?(TS|SH)$/.test(s)) {
        var mm = /^([-+]|VC)?(MI|BC|PR|DR|BL|SH|TS|FZ)?(.*)$/.exec(s), parts = (mm[3].match(/.{2}/g) || []).map(function (p) { return WX[p] || p; });
        var txt = (mm[2] ? WX[mm[2]] + (parts.length ? ' ' : '') : '') + parts.join(' et ');
        txt = (mm[1] === '-' ? 'faible ' : mm[1] === '+' ? 'fort(e) ' : '') + txt + (mm[1] === 'VC' ? ' au voisinage' : '');
        r.wx.push(s); out.push([s, txt.charAt(0).toUpperCase() + txt.slice(1)]); continue;
      }
      if ((m = /^(FEW|SCT|BKN|OVC)(\d{3})(CB|TCU|\/\/\/)?$/.exec(s))) { var hgt = +m[2] * 100; if ((m[1] === 'BKN' || m[1] === 'OVC') && r.ceil === null) r.ceil = hgt; out.push([s, CLD[m[1]] + ' à ' + fmt(hgt) + ' ft' + (m[3] === 'CB' ? ', cumulonimbus !' : m[3] === 'TCU' ? ', cumulus bourgeonnants' : '')]); continue; }
      if ((m = /^VV(\d{3})$/.exec(s))) { r.ceil = +m[1] * 100; out.push([s, 'ciel invisible, visibilité verticale ' + fmt(+m[1] * 100) + ' ft']); continue; }
      if (s === 'NSC' || s === 'SKC' || s === 'NCD') { out.push([s, s === 'NSC' ? 'pas de nuage significatif' : s === 'SKC' ? 'ciel clair' : 'aucun nuage détecté']); continue; }
      if ((m = /^(M?\d{2})\/(M?\d{2})$/.exec(s))) { r.t = +m[1].replace('M', '-'); r.td = +m[2].replace('M', '-'); out.push([s, 'température ' + r.t + ' °C, point de rosée ' + r.td + ' °C']); continue; }
      if ((m = /^Q(\d{4})$/.exec(s))) { out.push([s, 'QNH ' + +m[1] + ' hPa']); continue; }
      if (s === 'NOSIG') { out.push([s, 'pas de changement significatif prévu dans les 2 heures']); continue; }
      if (s === 'BECMG' || s === 'TEMPO') { out.push([s, s === 'BECMG' ? 'évolution durable prévue (devenant)' : 'variations temporaires prévues']); continue; }
      out.push([s, 'groupe non reconnu par ce décodeur']);
    }
    return { rows: out, r: r };
  }
  function metar() {
    var L = B.lab('lab-metar', { num: '8', title: 'Décodeur de METAR et « VFR possible ? »',
      hint: 'Choisis un exemple ou colle un vrai METAR (sur aviation.meteo.fr, par exemple). Chaque groupe est traduit.',
      takeaway: 'Règle SERA.5005 : pour entrer en VFR dans la zone de contrôle d’un aérodrome, il faut au moins 5 km de visibilité au sol et un plafond d’au moins 1 500 ft (sauf clairance VFR spéciale). Les exemples sont fictifs.' });
    var EX = [
      ['Beau temps', 'METAR LFRS 221030Z 27012KT 9999 FEW030 SCT045 14/07 Q1021 NOSIG'],
      ['CAVOK', 'METAR LFPO 151500Z 06008KT CAVOK 24/11 Q1018 NOSIG'],
      ['Brouillard', 'METAR LFRS 220600Z 00000KT 0300 R03/0450 FG VV001 03/03 Q1027'],
      ['Front froid', 'METAR LFBD 181430Z 26018G32KT 4000 +TSRA BKN012 FEW025CB 16/14 Q1004 TEMPO 1500 +TSRAGR'],
      ['Plafond bas', 'METAR LFRN 120800Z 22009KT 6000 -RA BKN011 OVC025 11/09 Q1012']
    ];
    L.stage.style.touchAction = 'auto';
    L.stage.innerHTML = '<div style="padding:12px"><div class="seg" id="mt-ex"></div><textarea id="mt-in" rows="3" style="width:100%;margin-top:10px;font:600 16px ui-monospace,Menlo,monospace;border:2px solid #dde4ef;border-radius:10px;padding:10px;resize:vertical" aria-label="Message METAR"></textarea><div class="tablewrap"><table class="data" id="mt-out"></table></div></div>';
    var ex = L.stage.querySelector('#mt-ex'), inp = L.stage.querySelector('#mt-in'), tab = L.stage.querySelector('#mt-out');
    EX.forEach(function (e) { var b = B.h('<button type="button">' + e[0] + '</button>'); b.onclick = function () { inp.value = e[1]; run(); }; ex.appendChild(b); });
    var set = B.readout(L.ctrls, [['v', 'Visibilité'], ['c', 'Plafond'], ['s', 'Écart T − Td']]);
    var verdict = B.h('<div class="verdict"></div>'); L.ctrls.appendChild(verdict);
    function run() {
      var d = decode(inp.value), r = d.r;
      tab.innerHTML = '<tr><th>Groupe</th><th>Signification</th></tr>' + d.rows.map(function (x) { return '<tr><td><b>' + B.esc(x[0]) + '</b></td><td>' + B.esc(x[1]) + '</td></tr>'; }).join('');
      set('v', r.vis === null ? '–' : r.vis >= 9999 ? '≥ 10 km' : fmt(r.vis) + ' m', r.vis !== null && r.vis < 5000 ? 'warn' : '');
      set('c', r.ceil === null ? (r.cavok ? '≥ 5 000 ft' : 'aucun') : fmt(r.ceil) + ' ft', r.ceil !== null && r.ceil < 1500 ? 'warn' : '');
      set('s', r.t === null ? '–' : (r.t - r.td) + ' °C', r.t !== null && r.t - r.td <= 2 ? 'warn' : '');
      var bad = [];
      if (r.vis !== null && r.vis < 5000) bad.push('visibilité inférieure à 5 km');
      if (r.ceil !== null && r.ceil < 1500) bad.push('plafond inférieur à 1 500 ft');
      if (r.wx.some(function (w) { return /TS|GR|\+/.test(w); }) || /CB/.test(inp.value.toUpperCase())) bad.push('orage ou cumulonimbus');
      if (!inp.value.trim()) { verdict.className = 'verdict'; verdict.textContent = 'Colle un METAR ou choisis un exemple.'; }
      else if (bad.length) { verdict.className = 'verdict bad'; verdict.textContent = 'VFR impossible en zone de contrôle : ' + bad.join(', ') + '.'; }
      else { verdict.className = 'verdict good'; verdict.textContent = 'Minima VFR de zone de contrôle respectés.' + (r.t !== null && r.t - r.td <= 2 ? ' Mais T et Td sont proches : brouillard ou nuages bas possibles.' : ''); }
    }
    inp.addEventListener('input', run);
    inp.value = EX[0][1]; run();
  }

  function init() {
    isa(); altimetre(); vent(); foehn(); nuages(); front(); heure(); metar();
    B.quiz(document.getElementById('quiz'), window.QMETEO || []);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
