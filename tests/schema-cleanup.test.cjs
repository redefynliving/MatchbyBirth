const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

test('homepage schema does not claim unverifiable ratings', () => {
  const files = [
    path.join(repoRoot, 'apps/web/index.html'),
    path.join(repoRoot, 'apps/web/src/pages/HomePage.jsx'),
  ];

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    assert.equal(source.includes('aggregateRating'), false, `${file} should not include aggregateRating`);
    assert.equal(source.includes('ratingValue'), false, `${file} should not include ratingValue`);
    assert.equal(source.includes('ratingCount'), false, `${file} should not include ratingCount`);
    assert.equal(source.includes('reviewCount'), false, `${file} should not include reviewCount`);
  }
});
