'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const {
  normalizeEvent,
  summarizeFunnelEvents,
} = require('../api/_lib/funnel-service.cjs');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('funnel events are sanitized before storage', () => {
  const event = normalizeEvent({
    name: 'share_page_cta_click',
    properties: {
      share_id: 'share_123',
      score: 86,
      relationship_type: 'love',
      placement: 'top',
      cta_label: 'Try your own match',
      birthDate: '1990-03-21',
      email: 'buyer@example.com',
      private_token: 'secret',
    },
  });

  assert.equal(event.event_name, 'share_page_cta_click');
  assert.equal(event.score_band, 'strong_natural_rhythm');
  assert.equal(event.relationship_type, 'love');
  assert.equal(event.properties.birthDate, undefined);
  assert.equal(event.properties.email, undefined);
  assert.equal(event.properties.private_token, undefined);
});

test('weekly funnel summary counts share traffic through purchase by score band', () => {
  const rows = [
    { event_name: 'share_page_view', score_band: 'good_compatibility', properties: {} },
    { event_name: 'share_page_cta_click', score_band: 'good_compatibility', properties: {} },
    { event_name: 'share_page_sample_report_click', score_band: 'good_compatibility', properties: {} },
    {
      event_name: 'calculation_started',
      score_band: 'good_compatibility',
      source: 'share_page',
      properties: { funnel_source: 'share_page' },
    },
    {
      event_name: 'checkout_started',
      score_band: 'good_compatibility',
      source: 'share_page',
      properties: { funnel_source: 'share_page' },
    },
    { event_name: 'purchase_completed', score_band: 'good_compatibility', properties: {} },
  ];

  const summary = summarizeFunnelEvents(rows, { since: '2026-07-01T00:00:00.000Z' });

  assert.equal(summary.totals.share_page_view, 1);
  assert.equal(summary.totals.share_page_cta_click, 1);
  assert.equal(summary.totals.share_page_sample_report_click, 1);
  assert.equal(summary.totals.calculation_started_from_share, 1);
  assert.equal(summary.totals.checkout_started_from_share, 1);
  assert.equal(summary.totals.purchase_completed, 1);
  assert.equal(summary.scoreBands.good_compatibility.purchase_completed, 1);
  assert.equal(summary.conversionRates.shareViewToCalculator, 100);
});

test('first-party funnel routes and dashboard are wired', () => {
  const router = read('api/index.js');
  const analytics = read('apps/web/src/lib/analytics.js');
  const app = read('apps/web/src/App.jsx');
  const dashboard = read('apps/web/src/pages/FunnelDashboardPage.jsx');
  const migration = read('supabase/migrations/20260707133000_funnel_events.sql');
  const webhook = read('api/_lib/webhook-service.cjs');

  assert.match(router, /\/api\/track-event/);
  assert.match(router, /\/api\/funnel-summary/);
  assert.match(analytics, /\/api\/track-event/);
  assert.match(analytics, /sendBeacon/);
  assert.match(app, /\/admin\/funnel/);
  assert.match(dashboard, /share_page_view/);
  assert.match(dashboard, /checkout_started_from_share/);
  assert.match(dashboard, /purchase_completed/);
  assert.match(migration, /create table public\.funnel_events/);
  assert.match(migration, /enable row level security/);
  assert.match(webhook, /purchase_completed/);
});
