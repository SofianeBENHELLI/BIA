/* Parcours des 43 avions mythiques : frise, galerie filtrable, fiches détaillées, jeux. */
(function () {
  'use strict';
  var B = window.BIA, A = window.MYTHIQUES.slice().sort(function (a, b) { return a.an - b.an; }), P = window.MYTH_PHOTOS;
  var EP = [['all', 'Toutes'], ['pionniers', 'Les pionniers'], ['guerres', 'Les guerres mondiales'], ['jet', 'L’âge du jet'], ['moderne', 'L’ère moderne']];
  var seen = B.load('myth-seen', {}), filter = 'all', cur = -1;
  var dlg = document.getElementById('fiche');

  function img(a, cls) {
    if (!P[a.id]) return '<div class="noimg' + (cls ? ' ' + cls : '') + '" role="img" aria-label="' + B.esc(a.n) + ', photo à venir"><span>✈</span></div>';
    return '<img src="photos/' + P[a.id].f + '" alt="' + B.esc(a.n) + '" loading="lazy"' + (cls ? ' class="' + cls + '"' : '') + '>';
  }
  function credit(a) {
    var p = P[a.id];
    if (!p) return 'Photo à venir';
    return (p.note ? B.esc(p.note) + '<br>' : '') + 'Photo : ' + B.esc(p.a) + ' · ' + B.esc(p.l) + (/SA|BY/.test(p.l) ? ', réduite' : '') + ' · <a href="' + p.u + '" target="_blank" rel="noopener">Commons</a>';
  }
  function progress() {
    var n = Object.keys(seen).length;
    document.getElementById('progress').innerHTML = '<div><b>' + n + '</b><span>découverts</span></div><div><b>' + (A.length - n) + '</b><span>à découvrir</span></div>';
  }
  function timeline() {
    var t = document.getElementById('timeline'); t.innerHTML = '';
    A.forEach(function (a, i) {
      var b = B.h('<button type="button" title="' + B.esc(a.n) + '"><b>' + a.an + '</b><i></i><span>' + B.esc(a.n.split(' ')[0]) + '</span></button>');
      if (seen[a.id]) b.classList.add('seen');
      b.setAttribute('aria-label', a.an + ', ' + a.n);
      b.onclick = function () { open(i); };
      t.appendChild(b);
    });
  }
  function grid() {
    var g = document.getElementById('grid'); g.innerHTML = '';
    A.forEach(function (a, i) {
      if (filter !== 'all' && a.ep !== filter) return;
      var c = B.h('<button type="button" class="mcard' + (seen[a.id] ? ' seen' : '') + '">' + img(a) + '<div><span class="yr">' + a.an + '</span><h3>' + B.esc(a.n) + '</h3><p>' + a.pays + ' · ' + B.esc(a.ty) + '</p></div></button>');
      c.onclick = function () { open(i); };
      g.appendChild(c);
    });
  }
  function filters() {
    var f = document.getElementById('filters'); f.innerHTML = '';
    EP.forEach(function (e) {
      var n = e[0] === 'all' ? A.length : A.filter(function (a) { return a.ep === e[0]; }).length;
      var b = B.h('<button type="button" class="btn' + (filter === e[0] ? ' primary' : '') + '">' + e[1] + ' (' + n + ')</button>');
      b.onclick = function () { filter = e[0]; filters(); grid(); };
      f.appendChild(b);
    });
  }
  function open(i) {
    cur = i; var a = A[i];
    seen[a.id] = 1; B.save('myth-seen', seen);
    dlg.innerHTML = '<div class="fiche-img">' + img(a) + '<button type="button" class="close-x" aria-label="Fermer">✕</button><div class="credit">' + credit(a) + '</div></div>' +
      '<div class="fiche-body"><p class="eyebrow" style="color:var(--sky)">' + (i + 1) + ' / ' + A.length + ' · Premier vol en ' + a.an + '</p><h2 id="fiche-title">' + B.esc(a.n) + '</h2>' +
      '<p class="meta">' + a.pays + ' · ' + B.esc(a.par) + ' · ' + B.esc(a.ty) + '</p>' +
      '<div class="tablewrap"><table class="data">' + a.c.map(function (r) { return '<tr><th>' + B.esc(r[0]) + '</th><td>' + B.esc(r[1]) + '</td></tr>'; }).join('') + '</table></div>' +
      '<h3 style="margin:14px 0 4px">L’histoire</h3><p style="margin:0">' + B.esc(a.h) + '</p>' +
      '<div class="box mem"><b>L’anecdote</b>' + B.esc(a.a) + '</div>' +
      '<div class="fiche-nav"><button type="button" class="btn" data-go="-1"' + (i === 0 ? ' disabled' : '') + '>← ' + (i > 0 ? B.esc(A[i - 1].n) : '') + '</button><button type="button" class="btn primary" data-go="1"' + (i === A.length - 1 ? ' disabled' : '') + '>' + (i < A.length - 1 ? B.esc(A[i + 1].n) : '') + ' →</button></div></div>';
    dlg.querySelector('.close-x').onclick = close;
    [].forEach.call(dlg.querySelectorAll('[data-go]'), function (b) { b.onclick = function () { open(cur + (+b.getAttribute('data-go'))); dlg.scrollTop = 0; }; });
    if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); }
    refresh();
  }
  function close() { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }
  dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
  dlg.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' && cur < A.length - 1) open(cur + 1); if (e.key === 'ArrowLeft' && cur > 0) open(cur - 1); });
  // glisser du doigt dans la fiche pour passer à la suivante
  var sx = null;
  dlg.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 70) { if (dx < 0 && cur < A.length - 1) open(cur + 1); if (dx > 0 && cur > 0) open(cur - 1); } });
  function refresh() { progress(); timeline(); grid(); }

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* Jeu 1 : quel est cet avion ? */
  function gamePhoto() {
    var L = B.lab('game-photo', { num: '🎯', title: 'Quel est cet avion ?', hint: 'Une photo, quatre noms. Enchaîne les séries de dix.', takeaway: '' });
    L.stage.style.touchAction = 'auto';
    var score = 0, n = 0, best = B.load('myth-best', 0);
    var set = B.readout(L.ctrls, [['s', 'Score de la série'], ['b', 'Meilleur score']]);
    var verdict = B.h('<div class="verdict">Choisis le bon nom.</div>'); L.ctrls.appendChild(verdict);
    function q() {
      if (n === 10) {
        if (score > best) { best = score; B.save('myth-best', best); }
        L.stage.innerHTML = '<div style="padding:16px"><h3 style="margin-top:0">Série terminée : ' + score + ' / 10</h3><p>' + (score === 10 ? 'Parfait, œil de pilote !' : score >= 7 ? 'Très bien. Ouvre les fiches des avions ratés.' : 'Parcours la galerie, puis retente.') + '</p></div>';
        var again = B.h('<button type="button" class="btn primary" style="margin:0 16px 16px">Nouvelle série</button>'); again.onclick = function () { score = 0; n = 0; q(); }; L.stage.appendChild(again);
        set('s', score + ' / 10'); set('b', best + ' / 10'); return;
      }
      var AP = A.filter(function (x) { return P[x.id]; }), ans = AP[Math.floor(Math.random() * AP.length)];
      var opts = shuffle([ans].concat(shuffle(A.filter(function (x) { return x !== ans; })).slice(0, 3)));
      L.stage.innerHTML = '<div class="photoq" style="padding:12px">' + img(ans) + '<div class="choices" style="margin-top:10px"></div></div>';
      var box = L.stage.querySelector('.choices');
      opts.forEach(function (o, k) {
        var b = B.h('<button type="button" class="choice"><b>' + 'ABCD'[k] + '</b><span>' + B.esc(o.n) + '</span></button>');
        b.onclick = function () {
          [].forEach.call(box.children, function (x, j) { x.disabled = true; if (opts[j] === ans) x.classList.add('right'); });
          n++; if (o === ans) score++; else b.classList.add('wrong');
          verdict.className = 'verdict ' + (o === ans ? 'good' : 'bad');
          verdict.textContent = (o === ans ? 'Bravo : ' : 'C’était le ') + ans.n + ' (' + ans.an + '). ' + ans.a.split('. ')[0] + '.';
          set('s', score + ' / ' + n);
          var nx = B.h('<button type="button" class="btn primary" style="margin-top:10px">' + (n < 10 ? 'Photo suivante →' : 'Voir le score') + '</button>'); nx.onclick = q; L.stage.querySelector('.photoq').appendChild(nx);
        };
        box.appendChild(b);
      });
      set('s', score + ' / ' + n); set('b', best + ' / 10');
    }
    q();
  }

  /* Jeu 2 : remettre dans l'ordre chronologique */
  function gameOrder() {
    var L = B.lab('game-order', { num: '⏳', title: 'Remets-les dans l’ordre', hint: 'Classe ces cinq avions du plus ancien au plus récent, avec les flèches, puis vérifie.', takeaway: 'Repères : 1903 premier vol, 1909 la Manche, 1927 l’Atlantique, 1947 le mur du son, 1969 Concorde et le 747.' });
    L.stage.style.touchAction = 'auto';
    var list = [];
    var verdict = B.h('<div class="verdict">Du plus ancien en haut au plus récent en bas.</div>'); L.ctrls.appendChild(verdict);
    var check = B.h('<button type="button" class="btn primary">Vérifier</button>'); L.ctrls.appendChild(check);
    var again = B.h('<button type="button" class="btn">Nouveaux avions</button>'); L.ctrls.appendChild(again);
    function deal() {
      var pool = shuffle(A), pick = [];
      pool.forEach(function (a) { if (pick.length < 5 && !pick.some(function (p) { return p.an === a.an; })) pick.push(a); });
      list = shuffle(pick); render(false);
      verdict.className = 'verdict'; verdict.textContent = 'Du plus ancien en haut au plus récent en bas.';
    }
    function render(show) {
      L.stage.innerHTML = '<div class="order-list" style="padding:12px"></div>';
      var box = L.stage.querySelector('.order-list'), sorted = list.slice().sort(function (a, b) { return a.an - b.an; });
      list.forEach(function (a, i) {
        var ok = show && sorted[i] === a;
        var it = B.h('<div class="order-item' + (show ? (ok ? ' ok' : ' ko') : '') + '">' + img(a) + '<span>' + B.esc(a.n) + (show ? ' · ' + a.an : '') + '</span>' +
          '<button type="button" class="btn" aria-label="Monter ' + B.esc(a.n) + '"' + (i === 0 ? ' disabled' : '') + '>↑</button><button type="button" class="btn" aria-label="Descendre ' + B.esc(a.n) + '"' + (i === list.length - 1 ? ' disabled' : '') + '>↓</button></div>');
        var bs = it.querySelectorAll('button');
        bs[0].onclick = function () { var t = list[i - 1]; list[i - 1] = list[i]; list[i] = t; render(false); };
        bs[1].onclick = function () { var t = list[i + 1]; list[i + 1] = list[i]; list[i] = t; render(false); };
        box.appendChild(it);
      });
    }
    check.onclick = function () {
      var ok = list.every(function (a, i) { return i === 0 || list[i - 1].an < a.an; });
      render(true);
      verdict.className = 'verdict ' + (ok ? 'good' : 'bad');
      verdict.textContent = ok ? 'Parfait, la chronologie est respectée !' : 'Pas encore : les années sont affichées, corrige l’ordre puis revérifie.';
    };
    again.onclick = deal;
    deal();
  }

  function init() { filters(); refresh(); gamePhoto(); gameOrder(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
