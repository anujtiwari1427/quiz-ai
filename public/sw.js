const CACHE_NAME = 'edupulse-pwa-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/marklab/flash-dynamic-gradient.svg',
  '/fonts/TASAOrbiterDeck-Regular.otf',
  '/fonts/TASAOrbiterDeck-Medium.otf',
  '/fonts/TASAOrbiterDeck-SemiBold.otf',
  '/fonts/TASAOrbiterDeck-Bold.otf'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('PWA Cache addAll warning:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Do not intercept AI provider API calls (Gemini, OpenAI, Anthropic) or non-GET requests
  const url = new URL(event.request.url);
  if (
    event.request.method !== 'GET' ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('anthropic.com') ||
    url.hostname.includes('openai.com')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached, and fetch update in background
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
