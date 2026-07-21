/* Offline-first service worker for this static SPA (GitHub Pages, subpath base).
   Strategy: stale-while-revalidate for same-origin GETs, with the cached app
   shell served for navigations when the network is unavailable. Cross-origin
   requests (e.g. the web-font CDN) are left to the browser. */
const CACHE = "igr-cache-v1";
const BASE = new URL("./", self.location).pathname; // e.g. /learn-grammar/

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Precache the icon + manifest.
    await cache.addAll([BASE + "manifest.webmanifest", BASE + "icon.svg"]).catch(() => {});
    // Precache the app shell + its hashed JS/CSS (names aren't known ahead of
    // time, so read them out of index.html) — makes the app work offline from
    // the first visit, before the SW controls the very first asset fetches.
    try {
      const res = await fetch(BASE, { cache: "no-cache" });
      await cache.put(BASE, res.clone());
      const html = await res.text();
      const urls = new Set();
      const re = /(?:src|href)="([^"]+\.(?:js|css))(?:\?[^"]*)?"/g;
      let m;
      while ((m = re.exec(html))) urls.add(new URL(m[1], self.location).href);
      await Promise.all([...urls].map((u) => cache.add(u).catch(() => {})));
    } catch (e) { /* best effort — runtime caching still covers repeat visits */ }
  })());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // let the browser handle cross-origin

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req);
    const fetching = fetch(req).then((res) => {
      if (res && res.status === 200 && res.type === "basic") cache.put(req, res.clone());
      return res;
    }).catch(() => null);

    if (cached) {
      event.waitUntil(fetching); // refresh the cache in the background
      return cached;
    }
    const res = await fetching;
    if (res) return res;
    if (req.mode === "navigate") {
      const shell = await cache.match(BASE);
      if (shell) return shell;
    }
    return new Response("Offline", { status: 503, statusText: "Offline" });
  })());
});
