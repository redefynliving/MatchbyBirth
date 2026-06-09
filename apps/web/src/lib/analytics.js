import { track } from '@vercel/analytics';

export function trackEvent(name, properties = {}) {
  try {
    track(name, properties);
  } catch {
    // Analytics must never interrupt the calculator or checkout.
  }
}
