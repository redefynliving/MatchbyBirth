'use strict';

const assert = require('node:assert/strict');
const { Readable } = require('node:stream');
const test = require('node:test');

const apiHandler = require('../api/index.js');
const {
  attachNodeResponseHelpers,
} = require('../api/_lib/node-response-helpers.cjs');

function createStandardResponse() {
  const headers = new Map();
  return {
    body: '',
    headersSent: false,
    statusCode: 200,
    writableEnded: false,
    setHeader(name, value) {
      headers.set(String(name).toLowerCase(), value);
    },
    getHeader(name) {
      return headers.get(String(name).toLowerCase());
    },
    end(value = '') {
      this.body += String(value);
      this.headersSent = true;
      this.writableEnded = true;
      return this;
    },
  };
}

test('response helpers add only the status and JSON methods the API uses', () => {
  const response = createStandardResponse();

  const returned = attachNodeResponseHelpers(response)
    .status(202)
    .json({ ok: true });

  assert.equal(returned, response);
  assert.equal(response.statusCode, 202);
  assert.equal(response.getHeader('content-type'), 'application/json; charset=utf-8');
  assert.equal(response.body, '{"ok":true}');
  assert.equal(response.writableEnded, true);
});

test('response helpers preserve methods supplied by another Node adapter', () => {
  const response = createStandardResponse();
  const status = () => 'existing status';
  const json = () => 'existing json';
  response.status = status;
  response.json = json;

  attachNodeResponseHelpers(response);

  assert.equal(response.status, status);
  assert.equal(response.json, json);
});

test('the production API router works with a plain Node response', async () => {
  const request = Readable.from([]);
  request.method = 'GET';
  request.url = '/api/not-a-route';
  request.headers = { host: 'matchbybirth.com' };
  const response = createStandardResponse();

  await apiHandler(request, response);

  assert.equal(response.statusCode, 404);
  assert.deepEqual(JSON.parse(response.body), {
    ok: false,
    error: 'Route /api/not-a-route not found',
  });
});
