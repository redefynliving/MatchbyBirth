'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const handler = require('../api/search-birth-places.js');

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(key, value) {
      this.headers[key] = value;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test('search-birth-places returns sanitized Atlanta suggestions', async () => {
  const req = { method: 'GET', query: { q: 'Atlanta GA' } };
  const res = createResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['Cache-Control'], 'public, max-age=86400, s-maxage=86400');
  assert.ok(Array.isArray(res.body.places));
  assert.ok(res.body.places.length > 0);
  assert.equal(res.body.places[0].city, 'Atlanta');
  assert.equal(res.body.places[0].timezone, 'America/New_York');
  assert.equal(Object.hasOwn(res.body.places[0], 'pop'), false);
});

test('search-birth-places rejects unsupported methods', async () => {
  const req = { method: 'POST', query: { q: 'Atlanta' } };
  const res = createResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.Allow, 'GET');
  assert.match(res.body.error, /method/i);
});

test('search-birth-places requires at least two query characters', async () => {
  const req = { method: 'GET', query: { q: 'A' } };
  const res = createResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 400);
  assert.match(res.body.error, /at least 2/i);
});
