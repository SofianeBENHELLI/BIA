/* BIA blanc : tirage par domaine, chronomètre, pas de correction avant la fin, note et mention, historique.
   L'épreuve en cours est enregistrée : on peut fermer l'appli et reprendre. */
(function () {
  'use strict';
  var B = window.BIA, app = document.getElementById('app');
  var DOM = [['met', '1. Météorologie et aérologie', window.QMETEO], ['aer', '2. Aérodynamique et principes du vol', window.QAERO], ['aef', '3. Aéronefs et engins spatiaux', window.QAERONEFS], ['nav', '4. Navigation, réglementation, sécurité', window.QNAV], ['his', '5. Histoire et culture', window.QHIST]];
  var ALL = {};
  DOM.forEach(function (d) { d[2].forEach(function (q) { ALL[q.id] = q; }); });
  window.QANG.forEach(function (q) { ALL[q.id] = q; });
  var ex = B.load('exam-cur', null), tick = null;

  function fmtT(s) { s = Math.max(0, Math.round(s)); var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (h ? h + ' h ' : '') + String(m).padStart(2, '0') + ' min ' + String(x).padStart(2, '0'); }
  function save() { B.save('exam-cur', ex); }

  function home() {
    clearInterval(tick);
    var hist = B.load('exam-hist', []);
    app.innerHTML = '<div class="grid"><div class="card"><h3 style="margin-top:0">🎯 BIA blanc complet</h3><p>100 questions : 20 par domaine. 2 h 30. Une seule bonne réponse sur quatre, pas de point négatif.</p><label style="display:flex;gap:8px;align-items:center;margin:8px 0"><input type="checkbox" id="eng" checked style="width:20px;height:20px"> Ajouter l’anglais facultatif (20 questions, 30 min)</label><button type="button" class="btn primary" id="go-full">Commencer l’épreuve</button></div>' +
      '<div class="card"><h3 style="margin-top:0">⏱️ Mini BIA</h3><p>25 questions : 5 par domaine, 40 minutes. Idéal pour une séance de révision.</p><button type="button" class="btn amber" id="go-mini">Lancer un mini BIA</button></div></div>' +
      (hist.length ? '<div class="card" style="margin-top:12px"><h3 style="margin-top:0">Mes BIA blancs</h3><div class="tablewrap"><table class="data hist"><tr><th>Date</th><th>Type</th><th>Points</th><th>Anglais</th><th>Note</th></tr>' + hist.slice().reverse().map(function (h) { return '<tr><td>' + new Date(h.d).toLocaleDateString('fr-FR') + '</td><td>' + (h.mini ? 'Mini' : 'Complet') + '</td><td>' + h.p + ' / ' + h.n + '</td><td>' + (h.a === null ? '–' : h.a + ' / 20') + '</td><td><b>' + B.fmt(h.note, 1) + '</b></td></tr>'; }).join('') + '</table></div></div>' : '');
    document.getElementById('go-full').onclick = function () { start(false, document.getElementById('eng').checked); };
    document.getElementById('go-mini').onclick = function () { start(true, false); };
  }

  function start(mini, eng) {
    var per = mini ? 5 : 20, ids = [];
    DOM.forEach(function (d) { B.shuffle(d[2].filter(function (q) { return q.lvl !== 'ppl'; })).slice(0, per).forEach(function (q) { ids.push(q.id); }); });
    var opts = {};
    ids.forEach(function (id) { opts[id] = B.shuffle(ALL[id].c.map(function (t, k) { return k; })); });
    var eids = eng ? B.shuffle(window.QANG).slice(0, 20).map(function (q) { opts[q.id] = B.shuffle(q.c.map(function (t, k) { return k; })); return q.id; }) : [];
    ex = { mini: mini, ids: ids, eids: eids, opts: opts, ans: {}, phase: 'main', i: 0, end: Date.now() + (mini ? 40 : 150) * 60000 };
    save(); run();
  }

  function list() { return ex.phase === 'main' ? ex.ids : ex.eids; }
  function run() {
    clearInterval(tick);
    var L = list();
    app.innerHTML = '<div class="exam-bar"><span><b>' + (ex.phase === 'main' ? (ex.mini ? 'Mini BIA' : 'Épreuve obligatoire') : 'Anglais facultatif') + '</b> · <span id="cnt"></span></span><span class="timer" id="tm"></span><button type="button" class="btn" id="fin">Rendre la copie</button></div><div class="quiz" id="qbox"></div><details class="card" style="margin-top:12px"><summary style="cursor:pointer;font-weight:700">Toutes les questions</summary><div class="qgrid" id="grid"></div></details>';
    document.getElementById('fin').onclick = confirmEnd;
    function upd() {
      var left = (ex.end - Date.now()) / 1000, t = document.getElementById('tm');
      if (!t) return;
      t.textContent = fmtT(left); t.className = 'timer' + (left < 600 ? ' low' : '');
      if (left <= 0) { endPhase(true); }
    }
    upd(); tick = setInterval(upd, 1000);
    show();
  }
  function show() {
    var L = list(), id = L[ex.i], q = ALL[id], box = document.getElementById('qbox');
    var dom = ex.phase === 'main' ? DOM.filter(function (d) { return id.indexOf(d[0] + '-') === 0; })[0][1] : 'Anglais';
    box.innerHTML = '<div class="quiz-top"><span>Question ' + (ex.i + 1) + ' / ' + L.length + ' · ' + dom + '</span></div><p class="quiz-q">' + q.q + '</p><div class="choices"></div><div class="quiz-nav"><button type="button" class="btn" id="prev"' + (ex.i === 0 ? ' disabled' : '') + '>← Précédente</button><button type="button" class="btn primary" id="next">' + (ex.i === L.length - 1 ? 'Terminer cette partie' : 'Suivante →') + '</button></div>';
    var cb = box.querySelector('.choices');
    ex.opts[id].forEach(function (k, j) {
      var b = B.h('<button type="button" class="choice' + (ex.ans[id] === k ? ' sel' : '') + '" aria-pressed="' + (ex.ans[id] === k) + '"><b>' + 'ABCD'[j] + '</b><span>' + q.c[k] + '</span></button>');
      b.onclick = function () { ex.ans[id] = k; save(); [].forEach.call(cb.children, function (x) { x.classList.remove('sel'); x.setAttribute('aria-pressed', 'false'); }); b.classList.add('sel'); b.setAttribute('aria-pressed', 'true'); grid(); };
      cb.appendChild(b);
    });
    box.querySelector('#prev').onclick = function () { ex.i--; save(); show(); };
    box.querySelector('#next').onclick = function () { if (ex.i < L.length - 1) { ex.i++; save(); show(); window.scrollTo({ top: 0 }); } else confirmEnd(); };
    grid();
  }
  function grid() {
    var L = list(), g = document.getElementById('grid'), n = 0;
    g.innerHTML = '';
    L.forEach(function (id, k) {
      if (ex.ans[id] !== undefined) n++;
      var b = B.h('<button type="button" class="' + (ex.ans[id] !== undefined ? 'done' : '') + (k === ex.i ? ' cur' : '') + '">' + (k + 1) + '</button>');
      b.onclick = function () { ex.i = k; save(); show(); };
      g.appendChild(b);
    });
    document.getElementById('cnt').textContent = n + ' / ' + L.length + ' répondues';
  }
  function confirmEnd() {
    var L = list(), miss = L.filter(function (id) { return ex.ans[id] === undefined; }).length;
    var box = document.getElementById('qbox');
    box.innerHTML = '<h3 style="margin-top:0">Rendre la copie ?</h3><p>' + (miss ? 'Il reste <b>' + miss + '</b> question(s) sans réponse. Pas de point négatif : mieux vaut répondre au hasard que laisser vide.' : 'Toutes les questions ont une réponse.') + '</p><div class="seg"><button type="button" class="btn" id="back">Revenir aux questions</button><button type="button" class="btn primary" id="ok">Rendre la copie</button></div>';
    box.querySelector('#back').onclick = show; box.querySelector('#ok').onclick = function () { endPhase(false); };
  }
  function endPhase(timeout) {
    clearInterval(tick);
    if (ex.phase === 'main' && ex.eids.length) { ex.phase = 'eng'; ex.i = 0; ex.end = Date.now() + 30 * 60000; save(); if (timeout) alertMsg('Temps écoulé pour l’épreuve obligatoire. Place à l’anglais.'); run(); return; }
    results(timeout);
  }
  function alertMsg(t) { var m = B.h('<div class="verdict warn" style="margin-bottom:10px">' + t + '</div>'); app.insertBefore(m, app.firstChild); }

  function results(timeout) {
    var per = {}, pts = 0;
    DOM.forEach(function (d) { per[d[0]] = [0, 0]; });
    ex.ids.forEach(function (id) { var d = id.split('-')[0], ok = ex.ans[id] === 0; per[d][1]++; if (ok) { per[d][0]++; pts++; } B.record(id, ok); });
    var ang = null;
    if (ex.eids.length) { ang = 0; ex.eids.forEach(function (id) { var ok = ex.ans[id] === 0; if (ok) ang++; B.record(id, ok); }); }
    var n = ex.ids.length, p100 = pts * 100 / n, note = (p100 + Math.max(0, (ang || 0) - 10)) / 5;
    var mention = note >= 16 ? 'Admis, mention très bien' : note >= 14 ? 'Admis, mention bien' : note >= 12 ? 'Admis, mention assez bien' : note >= 10 ? 'Admis' : 'Non admis';
    var hist = B.load('exam-hist', []); hist.push({ d: Date.now(), mini: ex.mini, p: pts, n: n, a: ang, note: Math.round(note * 10) / 10 }); B.save('exam-hist', hist.slice(-30));
    var wrong = ex.ids.concat(ex.eids).filter(function (id) { return ex.ans[id] !== 0; });
    var done = ex; ex = null; B.save('exam-cur', null);
    app.innerHTML = (timeout ? '<div class="verdict warn" style="margin-bottom:10px">Temps écoulé : copie ramassée.</div>' : '') +
      '<div class="card"><p class="eyebrow" style="color:var(--sky)">Résultat</p><p style="font:800 56px Manrope,sans-serif;margin:0;color:var(--head)">' + B.fmt(note, 1) + ' <span style="font-size:24px">/ 20</span></p><div class="verdict ' + (note >= 10 ? 'good' : 'bad') + '">' + mention + '</div>' +
      '<p class="small">' + pts + ' bonnes réponses sur ' + n + (done.mini ? ' (ramené à 100 : ' + B.fmt(p100, 0) + ')' : '') + (ang !== null ? ' · anglais ' + ang + ' / 20, bonus ' + Math.max(0, ang - 10) + ' point(s)' : '') + '. Note = (points sur 100 + bonus d’anglais) / 5.</p>' +
      DOM.map(function (d) { var r = per[d[0]], pc = r[1] ? r[0] / r[1] : 0; return '<div class="dombar"><span>' + d[1] + '</span><b>' + r[0] + ' / ' + r[1] + '</b><div class="scorebar"><i style="width:' + Math.round(pc * 100) + '%;background:' + (pc >= 0.75 ? 'var(--green)' : pc >= 0.5 ? 'var(--amber)' : 'var(--red)') + '"></i></div></div>'; }).join('') +
      '<div class="seg" style="margin-top:12px"><button type="button" class="btn primary" id="again">Retour à l’accueil du BIA blanc</button></div></div>' +
      (wrong.length ? '<div class="card" style="margin-top:12px"><h3 style="margin-top:0">Correction de tes erreurs (' + wrong.length + ')</h3>' + wrong.map(function (id) { var q = ALL[id], a = done.ans[id]; return '<div style="border-top:1px solid var(--line);padding:10px 0"><p style="margin:0 0 4px;font-weight:700;color:var(--head)">' + q.q + '</p><p style="margin:0;font-size:15px">' + (a === undefined ? '<span style="color:var(--red)">Sans réponse.</span>' : '<span style="color:var(--red)">✗ ' + q.c[a] + '</span>') + '<br><span style="color:var(--green)">✓ ' + q.c[0] + '</span></p><p class="small" style="margin:4px 0 0">' + q.e + '</p></div>'; }).join('') + '<p class="small">Ces questions sont aussi dans « À revoir » de chaque domaine.</p></div>' : '<div class="verdict good" style="margin-top:12px">Aucune erreur : sans-faute !</div>');
    document.getElementById('again').onclick = home;
    window.scrollTo({ top: 0 });
  }

  if (ex && ex.ids) run(); else home();
})();
