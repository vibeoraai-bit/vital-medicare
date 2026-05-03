// Vital Medicare Service Worker v1.0
const CACHE_NAME = 'vital-medicare-v1'
const OFFLINE_URL = '/offline'

// Files to cache for offline use
const PRECACHE_URLS = [
  '/',
  '/shop',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

// Install event — precache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  )
})

// Activate event — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(cacheNames.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    ).then(() => self.clients.claim())
  )
})

// Fetch event — network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET and external requests
  if (request.method !== 'GET') return
  if (!url.origin === location.origin) return
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) return

  event.respondWith(
    fetch(request)
      .then(response => {
        // Cache successful responses
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseToCache))
        }
        return response
      })
      .catch(() => {
        // Offline fallback
        return caches.match(request).then(cached => {
          if (cached) return cached
          if (request.mode === 'navigate') return caches.match('/')
          return new Response('Offline', { status: 503 })
        })
      })
  )
})

// Push notification handler
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {}
  const options = {
    body: data.body || 'You have a new notification from Vital Medicare',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'View', icon: '/icons/icon-96.png' },
      { action: 'close', title: 'Dismiss' },
    ],
  }
  event.waitUntil(
    self.registration.showNotification(data.title || 'Vital Medicare', options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  if (event.action === 'close') return
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})