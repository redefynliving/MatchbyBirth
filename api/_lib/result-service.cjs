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

const VALIDATION_ERROR_PATTERNS = [
  /people must be provided/i,
  /add at least \d+ people/i,
  /add no more than \d+ people/i,
  /needs a name/i,
  /birth date/i,
];

function isCalculationValidationError(error) {
  return error instanceof Error
    && VALIDATION_ERROR_PATTERNS.some((pattern) => pattern.test(error.message));
}

function normalizeCalculationError(error) {
  if (error instanceof ResultServiceError) {
    return error;
  }

  if (isCalculationValidationError(error)) {
    return new ResultServiceError(error.message, 400);
  }

  return error;
}

function createShareSlug() {
  return crypto.randomBytes(18).toString('base64url');
}

function calculateResult(input) {
  const mode = input?.mode === 'group' ? 'group' : 'pair';
  try {
    return mode === 'group'
      ? calculateGroupResult(input?.people)
      : calculatePairResult(input?.people, input?.relationshipType, {
        reportFocus: input?.reportFocus,
        source: input?.source,
        clarityGoal: input?.clarityGoal,
      });
  } catch (error) {
    throw normalizeCalculationError(error);
  }
}

async function calculateAndStoreResult(input, store, slugFactory = createShareSlug) {
  const result = calculateResult(input);
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
    persisted: true,
    result,
  };
}

async function calculateResultWithOptionalStorage(
  input,
  store,
  slugFactory = createShareSlug,
) {
  if (!store?.isConfigured?.()) {
    return {
      resultId: null,
      shareSlug: null,
      persisted: false,
      result: calculateResult(input),
    };
  }

  return calculateAndStoreResult(input, store, slugFactory);
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
  calculateResult,
  calculateResultWithOptionalStorage,
  createShareSlug,
  getSharedResult,
  normalizeCalculationError,
};
