self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (ev) => ev.waitUntil(self.clients.claim()));

self.addEventListener('message', (event) => {
  try {
    const { type, payload } = event.data || {};
    if (type === 'GEO_LOG' && payload) {
      // fire-and-forget to server; SW fetch runs in background and survives page unloads
      fetch('/api/geo-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {
        // failure is silent; optionally implement IndexedDB queue + sync later
      });
    }
  } catch (e) { /* ignore */ }
});
