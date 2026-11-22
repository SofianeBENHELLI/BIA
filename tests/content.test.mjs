// Vérifie la banque de questions : identifiants uniques, 4 propositions distinctes, explication présente,
// et nombre de questions cohérent avec la déclaration des pages (core.js).
import { readFileSync } from "node:fs";
import vm from "node:vm";
const ctx = { window: {} };
vm.runInNewContext(readFileSync(new URL("../site/aerodynamique/questions.js", import.meta.url), "utf8"), ctx);
const Q = ctx.window.QAERO;
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log("ECHEC", m); } };
const ids = new Set();
for (const q of Q) {
  ok(!ids.has(q.id), "id en double " + q.id); ids.add(q.id);
  ok(Array.isArray(q.c) && q.c.length === 4, q.id + " : 4 propositions");
  ok(new Set(q.c).size === 4, q.id + " : propositions distinctes");
  ok(q.e && q.e.length > 20, q.id + " : explication");
  ok(["bia", "ppl"].includes(q.lvl), q.id + " : niveau");
  ok(!/—/.test(q.q + q.c.join("") + q.e), q.id + " : tiret cadratin");
}
const core = readFileSync(new URL("../site/assets/core.js", import.meta.url), "utf8");
const n = +core.match(/q: 'aer-', n: (\d+)/)[1];
ok(n === Q.length, `core.js déclare ${n} questions, la banque en a ${Q.length}`);
console.log(fails ? fails + " échec(s)" : `OK : ${Q.length} questions`);
process.exit(fails ? 1 : 0);
