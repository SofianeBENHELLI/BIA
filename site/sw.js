/* Service worker généré par scripts/build-pwa.mjs : ne pas modifier sw.js à la main. */
const VERSION = "2d9ac6b9c810";
const CACHE = "bia-saleem-" + VERSION;
const ASSETS = [
 "/",
 "/aerodynamique/",
 "/aerodynamique/labs.js",
 "/aerodynamique/questions.js",
 "/aeronefs/",
 "/aeronefs/labs.js",
 "/aeronefs/questions.js",
 "/anglais/",
 "/anglais/app.js",
 "/anglais/data.js",
 "/anglais/questions.js",
 "/assets/app.css",
 "/assets/core.js",
 "/assets/fonts.css",
 "/assets/fonts/font-0.ttf",
 "/assets/fonts/font-1.ttf",
 "/assets/fonts/font-2.ttf",
 "/assets/fonts/font-3.ttf",
 "/assets/fonts/font-4.ttf",
 "/assets/fonts/font-5.ttf",
 "/assets/fonts/font-6.ttf",
 "/assets/fonts/font-7.ttf",
 "/assets/fonts/font-8.ttf",
 "/assets/pwa.js",
 "/avions/",
 "/avions/app.js",
 "/avions/photos/cockpit.webp",
 "/avions/photos/cockpitvol.webp",
 "/avions/photos/dr401.webp",
 "/avions/photos/hero.webp",
 "/avions/photos/moteur.webp",
 "/avions/photos/v120.webp",
 "/avions/photos/v140b.webp",
 "/avions/photos/v180.webp",
 "/avions/photos/v180r.webp",
 "/avions/questions.js",
 "/credits/",
 "/entrainement/",
 "/entrainement/app.js",
 "/histoire/",
 "/histoire/app.js",
 "/histoire/data.js",
 "/histoire/questions.js",
 "/icons/apple-touch-icon.png",
 "/icons/icon-192.png",
 "/icons/icon-512.png",
 "/icons/icon-maskable-512.png",
 "/manifest.webmanifest",
 "/meteo/",
 "/meteo/labs.js",
 "/meteo/questions.js",
 "/mythiques/",
 "/mythiques/app.js",
 "/mythiques/data.js",
 "/mythiques/photos.js",
 "/mythiques/photos/a300.webp",
 "/mythiques/photos/a320.webp",
 "/mythiques/photos/a380.webp",
 "/mythiques/photos/alouette.webp",
 "/mythiques/photos/alphajet.webp",
 "/mythiques/photos/an225.webp",
 "/mythiques/photos/b17.webp",
 "/mythiques/photos/b707.webp",
 "/mythiques/photos/b737.webp",
 "/mythiques/photos/b747.webp",
 "/mythiques/photos/bf109.webp",
 "/mythiques/photos/bleriot.webp",
 "/mythiques/photos/c130.webp",
 "/mythiques/photos/c172.webp",
 "/mythiques/photos/cap10.webp",
 "/mythiques/photos/caravelle.webp",
 "/mythiques/photos/comet.webp",
 "/mythiques/photos/concorde.webp",
 "/mythiques/photos/constellation.webp",
 "/mythiques/photos/cub.webp",
 "/mythiques/photos/dc3.webp",
 "/mythiques/photos/dr400.webp",
 "/mythiques/photos/f117.webp",
 "/mythiques/photos/f14.webp",
 "/mythiques/photos/fokker.webp",
 "/mythiques/photos/late28.webp",
 "/mythiques/photos/me262.webp",
 "/mythiques/photos/mirage2000.webp",
 "/mythiques/photos/mirage3.webp",
 "/mythiques/photos/p38.webp",
 "/mythiques/photos/p51.webp",
 "/mythiques/photos/rafale.webp",
 "/mythiques/photos/shuttle.webp",
 "/mythiques/photos/solar.webp",
 "/mythiques/photos/spad.webp",
 "/mythiques/photos/spitfire.webp",
 "/mythiques/photos/sr71.webp",
 "/mythiques/photos/stlouis.webp",
 "/mythiques/photos/wright.webp",
 "/mythiques/photos/x1.webp",
 "/mythiques/photos/x15.webp",
 "/navigation/",
 "/navigation/labs.js",
 "/navigation/questions.js",
 "/pilote/",
 "/pilote/app.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("bia-saleem-") && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

// Réseau d'abord pour les pages, scripts et styles (le HTML et le JS restent toujours de la même version),
// cache si hors ligne ou trop lent. Polices et images : cache d'abord.
function putCache(req, res) { if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; }
function networkFirst(req, fallback) {
  return new Promise((resolve) => {
    let done = false;
    const timer = setTimeout(() => { caches.match(req, { ignoreSearch: true }).then((r) => { if (r && !done) { done = true; resolve(r); } }); }, 4000);
    fetch(req).then((res) => { clearTimeout(timer); if (!done) { done = true; resolve(putCache(req, res)); } else putCache(req, res); })
      .catch(() => { clearTimeout(timer); if (!done) { done = true; resolve(fallback()); } });
  });
}
self.addEventListener("fetch", (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  const dyn = req.mode === "navigate" || /\.(js|css|html|json|webmanifest)$/.test(url.pathname) || url.pathname.endsWith("/");
  if (dyn) {
    e.respondWith(networkFirst(req, () => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match(url.pathname.endsWith("/") ? url.pathname + "index.html" : url.pathname, { ignoreSearch: true })).then((r) => r || (req.mode === "navigate" ? caches.match("/") : Response.error()))));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((r) => r || fetch(req).then(putCache.bind(null, req))));
});
