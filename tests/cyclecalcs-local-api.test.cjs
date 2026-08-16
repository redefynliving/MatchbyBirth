'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('local API mounts the CycleCalcs route used by Vite development', () => {
  const routes = read('apps/api/src/routes/index.js');
  const bridge = read('apps/api/src/backend-bridge.js');

  assert.match(bridge, /cyclecalcs/);
  assert.match(routes, /cyclecalcs/);
  assert.match(routes, /\/api\/cyclecalcs\/moon/);
});
