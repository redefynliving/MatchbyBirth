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
  assert.match(view, /Want your full report/);
  assert.match(resultCard, /View sample report/);
  assert.match(ssg, /route: 'sample-report'/);
  assert.match(generateSitemapXml(), /https:\/\/matchbybirth\.com\/sample-report/);
});

test('sample report data demonstrates the paid report value clearly', () => {
  const sample = read('apps/web/src/data/sampleReport.js');

  assert.match(sample, /Alex & Jordan/);
  assert.match(sample, /86/);
  assert.match(sample, /Chemistry/);
  assert.match(sample, /Stability/);
  assert.match(sample, /Say this first/);
  assert.match(sample, /practical_advice/);
  assert.match(sample, /entertainment|verdict/i);
});
