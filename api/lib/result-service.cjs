'use strict';

const crypto = require('node:crypto');
const {
  calculateGroupResult,
  calculatePairResult,
} = require('../../shared/compatibility.cjs');

class ResultServiceError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'ResultServiceError';
    this.statusCode = statusCode;
  }
}

function createShareSlug() {
  return crypto.randomBytes(18).toString('base64url');
}

async function calculateAndStoreResult(input, store, slugFactory = createShareSlug) {
  const mode = input?.mode === 'group' ? 'group' : 'pair';
  const result = mode === 'group'
    ? calculateGroupResult(input?.people)
    : calculatePairResult(input?.people, input?.relationshipType);
  const shareSlug = slugFactory();
  const inserted = await store.insertResult({
    share_slug: shareSlug,
    mode: result.mode,
    relationship_type: result.relationshipType,
    result_payload: result,
  });

  return {
    resultId: inserted.id,
    shareSlug,
    result,
  };
}

async function getSharedResult(shareSlug, store, now = new Date()) {
  if (!shareSlug || typeof shareSlug !== 'string' || shareSlug.length > 100) {
    throw new ResultServiceError('Invalid result link.', 400);
  }

  const record = await store.findResultBySlug(shareSlug);
  if (!record) {
    throw new ResultServiceError('Result not found.', 404);
  }
  if (record.expires_at && new Date(record.expires_at).getTime() <= now.getTime()) {
    throw new ResultServiceError('This result link has expired.', 410);
  }

  return {
    resultId: record.id,
    shareSlug,
    result: record.result_payload,
    createdAt: record.created_at,
  };
}

module.exports = {
  ResultServiceError,
  calculateAndStoreResult,
  createShareSlug,
  getSharedResult,
};
