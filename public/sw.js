/**
 * KrushiMitra AI - Progressive Web App Service Worker
 * Version: 1.0.0
 * Provides robust offline capabilities, asset caching, and network resilience
 * for farmers and merchants with intermittent rural network connectivity.
 */

const CACHE_NAME = 'krushimitra-core-v1.0.0';
const DATA_CACHE_NAME = 'krushimitra-data-v1.0.0';

// Critical static assets precached immediately on installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/manifest.json',
  '/offline.html',
  '/favicon.svg',
  '/icons/icon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-512x512.png',
  '/icons/apple-touch-icon.png',
];

// Install Event: precache core shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(PRECACHE_ASSETS);
      } catch (err) {
        console.warn('[SW] Core asset precache partial failure:', err);
      }
    })
  );
});

// Activate Event: purge stale caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('[SW] Purging outdated cache:', key);
            return caches.delete(key);
          }
        })
      );
      await self.clients.claim();
    })()
  );
});

// Helper to determine asset types
const isNavigationRequest = (request) => request.mode === 'navigate';
const isGoogleFont = (url) => url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
const isStaticAsset = (url) =>
  url.pathname.startsWith('/assets/') ||
  url.pathname.endsWith('.js') ||
  url.pathname.endsWith('.css') ||
  url.pathname.endsWith('.svg') ||
  url.pathname.endsWith('.png') ||
  url.pathname.endsWith('.jpg') ||
  url.pathname.endsWith('.webp') ||
  url.pathname.endsWith('.woff2');

// Fetch Event: intelligent tiered caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests (e.g., Supabase POST / mutations)
  if (request.method !== 'GET') {
    return;
  }

  // Ignore browser extensions, chrome-extension://, or non-http protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 1. Navigation Requests (HTML Pages): Network-First, with cache and offline.html fallback
  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;

          const indexCache = await caches.match('/index.html');
          if (indexCache) return indexCache;

          const offlineFallback = await caches.match('/offline.html');
          if (offlineFallback) return offlineFallback;

          return new Response('Offline - No connection', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          });
        })
    );
    return;
  }

  // 2. Google Fonts & Static Assets: Stale-While-Revalidate
  if (isGoogleFont(url) || isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              const copy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. API & Data Requests (e.g. Supabase, APMC Mandi, Agmarknet): Network-first with data cache fallback
  if (url.hostname.includes('supabase.co') || url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const copy = networkResponse.clone();
            caches.open(DATA_CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return new Response(JSON.stringify({ offline: true, error: 'Network unavailable' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          });
        })
    );
    return;
  }

  // 4. Default: Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              const copy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse)
      );
    })
  );
});

// Message listener for skip waiting on update
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background Sync listener (when farmer regains connectivity)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-bids-and-listings') {
    console.log('[SW] Background sync triggered: sync-bids-and-listings');
  }
});

// Push Notification listener for incoming auction bids
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || 'KrushiMitra AI - नवीन लिलाव अपडेट';
    const options = {
      body: data.body || 'तुमच्या शेतमालावर नवीन बोली प्राप्त झाली आहे.',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/farmer',
      },
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch {
    // Fallback if not JSON
    event.waitUntil(
      self.registration.showNotification('KrushiMitra AI', {
        body: event.data.text(),
        icon: '/icons/icon-192x192.png',
      })
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
