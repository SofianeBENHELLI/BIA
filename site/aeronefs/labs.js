/* Ateliers interactifs du domaine Aéronefs et engins spatiaux. Modèles pédagogiques simplifiés. */
(function () {
  'use strict';
  var B = window.BIA, S = B.svg, T = B.text, fmt = B.fmt, clamp = B.clamp, RAD = Math.PI / 180;
  function visible(el, loop) { if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) loop.start(); else loop.stop(); }); }).observe(el); else loop.start(); }

  /* =================== 1. Moteur à 4 temps =================== */
  function moteur() {
    var L = B.lab('lab-moteur', { num: '1', title: 'Le moteur à 4 temps, tour par tour', hint: 'Fais tourner le vilebrequin avec la poignée orange, ou lance le moteur. Observe les soupapes, l’étincelle des deux bougies et la couleur des gaz.', takeaway: 'Admission (piston descend), compression (monte), combustion-détente (descend, seul temps moteur), échappement (monte). Deux tours de vilebrequin par cycle. Deux bougies par cylindre : le double allumage.' });
    var W = 600, H = 400, cx = 300, cy = 300, r = 50, l = 130, top = 60;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Coupe d’un cylindre de moteur à 4 temps' }, L.stage);
    // cylindre
    S('rect', { x: cx - 62, y: top, width: 124, height: 180, fill: '#dde4ef', stroke: '#5b6880', 'stroke-width': 4 }, svg);
    var gas = S('rect', { x: cx - 58, y: top + 4, width: 116, height: 40, fill: '#9ec3ff' }, svg);
    var flash = S('circle', { cx: cx, cy: top + 14, r: 30, fill: '#f5a623', opacity: 0 }, svg);
    // culasse, conduits
    S('rect', { x: cx - 80, y: top - 30, width: 160, height: 30, fill: '#5b6880' }, svg);
    S('path', { d: 'M' + (cx - 80) + ',' + (top - 22) + ' L' + (cx - 150) + ',' + (top - 22) + ' L' + (cx - 150) + ',' + (top - 6) + ' L' + (cx - 80) + ',' + (top - 6), fill: '#9ec3ff' }, svg);
    S('path', { d: 'M' + (cx + 80) + ',' + (top - 22) + ' L' + (cx + 150) + ',' + (top - 22) + ' L' + (cx + 150) + ',' + (top - 6) + ' L' + (cx + 80) + ',' + (top - 6), fill: '#b8c4d8' }, svg);
    T(svg, cx - 150, top - 30, 'admission', '#2f6fde', 'start', 12); T(svg, cx + 150, top - 30, 'échappement', '#5b6880', 'end', 12);
    var vIn = S('rect', { x: cx - 48, width: 26, height: 8, fill: '#2f6fde', rx: 2 }, svg), vEx = S('rect', { x: cx + 22, width: 26, height: 8, fill: '#5b6880', rx: 2 }, svg);
    var sp1 = S('circle', { cx: cx - 8, cy: top - 4, r: 5, fill: '#10203f' }, svg), sp2 = S('circle', { cx: cx + 8, cy: top - 4, r: 5, fill: '#10203f' }, svg);
    var piston = S('rect', { x: cx - 58, width: 116, height: 44, rx: 4, fill: '#10203f' }, svg);
    var rod = S('line', { stroke: '#5b6880', 'stroke-width': 12, 'stroke-linecap': 'round' }, svg);
    S('circle', { cx: cx, cy: cy, r: r + 16, fill: 'none', stroke: '#b8c4d8', 'stroke-width': 2, 'stroke-dasharray': '4 4' }, svg);
    S('circle', { cx: cx, cy: cy, r: 10, fill: '#10203f' }, svg);
    var hnd = B.handle(svg);
    var title = T(svg, 20, 30, '', '#10203f', 'start', 18);
    var th = 0, playing = false, rpm = 1;
    var ctl = L.ctrls;
    var play = B.h('<button type="button" class="btn primary">▶ Lancer le moteur</button>'); ctl.appendChild(play);
    var step = B.h('<button type="button" class="btn">Temps suivant →</button>'); ctl.appendChild(step);
    var set = B.readout(ctl, [['t', 'Temps'], ['p', 'Piston'], ['v', 'Soupapes'], ['n', 'Tour du vilebrequin']]);
    var verdict = B.h('<div class="verdict"></div>'); ctl.appendChild(verdict);
    var PH = [['1. Admission', 'descend', 'admission ouverte', '#9ec3ff', 'Le piston descend et aspire le mélange air-essence par la soupape d’admission.'],
      ['2. Compression', 'monte', 'fermées', '#5b8de8', 'Soupapes fermées, le piston comprime le mélange, qui s’échauffe.'],
      ['3. Combustion-détente', 'descend', 'fermées', '#f5a623', 'Les deux bougies font jaillir l’étincelle : la combustion pousse violemment le piston. C’est le seul temps qui fournit du travail.'],
      ['4. Échappement', 'monte', 'échappement ouverte', '#b8c4d8', 'Le piston remonte et chasse les gaz brûlés par la soupape d’échappement.']];
    var loop = B.loop(function (dt) { if (!playing) return false; th = (th + dt * 360 * rpm) % 720; draw(); return true; });
    function draw() {
      var a = th % 360 * RAD;
      var crank = [cx + r * Math.sin(a), cy - r * Math.cos(a)];
      var y = cy - (r * Math.cos(a) + Math.sqrt(l * l - r * r * Math.sin(a) * Math.sin(a))) - 22; // centre de l'axe du piston
      var pTop = y - 22;
      piston.setAttribute('y', pTop.toFixed(1));
      rod.setAttribute('x1', cx); rod.setAttribute('y1', y); rod.setAttribute('x2', crank[0]); rod.setAttribute('y2', crank[1]);
      hnd.setAttribute('transform', 'translate(' + crank[0].toFixed(1) + ',' + crank[1].toFixed(1) + ')');
      var k = Math.floor(th / 180), ph = PH[k];
      gas.setAttribute('height', Math.max(4, pTop - top - 4)); gas.setAttribute('fill', ph[3]);
      vIn.setAttribute('y', top - 8 + (k === 0 ? 14 * Math.sin((th % 180) * RAD) : 0));
      vEx.setAttribute('y', top - 8 + (k === 3 ? 14 * Math.sin((th % 180) * RAD) : 0));
      var spark = th >= 350 && th < 400;
      flash.setAttribute('opacity', spark ? 0.85 : k === 2 ? 0.25 : 0);
      [sp1, sp2].forEach(function (s) { s.setAttribute('fill', spark ? '#f5a623' : '#10203f'); });
      title.textContent = ph[0];
      set('t', ph[0]); set('p', ph[1]); set('v', ph[2]); set('n', th < 360 ? '1er tour' : '2e tour');
      verdict.className = 'verdict' + (k === 2 ? ' good' : ''); verdict.textContent = ph[4];
    }
    play.onclick = function () { playing = !playing; play.textContent = playing ? '⏸ Arrêter' : '▶ Lancer le moteur'; if (playing) loop.start(); };
    step.onclick = function () { playing = false; play.textContent = '▶ Lancer le moteur'; th = (Math.floor(th / 180) + 1) % 4 * 180 + 90; draw(); };
    var lastA = null;
    B.drag(svg, hnd, function (p, phase) {
      playing = false; play.textContent = '▶ Lancer le moteur';
      var a = Math.atan2(p.x - cx, -(p.y - cy)) / RAD; if (a < 0) a += 360;
      var base = th >= 360 ? 360 : 0;
      if (lastA !== null && phase !== 'start') { if (lastA > 300 && a < 60) base = (base + 360) % 720; if (lastA < 60 && a > 300) base = (base + 360) % 720; }
      lastA = a; th = (base + a) % 720; draw();
    });
    hnd.setAttribute('aria-label', 'Vilebrequin, flèches pour tourner');
    hnd.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { th = (th + 15) % 720; draw(); e.preventDefault(); } if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { th = (th + 705) % 720; draw(); e.preventDefault(); } });
    draw();
  }

  /* =================== 2. Chaîne anémo-barométrique et pannes =================== */
  function pitot() {
    var L = B.lab('lab-pitot', { num: '2', title: 'Pitot, prises statiques et pannes d’instruments', hint: 'Fais monter, descendre, accélérer l’avion, puis bouche une prise. Observe comment chaque instrument réagit, et sauve la situation avec la prise statique de secours.', takeaway: 'Anémomètre = pression totale − pression statique. Altimètre et variomètre = pression statique seule. Modèle en atmosphère standard, sans erreur d’installation, temps accéléré 30 fois (montée et descente à 1 000 ft/min).' });
    var W = 600, H = 300;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Schéma de la chaîne anémo-barométrique' }, L.stage);
    // avion et circuits
    S('path', { d: 'M40,150 Q60,120 140,120 L460,126 Q520,130 560,110 L570,150 Q520,170 140,176 Q60,176 40,150Z', fill: '#dde4ef', stroke: '#9aa8c4' }, svg);
    var pit = S('rect', { x: 150, y: 190, width: 70, height: 8, rx: 3, fill: '#10203f' }, svg); T(svg, 150, 216, 'antenne Pitot (pression totale)', '#10203f', 'start', 11);
    var drn = S('circle', { cx: 225, cy: 194, r: 4, fill: '#5b6880' }, svg);
    var stp = S('circle', { cx: 380, cy: 150, r: 8, fill: '#10203f' }, svg); T(svg, 392, 154, 'prise statique', '#10203f', 'start', 11);
    var ptLine = S('path', { d: 'M185,190 L185,95 L120,95 L120,70', fill: 'none', stroke: '#d64541', 'stroke-width': 3 }, svg);
    var psLine = S('path', { d: 'M380,142 L380,110 L130,110 L130,70 M300,110 L300,70 M470,110 L470,70 M380,110 L470,110', fill: 'none', stroke: '#2f6fde', 'stroke-width': 3 }, svg);
    var inst = {};
    [['asi', 125, 'Anémomètre'], ['alt', 300, 'Altimètre'], ['vsi', 470, 'Variomètre']].forEach(function (d) {
      var g = S('g', { transform: 'translate(' + d[1] + ',40)' }, svg);
      S('rect', { x: -62, y: -30, width: 124, height: 56, rx: 12, fill: '#1c2639' }, g);
      T(g, 0, -12, d[2], '#9aa8c4', 'middle', 11);
      inst[d[0]] = T(g, 0, 16, '', '#fff', 'middle', 18);
    });
    T(svg, 20, 290, 'rouge : pression totale · bleu : pression statique', '#5b6880', 'start', 11);
    var st = { alt: 3000, ias: 200, tAlt: 3000, tIas: 200, pitot: false, drain: false, stat: false, alt2: false, Pt0: null, Ps0: null, lastInd: null, vs: 0 };
    var ctl = L.ctrls;
    B.slider(ctl, { label: 'Altitude visée', min: 0, max: 8000, step: 500, value: 3000, fmt: function (v) { return fmt(v) + ' ft'; }, onInput: function (v) { st.tAlt = v; } });
    B.slider(ctl, { label: 'Vitesse visée', min: 120, max: 300, step: 10, value: 200, fmt: function (v) { return v + ' km/h'; }, onInput: function (v) { st.tIas = v; } });
    var tog = B.h('<div class="seg"></div>'); ctl.appendChild(tog);
    function toggle(label, key) {
      var b = B.h('<button type="button" aria-pressed="false">' + label + '</button>');
      b.onclick = function () { st[key] = !st[key]; b.className = st[key] ? 'on' : ''; b.setAttribute('aria-pressed', st[key]); freeze(); };
      tog.appendChild(b);
    }
    toggle('Boucher le Pitot', 'pitot'); toggle('Boucher le drain', 'drain'); toggle('Boucher la statique', 'stat'); toggle('Prise statique de secours', 'alt2');
    var verdict = B.h('<div class="verdict"></div>'); ctl.appendChild(verdict);
    function Ps(altFt) { return B.isa(altFt / 3.28084).P; }
    function q(iasKmh) { var v = iasKmh / 3.6; return 0.5 * 1.225 * v * v; }
    function freeze() {
      var ps = Ps(st.alt);
      if (st.stat && st.Ps0 === null) st.Ps0 = ps; if (!st.stat) st.Ps0 = null;
      if (st.pitot && st.drain && st.Pt0 === null) st.Pt0 = ps + q(st.ias); if (!(st.pitot && st.drain)) st.Pt0 = null;
    }
    var loop = B.loop(function (dt) {
      st.alt += clamp(st.tAlt - st.alt, -500 * dt, 500 * dt); // 1 000 ft/min, temps accéléré × 30
      st.ias += clamp(st.tIas - st.ias, -30 * dt, 30 * dt);
      var psTrue = Ps(st.alt);
      var psMeas = st.stat && !st.alt2 ? st.Ps0 : psTrue;
      var ptMeas = st.pitot ? (st.drain ? st.Pt0 : psMeas) : psTrue + q(st.ias);
      var asi = Math.sqrt(Math.max(0, 2 * (ptMeas - psMeas) / 1.225)) * 3.6;
      // altitude indiquée : inverse de l'atmosphère standard (troposphère)
      var indAlt = (1 - Math.pow(psMeas / 101325, 1 / 5.2559)) * 288.15 / 0.0065 * 3.28084;
      if (st.lastInd !== null && dt > 0) st.vs += ((indAlt - st.lastInd) / dt * 60 / 30 - st.vs) * Math.min(1, dt * 3);
      st.lastInd = indAlt;
      inst.asi.textContent = fmt(asi) + ' km/h'; inst.alt.textContent = fmt(Math.round(indAlt / 10) * 10) + ' ft'; inst.vsi.textContent = (st.vs > 0 ? '+' : '') + fmt(Math.round(st.vs / 10) * 10) + ' ft/min';
      pit.setAttribute('fill', st.pitot ? '#d64541' : '#10203f'); drn.setAttribute('fill', st.drain ? '#d64541' : '#5b6880'); stp.setAttribute('fill', st.stat && !st.alt2 ? '#d64541' : '#10203f');
      var msg;
      if (st.stat && !st.alt2) msg = ['bad', 'Statique bouchée : l’altimètre est figé à ' + fmt(Math.round(indAlt / 10) * 10) + ' ft et le variomètre à zéro, quoi que fasse l’avion. Ouvre la prise statique de secours.'];
      else if (st.pitot && st.drain) msg = ['bad', 'Pitot et drain bouchés : la pression totale est piégée. Monte : l’anémomètre augmente ; descends : il diminue. Il se comporte comme un altimètre. Piège mortel si l’on croit accélérer.'];
      else if (st.pitot) msg = ['warn', 'Pitot bouché, drain ouvert : la pression du tube fuit par le drain, l’anémomètre tombe à zéro. Vole à l’assiette et à la puissance connues.'];
      else if (st.stat && st.alt2) msg = ['good', 'Prise statique de secours ouverte : les instruments refonctionnent (avec une petite erreur en réalité, la pression de cabine étant un peu différente).'];
      else msg = ['', 'Tout fonctionne. Change l’altitude ou la vitesse, puis bouche une prise.'];
      verdict.className = 'verdict ' + msg[0]; verdict.textContent = msg[1];
      return true;
    });
    visible(L.el, loop);
  }

  /* =================== 3. Le longeron en flexion =================== */
  function longeron() {
    var L = B.lab('lab-longeron', { num: '3', title: 'Le longeron : qui est comprimé, qui est tendu ?', hint: 'Tire le bout d’aile vers le haut ou le bas (poignée orange) pour simuler le facteur de charge. Rouge : compression. Bleu : traction.', takeaway: 'Facteur de charge positif : l’aile fléchit vers le haut, extrados comprimé, intrados tendu. Négatif (vol dos, rafale descendante) : c’est l’inverse. Les contraintes sont maximales à l’emplanture.' });
    var W = 600, H = 300, x0 = 80, x1 = 540, y0 = 150;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Aile en flexion' }, L.stage);
    S('rect', { x: 20, y: 90, width: 60, height: 120, rx: 8, fill: '#10203f' }, svg); T(svg, 50, 230, 'fuselage', '#10203f', 'middle', 12);
    var g = S('g', {}, svg), hnd = B.handle(svg);
    var n = 1;
    var set = B.readout(L.ctrls, [['n', 'Facteur de charge'], ['e', 'Extrados'], ['i', 'Intrados']]);
    var verdict = B.h('<div class="verdict"></div>'); L.ctrls.appendChild(verdict);
    function defl(x) { var u = (x - x0) / (x1 - x0); return -n * 14 * u * u * (3 - u); }
    function draw() {
      B.clear(g);
      var U = [], D = [], N = 30;
      for (var i = 0; i <= N; i++) { var x = x0 + (x1 - x0) * i / N, d = defl(x), th = 26 * (1 - 0.6 * i / N); U.push(x + ',' + (y0 + d - th / 2).toFixed(1)); D.push(x + ',' + (y0 + d + th / 2).toFixed(1)); }
      var up = 'M' + U.join(' L'), lo = 'M' + D.join(' L');
      var comp = '#d64541', tens = '#2f6fde', top = n >= 0 ? comp : tens, bot = n >= 0 ? tens : comp;
      S('path', { d: up + ' L' + D.slice().reverse().join(' L') + 'Z', fill: '#dde4ef' }, g);
      S('path', { d: up, fill: 'none', stroke: top, 'stroke-width': 3 + Math.abs(n) * 1.5 }, g);
      S('path', { d: lo, fill: 'none', stroke: bot, 'stroke-width': 3 + Math.abs(n) * 1.5 }, g);
      for (var k = 1; k <= 5; k++) { var xx = x0 + (x1 - x0) * k / 6; B.arrow(g, xx, y0 + defl(xx) + (n >= 0 ? 40 : -40), xx, y0 + defl(xx) + (n >= 0 ? 16 : -16), '#1f9d6a', 2.5); }
      T(g, x0 + 10, y0 - 40, n >= 0 ? 'extrados : compression' : 'extrados : traction', top, 'start', 13);
      T(g, x0 + 10, y0 + 56, n >= 0 ? 'intrados : traction' : 'intrados : compression', bot, 'start', 13);
      hnd.setAttribute('transform', 'translate(' + x1 + ',' + (y0 + defl(x1)) + ')');
      set('n', (n > 0 ? '+' : '') + fmt(n, 1) + ' g', n > 3.8 || n < -1.9 ? 'warn' : '');
      set('e', n >= 0 ? 'compression' : 'traction'); set('i', n >= 0 ? 'traction' : 'compression');
      if (n > 3.8 || n < -1.9) { verdict.className = 'verdict bad'; verdict.textContent = 'Au-delà des limites du DR400 en catégorie normale (+3,8 / −1,9 g) : risque de déformation permanente, puis de rupture.'; }
      else if (n < 0) { verdict.className = 'verdict warn'; verdict.textContent = 'Facteur de charge négatif : l’aile fléchit vers le bas, les rôles s’inversent.'; }
      else { verdict.className = 'verdict good'; verdict.textContent = 'En vol normal, la portance plie l’aile vers le haut : le haut du longeron se raccourcit, le bas s’allonge.'; }
    }
    B.drag(svg, hnd, function (p) { n = Math.round(clamp(-(p.y - y0) / 28, -3, 5) * 10) / 10; draw(); });
    hnd.setAttribute('aria-label', 'Facteur de charge, flèches haut et bas');
    hnd.addEventListener('keydown', function (e) { if (e.key === 'ArrowUp') { n = clamp(n + 0.2, -3, 5); draw(); e.preventDefault(); } if (e.key === 'ArrowDown') { n = clamp(n - 0.2, -3, 5); draw(); e.preventDefault(); } });
    draw();
  }

  /* =================== 4. Turbomachines =================== */
  function turbo() {
    var L = B.lab('lab-turbo', { num: '4', title: 'Turboréacteur, double flux, turbopropulseur', hint: 'Choisis un type de moteur. Pour le double flux, fais varier le taux de dilution et regarde le flux d’air froid grossir autour du cœur.', takeaway: 'Compresseur, chambre de combustion, turbine : le même cœur pour tous. Taux de dilution = débit secondaire (froid) / débit primaire (chaud).' });
    var W = 600, H = 260, cy = 130;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Coupe d’une turbomachine' }, L.stage);
    var body = S('g', {}, svg), parts = S('g', {}, svg);
    var type = 'df', bpr = 8, t = 0, dots = [];
    var ctl = L.ctrls;
    B.seg(ctl, [['sf', 'Simple flux'], ['df', 'Double flux'], ['tp', 'Turbopropulseur'], ['tm', 'Turbomoteur']], 'df', function (v) { type = v; draw(); });
    var bprS = B.slider(ctl, { label: 'Taux de dilution (double flux)', min: 0.5, max: 12, step: 0.5, value: bpr, fmt: function (v) { return fmt(v, 1); }, onInput: function (v) { bpr = v; draw(); } });
    var verdict = B.h('<div class="verdict"></div>'); ctl.appendChild(verdict);
    var TXT = { sf: 'Tout l’air traverse le cœur et ressort très vite et très chaud : beaucoup de poussée pour un moteur fin, mais bruyant et gourmand. Concorde, avions de chasse anciens.', df: '', tp: 'La turbine entraîne une hélice par un réducteur : très efficace jusqu’à environ 600 km/h. ATR 72, C-130 Hercules, TBM.', tm: 'La turbine entraîne un arbre de sortie qui fait tourner le rotor d’un hélicoptère. Alouette II, Écureuil.' };
    function draw() {
      B.clear(body);
      var core = 34, fan = type === 'df' ? core * Math.sqrt(1 + bpr) * 0.75 + 6 : core;
      if (type === 'df') { S('rect', { x: 60, y: cy - fan - 8, width: 420, height: 8, rx: 4, fill: '#5b6880' }, body); S('rect', { x: 60, y: cy + fan, width: 420, height: 8, rx: 4, fill: '#5b6880' }, body); S('rect', { x: 70, y: cy - fan, width: 18, height: fan * 2, fill: '#2f6fde', opacity: 0.6 }, body); T(body, 79, cy - fan - 14, 'soufflante', '#2f6fde', 'middle', 11); }
      if (type === 'tp') { S('rect', { x: 40, y: cy - 110, width: 10, height: 220, rx: 5, fill: '#10203f' }, body); T(body, 45, 18, 'hélice', '#10203f', 'middle', 12); S('rect', { x: 50, y: cy - 6, width: 60, height: 12, fill: '#5b6880' }, body); T(body, 80, cy + 30, 'réducteur', '#5b6880', 'middle', 11); }
      if (type === 'tm') { S('rect', { x: 290, y: 20, width: 10, height: cy - core - 20, fill: '#5b6880' }, body); S('rect', { x: 230, y: 12, width: 130, height: 10, rx: 5, fill: '#10203f' }, body); T(body, 300, 44, 'vers le rotor', '#5b6880', 'start', 11); }
      S('path', { d: 'M110,' + (cy - core) + ' L460,' + (cy - core + 8) + ' L540,' + (cy - core + 16) + ' L540,' + (cy + core - 16) + ' L460,' + (cy + core - 8) + ' L110,' + (cy + core) + 'Z', fill: '#dde4ef', stroke: '#5b6880', 'stroke-width': 2 }, body);
      [[130, 220, '#9ec3ff', 'compresseur'], [230, 300, '#f5a623', 'combustion'], [310, 380, '#d64541', 'turbine'], [390, 540, '#b8c4d8', 'tuyère']].forEach(function (s) { S('rect', { x: s[0], y: cy - core + 6, width: s[1] - s[0], height: core * 2 - 12, fill: s[2], opacity: 0.55 }, body); T(body, (s[0] + s[1]) / 2, cy + core + 22, s[3], '#10203f', 'middle', 11); });
      S('line', { x1: type === 'tp' ? 50 : 110, y1: cy, x2: 390, y2: cy, stroke: '#10203f', 'stroke-width': 4 }, body);
      bprS.el.disabled = type !== 'df';
      verdict.className = 'verdict'; verdict.textContent = type === 'df' ? 'Taux de dilution ' + fmt(bpr, 1) + ' : pour 1 kg d’air chaud dans le cœur, ' + fmt(bpr, 1) + ' kg d’air froid passent autour. ' + (bpr >= 10 ? 'Valeur des moteurs récents d’avions de ligne : sobres et silencieux.' : bpr <= 1 ? 'Valeur d’un moteur d’avion de chasse : fin et puissant à grande vitesse.' : 'Plus il est grand, plus le moteur est sobre et silencieux.') : TXT[type];
      dots = [];
    }
    var loop = B.loop(function (dt) {
      t += dt; B.clear(parts);
      var core = 34, fan = type === 'df' ? core * Math.sqrt(1 + bpr) * 0.75 + 6 : core;
      for (var i = 0; i < 14; i++) {
        var x = 90 + ((t * 160 + i * 34) % 470), yy = cy + ((i * 37) % 50 - 25) / 25 * (core - 12);
        S('circle', { cx: x, cy: yy, r: 3, fill: x > 230 ? '#d64541' : '#2f6fde' }, parts);
        if (type === 'df') { var y2 = cy - core - 4 - ((i * 13) % 10) / 10 * (fan - core - 4); S('circle', { cx: 80 + ((t * 120 + i * 32) % 400), cy: y2, r: 3, fill: '#2f6fde' }, parts); S('circle', { cx: 80 + ((t * 120 + i * 32 + 16) % 400), cy: 2 * cy - y2, r: 3, fill: '#2f6fde' }, parts); }
      }
      return true;
    });
    draw(); visible(L.el, loop);
  }

  /* =================== 5. Orbites =================== */
  function orbite() {
    var L = B.lab('lab-orbite', { num: '5', title: 'Mets un satellite en orbite', hint: 'Éloigne ou rapproche le satellite (poignée orange), ou choisis une orbite connue. Compare sa vitesse et la durée d’un tour.', takeaway: 'v = √(GM / r) et T = 2π √(r³ / GM), avec GM = 398 600 km³/s². Échelle des distances non proportionnelle (logarithmique), pour tout faire tenir.' });
    var W = 600, H = 400, cx = 300, cy = 200, RE = 6371, GM = 398600;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Terre et orbite de satellite' }, L.stage);
    S('rect', { width: W, height: H, fill: '#0b1530' }, svg);
    for (var i = 0; i < 60; i++) S('circle', { cx: (i * 97) % W, cy: (i * 53) % H, r: (i % 3) * 0.5 + 0.5, fill: '#fff', opacity: 0.5 }, svg);
    var orb = S('circle', { cx: cx, cy: cy, fill: 'none', stroke: '#9ec3ff', 'stroke-dasharray': '4 6' }, svg);
    S('circle', { cx: cx, cy: cy, r: 50, fill: '#2f6fde' }, svg);
    S('path', { d: 'M' + (cx - 30) + ',' + (cy - 20) + ' q20,-15 35,5 q10,20 -10,30 q-20,5 -25,-35Z', fill: '#1f9d6a' }, svg);
    var sat = S('g', {}, svg); S('rect', { x: -6, y: -6, width: 12, height: 12, fill: '#f5a623' }, sat); S('rect', { x: -22, y: -3, width: 14, height: 6, fill: '#9ec3ff' }, sat); S('rect', { x: 8, y: -3, width: 14, height: 6, fill: '#9ec3ff' }, sat);
    var hnd = B.handle(svg, 22);
    var alt = 400, ang = 0;
    function px(a) { return 50 + 75 * Math.log10(1 + a / 1000); }
    var pre = B.h('<div class="seg"></div>'); L.ctrls.appendChild(pre);
    [['Station spatiale', 400], ['Orbite héliosynchrone', 800], ['GPS / Galileo', 20200], ['Géostationnaire', 35786]].forEach(function (p) { var b = B.h('<button type="button">' + p[0] + '</button>'); b.onclick = function () { alt = p[1]; draw(); }; pre.appendChild(b); });
    var set = B.readout(L.ctrls, [['a', 'Altitude'], ['v', 'Vitesse'], ['vk', 'En km/h'], ['t', 'Durée d’un tour'], ['j', 'Tours par jour']]);
    var verdict = B.h('<div class="verdict"></div>'); L.ctrls.appendChild(verdict);
    function per() { var r = RE + alt; return 2 * Math.PI * Math.sqrt(r * r * r / GM); }
    function draw() {
      var r = RE + alt, v = Math.sqrt(GM / r), T0 = per();
      orb.setAttribute('r', px(alt));
      set('a', fmt(alt) + ' km'); set('v', fmt(v, 2) + ' km/s'); set('vk', fmt(v * 3600) + ' km/h');
      var hh = Math.floor(T0 / 3600), mm = Math.round(T0 % 3600 / 60); if (mm === 60) { hh++; mm = 0; }
      set('t', hh + ' h ' + (mm < 10 ? '0' : '') + mm); set('j', fmt(86164 / T0, 1));
      verdict.className = 'verdict';
      verdict.textContent = Math.abs(T0 - 86164) < 600 ? 'Période d’un jour sidéral : au-dessus de l’équateur, le satellite paraît immobile. C’est l’orbite géostationnaire, celle des satellites de télévision et de météo.' : alt < 2000 ? 'Orbite basse : très rapide, plusieurs tours par jour. Station spatiale, satellites d’observation.' : 'Plus haut, plus lent : la période s’allonge plus vite que la distance (troisième loi de Kepler).';
    }
    var loop = B.loop(function (dt) { ang += dt * 360 / (per() / 900); var R = px(alt); sat.setAttribute('transform', 'translate(' + (cx + R * Math.cos(ang * RAD)).toFixed(1) + ',' + (cy + R * Math.sin(ang * RAD)).toFixed(1) + ')'); hnd.setAttribute('transform', 'translate(' + (cx + R) + ',' + cy + ')'); return true; });
    B.drag(svg, hnd, function (p) { var d = Math.hypot(p.x - cx, p.y - cy); var a = (Math.pow(10, (clamp(d, 55, 185) - 50) / 75) - 1) * 1000; alt = Math.round(clamp(a, 200, 40000) / 10) * 10; draw(); });
    hnd.setAttribute('aria-label', 'Altitude du satellite, flèches pour régler');
    hnd.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { alt = clamp(Math.round(alt * 1.15), 200, 40000); draw(); e.preventDefault(); } if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { alt = clamp(Math.round(alt / 1.15), 200, 40000); draw(); e.preventDefault(); } });
    draw(); visible(L.el, loop);
  }

  /* =================== 6. Reconnaître les configurations =================== */
  var CONF = [['c172', 'Aile haute'], ['cub', 'Aile haute'], ['c130', 'Aile haute'], ['an225', 'Aile haute'], ['dr400', 'Aile basse'], ['cap10', 'Aile basse'], ['a320', 'Aile basse'], ['b737', 'Aile basse'], ['spitfire', 'Aile basse'], ['mirage3', 'Aile delta'], ['concorde', 'Aile delta'], ['rafale', 'Formule canard'], ['spad', 'Biplan'], ['fokker', 'Triplan'], ['alouette', 'Hélicoptère'], ['p38', 'Double poutre']];
  var NAMES = { c172: 'Cessna 172', cub: 'Piper J-3 Cub', c130: 'C-130 Hercules', an225: 'Antonov An-225', dr400: 'Robin DR400', cap10: 'Mudry CAP 10', a320: 'Airbus A320', b737: 'Boeing 737', spitfire: 'Supermarine Spitfire', mirage3: 'Dassault Mirage III', concorde: 'Concorde', rafale: 'Dassault Rafale', spad: 'SPAD XIII', fokker: 'Fokker Dr.I', alouette: 'Alouette II', p38: 'Lockheed P-38' };
  function config() {
    var L = B.lab('lab-config', { num: '6', title: 'Reconnais la configuration', hint: 'À l’examen, une photo, quatre réponses. Quelle est la configuration de cet appareil ?', takeaway: 'Photos de la galerie des avions mythiques (Wikimedia Commons, crédits dans chaque fiche).' });
    L.stage.style.touchAction = 'auto';
    var cats = CONF.map(function (c) { return c[1]; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    var score = 0, n = 0;
    var set = B.readout(L.ctrls, [['s', 'Score']]);
    var verdict = B.h('<div class="verdict">Choisis la bonne configuration.</div>'); L.ctrls.appendChild(verdict);
    function q() {
      var it = CONF[Math.floor(Math.random() * CONF.length)];
      var opts = [it[1]].concat(cats.filter(function (c) { return c !== it[1]; }).sort(function () { return Math.random() - 0.5; }).slice(0, 3)).sort(function () { return Math.random() - 0.5; });
      L.stage.innerHTML = '<div style="padding:12px"><img src="/mythiques/photos/' + it[0] + '.webp" alt="Appareil à identifier" style="width:100%;aspect-ratio:3/2;object-fit:cover;border-radius:12px;display:block"><div class="choices" style="margin-top:10px"></div></div>';
      var box = L.stage.querySelector('.choices');
      opts.forEach(function (o, k) {
        var b = B.h('<button type="button" class="choice"><b>' + 'ABCD'[k] + '</b><span>' + o + '</span></button>');
        b.onclick = function () {
          [].forEach.call(box.children, function (x, j) { x.disabled = true; if (opts[j] === it[1]) x.classList.add('right'); });
          n++; if (o === it[1]) score++; else b.classList.add('wrong');
          set('s', score + ' / ' + n);
          verdict.className = 'verdict ' + (o === it[1] ? 'good' : 'bad'); verdict.textContent = NAMES[it[0]] + ' : ' + it[1].toLowerCase() + '.';
          var nx = B.h('<button type="button" class="btn primary" style="margin-top:10px">Photo suivante →</button>'); nx.onclick = q; L.stage.firstChild.appendChild(nx);
        };
        box.appendChild(b);
      });
    }
    set('s', '0 / 0'); q();
  }

  function init() {
    moteur(); pitot(); longeron(); turbo(); orbite(); config();
    B.quiz(document.getElementById('quiz'), window.QAERONEFS || []);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
