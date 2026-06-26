'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');

test('llms generator maps lazy route pages to their public URLs', async () => {
  const tool = await import(pathToFileURL(path.join(root, 'apps/web/tools/generate-llms.js')));
  const appPath = path.join(root, 'apps/web/src/App.jsx');
  const howItWorksPath = path.join(root, 'apps/web/src/pages/HowItWorksPage.jsx');
  const blogPostPath = path.join(root, 'apps/web/src/pages/BlogPostPage.jsx');
  const legacyTermsPath = path.join(root, 'apps/web/src/pages/TermsAndConditionsPage.jsx');

  assert.equal(typeof tool.extractRoutes, 'function');
  assert.equal(typeof tool.extractHelmetData, 'function');

  const routes = tool.extractRoutes(appPath);
  assert.equal(routes.get('AboutPage'), '/about');
  assert.equal(routes.get('HowItWorksPage'), '/how-it-works');
  assert.equal(routes.get('PrivacyPolicyPage'), '/privacy');

  const page = tool.extractHelmetData(
    fs.readFileSync(howItWorksPath, 'utf8'),
    howItWorksPath,
    routes,
  );

  assert.equal(page.url, '/how-it-works');
  assert.match(page.title, /How Match by Birth Works/);

  const dynamicPage = tool.extractHelmetData(
    fs.readFileSync(blogPostPath, 'utf8'),
    blogPostPath,
    routes,
  );
  assert.equal(dynamicPage, null);

  const unroutedPage = tool.extractHelmetData(
    fs.readFileSync(legacyTermsPath, 'utf8'),
    legacyTermsPath,
    routes,
  );
  assert.equal(unroutedPage, null);
});
