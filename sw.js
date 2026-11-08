// Service worker : permet d'ouvrir l'appli sans réseau.
// Pour publier une nouvelle version des icônes ou du manifeste, changez le numéro ci-dessous.
const CACHE = "finances-v2";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./apple-touch-icon.png"];
// Bibliothèques externes gardées en cache (Firebase, polices, lecteur Excel). Les échanges avec la base Firestore ne passent pas par ici.
const CDN = /^https:\/\/(www\.gstatic\.com\/firebasejs\/|fonts\.googleapis\.com\/|fonts\.gstatic\.com\/|cdnjs\.cloudflare\.com\/)/;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
const put = (req, res) => { if (res && (res.ok || res.type === "opaque")) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)) } return res };

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    if (req.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith(".html")) {
      // Page : réseau d'abord (pour recevoir les mises à jour), cache si hors ligne.
      e.respondWith(fetch(req).then(res => put(req, res)).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("./index.html"))));
    } else {
      e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => put(req, res))));
    }
    return;
  }
  if (CDN.test(req.url)) e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => put(req, res))));
});
