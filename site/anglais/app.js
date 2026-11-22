/* Anglais : cartes de vocabulaire, alphabet et chiffres OACI, dialogue avec la tour, QCU. */
(function () {
  'use strict';
  var B = window.BIA;
  function speak(txt) {
    try { if (!('speechSynthesis' in window)) return false; speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(txt); u.lang = 'en-GB'; u.rate = 0.9; var v = speechSynthesis.getVoices().filter(function (x) { return /^en(-|_)GB/i.test(x.lang); })[0]; if (v) u.voice = v; speechSynthesis.speak(u); return true; } catch (e) { return false; }
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function flash() {
    var L = B.lab('lab-flash', { num: '1', title: 'Les cartes de vocabulaire', hint: 'Touche la carte pour la retourner. 🔊 pour entendre le mot. Classe-la « je sais » ou « à revoir » : les cartes à revoir reviennent plus souvent.', takeaway: '' });
    L.stage.style.touchAction = 'auto';
    var themes = Object.keys(window.VOCAB), theme = themes[0], dir = 'en', deck = [], i = 0;
    var know = B.load('ang-know', {});
    var tabs = B.h('<div class="seg"></div>'); L.ctrls.appendChild(tabs);
    themes.forEach(function (t) { var b = B.h('<button type="button">' + t + '</button>'); if (t === theme) b.className = 'on'; b.onclick = function () { theme = t; [].forEach.call(tabs.children, function (x) { x.className = ''; }); b.className = 'on'; deal(); }; tabs.appendChild(b); });
    B.seg(L.ctrls, [['en', 'Anglais → français'], ['fr', 'Français → anglais']], 'en', function (v) { dir = v; show(); });
    var set = B.readout(L.ctrls, [['k', 'Mots sus (ce thème)'], ['c', 'Carte']]);
    function deal() {
      var w = window.VOCAB[theme];
      deck = shuffle(w.filter(function (p) { return !know[p[0]]; })).concat(shuffle(w.filter(function (p) { return know[p[0]]; })));
      i = 0; show();
    }
    function show() {
      var p = deck[i], w = window.VOCAB[theme];
      var front = dir === 'en' ? p[0] : p[1], back = dir === 'en' ? p[1] : p[0];
      L.stage.innerHTML = '<div style="padding:14px"><div class="flash"><div class="in" role="button" tabindex="0" aria-label="Retourner la carte"><div class="face front"><span class="w"></span><span class="s">touche pour retourner</span></div><div class="face back"><span class="w"></span><span class="s">' + (dir === 'en' ? 'en français' : 'in English') + '</span></div></div></div>' +
        '<div class="seg" style="margin-top:12px;justify-content:center"><button type="button" class="btn" data-a="say">🔊 Écouter</button><button type="button" class="btn" data-a="ko">À revoir</button><button type="button" class="btn primary" data-a="ok">Je sais ✓</button></div></div>';
      L.stage.querySelector('.front .w').textContent = front; L.stage.querySelector('.back .w').textContent = back;
      var card = L.stage.querySelector('.flash'), inn = card.querySelector('.in');
      function flip() { card.classList.toggle('flip'); }
      inn.onclick = flip; inn.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { flip(); e.preventDefault(); } };
      L.stage.querySelector('[data-a=say]').onclick = function () { if (!speak(p[0])) this.textContent = 'Synthèse vocale indisponible'; };
      L.stage.querySelector('[data-a=ok]').onclick = function () { know[p[0]] = 1; B.save('ang-know', know); next(); };
      L.stage.querySelector('[data-a=ko]').onclick = function () { delete know[p[0]]; B.save('ang-know', know); deck.push(p); next(); };
      set('k', w.filter(function (x) { return know[x[0]]; }).length + ' / ' + w.length); set('c', (i + 1) + ' / ' + deck.length);
    }
    function next() { i++; if (i >= deck.length) deal(); else show(); }
    deal();
  }

  function alpha() {
    var L = B.lab('lab-alpha', { num: '2', title: 'L’alphabet et les chiffres OACI', hint: 'Tape une immatriculation ou un message (lettres et chiffres). Il est épelé comme à la radio, et l’indicatif abrégé est calculé.', takeaway: 'Indicatif abrégé : la première lettre et les deux dernières (F-GTMP devient F-MP), seulement après que le contrôleur l’a utilisé lui-même. 3 = tree, 5 = fife, 9 = niner.' });
    L.stage.style.touchAction = 'auto';
    L.stage.innerHTML = '<div style="padding:16px"><input type="text" id="al-in" value="F-GTMP" aria-label="Immatriculation ou texte" style="width:100%;font:700 24px DM Sans,sans-serif;padding:10px;border:2px solid var(--line);border-radius:12px;text-transform:uppercase"><p class="spell" id="al-out"></p><button type="button" class="btn primary" id="al-say">🔊 Écouter</button></div>';
    var inp = L.stage.querySelector('#al-in'), out = L.stage.querySelector('#al-out');
    var set = B.readout(L.ctrls, [['a', 'Indicatif abrégé']]);
    var quiz = B.h('<div class="card" style="padding:12px"><p class="small" style="margin:0 0 6px">Défi : comment dit-on cette lettre ?</p><p style="font:800 34px Manrope,sans-serif;margin:0;color:var(--head)" id="al-q"></p><div class="choices" id="al-c" style="margin-top:8px"></div></div>'); L.ctrls.appendChild(quiz);
    function words() { return inp.value.toUpperCase().split('').map(function (c) { return window.ALPHA[c] || window.NUMS[c] || (c === '-' ? '' : c === ' ' ? '·' : ''); }).filter(Boolean); }
    function upd() {
      out.textContent = words().join(' ');
      var r = inp.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      set('a', /^[A-Z]{5}$/.test(r) ? r[0] + '-' + r.slice(3) + ' (' + window.ALPHA[r[0]] + ' ' + window.ALPHA[r[3]] + ' ' + window.ALPHA[r[4]] + ')' : '–');
    }
    inp.addEventListener('input', upd);
    L.stage.querySelector('#al-say').onclick = function () { if (!speak(words().join(', '))) this.textContent = 'Synthèse vocale indisponible'; };
    function q() {
      var letters = Object.keys(window.ALPHA), l = letters[Math.floor(Math.random() * 26)];
      var opts = shuffle([l].concat(shuffle(letters.filter(function (x) { return x !== l; })).slice(0, 3)));
      quiz.querySelector('#al-q').textContent = l;
      var box = quiz.querySelector('#al-c'); box.innerHTML = '';
      opts.forEach(function (o) {
        var b = B.h('<button type="button" class="choice"><span>' + window.ALPHA[o] + '</span></button>');
        b.onclick = function () { [].forEach.call(box.children, function (x, j) { x.disabled = true; if (opts[j] === l) x.classList.add('right'); }); if (o !== l) b.classList.add('wrong'); setTimeout(q, 900); };
        box.appendChild(b);
      });
    }
    upd(); q();
  }

  function dialog() {
    var L = B.lab('lab-dialog', { num: '3', title: 'Du parking à l’atterrissage avec la tour', hint: 'Tu es F-GTMP, un DR400. Lis le message du contrôleur et choisis le bon collationnement.', takeaway: 'On collationne toujours : piste, autorisation de décoller ou d’atterrir, calage altimétrique, code transpondeur, fréquence, cap, niveau, et les instructions « hold short ». L’indicatif termine le message.' });
    L.stage.style.touchAction = 'auto';
    var D = window.DIALOG, k = 0, score = 0;
    var set = B.readout(L.ctrls, [['e', 'Étape'], ['s', 'Bons collationnements']]);
    var verdict = B.h('<div class="verdict">À toi de répondre.</div>'); L.ctrls.appendChild(verdict);
    function show() {
      if (k >= D.length) { L.stage.innerHTML = '<div style="padding:16px"><h3 style="margin-top:0">Vol terminé, moteur coupé.</h3><p>' + score + ' bons collationnements sur ' + D.length + '.</p></div>'; var r = B.h('<button type="button" class="btn primary" style="margin:0 16px 16px">Refaire le vol</button>'); r.onclick = function () { k = 0; score = 0; show(); }; L.stage.appendChild(r); return; }
      var d = D[k], opts = shuffle([d.ok].concat(d.bad));
      L.stage.innerHTML = '<div style="padding:14px"><div class="card" style="background:var(--navy);color:#fff;border:0"><span class="small" style="color:#9ec3ff">🗼 TOWER</span><p style="font:700 18px/1.4 Manrope,sans-serif;margin:4px 0 0;color:#fff">' + B.esc(d.atc) + '</p><button type="button" class="btn" style="margin-top:8px">🔊 Écouter</button></div><p class="small" style="margin:12px 0 6px">✈️ Ta réponse :</p><div class="choices"></div></div>';
      L.stage.querySelector('.card .btn').onclick = function () { speak(d.atc.replace(/F-GTMP/g, 'Foxtrot Golf Tango Mike Papa').replace(/F-MP/g, 'Foxtrot Mike Papa')); };
      var box = L.stage.querySelector('.choices');
      opts.forEach(function (o, j) {
        var b = B.h('<button type="button" class="choice"><b>' + 'ABCD'[j] + '</b><span>' + B.esc(o) + '</span></button>');
        b.onclick = function () {
          [].forEach.call(box.children, function (x, i) { x.disabled = true; if (opts[i] === d.ok) x.classList.add('right'); });
          if (o === d.ok) score++; else b.classList.add('wrong');
          verdict.className = 'verdict ' + (o === d.ok ? 'good' : 'bad'); verdict.textContent = d.e;
          set('s', score + ' / ' + (k + 1));
          var nx = B.h('<button type="button" class="btn primary" style="margin-top:10px">Suite du vol →</button>'); nx.onclick = function () { k++; verdict.className = 'verdict'; verdict.textContent = 'À toi de répondre.'; show(); }; L.stage.firstChild.appendChild(nx);
        };
        box.appendChild(b);
      });
      set('e', (k + 1) + ' / ' + D.length);
    }
    set('s', '0'); show();
  }

  function init() { flash(); alpha(); dialog(); B.quiz(document.getElementById('quiz'), window.QANG || []); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
