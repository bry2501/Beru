// Offline support for Offer Check.
// Online: always load the latest version (falls back to the saved copy if the
// network is slow or down). Offline: use the saved copy.
const VERSION = 'offer-check-v6';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
const SLOW_MS = 2000;

self.addEventListener('install', e => {
  // cache:'reload' skips the browser's HTTP cache so we never save a stale copy.
  e.waitUntil(caches.open(VERSION)
    .then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const sameOrigin = new URL(req.url).origin === location.origin;

  // Network, bypassing the HTTP cache for our own files; save what comes back.
  const fromNetwork = fetch(sameOrigin ? new Request(req, { cache: 'no-cache' }) : req).then(res => {
    if (res.ok || res.type === 'opaque') {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(req, copy));
    }
    return res;
  });
  const fromCache = () => caches.match(req, { ignoreSearch: true })
    .then(hit => hit || (req.mode === 'navigate' ? caches.match('index.html') : undefined));

  e.respondWith(new Promise(resolve => {
    let done = false;
    const finish = r => { if (!done && r) { done = true; resolve(r); } };
    // Network wins if it answers quickly; otherwise show the saved copy.
    const timer = setTimeout(() => fromCache().then(finish), SLOW_MS);
    fromNetwork.then(r => { clearTimeout(timer); finish(r); })
      .catch(() => { clearTimeout(timer); fromCache().then(r => finish(r || Response.error())); });
  }));
});
