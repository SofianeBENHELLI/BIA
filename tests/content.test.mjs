// Vérifie la banque de questions : identifiants uniques, 4 propositions distinctes, explication présente,
// et nombre de questions cohérent avec la déclaration des pages (core.js).
import { readFileSync } from "node:fs";
import vm from "node:vm";
const ctx = { window: {} };
vm.runInNewContext(readFileSync(new URL("../site/aerodynamique/questions.js", import.meta.url), "utf8"), ctx);
vm.runInNewContext(readFileSync(new URL("../site/meteo/questions.js", import.meta.url), "utf8"), ctx);
vm.runInNewContext(readFileSync(new URL("../site/avions/questions.js", import.meta.url), "utf8"), ctx);
const Q = [...ctx.window.QAERO, ...ctx.window.QMETEO, ...ctx.window.QDR400];
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
for (const [pre, bank] of [["aer-", ctx.window.QAERO], ["met-", ctx.window.QMETEO], ["dr4-", ctx.window.QDR400]]) {
  const n = +core.match(new RegExp("q: '" + pre + "', n: (\\d+)"))[1];
  ok(n === bank.length, `core.js déclare ${n} questions ${pre}, la banque en a ${bank.length}`);
}
console.log(fails ? fails + " échec(s)" : `OK : ${Q.length} questions`);
process.exit(fails ? 1 : 0);
