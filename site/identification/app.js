/* Reconnais l'avion : quiz photo sur tous les avions qui ont une photo (fiches mythiques + flotte), galerie filtrable. */
(function () {
  'use strict';
  var B = window.BIA, P = window.MYTH_PHOTOS;
  var CATS = [['all', 'Tous'], ['leger', 'Aviation légère'], ['ligne', 'Ligne et affaires'], ['militaire', 'Transport, soutien, bombardiers'], ['chasse', 'Avions de combat'], ['ancien', 'Historiques'], ['special', 'Records et expérimentaux']];
  var CAT_MYTH = {
    wright: 'ancien', bleriot: 'ancien', spad: 'ancien', fokker: 'ancien', stlouis: 'ancien', late28: 'ancien', dc3: 'ancien', spitfire: 'ancien', bf109: 'ancien', b17: 'ancien',
    cub: 'leger', p51: 'ancien', p38: 'ancien', me262: 'ancien', constellation: 'ancien', x1: 'special', comet: 'ligne', c130: 'militaire', caravelle: 'ligne', alouette: 'special',
    c172: 'leger', mirage3: 'chasse', b707: 'ligne', x15: 'special', sr71: 'militaire', b737: 'ligne', concorde: 'ligne', b747: 'ligne', cap10: 'leger', dr400: 'leger', a300: 'ligne',
    alphajet: 'chasse', sue: 'chasse', mirage2000: 'chasse', f14: 'chasse', shuttle: 'special', f117: 'chasse', a320: 'ligne', an225: 'militaire', rafale: 'chasse', a380: 'ligne',
    neuron: 'special', solar: 'special', f15: 'chasse', f16: 'chasse', mig29: 'chasse', su27: 'chasse', fa18: 'chasse', b2: 'militaire', gripen: 'chasse', typhoon: 'chasse',
    f22: 'chasse', f35: 'chasse', su57: 'chasse', j20: 'chasse', b21: 'militaire', b787: 'ligne', a350: 'ligne', x59: 'special', c919: 'ligne'
  };
  var POOL = [];
  window.MYTHIQUES.forEach(function (a) { if (P[a.id]) POOL.push({ id: a.id, n: a.n, ty: a.ty, cat: CAT_MYTH[a.id] || 'special', d: a.c.map(function (r) { return r[0] + ' : ' + r[1]; }).slice(0, 2).join(' · '), fiche: true }); });
  window.FLOTTE.forEach(function (a) { if (P[a.id]) POOL.push({ id: a.id, n: a.n, ty: a.ty, cat: a.cat, d: a.d }); });
  var BY = {}; POOL.forEach(function (a) { BY[a.id] = a; });
  var known = B.load('ident-ok', {});

  function credit(id) { var p = P[id]; return 'Photo : ' + B.esc(p.a) + ' · ' + B.esc(p.l) + ' · <a href="' + p.u + '" target="_blank" rel="noopener">source</a>'; }
  function progress() {
    var n = POOL.filter(function (a) { return known[a.id]; }).length;
    document.getElementById('progress').innerHTML = '<div><b>' + POOL.length + '</b><span>avions en photo</span></div><div><b>' + n + '</b><span>déjà reconnus</span></div><div><b>' + B.load('ident-best', 0) + '</b><span>record de série</span></div>';
  }

  /* ---------- Quiz ---------- */
  function quiz() {
    var L = B.lab('lab-ident', { num: '📸', title: 'Quel est cet avion ?', hint: 'Choisis la difficulté et la catégorie, puis lance une série. En mode expert, les mauvaises réponses sont des avions de la même famille.', takeaway: 'Regarde dans l’ordre : nombre et position des moteurs, forme de l’aile, empennage, train. Puis les détails : forme du nez, des hublots, des saumons.' });
    L.stage.style.touchAction = 'auto';
    var cfg = { cat: 'all', len: 10, hard: false };
    var catSel = B.h('<div class="ctrl"><label for="id-cat"><span>Catégorie</span></label><select id="id-cat" class="select">' + CATS.map(function (c) { var k = c[0] === 'all' ? POOL.length : POOL.filter(function (a) { return a.cat === c[0]; }).length; return '<option value="' + c[0] + '">' + c[1] + ' (' + k + ')</option>'; }).join('') + '</select></div>');
    L.ctrls.appendChild(catSel); catSel.querySelector('select').onchange = function () { cfg.cat = this.value; };
    B.seg(L.ctrls, [[10, 'Série de 10'], [20, 'Série de 20'], [0, 'Marathon (tous)']], 10, function (v) { cfg.len = v; });
    B.seg(L.ctrls, [[false, 'Facile'], [true, 'Expert']], false, function (v) { cfg.hard = v; });
    var go = B.h('<button type="button" class="btn primary">Lancer la série</button>'); L.ctrls.appendChild(go);
    var set = B.readout(L.ctrls, [['s', 'Score'], ['r', 'Série en cours'], ['k', 'Avions reconnus']]);
    var deck = [], i = 0, score = 0, streak = 0;
    function pool() { return POOL.filter(function (a) { return cfg.cat === 'all' || a.cat === cfg.cat; }); }
    function start() {
      var pl = B.shuffle(pool()); deck = cfg.len ? pl.slice(0, cfg.len) : pl; i = 0; score = 0; streak = 0; q();
    }
    function q() {
      set('k', POOL.filter(function (a) { return known[a.id]; }).length + ' / ' + POOL.length);
      if (i >= deck.length) {
        var best = B.load('ident-best', 0); if (streak > best) B.save('ident-best', streak);
        var pc = deck.length ? score / deck.length : 0;
        L.stage.innerHTML = '<div style="padding:16px"><p class="eyebrow" style="color:var(--sky)">Série terminée</p><p style="font:800 44px Manrope,sans-serif;margin:0">' + score + ' / ' + deck.length + '</p><p>' + (pc === 1 ? 'Sans-faute : œil de pilote de chasse !' : pc >= 0.8 ? 'Très bien. Relance en mode expert.' : pc >= 0.5 ? 'Pas mal. Parcours la galerie et réessaie.' : 'Continue : la galerie en dessous t’aide à mémoriser les silhouettes.') + '</p><button type="button" class="btn primary" id="id-again">Nouvelle série</button></div>';
        L.stage.querySelector('#id-again').onclick = start; progress(); return;
      }
      var a = deck[i], others;
      var same = POOL.filter(function (x) { return x !== a && x.cat === a.cat; }), diff = POOL.filter(function (x) { return x !== a && x.cat !== a.cat; });
      others = cfg.hard && same.length >= 3 ? B.shuffle(same).slice(0, 3) : B.shuffle(same).slice(0, 1).concat(B.shuffle(diff).slice(0, 2));
      var opts = B.shuffle([a].concat(others));
      L.stage.innerHTML = '<div style="padding:12px"><div class="quiz-top"><span>Photo ' + (i + 1) + ' / ' + deck.length + '</span><span>' + score + ' bonne(s) réponse(s)</span></div><div class="ph"><img class="qphoto" src="/mythiques/photos/' + P[a.id].f + '" alt="Photo d’un avion à identifier"></div><div class="choices" style="margin-top:10px"></div><div id="id-fb"></div></div>';
      var box = L.stage.querySelector('.choices');
      opts.forEach(function (o, k) {
        var b = B.h('<button type="button" class="choice"><b>' + 'ABCD'[k] + '</b><span>' + B.esc(o.n) + '</span></button>');
        b.onclick = function () {
          var ok = o === a;
          [].forEach.call(box.children, function (x, j) { x.disabled = true; if (opts[j] === a) x.classList.add('ok'); });
          if (ok) { score++; streak++; known[a.id] = 1; B.save('ident-ok', known); } else { b.classList.add('ko'); var best = B.load('ident-best', 0); if (streak > best) B.save('ident-best', streak); streak = 0; }
          B.record('img-' + a.id, ok);
          set('s', score + ' / ' + (i + 1), ok ? 'good' : 'warn'); set('r', streak + ' d’affilée');
          var fb = L.stage.querySelector('#id-fb');
          fb.innerHTML = '<div class="verdict ' + (ok ? 'good' : 'bad') + '" style="margin-top:10px">' + (ok ? 'Bravo, bonne réponse : ' : 'Raté. La bonne réponse : ') + '<b>' + B.esc(a.n) + '</b></div><p style="margin:8px 0 4px"><b>' + B.esc(a.ty) + '.</b> ' + B.esc(a.d) + (a.fiche ? ' <a href="/mythiques/#galerie">Voir sa fiche</a>' : '') + '</p><p class="small" style="margin:0">' + credit(a.id) + '</p>';
          var nx = B.h('<button type="button" class="btn primary" style="margin-top:10px">' + (i === deck.length - 1 ? 'Voir le résultat' : 'Avion suivant →') + '</button>');
          nx.onclick = function () { i++; q(); var top = L.el.getBoundingClientRect().top; if (top < 0) L.el.scrollIntoView({ behavior: 'smooth' }); };
          fb.appendChild(nx);
        };
        box.appendChild(b);
      });
    }
    go.onclick = start;
    set('s', '–'); set('r', '–');
    start();
  }

  /* ---------- Galerie ---------- */
  var dlg = document.getElementById('photo'), gcat = 'all';
  function open(a) {
    dlg.innerHTML = '<div class="fiche-img"><img src="/mythiques/photos/' + P[a.id].f + '" alt="' + B.esc(a.n) + '"><button type="button" class="close-x" aria-label="Fermer">✕</button><div class="credit">' + credit(a.id) + '</div></div><div class="fiche-body"><h2>' + B.esc(a.n) + '</h2><p class="meta">' + B.esc(a.ty) + '</p><p>' + B.esc(a.d) + '</p>' + (a.fiche ? '<a class="btn" href="/mythiques/#galerie">Fiche complète dans les avions mythiques</a>' : '') + '</div>';
    dlg.querySelector('.close-x').onclick = function () { dlg.close(); };
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  function gallery() {
    var f = document.getElementById('gfilters'), g = document.getElementById('ggrid');
    function render() {
      f.innerHTML = ''; g.innerHTML = '';
      CATS.forEach(function (c) {
        var b = B.h('<button type="button" class="btn' + (gcat === c[0] ? ' primary' : '') + '">' + c[1] + '</button>');
        b.onclick = function () { gcat = c[0]; render(); }; f.appendChild(b);
      });
      POOL.filter(function (a) { return gcat === 'all' || a.cat === gcat; }).sort(function (x, y) { return x.n.localeCompare(y.n, 'fr'); }).forEach(function (a) {
        var c = B.h('<button type="button" class="gcard' + (known[a.id] ? ' ok' : '') + '"><img src="/mythiques/photos/' + P[a.id].f + '" alt="" loading="lazy"><span>' + B.esc(a.n) + '</span></button>');
        c.onclick = function () { open(a); }; g.appendChild(c);
      });
    }
    render();
  }

  function init() { progress(); quiz(); gallery(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
