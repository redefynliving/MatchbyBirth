'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

test('app lazy-loads non-home routes and keeps heavy export libraries dynamic', () => {
  const appSource = fs.readFileSync(path.join(root, 'apps/web/src/App.jsx'), 'utf8');
  const reportSource = fs.readFileSync(path.join(root, 'apps/web/src/pages/ReportPage.jsx'), 'utf8');
  const resultCardSource = fs.readFileSync(path.join(root, 'apps/web/src/components/ResultCard.jsx'), 'utf8');

  assert.match(appSource, /lazy\(/);
  assert.match(appSource, /<Suspense/);
  assert.doesNotMatch(appSource, /import ReportPage from/);
  assert.doesNotMatch(appSource, /import ResultPage from/);
  assert.doesNotMatch(appSource, /import BlogPostPage from/);
  assert.doesNotMatch(appSource, /import CategoryPage from/);

  assert.match(reportSource, /import\(['"]jspdf['"]\)/);
  assert.match(resultCardSource, /import\(['"]html2canvas['"]\)/);
});

test('homepage schema does not include unverifiable aggregate ratings', () => {
  const source = fs.readFileSync(path.join(root, 'apps/web/src/pages/HomePage.jsx'), 'utf8');

  assert.doesNotMatch(source, /aggregateRating/);
  assert.doesNotMatch(source, /ratingValue/);
  assert.doesNotMatch(source, /ratingCount/);
});
