'use strict';

async function refreshRetryablePurchase(
  purchase,
  sessionId,
  dependencies,
) {
  const attempts = Number(purchase?.delivery_attempts || 0);
  const retryable = purchase
    && (purchase.status === 'paid' || purchase.status === 'failed')
    && attempts < 5;

  if (!retryable) return purchase;

  try {
    await dependencies.fulfillPurchase(purchase.id);
    return (
      await dependencies.store.findPurchaseBySessionId(sessionId)
    ) || purchase;
  } catch {
    return purchase;
  }
}

module.exports = { refreshRetryablePurchase };
