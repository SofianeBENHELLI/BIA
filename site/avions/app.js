/* Onglet Avions : Robin DR400. Vitesses : certificat de type EASA A.367 et manuel de vol DR400/180. */
(function () {
  'use strict';
  var B = window.BIA, S = B.svg, T = B.text, fmt = B.fmt, clamp = B.clamp, RAD = Math.PI / 180;

  var VARIANTS = [
    { img: 'v120', n: 'DR400/120 « Dauphin 2+2 »', d: 'La version la plus vendue. 108 à 112 ch, 900 kg maximum, deux adultes et deux enfants. Un grand classique de l’école.', cr: 'Cjp24 · CC BY-SA 4.0', u: 'Robin_DR400-120,_F-GKQZ.jpg' },
    { img: 'v140b', n: 'DR400/140B « Dauphin 4 »', d: '160 ch, quatre vraies places, 1 000 kg maximum. Polyvalent : école, voyage, baptêmes.', cr: 'Cjp24 · CC BY-SA 4.0', u: 'Robin_DR400-140B_Dauphin.jpg' },
    { img: 'v180', n: 'DR400/180 « Régent »', d: '180 ch, trois réservoirs (110 + 2 × 40 L), 1 100 kg : quatre adultes, le plein et des bagages. Le voyageur.', cr: 'Cjp24 · CC BY-SA 4.0', u: 'Robin_DR400-180_R%C3%A9gent,_F-GTPH.jpg' },
    { img: 'v180r', n: 'DR400/180R « Remorqueur »', d: 'Équipé d’un crochet pour tracter les planeurs jusqu’à leur altitude de largage. On le voit ici avec son planeur.', cr: 'Raimond Spekking · CC BY-SA 4.0', u: 'Robin_DR400-180R_-_D-EGTW_-_towing_glider_D-6403_over_Bad_H%C3%B6nningen-0181.jpg' }
  ];
  function variants() {
    var g = document.getElementById('vgrid');
    VARIANTS.forEach(function (v) {
      g.appendChild(B.h('<figure class="photo card" style="padding:0"><img src="photos/' + v.img + '.webp" alt="' + B.esc(v.n) + '" loading="lazy"><figcaption><b style="color:var(--head);font-size:15px">' + v.n + '</b><br><span style="font-size:14px;color:var(--ink)">' + v.d + '</span><br>Photo : ' + v.cr + ', réduite · <a href="https://commons.wikimedia.org/wiki/File:' + v.u + '" target="_blank" rel="noopener">Commons</a></figcaption></figure>'));
    });
  }

  /* =================== Anémomètre interactif =================== */
  var MARKS = [
    [95, 'Vs0', 'Décrochage volets sortis (60°) à 1 100 kg : début de l’arc blanc.'],
    [99, 'Vs1 volets 15°', 'Décrochage au premier cran de volets.'],
    [100, 'Décollage', 'On décolle « franchement » vers 100 km/h, sans soulager la roue avant trop tôt.'],
    [105, 'Vs', 'Décrochage volets rentrés à 1 100 kg : début de l’arc vert.'],
    [125, 'Approche', 'Vitesse d’approche finale à 1 045 kg, volets sortis, réchauffage carburateur tiré.'],
    [130, 'Vx', 'Meilleur angle de montée, un cran de volets : pour passer un obstacle.'],
    [150, 'Plané', 'Meilleure finesse, environ 9,5 : la vitesse à prendre en cas de panne moteur.'],
    [165, 'Vy', 'Montée normale, 160 à 170 km/h volets rentrés, plein gaz.'],
    [170, 'VFE', 'Vitesse maximale volets sortis : fin de l’arc blanc.'],
    [215, 'VA', 'Vitesse de manœuvre : au-dessus, un braquage complet des gouvernes peut endommager la structure.'],
    [248, 'Croisière 75 %', 'Environ 248 km/h vraie au niveau de la mer, 39 L/h (manuel 180).'],
    [260, 'VNO', 'Fin de l’arc vert : au-dessus, air calme uniquement.'],
    [308, 'VNE', 'Trait rouge : vitesse à ne jamais dépasser.']
  ];
  function anemo() {
    var L = B.lab('lab-anemo', { num: '1', title: 'L’anémomètre du DR400/180', hint: 'Fais tourner l’aiguille (poignée orange) ou touche une phase de vol. Lis la couleur de l’arc et ce qu’elle t’autorise.', takeaway: 'Arc blanc 95 à 170 : volets autorisés. Arc vert 105 à 260 : utilisation normale. Arc jaune 260 à 308 : air calme seulement. Trait rouge 308 : jamais au-delà.' });
    var W = 600, H = 420, cx = 300, cy = 215, R = 170, A0 = -140, A1 = 140, VMAX = 350;
    var ang = function (v) { return A0 + (A1 - A0) * v / VMAX; };
    var pt = function (v, r) { var a = ang(v) * RAD; return [cx + Math.sin(a) * r, cy - Math.cos(a) * r]; };
    function arc(v1, v2, r, w, col) {
      var p1 = pt(v1, r), p2 = pt(v2, r), large = (ang(v2) - ang(v1)) > 180 ? 1 : 0;
      S('path', { d: 'M' + p1[0] + ',' + p1[1] + ' A' + r + ',' + r + ' 0 ' + large + ' 1 ' + p2[0] + ',' + p2[1], fill: 'none', stroke: col, 'stroke-width': w }, svg);
    }
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Anémomètre du DR400' }, L.stage);
    S('circle', { cx: cx, cy: cy, r: R + 24, fill: '#10203f' }, svg); S('circle', { cx: cx, cy: cy, r: R + 14, fill: '#1c2639' }, svg);
    arc(95, 170, R - 22, 10, '#ffffff');
    arc(105, 260, R - 8, 12, '#1f9d6a');
    arc(260, 308, R - 8, 12, '#f5a623');
    var r1 = pt(308, R - 20), r2 = pt(308, R + 4); S('line', { x1: r1[0], y1: r1[1], x2: r2[0], y2: r2[1], stroke: '#d64541', 'stroke-width': 6 }, svg);
    for (var v = 0; v <= 340; v += 20) {
      var a1 = pt(v, R + 4), a2 = pt(v, R - (v % 40 ? 2 : 10)); S('line', { x1: a1[0], y1: a1[1], x2: a2[0], y2: a2[1], stroke: '#fff', 'stroke-width': 2 }, svg);
      if (v % 40 === 0 && v >= 40) { var tp = pt(v, R - 40); T(svg, tp[0], tp[1] + 5, String(v), '#fff', 'middle', 15); }
    }
    T(svg, cx, cy + 60, 'km/h', '#9aa8c4', 'middle', 13); T(svg, cx, cy + 78, 'DR400/180', '#9aa8c4', 'middle', 11);
    var marks = S('g', {}, svg);
    var needle = S('g', {}, svg);
    S('polygon', { points: '-5,20 5,20 2,-' + (R - 10) + ' -2,-' + (R - 10), fill: '#fff' }, needle); S('circle', { r: 12, fill: '#f5a623' }, needle);
    var hnd = B.handle(svg, 22);
    var spd = 125;
    var phases = B.h('<div class="seg"></div>'); L.ctrls.appendChild(phases);
    [['Décollage', 100], ['Vx', 130], ['Montée', 165], ['Croisière', 248], ['Plané', 150], ['Approche', 125], ['VFE', 170], ['VNO', 260], ['VNE', 308]].forEach(function (p) { var b = B.h('<button type="button">' + p[0] + '</button>'); b.onclick = function () { spd = p[1]; draw(); }; phases.appendChild(b); });
    var set = B.readout(L.ctrls, [['v', 'Vitesse indiquée'], ['kt', 'En nœuds'], ['z', 'Zone']]);
    var verdict = B.h('<div class="verdict"></div>'); L.ctrls.appendChild(verdict);
    function zone(v) {
      if (v >= 308) return ['trait rouge', 'bad', 'Au-delà de la VNE : risque de rupture ou de flottement des gouvernes. Interdit.'];
      if (v > 260) return ['arc jaune', 'warn', 'Au-dessus de la VNO : uniquement en air calme, sans braquage brutal.'];
      if (v >= 105) return [v <= 170 ? 'arc vert et blanc' : 'arc vert', 'good', v <= 170 ? 'Plage normale, volets autorisés.' : 'Plage normale d’utilisation, volets rentrés.' + (v > 215 ? ' Au-dessus de la VA : pas de braquage complet des gouvernes.' : '')];
      if (v >= 95) return ['arc blanc seul', 'warn', 'Seulement avec les volets sortis : volets rentrés, tu es en dessous de la vitesse de décrochage.'];
      return ['sous l’arc blanc', 'bad', 'Sous la vitesse de décrochage à la masse maximale, même volets sortis.'];
    }
    function draw() {
      needle.setAttribute('transform', 'translate(' + cx + ',' + cy + ') rotate(' + ang(spd) + ')');
      var hp = pt(spd, R - 70); hnd.setAttribute('transform', 'translate(' + hp[0].toFixed(1) + ',' + hp[1].toFixed(1) + ')');
      B.clear(marks);
      var near = MARKS.reduce(function (b, m) { return Math.abs(m[0] - spd) < Math.abs(b[0] - spd) ? m : b; });
      MARKS.forEach(function (m) { var p1 = pt(m[0], R + 14), p2 = pt(m[0], R + 24); S('line', { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], stroke: m === near ? '#f5a623' : '#9aa8c4', 'stroke-width': m === near ? 4 : 2 }, marks); });
      var z = zone(spd);
      set('v', fmt(spd) + ' km/h'); set('kt', fmt(spd / 1.852) + ' kt'); set('z', z[0], z[1] === 'bad' ? 'warn' : z[1] === 'good' ? 'good' : '');
      verdict.className = 'verdict ' + z[1];
      verdict.innerHTML = z[2] + (Math.abs(near[0] - spd) <= 4 ? '<br><b>' + near[1] + ' (' + near[0] + ' km/h)</b> : ' + near[2] : '');
    }
    B.drag(svg, hnd, function (p) {
      var a = Math.atan2(p.x - cx, -(p.y - cy)) / RAD;
      spd = Math.round(clamp((a - A0) / (A1 - A0) * VMAX, 0, VMAX));
      draw();
    });
    hnd.setAttribute('aria-label', 'Vitesse, flèches pour régler');
    hnd.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { spd = clamp(spd + 5, 0, VMAX); draw(); e.preventDefault(); } if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { spd = clamp(spd - 5, 0, VMAX); draw(); e.preventDefault(); } });
    draw();
  }

  /* =================== Tableau de bord schématique =================== */
  var PANEL = [
    { id: 'anemo', x: 90, y: 90, l: 'Anémomètre', d: 'Vitesse par rapport à l’air, grâce à l’antenne Pitot et aux prises statiques. C’est l’instrument qui t’évite le décrochage. Lis ses arcs de couleur (atelier 1).' },
    { id: 'horizon', x: 200, y: 90, l: 'Horizon artificiel', d: 'Assiette et inclinaison de l’avion, grâce à un gyroscope. En option sur le DR400, souvent entraîné par une pompe à vide.' },
    { id: 'alti', x: 310, y: 90, l: 'Altimètre', d: 'Altitude, grâce aux prises statiques. Il faut le caler : QNH (altitude), QFE (hauteur) ou 1013 (niveau de vol).' },
    { id: 'virage', x: 90, y: 200, l: 'Indicateur de virage et bille', d: 'Taux de virage, et la bille qui montre si le vol est symétrique. « Marche sur la bille » : mets du pied du côté où elle part.' },
    { id: 'cap', x: 200, y: 200, l: 'Conservateur de cap', d: 'Cap stable et facile à lire, mais il dérive : on le recale régulièrement sur le compas, en vol stabilisé.' },
    { id: 'vario', x: 310, y: 200, l: 'Variomètre', d: 'Vitesse verticale de montée ou de descente, en pieds par minute ou en mètres par seconde.' },
    { id: 'tours', x: 420, y: 90, l: 'Compte-tours', d: 'Régime moteur en tours par minute, avec le totalisateur d’heures de vol. Une baisse de régime inexpliquée fait penser au givrage carburateur.' },
    { id: 'moteur', x: 420, y: 200, l: 'Température et pression d’huile', d: 'La santé du moteur. Pression d’huile qui chute en vol : se préparer à un atterrissage, le moteur peut s’arrêter.' },
    { id: 'essence', x: 520, y: 90, l: 'Jauges d’essence', d: 'Une jauge par réservoir sur le DR400/180. On les vérifie toujours visuellement au sol : une jauge peut mentir.' },
    { id: 'amp', x: 520, y: 200, l: 'Ampèremètre', d: 'Indique si l’alternateur charge la batterie. En décharge : couper l’alternateur et réduire les consommateurs ; le moteur continue de tourner grâce aux magnétos.' },
    { id: 'compas', x: 200, y: 24, l: 'Compas magnétique', d: 'Le cap de secours, sans électricité. Il est faux en virage et en accélération : on le lit en vol rectiligne stabilisé.' },
    { id: 'magnetos', x: 90, y: 300, l: 'Contact magnétos et démarreur', d: 'Deux magnétos indépendantes allument les bougies, sans batterie. Positions : OFF, R, L, BOTH. On vole toujours sur BOTH.' },
    { id: 'gaz', x: 260, y: 300, l: 'Manette des gaz', d: 'La puissance. Sur le DR400, elle est au centre du tableau, avec une pompe de reprise. Poussée = plein gaz.' },
    { id: 'richesse', x: 330, y: 300, l: 'Richesse (tirette jaune)', d: 'Le mélange air et essence. Plein riche au décollage et à l’atterrissage ; on appauvrit en croisière. Tirée à fond, elle arrête le moteur (étouffoir).' },
    { id: 'rechauf', x: 400, y: 300, l: 'Réchauffage carburateur', d: 'Tout ou rien. Tiré moteur réduit, en descente et en approche ; repoussé pour le décollage et la remise de gaz. Il fait perdre environ 150 tr/min.' },
    { id: 'robinet', x: 470, y: 300, l: 'Robinet d’essence', d: 'Choix du réservoir et fermeture du circuit. Sur le DR400/180 : arrière, avant gauche, avant droit. Au décollage, le réservoir le plus plein.' },
    { id: 'pompe', x: 540, y: 300, l: 'Pompe électrique', d: 'Pompe de secours : en marche au démarrage, au décollage, à l’atterrissage et en descente, pour garantir l’alimentation si la pompe mécanique faiblit.' },
    { id: 'volets', x: 160, y: 380, l: 'Levier de volets', d: 'Entre les sièges, trois crans : 0°, 15° et 60°. Jamais au-dessus de la VFE, 170 km/h.' },
    { id: 'trim', x: 300, y: 380, l: 'Volant de trim', d: 'Règle le tab pour annuler l’effort sur le manche. On compense après chaque changement de vitesse.' },
    { id: 'frein', x: 440, y: 380, l: 'Frein de parc', d: 'Poignée de frein à main. Serré pour la mise en route et les essais moteur.' }
  ];
  function tableau() {
    var L = B.lab('lab-tableau', { num: '2', title: 'Le tableau de bord, élément par élément', hint: 'Touche un instrument ou une commande. Schéma type d’un DR400 : la disposition exacte change d’un avion à l’autre.', takeaway: 'Les six instruments de vol : en haut anémomètre, horizon, altimètre ; en bas virage et bille, conservateur de cap, variomètre.' });
    var W = 600, H = 420;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Tableau de bord schématique' }, L.stage);
    S('rect', { x: 20, y: 40, width: 560, height: 220, rx: 18, fill: '#1c2639' }, svg);
    S('rect', { x: 30, y: 262, width: 540, height: 70, rx: 12, fill: '#283552' }, svg);
    S('rect', { x: 120, y: 350, width: 360, height: 60, rx: 12, fill: '#d9e2f0' }, svg);
    T(svg, 300, 418, 'entre les sièges', '#5b6880', 'middle', 10);
    var sel = null, info = B.h('<div class="verdict">Touche un élément du tableau.</div>');
    L.ctrls.appendChild(info);
    var found = {}, score = B.h('<p class="small">Éléments découverts : <b>0</b> / ' + PANEL.length + '</p>'); L.ctrls.appendChild(score);
    PANEL.forEach(function (p) {
      var g = S('g', { transform: 'translate(' + p.x + ',' + p.y + ')', tabindex: 0, role: 'button', 'aria-label': p.l, style: 'cursor:pointer' }, svg);
      var inst = p.y < 260;
      if (p.id === 'compas') { S('rect', { x: -30, y: -14, width: 60, height: 28, rx: 6, fill: '#000' }, g); T(g, 0, 5, 'N  30  60', '#fff', 'middle', 11); }
      else if (inst) { S('circle', { r: 44, fill: '#000', stroke: '#5b6880', 'stroke-width': 3 }, g); S('circle', { r: 36, fill: '#111827' }, g); }
      else { S('rect', { x: -28, y: -18, width: 56, height: 36, rx: 8, fill: '#fff', stroke: '#9aa8c4' }, g); }
      var lab = T(g, 0, inst && p.id !== 'compas' ? 4 : 4, p.l.split(' ')[0], inst ? '#fff' : '#10203f', 'middle', inst ? 11 : 10);
      var ring = S('circle', { r: inst ? 48 : 34, fill: 'none', stroke: '#f5a623', 'stroke-width': 4, opacity: 0 }, g);
      function pick() {
        if (sel) sel.setAttribute('opacity', 0);
        ring.setAttribute('opacity', 1); sel = ring;
        found[p.id] = 1;
        score.innerHTML = 'Éléments découverts : <b>' + Object.keys(found).length + '</b> / ' + PANEL.length;
        info.className = 'verdict good'; info.innerHTML = '<b>' + p.l + '</b><br>' + p.d;
      }
      g.addEventListener('click', pick); g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { pick(); e.preventDefault(); } });
    });
    L.stage.style.touchAction = 'auto';
  }

  /* =================== Check-lists =================== */
  var CHECK = {
    'Visite prévol': ['Masse et centrage dans les limites', 'Batterie en marche, lire les jauges, puis batterie coupée', 'Contacts magnétos coupés, robinet d’essence ouvert', 'Purger les réservoirs (premier vol du jour, après un plein)', 'Bouchons et mises à l’air libre des réservoirs', 'Prises statiques et antenne Pitot propres et dégagées', 'Empennages, tab, charnières de direction et d’ailerons', 'Volets en appui sur leurs cales', 'Retirer amarrages, cache-Pitot et fourche de manœuvre', 'Trains et pneus (pression, amortisseurs)', 'Verrière propre', 'Niveau d’huile : pas de vol sous 3,8 L'],
    'Avant mise en route': ['Bagages arrimés', 'Sièges réglés et ceintures attachées', 'Verrière verrouillée', 'Commandes libres', 'Frein de parc serré', 'Tab au neutre', 'Richesse plein riche', 'Réchauffage carburateur poussé', 'Essence ouverte sur le bon réservoir', 'Volets rentrés'],
    'Mise en route': ['Pompe électrique en marche', 'Deux injections avec la manette des gaz', 'Batterie et alternateur', 'Contact sur une magnéto, démarreur', 'Contact sur les deux magnétos (BOTH)', 'Ralenti le plus bas sans vibration, pression d’huile qui monte'],
    'Avant décollage': ['Chauffe vers 1 200 tr/min, pas de point fixe prolongé', 'Magnétos à 1 800 tr/min : chute de 125 tr/min au maximum', 'Test de coupure vers 1 000 tr/min', 'Instruments et radio', 'Actions vitales (check-list du club)'],
    'Décollage et montée': ['Réchauffage carburateur et richesse poussés', 'Plein gaz progressivement, régime au moins 2 200 tr/min', 'Ne pas soulager la roue avant', 'Décoller franchement vers 100 km/h', 'Monter vers 130 km/h, puis 160 à 170 km/h volets rentrés', 'Couper la pompe électrique en montée'],
    'Croisière': ['Régler la puissance et le tab', 'Appauvrir le mélange, réajuster à chaque changement', 'Surveiller régime, huile, essence et réservoirs'],
    'Descente et atterrissage': ['Réchauffage carburateur tiré moteur réduit', 'Richesse plein riche', 'Pompe électrique en marche', 'Volets sous 170 km/h', 'Finale stabilisée à 125 km/h (DR400/180 à 1 045 kg)', 'Remise de gaz : réchauffage repoussé, volets au premier cran'],
    'Après atterrissage': ['Volets rentrés au roulage', 'Frein de parc, 1 200 tr/min, test des magnétos', 'Arrêt moteur par la richesse (étouffoir)', 'Contacts et batterie coupés', 'Sortir les volets à l’arrêt pour qu’on ne marche pas dessus']
  };
  function checklists() {
    var L = B.lab('lab-check', { num: '3', title: 'Récite tes check-lists', hint: 'Choisis une phase et coche chaque étape à voix haute, comme en vol.', takeaway: 'D’après le manuel de vol DR400/180. À bord, c’est la check-list de ton aéroclub qui s’applique.' });
    L.stage.style.touchAction = 'auto';
    L.stage.innerHTML = '<div style="padding:12px"><div class="checklist" id="cl"></div></div>';
    var box = L.stage.querySelector('#cl'), phase = Object.keys(CHECK)[0];
    var tabs = B.h('<div class="seg"></div>'); L.ctrls.appendChild(tabs);
    var set = B.readout(L.ctrls, [['p', 'Progression']]);
    var reset = B.h('<button type="button" class="btn">Tout décocher</button>'); L.ctrls.appendChild(reset);
    Object.keys(CHECK).forEach(function (k) { var b = B.h('<button type="button">' + k + '</button>'); if (k === phase) b.className = 'on'; b.onclick = function () { phase = k; [].forEach.call(tabs.children, function (x) { x.className = ''; }); b.className = 'on'; render(); }; tabs.appendChild(b); });
    function render() {
      box.innerHTML = '';
      CHECK[phase].forEach(function (it) {
        var l = B.h('<label><input type="checkbox"><span>' + B.esc(it) + '</span></label>');
        var c = l.querySelector('input');
        c.onchange = function () { l.classList.toggle('done', c.checked); upd(); };
        box.appendChild(l);
      });
      upd();
    }
    function upd() { var all = box.querySelectorAll('input'), n = box.querySelectorAll('input:checked').length; set('p', n + ' / ' + all.length, n === all.length ? 'good' : ''); }
    reset.onclick = render;
    render();
  }

  /* =================== Carburant et autonomie =================== */
  function fuel() {
    var L = B.lab('lab-fuel', { num: '4', title: 'Autonomie et réserve du DR400/180', hint: 'Règle le carburant au départ, la puissance de croisière et le vent. Le réservoir montre ce qui est utilisable et ce qui doit rester en réserve.', takeaway: 'Consommation du manuel DR400/180 : 39 L/h à 75 % (environ 248 km/h) et 32 L/h à 60 % (environ 228 km/h), au niveau de la mer. Réserve réglementaire de jour en VFR : 30 minutes de vol (10 minutes pour un vol local en vue de l’aérodrome), règlement européen Part-NCO.' });
    var W = 600, H = 260;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Jauge de carburant' }, L.stage);
    var g = S('g', {}, svg);
    var st = { fuel: 190, p: 75, wind: 0, std92: false, res: 30 };
    B.slider(L.ctrls, { label: 'Carburant au départ', min: 20, max: 190, step: 5, value: st.fuel, fmt: function (v) { return v + ' L'; }, onInput: function (v) { st.fuel = v; draw(); } });
    B.seg(L.ctrls, [[75, 'Croisière 75 %'], [60, 'Économique 60 %']], 75, function (v) { st.p = v; draw(); });
    B.slider(L.ctrls, { label: 'Vent (négatif = vent arrière)', min: -40, max: 40, step: 5, value: 0, fmt: function (v) { return v > 0 ? v + ' km/h de face' : v < 0 ? (-v) + ' km/h arrière' : 'nul'; }, onInput: function (v) { st.wind = v; draw(); } });
    B.seg(L.ctrls, [[false, 'Avion Standard 88 (10 L inutilisables)'], [true, 'Standard 92 (1 L)']], false, function (v) { st.std92 = v; draw(); });
    B.seg(L.ctrls, [[30, 'Réserve 30 min'], [60, 'Réserve personnelle 1 h']], 30, function (v) { st.res = v; draw(); });
    var set = B.readout(L.ctrls, [['e', 'Autonomie totale'], ['u', 'Avant d’entamer la réserve'], ['d', 'Distance possible']]);
    var verdict = B.h('<div class="verdict"></div>'); L.ctrls.appendChild(verdict);
    function draw() {
      var ff = st.p === 75 ? 39 : 32, tas = st.p === 75 ? 248 : 228, unus = st.std92 ? 1 : 10;
      var usable = Math.max(0, st.fuel - unus), resL = ff * st.res / 60, flyL = Math.max(0, usable - resL);
      var tot = usable / ff, fly = flyL / ff, gs = tas - st.wind;
      B.clear(g);
      var x0 = 40, w = 520, y = 60, h = 70, sc = w / 190;
      S('rect', { x: x0, y: y, width: w, height: h, rx: 12, fill: '#fff', stroke: '#9aa8c4', 'stroke-width': 2 }, g);
      var xx = x0;
      [[unus, '#9aa8c4', 'inutilisable'], [Math.min(resL, usable), '#d64541', 'réserve'], [flyL, '#1f9d6a', 'pour voler']].forEach(function (s) {
        var ww = Math.min(s[0], Math.max(0, st.fuel - (xx - x0) / sc)) * sc;
        if (ww > 0) { S('rect', { x: xx, y: y + 4, width: ww, height: h - 8, fill: s[1], rx: 6 }, g); if (ww > 60) T(g, xx + ww / 2, y + h / 2 + 5, s[2], '#fff', 'middle', 13); xx += ww; }
      });
      T(g, x0, y - 12, '0 L', '#5b6880', 'start', 12); T(g, x0 + 110 * sc, y - 12, '110 L (principal)', '#5b6880', 'middle', 12); T(g, x0 + w, y - 12, '190 L', '#5b6880', 'end', 12);
      S('line', { x1: x0 + 110 * sc, y1: y - 6, x2: x0 + 110 * sc, y2: y + h + 6, stroke: '#5b6880', 'stroke-dasharray': '4 4' }, g);
      T(g, 300, 180, fmt(ff) + ' L/h · ' + fmt(tas) + ' km/h vraie · ' + fmt(gs) + ' km/h sol', '#10203f', 'middle', 15);
      T(g, 300, 210, '1 h de vol = ' + fmt(ff) + ' L, soit environ ' + fmt(ff * 0.72) + ' kg d’essence', '#5b6880', 'middle', 13);
      function hm(x) { var hh = Math.floor(x), mm = Math.round((x - hh) * 60); if (mm === 60) { hh++; mm = 0; } return hh + ' h ' + (mm < 10 ? '0' : '') + mm; }
      set('e', hm(tot)); set('u', hm(fly), fly < 0.5 ? 'warn' : 'good'); set('d', fmt(fly * gs) + ' km');
      if (flyL <= 0) { verdict.className = 'verdict bad'; verdict.textContent = 'Pas assez de carburant : la réserve n’est même pas assurée. On ne décolle pas.'; }
      else if (fly < 0.75) { verdict.className = 'verdict warn'; verdict.textContent = 'Juste pour un vol local. Fais le plein avant une navigation.'; }
      else { verdict.className = 'verdict good'; verdict.textContent = 'Tu peux voler ' + hm(fly) + ' en gardant ta réserve, soit environ ' + fmt(fly * gs) + ' km' + (st.wind > 0 ? ' avec ce vent de face.' : st.wind < 0 ? ' avec ce vent arrière.' : '.'); }
    }
    draw();
  }

  /* =================== Pièges =================== */
  var TRAPS = [
    ['🧊', 'Le givrage carburateur', 'Le régime baisse tout seul ? Réchauffage carburateur tiré à fond : le régime remonte quand la glace a fondu. Tire-le systématiquement moteur réduit, même par temps doux et humide.', 'Manuel de vol DR400/180'],
    ['⛽', 'Le mauvais réservoir', 'Sur un DR400/180 ancien, les 10 derniers litres du réservoir arrière ne passent pas en montée. Au décollage, choisis le réservoir le plus plein, et vérifie toujours le niveau à l’œil.', 'Manuel DR400/180 ; BEA, Cahiers du RSA n° 266'],
    ['🪟', 'La verrière qui s’ouvre', 'Mal verrouillée, elle se soulève au décollage et fait du bruit, mais quitte rarement l’avion. Piloter d’abord ; ne jamais essayer de la refermer près du sol. Verrouillage vérifié avant chaque décollage.', 'aeroVFR ; BEA'],
    ['🛞', 'La roue avant', 'Au décollage, ne la soulage pas trop tôt : elle aide à tenir l’axe. À l’atterrissage, pose d’abord le train principal, puis la roue avant en douceur.', 'Manuel DR400/180 ; BEA'],
    ['🔥', 'Le moteur qui chauffe au sol', 'Le refroidissement est prévu pour le vol. Pas de point fixe prolongé, et une montée au plus grand angle courte.', 'Manuel DR400/180'],
    ['🪵', 'La cellule en bois et toile', 'Sors les volets à l’arrêt pour qu’on ne marche pas dessus, roule doucement sur les cailloux qui abîment hélice et empennage, et signale tout choc au mécanicien.', 'Manuel DR400/180']
  ];
  function traps() {
    var g = document.getElementById('traps');
    TRAPS.forEach(function (t) { g.appendChild(B.h('<div class="card trap"><div style="font-size:28px">' + t[0] + '</div><h3>' + t[1] + '</h3><p>' + t[2] + '</p><p class="src">Source : ' + t[3] + '</p></div>')); });
  }

  /* =================== Comparateur =================== */
  var COMP = [
    ['Robin DR400/180', 4, 180, 1100, 248, 95, 'Bois, aile basse'],
    ['Robin DR401-120', 2, 108, 800, 215, null, 'Bois, version école légère'],
    ['Cessna 152', 2, 110, 757, 198, 80, 'Métal, aile haute'],
    ['Cessna 172R', 4, 160, 1111, 226, 87, 'Métal, aile haute'],
    ['Piper PA-28-150', 4, 150, 975, 200, 87, 'Métal, aile basse'],
    ['Aquila A211', 2, 99, 750, 191, 80, 'Composite, aile basse'],
    ['Tecnam P2008', 2, 99, 600, 215, 73, 'Aile haute'],
    ['Diamond DA20-C1', 2, 125, 800, 256, 83, 'Composite, aile basse'],
    ['Diamond DA40', 4, 180, 1198, 279, 91, 'Composite, aile basse'],
    ['Elixir', 2, 100, null, 226, null, 'Carbone, conçu à La Rochelle'],
    ['Planeur ASK 21', 2, 0, 600, null, 65, 'Planeur école, finesse 34'],
    ['ULM Ikarus C42', 2, 80, 540, 175, null, 'ULM, aile haute'],
    ['ULM Savannah', 2, 80, 450, 179, 48, 'ULM à décollage court']
  ];
  function compare() {
    var el = document.getElementById('compare'), key = 3, dir = -1;
    var COLS = [['Avion', 0], ['Places', 1], ['Puissance (ch)', 2], ['Masse max (kg)', 3], ['Croisière (km/h)', 4], ['Décrochage (km/h)', 5], ['Remarque', 6]];
    function render() {
      var rows = COMP.slice().sort(function (a, b) { var x = a[key], y = b[key]; if (x === null) return 1; if (y === null) return -1; return (x > y ? 1 : x < y ? -1 : 0) * dir; });
      el.innerHTML = '<table class="data"><tr>' + COLS.map(function (c) { return '<th class="sort" data-k="' + c[1] + '" tabindex="0">' + c[0] + (c[1] === key ? (dir > 0 ? ' ↑' : ' ↓') : '') + '</th>'; }).join('') + '</tr>' +
        rows.map(function (r) { return '<tr' + (r[0].indexOf('DR400') >= 0 ? ' style="background:var(--amber-l)"' : '') + '>' + r.map(function (v, i) { return '<td>' + (v === null ? '–' : i === 2 && v === 0 ? 'sans moteur' : typeof v === 'number' ? fmt(v) : B.esc(v)) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>' +
        '<p class="small">Sources : manuel DR400/180, fiche Robin DR401 (2019), fiches Wikipédia des autres avions (versions indiquées). Décrochage : configuration la plus basse publiée (volets sortis le plus souvent).</p>';
      [].forEach.call(el.querySelectorAll('th.sort'), function (th) { function go() { var k = +th.getAttribute('data-k'); if (k === key) dir = -dir; else { key = k; dir = k === 0 || k === 6 ? 1 : -1; } render(); } th.onclick = go; th.onkeydown = function (e) { if (e.key === 'Enter') go(); }; });
    }
    render();
  }

  function init() { variants(); anemo(); tableau(); checklists(); fuel(); traps(); compare(); B.quiz(document.getElementById('quiz'), window.QDR400 || []); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
