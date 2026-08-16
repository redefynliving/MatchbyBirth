'use strict';

const ALLOWED_EVENTS = new Set([
  'share_page_view',
  'share_page_cta_click',
  'share_page_sample_report_click',
  'share_page_copy_link_click',
  'share_page_x_share_click',
  'timing_context_viewed',
  'calculation_started',
  'calculation_completed',
  'checkout_started',
  'checkout_redirected',
  'purchase_completed',
  'report_delivered',
]);

const SAFE_PROPERTY_KEYS = new Set([
  'share_id',
  'relationship_type',
  'score',
  'score_band',
  'placement',
  'cta_label',
  'source',
  'mode',
  'group_size',
  'exact_mode',
  'funnel_source',
  'cta_placement',
  'cta_text',
  'cta_variant',
  'price',
  'currency',
  'discount_applied',
  'session_id',
  'moon_phase',
]);

const SCORE_BANDS = [
  [85, 'strong_natural_rhythm'],
  [70, 'good_compatibility'],
  [50, 'mixed_rhythm'],
  [0, 'different_rhythms'],
];

function getScoreBandKey(score) {
  const normalized = Number(score);
  if (!Number.isFinite(normalized)) return null;
  return SCORE_BANDS.find(([minimum]) => normalized >= minimum)?.[1] || 'different_rhythms';
}

function sanitizeValue(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return undefined;
    return Math.round(value * 100) / 100;
  }
  if (typeof value === 'string') return value.trim().slice(0, 160);
  return undefined;
}

function sanitizeProperties(properties = {}) {
  const sanitized = {};
  for (const [key, value] of Object.entries(properties || {})) {
    if (!SAFE_PROPERTY_KEYS.has(key)) continue;
    const sanitizedValue = sanitizeValue(value);
    if (sanitizedValue !== undefined && sanitizedValue !== '') {
      sanitized[key] = sanitizedValue;
    }
  }

  if (!sanitized.score_band && sanitized.score !== undefined) {
    sanitized.score_band = getScoreBandKey(sanitized.score);
  }

  return sanitized;
}

function normalizeEvent(input = {}) {
  const eventName = String(input.name || input.event_name || '').trim();
  if (!ALLOWED_EVENTS.has(eventName)) return null;

  const properties = sanitizeProperties(input.properties || {});
  return {
    event_name: eventName,
    properties,
    session_id: properties.session_id || null,
    share_id: properties.share_id || null,
    score_band: properties.score_band || null,
    relationship_type: properties.relationship_type || null,
    source: properties.source || properties.funnel_source || null,
    placement: properties.placement || properties.cta_placement || null,
    cta_label: properties.cta_label || null,
    created_at: new Date().toISOString(),
  };
}

async function recordFunnelEvent(input, store) {
  const event = normalizeEvent(input);
  if (!event) return { stored: false, reason: 'ignored_event' };
  if (!store?.isConfigured?.() || !store?.insertFunnelEvent) {
    return { stored: false, reason: 'not_configured' };
  }

  await store.insertFunnelEvent(event);
  return { stored: true };
}

function createEmptyMetric() {
  return {
    share_page_view: 0,
    share_page_cta_click: 0,
    share_page_sample_report_click: 0,
    timing_context_viewed: 0,
    calculation_started_from_share: 0,
    checkout_started_from_share: 0,
    purchase_completed: 0,
  };
}

function increment(metrics, key) {
  metrics[key] = (metrics[key] || 0) + 1;
}

function getEventProperties(row) {
  return row?.properties && typeof row.properties === 'object' ? row.properties : {};
}

function isFromShare(row) {
  const properties = getEventProperties(row);
  return (
    row.source === 'share_page'
    || properties.source === 'share_page'
    || properties.funnel_source === 'share_page'
    || Boolean(row.share_id || properties.share_id)
  );
}

function getBand(row) {
  const properties = getEventProperties(row);
  return row.score_band || properties.score_band || 'unknown';
}

function safeRate(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 1000) / 10;
}

function summarizeFunnelEvents(rows = [], options = {}) {
  const summary = {
    generatedAt: new Date().toISOString(),
    since: options.since || null,
    totals: createEmptyMetric(),
    scoreBands: {},
    recentEvents: rows.slice(-20).reverse(),
    conversionRates: {},
  };

  for (const row of rows) {
    const band = getBand(row);
    if (!summary.scoreBands[band]) summary.scoreBands[band] = createEmptyMetric();
    const bandMetrics = summary.scoreBands[band];

    if (row.event_name === 'share_page_view') {
      increment(summary.totals, 'share_page_view');
      increment(bandMetrics, 'share_page_view');
    }
    if (row.event_name === 'share_page_cta_click') {
      increment(summary.totals, 'share_page_cta_click');
      increment(bandMetrics, 'share_page_cta_click');
    }
    if (row.event_name === 'share_page_sample_report_click') {
      increment(summary.totals, 'share_page_sample_report_click');
      increment(bandMetrics, 'share_page_sample_report_click');
    }
    if (row.event_name === 'timing_context_viewed') {
      increment(summary.totals, 'timing_context_viewed');
      increment(bandMetrics, 'timing_context_viewed');
    }
    if (row.event_name === 'calculation_started' && isFromShare(row)) {
      increment(summary.totals, 'calculation_started_from_share');
      increment(bandMetrics, 'calculation_started_from_share');
    }
    if (row.event_name === 'checkout_started' && isFromShare(row)) {
      increment(summary.totals, 'checkout_started_from_share');
      increment(bandMetrics, 'checkout_started_from_share');
    }
    if (row.event_name === 'purchase_completed') {
      increment(summary.totals, 'purchase_completed');
      increment(bandMetrics, 'purchase_completed');
    }
  }

  summary.conversionRates = {
    shareViewToCta: safeRate(summary.totals.share_page_cta_click, summary.totals.share_page_view),
    shareViewToCalculator: safeRate(summary.totals.calculation_started_from_share, summary.totals.share_page_view),
    checkoutToPurchase: safeRate(summary.totals.purchase_completed, summary.totals.checkout_started_from_share),
  };

  return summary;
}

module.exports = {
  ALLOWED_EVENTS,
  getScoreBandKey,
  normalizeEvent,
  recordFunnelEvent,
  sanitizeProperties,
  summarizeFunnelEvents,
};
