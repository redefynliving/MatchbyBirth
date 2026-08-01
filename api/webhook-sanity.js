'use strict';

const crypto = require('node:crypto');

async function triggerGithubDispatch({ owner, repo, token, eventType, clientPayload }) {
  const url = `https://api.github.com/repos/${owner}/${repo}/dispatches`;
  const body = {
    event_type: eventType,
    client_payload: clientPayload || {},
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify(body),
  });

  if (response.status !== 204) {
    const text = await response.text();
    throw new Error(`GitHub dispatch failed: ${response.status} ${text}`);
  }
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, route: '/api/sanity-webhook' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    return res.status(500).json({ ok: false, error: 'Server missing webhook secret' });
  }

  const signature = String(req.headers['x-sanity-webhook-signature'] || '');
  const payload = JSON.stringify(req.body || {});

  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return res.status(401).json({ ok: false, error: 'Invalid signature' });
  }

  const doc = req.body || {};
  const trigger = doc._id ? `${doc._type}:${doc._id}` : 'sanity';

  const githubToken = process.env.GITHUB_DISPATCH_TOKEN;
  if (!githubToken) {
    return res.status(500).json({ ok: false, error: 'Server missing GitHub dispatch token' });
  }

  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  if (!owner || !repo) {
    return res.status(500).json({ ok: false, error: 'Server missing GitHub repo config' });
  }

  try {
    await triggerGithubDispatch({
      owner,
      repo,
      token: githubToken,
      eventType: 'sanity-publish',
      clientPayload: {
        trigger,
        id: doc._id,
        type: doc._type,
        slug: doc.slug,
        publishedAt: doc.publishedAt || new Date().toISOString(),
      },
    });

    return res.status(200).json({ ok: true, trigger, dispatched: true });
  } catch (error) {
    console.error('GitHub dispatch error:', error);
    return res.status(502).json({ ok: false, trigger, error: error.message });
  }
};
