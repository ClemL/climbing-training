/*
 * Offline service worker.
 *
 * Hand-rolled rather than generated: the app is one static page plus images, so
 * there is nothing to gain from coupling a plugin to the build, and a plugin
 * that breaks on a Next upgrade would take offline support with it.
 *
 * Install precaches the shell and every exercise image, so a plan you have
 * never opened still shows its illustrations in a basement gym with no signal.
 * Hashed build chunks are cached as they are requested, since their names are
 * only known after a build.
 */
const VERSION = "v1";
const SHELL = `shell-${VERSION}`;
const RUNTIME = `runtime-${VERSION}`;
const SHELL_URLS = ["/", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL);
      await cache.addAll(SHELL_URLS);

      // Images are listed in a manifest emitted by the image pipeline. A failure
      // here must not abort installation - the app still works without art.
      try {
        const res = await fetch("/image-manifest.json", { cache: "no-cache" });
        if (res.ok) {
          const images = await res.json();
          await Promise.allSettled(images.map((url) => cache.add(url)));
        }
      } catch {
        /* offline on first install; images fill in via runtime caching */
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([SHELL, RUNTIME]);
      const names = await caches.keys();
      await Promise.all(names.filter((n) => !keep.has(n)).map((n) => caches.delete(n)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigations: network first so a deploy is picked up, shell fallback offline.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(SHELL);
          cache.put("/", fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match("/", { ignoreSearch: true });
          return cached ?? Response.error();
        }
      })(),
    );
    return;
  }

  // Everything else: cache first. Build assets are content-hashed and images
  // never change, so a stale hit is always a correct hit.
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        const fresh = await fetch(request);
        if (fresh.ok && fresh.type === "basic") {
          const cache = await caches.open(RUNTIME);
          cache.put(request, fresh.clone());
        }
        return fresh;
      } catch {
        return Response.error();
      }
    })(),
  );
});
