'use strict';

const CYCLECALCS_MOON_URL = 'https://www.cyclecalcs.com/v2/moon';
const CACHE_TTL_MS = 15 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 3500;

let moonCache = null;

function unavailable() {
  return {
    available: false,
    source: 'cyclecalcs',
  };
}

function normalizeMoonResponse(payload) {
  const data = payload?.data;
  const phase = data?.phase;
  if (!phase || typeof phase.name !== 'string' || !phase.name.trim()) {
    return null;
  }

  const next = Array.isArray(data.next_phases) ? data.next_phases[0] : null;
  return {
    available: true,
    source: 'cyclecalcs',
    current: {
      phase: phase.name.trim(),
      illuminationPercent: Number.isFinite(Number(phase.illumination_percent))
        ? Number(phase.illumination_percent)
        : null,
      cycleDay: Number.isFinite(Number(phase.day_of_cycle))
        ? Number(phase.day_of_cycle)
        : null,
      summary: typeof data.summary === 'string' ? data.summary.trim().slice(0, 240) : '',
    },
    nextPhase: next && typeof next.name === 'string'
      ? {
        name: next.name.trim(),
        instant: typeof next.instant === 'string' ? next.instant : null,
        daysUntil: Number.isFinite(Number(next.days_until)) ? Number(next.days_until) : null,
      }
      : null,
  };
}

async function getMoonContext({
  now = new Date(),
  fetchImpl = globalThis.fetch,
  timeoutMs = REQUEST_TIMEOUT_MS,
} = {}) {
  const nowMs = now instanceof Date ? now.getTime() : new Date(now).getTime();
  if (!Number.isFinite(nowMs)) return unavailable();

  if (moonCache && moonCache.expiresAt > nowMs) {
    return moonCache.value;
  }

  if (typeof fetchImpl !== 'function') return unavailable();

  const url = new URL(CYCLECALCS_MOON_URL);
  url.searchParams.set('at', new Date(nowMs).toISOString());
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(url.toString(), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response?.ok) return unavailable();

    const payload = await response.json();
    const value = normalizeMoonResponse(payload);
    if (!value) return unavailable();

    moonCache = {
      expiresAt: nowMs + CACHE_TTL_MS,
      value,
    };
    return value;
  } catch {
    return unavailable();
  } finally {
    clearTimeout(timeout);
  }
}

function clearMoonContextCache() {
  moonCache = null;
}

module.exports = {
  clearMoonContextCache,
  getMoonContext,
  normalizeMoonResponse,
};
