'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const test = require('node:test');

const router = require('../api/index.js');
const root = path.resolve(__dirname, '..');

async function requestRouter(requestPath) {
  const server = http.createServer((req, res) => {
    Promise.resolve(router(req, res)).catch((error) => {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: error.message }));
    });
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try {
    return await fetch(`http://127.0.0.1:${port}${requestPath}`);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

test('Vercel API router supports native Node response objects', async () => {
  const response = await requestRouter('/api/not-a-route');
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: 'Route /api/not-a-route not found',
  });
});

test('Vercel places route loads exact astrology dependencies', async () => {
  const response = await requestRouter('/api/places?q=');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), []);
});

test('Vercel API router registers the CycleCalcs moon route', () => {
  const source = fs.readFileSync(path.join(root, 'api/index.js'), 'utf8');
  assert.match(source, /['"]\/api\/cyclecalcs\/moon['"]\s*:/);
});

test('Vercel build preserves root dependencies needed by serverless routes', () => {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  assert.equal(
    config.buildCommand,
    'npm ci && npm run build --prefix apps/web',
  );
});
