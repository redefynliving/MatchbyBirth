'use strict';

const urlModule = require('url');

const routes = {
  '/api/calculate-result': require('./_lib/calculate-result.js'),
  '/api/create-checkout-session': require('./_lib/create-checkout-session.js'),
  '/api/create-subscription-checkout': require('./_lib/create-subscription-checkout.js'),
  '/api/og': require('./_lib/og.js'),
  '/api/purchase-status': require('./_lib/purchase-status.js'),
  '/api/report': require('./_lib/report.js'),
  '/api/result': require('./_lib/result.js'),
  '/api/retry-failed-reports': require('./_lib/retry-failed-reports.js'),
  '/api/send-weekly-updates': require('./_lib/send-weekly-updates.js'),
  '/api/webhook': require('./_lib/webhook.js'),
  '/api/stripe-webhook': require('./_lib/webhook.js'),
  '/api/subscribe': require('./_lib/subscribe.js'),
  '/api/unsubscribe': require('./_lib/unsubscribe.js'),
  '/api/places': require('./_lib/places.js'),
};

module.exports = async (req, res) => {
  const parsedUrl = urlModule.parse(req.url, true);
  const path = parsedUrl.pathname;

  // Find routing target
  const targetModule = routes[path];
  if (!targetModule) {
    return res.status(404).json({ ok: false, error: `Route ${path} not found` });
  }

  // Ensure query is populated
  req.query = { ...parsedUrl.query, ...req.query };

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
    return await targetModule(req, res);
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
