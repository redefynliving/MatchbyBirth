'use strict';

class StoreError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'StoreError';
    this.statusCode = statusCode;
  }
}

function isConfigured() {
  return Boolean(
    String(process.env.SUPABASE_URL || '').trim()
    && String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim(),
  );
}

function getConfig() {
  const url = String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new StoreError('Database is not configured.');
  }

  return { url, serviceKey };
}

async function request(path, options = {}) {
  const { url, serviceKey } = getConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const requestId = response.headers.get('x-request-id');
    console.error('Supabase request failed', {
      status: response.status,
      requestId,
      resource: path.split('?')[0],
    });
    throw new StoreError('Database request failed.');
  }

  if (response.status === 204) return null;
  return response.json();
}

async function insertResult(record) {
  const rows = await request('results', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(record),
  });
  return rows[0];
}

async function findResultBySlug(shareSlug) {
  const query = new URLSearchParams({
    select: 'id,share_slug,result_payload,created_at,expires_at',
    share_slug: `eq.${shareSlug}`,
    limit: '1',
  });
  const rows = await request(`results?${query.toString()}`);
  return rows[0] || null;
}

async function findResultById(resultId) {
  const query = new URLSearchParams({
    select: 'id,share_slug,mode,relationship_type,result_payload,created_at,expires_at',
    id: `eq.${resultId}`,
    limit: '1',
  });
  const rows = await request(`results?${query.toString()}`);
  return rows[0] || null;
}

async function insertPurchase(record) {
  const rows = await request('purchases', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(record),
  });
  return rows[0];
}

async function updatePurchase(purchaseId, values) {
  const query = new URLSearchParams({ id: `eq.${purchaseId}` });
  const rows = await request(`purchases?${query.toString()}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      ...values,
      updated_at: values.updated_at || new Date().toISOString(),
    }),
  });
  return rows[0] || null;
}

async function upsertSubscriber(record) {
  const rows = await request('email_subscribers?on_conflict=email', {
    method: 'POST',
    headers: {
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(record),
  });
  return rows[0] || null;
}

async function updateSubscriberByEmail(email, values) {
  const query = new URLSearchParams({ email: `eq.${email}` });
  const rows = await request(`email_subscribers?${query.toString()}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(values),
  });
  return rows[0] || null;
}

async function findPurchaseWithResult(purchaseId) {
  const query = new URLSearchParams({
    select: '*,result:results(id,result_payload)',
    id: `eq.${purchaseId}`,
    limit: '1',
  });
  const rows = await request(`purchases?${query.toString()}`);
  return rows[0] || null;
}

async function findPurchaseBySessionId(sessionId) {
  const query = new URLSearchParams({
    select: 'id,status,delivery_attempts,last_error',
    stripe_checkout_session_id: `eq.${sessionId}`,
    limit: '1',
  });
  const rows = await request(`purchases?${query.toString()}`);
  return rows[0] || null;
}

async function findPurchaseByPaymentIntent(paymentIntentId) {
  if (!paymentIntentId) return null;
  const query = new URLSearchParams({
    select: 'id,status',
    stripe_payment_intent_id: `eq.${paymentIntentId}`,
    limit: '1',
  });
  const rows = await request(`purchases?${query.toString()}`);
  return rows[0] || null;
}

async function findReportByPurchaseId(purchaseId) {
  const query = new URLSearchParams({
    select: 'id,purchase_id,access_token_hash,content,model,prompt_version,provider_email_id,created_at,emailed_at',
    purchase_id: `eq.${purchaseId}`,
    limit: '1',
  });
  const rows = await request(`reports?${query.toString()}`);
  return rows[0] || null;
}

async function insertReport(record) {
  const rows = await request('reports', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(record),
  });
  return rows[0];
}

async function updateReport(reportId, values) {
  const query = new URLSearchParams({ id: `eq.${reportId}` });
  const rows = await request(`reports?${query.toString()}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(values),
  });
  return rows[0] || null;
}

async function updateResult(resultId, values) {
  const query = new URLSearchParams({ id: `eq.${resultId}` });
  const rows = await request(`results?${query.toString()}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(values),
  });
  return rows[0] || null;
}

async function claimWebhookEvent(stripeEventId, eventType) {
  const rows = await request('webhook_events?on_conflict=stripe_event_id', {
    method: 'POST',
    headers: {
      Prefer: 'resolution=ignore-duplicates,return=representation',
    },
    body: JSON.stringify({
      stripe_event_id: stripeEventId,
      event_type: eventType,
      status: 'processing',
    }),
  });
  return rows.length > 0;
}

async function completeWebhookEvent(stripeEventId, values) {
  const query = new URLSearchParams({ stripe_event_id: `eq.${stripeEventId}` });
  const rows = await request(`webhook_events?${query.toString()}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(values),
  });
  return rows[0] || null;
}

async function listRetryablePurchases(limit = 10) {
  const query = new URLSearchParams({
    select: 'id',
    or: '(status.eq.paid,status.eq.failed)',
    delivery_attempts: 'lt.5',
    order: 'updated_at.asc',
    limit: String(limit),
  });
  return request(`purchases?${query.toString()}`);
}

async function listActiveSubscribers() {
  const query = new URLSearchParams({
    select: 'email,consented_at',
    unsubscribed_at: 'is.null',
    order: 'consented_at.desc',
  });
  return request(`email_subscribers?${query.toString()}`);
}
  StoreError,
  claimWebhookEvent,
  completeWebhookEvent,
  findPurchaseByPaymentIntent,
  findPurchaseBySessionId,
  findPurchaseWithResult,
  findReportByPurchaseId,
  findResultById,
  findResultBySlug,
  isConfigured,
  insertReport,
  insertResult,
  insertPurchase,
  listRetryablePurchases,
  listActiveSubscribers,
  request,
  updateReport,
  updateResult,
  updatePurchase,
  updateSubscriberByEmail,
  upsertSubscriber,
};
