'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('private report page delegates display to the shared report view', () => {
  const source = read('apps/web/src/pages/ReportPage.jsx');

  assert.match(source, /ReportView/);
  assert.match(source, /fetch\(`\/api\/report/);
  assert.match(source, /noindex,nofollow,noarchive/);
  assert.doesNotMatch(source, /Report snapshot/);
});

test('sample report route uses the shared report view and sample data', async () => {
  const app = read('apps/web/src/App.jsx');
  const page = read('apps/web/src/pages/SampleReportPage.jsx');
  const view = read('apps/web/src/components/report/ReportView.jsx');
  const attribution = read('apps/web/src/lib/funnel-attribution.js');
  const calculator = read('apps/web/src/components/CalculatorWithPreview.jsx');
  const legacyCalculator = read('apps/web/src/components/CompatibilityCalculator.jsx');
  const saveModal = read('apps/web/src/components/SaveResultModal.jsx');
  const resultCard = read('apps/web/src/components/ResultCard.jsx');
  const ssg = read('tools/build-ssg.mjs');
  const { generateSitemapXml } = await import(pathToFileURL(
    path.join(root, 'apps/web/tools/generate-sitemap.js'),
  ));

  assert.match(app, /const SampleReportPage = lazy/);
  assert.match(app, /path="\/sample-report"/);
  assert.match(page, /sampleReport/);
  assert.match(page, /ReportView/);
  assert.match(view, /Report snapshot/);
  assert.match(view, /Sample compatibility report/);
  assert.match(view, /Run a private comparison first/);
  assert.match(view, /Run a private comparison/);
  assert.match(view, /sample_report_cta_clicked/);
  assert.match(view, /setFunnelAttribution/);
  assert.match(view, /placement: 'score_card'/);
  assert.match(view, /\/#calculator/);
  assert.doesNotMatch(view, /<ReportCta/);
  assert.doesNotMatch(view, /Read your own result this way/);
  assert.doesNotMatch(view, /See what this looks like with your names and scores/);
  assert.doesNotMatch(view, /Want a report that's actually yours/);
  assert.match(attribution, /cta_variant/);
  assert.match(attribution, /MAX_AGE_MS/);
  assert.match(calculator, /getFunnelAttribution/);
  assert.match(legacyCalculator, /getFunnelAttribution/);
  assert.match(resultCard, /getFunnelAttribution/);
  assert.match(saveModal, /getFunnelAttribution/);
  assert.match(resultCard, /See exactly what is included/);
  assert.match(ssg, /route: 'sample-report'/);
  assert.match(ssg, /Alex &amp; Jordan score 86/);
  assert.match(ssg, /Run a private comparison first/);
  assert.doesNotMatch(ssg, /Read your own result this way/);
  assert.doesNotMatch(ssg, /See what this looks like with your names and scores/);
  assert.doesNotMatch(ssg, /Want a report that's actually yours/);
  assert.match(generateSitemapXml(), /https:\/\/matchbybirth\.com\/sample-report/);
});

test('sample report data demonstrates the paid report value clearly', () => {
  const sample = read('apps/web/src/data/sampleReport.js');

  assert.match(sample, /Alex & Jordan/);
  assert.match(sample, /86/);
  assert.match(sample, /Chemistry/);
  assert.match(sample, /Stability/);
  assert.match(sample, /focusLabel: 'Full Compatibility Report'/);
  assert.match(sample, /evidenceSummary/);
  assert.match(sample, /precisionNote/);
  assert.match(sample, /words_to_use/);
  assert.match(sample, /Chemistry leads at 90/);
  assert.match(sample, /What did you mean by that/);
  assert.match(sample, /seven-day plan/i);
  assert.match(sample, /structured-v7/);
  assert.doesNotMatch(sample, /soulmate|fated|guaranteed|meaningful connection/i);
});

test('shared report renderer groups all nine sections into four backward-compatible chapters', () => {
  const view = read('apps/web/src/components/report/ReportView.jsx');

  assert.match(view, /Overview/);
  assert.match(view, /Relating/);
  assert.match(view, /Building/);
  assert.match(view, /Action plan/);
  assert.match(view, /report\.sections\.slice/);
  assert.doesNotMatch(view, /promptVersion === 'structured-v7'/);
});
