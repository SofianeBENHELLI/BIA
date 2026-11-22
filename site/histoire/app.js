/* Histoire : frise filtrable, jeu de chronologie, « Qui suis-je ? », QCU. */
(function () {
  'use strict';
  var B = window.BIA, H = window.HIST, P = window.PERSOS;
  var TH = [['all', 'Tout'], ['ballons', 'Ballons'], ['pionniers', 'Pionniers'], ['guerres', 'Guerres'], ['raids', 'Raids et lignes'], ['femmes', 'Pionnières'], ['jet', 'Âge du jet'], ['espace', 'Espace']];
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function frise() {
    var fil = document.getElementById('fil'), tl = document.getElementById('tl'), cur = 'all';
    function render() {
      tl.innerHTML = '';
      H.filter(function (e) { return cur === 'all' || e.th === cur; }).sort(function (a, b) { return a.y - b.y; }).forEach(function (e) {
        var el = B.h('<div class="ev f-' + e.th + '"><button type="button" aria-expanded="false"><b class="yr">' + e.y + '</b>' + B.esc(e.t) + '<span class="dt">' + B.esc(e.d) + '</span><span class="det">' + B.esc(e.x) + '</span></button></div>');
        var b = el.querySelector('button');
        b.onclick = function () { el.classList.toggle('open'); b.setAttribute('aria-expanded', el.classList.contains('open')); };
        tl.appendChild(el);
      });
    }
    TH.forEach(function (t) { var b = B.h('<button type="button">' + t[1] + '</button>'); if (t[0] === cur) b.className = 'on'; b.onclick = function () { cur = t[0]; [].forEach.call(fil.children, function (x) { x.className = ''; }); b.className = 'on'; render(); }; fil.appendChild(b); });
    render();
  }

  function gameOrder() {
    var L = B.lab('game-order', { num: '⏳', title: 'Remets ces événements dans l’ordre', hint: 'Du plus ancien en haut au plus récent en bas, avec les flèches. Puis vérifie.', takeaway: 'Les repères à connaître par cœur : 1783, 1903, 1909, 1927, 1930, 1947, 1957, 1961, 1969.' });
    L.stage.style.touchAction = 'auto';
    var list = [], best = B.load('hist-order-best', 0), wins = 0;
    var set = B.readout(L.ctrls, [['w', 'Séries réussies'], ['b', 'Record']]);
    var verdict = B.h('<div class="verdict">Classe les cinq événements.</div>'); L.ctrls.appendChild(verdict);
    var check = B.h('<button type="button" class="btn primary">Vérifier</button>'); L.ctrls.appendChild(check);
    var again = B.h('<button type="button" class="btn">Nouveaux événements</button>'); L.ctrls.appendChild(again);
    function deal() { var pick = []; shuffle(H).forEach(function (e) { if (pick.length < 5 && !pick.some(function (p) { return p.y === e.y; })) pick.push(e); }); list = shuffle(pick); render(false); verdict.className = 'verdict'; verdict.textContent = 'Classe les cinq événements.'; }
    function render(show) {
      L.stage.innerHTML = '<div class="order-list" style="padding:12px;display:grid;gap:8px"></div>';
      var box = L.stage.firstChild, sorted = list.slice().sort(function (a, b) { return a.y - b.y; });
      list.forEach(function (e, i) {
        var it = B.h('<div class="order-item' + (show ? (sorted[i] === e ? ' ok' : ' ko') : '') + '"><span>' + B.esc(e.t) + (show ? ' · <b>' + e.y + '</b>' : '') + '</span><button type="button" class="btn" aria-label="Monter"' + (i === 0 ? ' disabled' : '') + '>↑</button><button type="button" class="btn" aria-label="Descendre"' + (i === list.length - 1 ? ' disabled' : '') + '>↓</button></div>');
        var bs = it.querySelectorAll('button');
        bs[0].onclick = function () { var t = list[i - 1]; list[i - 1] = list[i]; list[i] = t; render(false); };
        bs[1].onclick = function () { var t = list[i + 1]; list[i + 1] = list[i]; list[i] = t; render(false); };
        box.appendChild(it);
      });
      set('w', String(wins)); set('b', String(best));
    }
    check.onclick = function () {
      var ok = list.every(function (e, i) { return i === 0 || list[i - 1].y <= e.y; });
      if (ok) { wins++; if (wins > best) { best = wins; B.save('hist-order-best', best); } }
      render(true);
      verdict.className = 'verdict ' + (ok ? 'good' : 'bad'); verdict.textContent = ok ? 'Parfait ! Les dates sont affichées pour les mémoriser.' : 'Pas encore : regarde les dates, corrige, puis revérifie.';
    };
    again.onclick = deal; deal();
  }

  function gameWho() {
    var L = B.lab('game-who', { num: '🕵️', title: 'Qui suis-je ?', hint: 'Lis le portrait et trouve le personnage.', takeaway: '' });
    L.stage.style.touchAction = 'auto';
    var score = 0, n = 0;
    var set = B.readout(L.ctrls, [['s', 'Score']]);
    function q() {
      var ans = P[Math.floor(Math.random() * P.length)];
      var opts = shuffle([ans].concat(shuffle(P.filter(function (p) { return p !== ans; })).slice(0, 3)));
      L.stage.innerHTML = '<div style="padding:16px"><p style="font:700 19px/1.4 Manrope,sans-serif;color:var(--head);margin:0 0 12px">« ' + B.esc(ans[1]) + ' »</p><div class="choices"></div></div>';
      var box = L.stage.querySelector('.choices');
      opts.forEach(function (o, k) {
        var b = B.h('<button type="button" class="choice"><b>' + 'ABCD'[k] + '</b><span>' + B.esc(o[0]) + '</span></button>');
        b.onclick = function () {
          [].forEach.call(box.children, function (x, j) { x.disabled = true; if (opts[j] === ans) x.classList.add('right'); });
          n++; if (o === ans) score++; else b.classList.add('wrong');
          set('s', score + ' / ' + n);
          var nx = B.h('<button type="button" class="btn primary" style="margin-top:10px">Portrait suivant →</button>'); nx.onclick = q; L.stage.firstChild.appendChild(nx);
        };
        box.appendChild(b);
      });
    }
    set('s', '0 / 0'); q();
  }

  function init() { frise(); gameOrder(); gameWho(); B.quiz(document.getElementById('quiz'), window.QHIST || []); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
