import { track } from '@vercel/analytics';

const SESSION_KEY = 'matchbybirth:funnel-session';

function createSessionId() {
  const cryptoApi = globalThis.crypto;
  if (typeof cryptoApi?.randomUUID === 'function') {
    return `mbb_${cryptoApi.randomUUID()}`;
  }
  if (typeof cryptoApi?.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    cryptoApi.getRandomValues(bytes);
    const token = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
    return `mbb_${token}`;
  }
  return '';
}

function getSessionId() {
  if (typeof window === 'undefined') return '';

  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;

    const sessionId = createSessionId();
    if (!sessionId) return '';
    window.sessionStorage.setItem(SESSION_KEY, sessionId);
    return sessionId;
  } catch {
    return '';
  }
}

function trackFirstPartyEvent(name, properties = {}) {
  if (typeof window === 'undefined') return;

  const payload = JSON.stringify({
    name,
    properties: {
      ...properties,
      session_id: getSessionId(),
    },
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/track-event', blob);
      return;
    }

    fetch('/api/track-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // First-party funnel logging must never interrupt the app.
  }
}

export function trackEvent(name, properties = {}) {
  try {
    track(name, properties);
  } catch {
    // Analytics must never interrupt the calculator or checkout.
  }

  trackFirstPartyEvent(name, properties);
}
