'use strict';

const routes = {
  '/api/calculate-result': () => require('./_lib/calculate-result.js'),
  '/api/create-checkout-session': () => require('./_lib/create-checkout-session.js'),
  '/api/create-subscription-checkout': () => require('./_lib/create-subscription-checkout.js'),
  '/api/funnel-summary': () => require('./_lib/funnel-summary.js'),
  '/api/og': () => require('./_lib/og.js'),
  '/api/purchase-status': () => require('./_lib/purchase-status.js'),
  '/api/report': () => require('./_lib/report.js'),
  '/api/result': () => require('./_lib/result.js'),
  '/api/retry-failed-reports': () => require('./_lib/retry-failed-reports.js'),
  '/api/send-weekly-updates': () => require('./_lib/send-weekly-updates.js'),
  '/api/webhook': () => require('./_lib/webhook.js'),
  '/api/stripe-webhook': () => require('./_lib/webhook.js'),
  '/api/sanity-webhook': () => require('./webhook-sanity.js'),
  '/api/subscribe': () => require('./_lib/subscribe.js'),
  '/api/track-event': () => require('./_lib/track-event.js'),
  '/api/unsubscribe': () => require('./_lib/unsubscribe.js'),
  '/api/places': () => require('./_lib/places.js'),
  '/api/cyclecalcs/moon': () => require('./_lib/cyclecalcs.js'),
};

function addResponseHelpers(res) {
  if (typeof res.status !== 'function') {
    res.status = (statusCode) => {
      res.statusCode = statusCode;
      return res;
    };
  }
  if (typeof res.json !== 'function') {
    res.json = (payload) => {
      if (!res.headersSent) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
      }
      res.end(JSON.stringify(payload));
      return res;
    };
  }
  if (typeof res.send !== 'function') {
    res.send = (payload) => {
      if (Buffer.isBuffer(payload) || typeof payload === 'string') {
        res.end(payload);
      } else {
        res.json(payload);
      }
      return res;
    };
  }
  return res;
}

module.exports = async (req, res) => {
  addResponseHelpers(res);
  const parsedUrl = new URL(req.url, 'http://localhost');
  const path = parsedUrl.pathname;

  // Find routing target
  const targetModule = routes[path];
  if (!targetModule) {
    return res.status(404).json({ ok: false, error: `Route ${path} not found` });
  }

  // Ensure query is populated
  req.query = { ...Object.fromEntries(parsedUrl.searchParams), ...req.query };

  // Parse body if method expects one
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks);

    if (path === '/api/webhook' || path === '/api/stripe-webhook') {
      req.body = rawBody;
    } else {
      const contentType = req.headers['content-type'] || '';
      if (contentType.includes('application/json')) {
        try {
          req.body = JSON.parse(rawBody.toString('utf8'));
        } catch {
          req.body = {};
        }
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        try {
          req.body = require('querystring').parse(rawBody.toString('utf8'));
        } catch {
          req.body = {};
        }
      } else {
        req.body = rawBody;
      }
    }
  }

  try {
    const handler = targetModule();
    return await handler(req, res);
  } catch (error) {
    console.error(`Error in handler for ${path}:`, error);
    if (!res.writableEnded && !res.headersSent) {
      return res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
};

// Disable automatic body parsing on Vercel so we can read raw bytes for webhooks
module.exports.config = {
  api: {
    bodyParser: false,
  },
};

module.exports.addResponseHelpers = addResponseHelpers;
