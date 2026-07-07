const ATTRIBUTION_KEY = 'matchbybirth:funnel-attribution';
const MAX_AGE_MS = 30 * 60 * 1000;

function getStorage() {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage || null;
}

export function setFunnelAttribution(data) {
  try {
    const storage = getStorage();
    if (!storage) return;
    storage.setItem(ATTRIBUTION_KEY, JSON.stringify({
      ...data,
      createdAt: Date.now(),
    }));
  } catch {
    // Attribution must never interrupt navigation.
  }
}

export function getFunnelAttribution() {
  try {
    const storage = getStorage();
    if (!storage) return {};
    const raw = storage.getItem(ATTRIBUTION_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (!parsed?.createdAt || Date.now() - parsed.createdAt > MAX_AGE_MS) {
      storage.removeItem(ATTRIBUTION_KEY);
      return {};
    }

    return {
      funnel_source: parsed.source || 'unknown',
      cta_placement: parsed.placement || 'unknown',
      cta_label: parsed.label || 'unknown',
      cta_text: parsed.text || 'unknown',
      cta_variant: parsed.variant || 'default',
    };
  } catch {
    return {};
  }
}
