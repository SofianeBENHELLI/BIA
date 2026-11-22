/* Devenir pilote : parcours par âge, estimation des aides, check-list personnelle. */
(function () {
  'use strict';
  var B = window.BIA;
  var STEPS = [
    [13, 'Le BIA', 'Accessible dès la classe de 3e, sans limite d’âge. Examen en mai, inscriptions de fin janvier à mi-mars (calendrier 2026).'],
    [13, 'Premiers vols en planeur', 'Les clubs de vol à voile forment dès 13 ans environ ; le premier vol solo est possible à 14 ans.'],
    [14, 'Premier solo en planeur', 'Âge minimum européen pour voler seul en planeur (Part-SFCL).'],
    [15, 'Brevet de pilote ULM', 'Accessible à partir de 15 ans. Aide FFPLUM jusqu’à 25 ans, plus élevée avec le BIA.'],
    [15, 'Choisir ses spécialités', 'Mathématiques et physique-chimie ouvrent les classes préparatoires et les écoles de pilotes. Travaille aussi l’anglais.'],
    [16, 'Licence de planeur (SPL)', 'Âge minimum de la licence de pilote de planeur.'],
    [16, 'Premier solo en avion', 'Possible dès 16 ans pendant la formation LAPL ou PPL. Aides FFA jusqu’à 21 ans.'],
    [17, 'Licence LAPL ou PPL avion', 'Âge minimum de la licence. Certificat médical de classe 2 (ou LAPL).'],
    [17, 'Vérifier l’aptitude de classe 1', 'Conseillé avant de viser une carrière professionnelle (à voir avec un médecin aéronautique).'],
    [18, 'Bac et orientation', 'Classe préparatoire scientifique ou licence de sciences ; ou officier sous contrat dans les armées après le bac.'],
    [19, 'Concours ENAC EPL/S', 'Après 60 crédits scientifiques (une année post-bac), jusqu’à moins de 23 ans au 1er janvier. Inscriptions de décembre à janvier, écrits en mars.'],
    [20, 'Air France Cadets', 'Avec un bac + 2 scientifique (120 crédits). Candidatures en juin et juillet (2026).'],
    [22, 'Dernière année pour l’EPL/S', 'Il faut avoir moins de 23 ans au 1er janvier de l’année du concours.'],
    [26, 'Dernière année pour pilote sous contrat (Air)', 'Officier sous contrat personnel navigant de l’Armée de l’Air et de l’Espace : moins de 27 ans.']
  ];
  function ages() {
    var L = B.lab('lab-age', { num: '🗓️', title: 'Ton parcours année par année', hint: 'Règle ton âge : les étapes possibles s’allument, les suivantes t’attendent.', takeaway: 'Calendrier construit à partir des âges officiels (Part-FCL, Part-SFCL, ENAC, armées). Ce n’est pas un parcours imposé : chacun avance à son rythme.' });
    L.stage.style.touchAction = 'auto'; L.stage.style.maxHeight = '440px'; L.stage.style.overflowY = 'auto';
    var age = B.load('pilote-age', 15);
    B.slider(L.ctrls, { label: 'Mon âge', min: 13, max: 27, value: age, fmt: function (v) { return v + ' ans'; }, onInput: function (v) { age = v; B.save('pilote-age', v); draw(); } });
    var set = B.readout(L.ctrls, [['ok', 'Déjà possible'], ['next', 'Prochaine étape']]);
    function draw() {
      L.stage.innerHTML = '<div class="steps" style="padding:12px"></div>';
      var box = L.stage.firstChild, next = null, n = 0;
      STEPS.forEach(function (s) {
        var cls = s[0] <= age ? (s[0] === age || (s[0] < age && s[0] >= age - 1) ? 'step now' : 'step') : 'step locked';
        if (s[0] <= age) n++; else if (!next) next = s;
        box.appendChild(B.h('<div class="' + cls + '"><div class="age">' + s[0] + ' ans</div><div><h4>' + (s[0] <= age ? '✓ ' : '') + s[1] + '</h4><p>' + s[2] + (s[0] > age ? ' <b>(dans ' + (s[0] - age) + ' an' + (s[0] - age > 1 ? 's' : '') + ')</b>' : '') + '</p></div></div>'));
      });
      var cur = box.querySelector('.step.locked'); if (cur) L.stage.scrollTop += cur.getBoundingClientRect().top - L.stage.getBoundingClientRect().top - 120;
      set('ok', n + ' étapes', 'good'); set('next', next ? next[1] + ' à ' + next[0] + ' ans' : 'tout est ouvert');
    }
    draw();
  }

  function aides() {
    var L = B.lab('lab-aides', { num: '💶', title: 'Estime les aides des fédérations', hint: 'Choisis l’activité, ton âge, et si tu as le BIA.', takeaway: 'Montants relevés sur les pages des fédérations et des CIRAS (2025-2026). Ils sont révisés chaque année : vérifie sur ffa-aero.fr, ffvp.fr ou ffplum.fr.' });
    L.stage.style.touchAction = 'auto';
    var st = { act: 'avion', age: 16, bia: true };
    B.seg(L.ctrls, [['avion', 'Avion (FFA)'], ['planeur', 'Planeur (FFVP)'], ['ulm', 'ULM (FFPLUM)']], 'avion', function (v) { st.act = v; draw(); });
    B.slider(L.ctrls, { label: 'Âge', min: 13, max: 27, value: 16, fmt: function (v) { return v + ' ans'; }, onInput: function (v) { st.age = v; draw(); } });
    B.seg(L.ctrls, [[true, 'J’ai le BIA'], [false, 'Pas encore']], true, function (v) { st.bia = v; draw(); });
    function draw() {
      var h = '';
      if (st.act === 'ulm') {
        var ok = st.age <= 25;
        h = '<h3 style="margin-top:0">FFPLUM, aide jeune pilote ULM</h3>' + (ok ? '<p style="font:800 40px Manrope,sans-serif;margin:6px 0;color:var(--green)">' + (st.bia ? '550 €' : '400 €') + '</p><ul><li>400 € pour un pilote de 25 ans au plus, à l’obtention du brevet.</li><li>' + (st.bia ? '+ 150 € grâce au BIA.' : 'Avec le BIA, ce serait 150 € de plus.') + '</li><li>Être licencié FFPLUM et se former dans une structure affiliée.</li></ul>' : '<p class="verdict bad">Aide réservée aux pilotes de 25 ans au plus.</p>') + '<p class="small">Sources : formulaire FFPLUM, CIRAS Nancy-Metz (mai 2025).</p>';
      } else if (st.act === 'planeur') {
        var ok2 = st.age <= 25;
        h = '<h3 style="margin-top:0">FFVP, bourses jeunes pilotes de planeur</h3>' + (ok2 ? '<p style="font:800 40px Manrope,sans-serif;margin:6px 0;color:var(--green)">jusqu’à 1 500 €</p><ul><li>Bourses « sur objectif » et aides aux jeunes pilotes méritants, jusqu’à 25 ans.</li><li>' + (st.bia ? 'Certaines aides sont majorées pour les titulaires du BIA.' : 'Le BIA majore certaines de ces aides.') + '</li></ul>' : '<p class="verdict bad">Aides réservées aux jeunes jusqu’à 25 ans.</p>') + '<p class="small">Source : CIRAS Nancy-Metz (mai 2025), détails sur ffvp.fr.</p>';
      } else {
        var ok3 = st.age <= 21;
        h = '<h3 style="margin-top:0">FFA, aides aux jeunes pilotes d’avion</h3>' + (ok3 ? '<p style="font:800 40px Manrope,sans-serif;margin:6px 0;color:var(--green)">plus de 2 000 €</p><ul><li>Aides versées par étapes de la formation jusqu’au PPL, jusqu’à 21 ans, via l’aéroclub.</li><li>' + (st.bia ? 'Avec le BIA, la première aide est plus élevée (520 € au lieu de 350 € selon la page consultée), et une prime s’ajoute à la réussite de la théorie.' : 'Le BIA augmente la première aide et ajoute une prime à la réussite de la théorie.') + '</li><li>L’année où l’on obtient le BIA, la licence-assurance fédérale peut être offerte.</li></ul>' : '<p class="verdict bad">Aides FFA réservées aux jeunes jusqu’à 21 ans.</p>') + '<p class="small">Sources : page FFA consultée en novembre 2026 (non datée) et CIRAS Bordeaux. Montants à confirmer sur ffa-aero.fr.</p>';
      }
      L.stage.innerHTML = '<div style="padding:16px">' + h + '</div>';
    }
    draw();
  }

  var TODO = ['Réussir le BIA, avec mention', 'Faire un vol d’initiation en aéroclub', 'Visiter un club de vol à voile ou d’ULM', 'Choisir maths et physique-chimie au lycée', 'Progresser en anglais (séries, podcasts, échanges)', 'Garder une bonne condition physique', 'Assister à un meeting aérien ou à un salon', 'Se renseigner sur les aides de sa région et des fédérations', 'Lire « Vol de nuit » ou « Terre des hommes » de Saint-Exupéry', 'Rencontrer un pilote professionnel et lui poser ses questions'];
  function todo() {
    var done = B.load('pilote-todo', {}), box = document.getElementById('todo');
    box.innerHTML = '<div class="checklist" style="display:grid;gap:6px"></div><p class="small" id="todo-n"></p>';
    var list = box.firstChild;
    function n() { document.getElementById('todo-n').textContent = Object.keys(done).length + ' / ' + TODO.length + ' fait(s). Ta liste est enregistrée sur cet appareil.'; }
    TODO.forEach(function (t, i) {
      var l = B.h('<label style="display:flex;gap:10px;align-items:flex-start;padding:8px 10px;border-radius:10px;background:var(--bg);cursor:pointer"><input type="checkbox" style="width:22px;height:22px;accent-color:var(--green)"><span>' + t + '</span></label>');
      var c = l.querySelector('input'); c.checked = !!done[i];
      c.onchange = function () { if (c.checked) done[i] = 1; else delete done[i]; B.save('pilote-todo', done); n(); };
      list.appendChild(l);
    });
    n();
  }

  function init() { ages(); aides(); todo(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
