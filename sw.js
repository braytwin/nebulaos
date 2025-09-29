importScripts("/scram/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

// Install and activate
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Intercept fetch requests
self.addEventListener("fetch", (event) => {
  event.respondWith((async () => {
    await scramjet.loadConfig();

    // If Scramjet can handle this request, proxy it
    if (scramjet.route(event)) {
      return scramjet.fetch(event);
    }

    // Otherwise, fetch normally
    return fetch(event.request);
  })());
});
