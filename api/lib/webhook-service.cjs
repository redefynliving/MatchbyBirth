'use strict';

async function processStripeEvent(event, dependencies) {
  const { store, fulfillPurchase } = dependencies;
  const claimed = await store.claimWebhookEvent(event.id, event.type);
  if (!claimed) return 'duplicate';

  try {
    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      const session = event.data.object;
      const purchaseId = session.metadata?.purchase_id;
      if (!purchaseId) throw new Error('Stripe event is missing purchase metadata.');

      await store.updatePurchase(purchaseId, {
        status: 'paid',
        stripe_payment_intent_id: session.payment_intent || null,
        paid_at: new Date().toISOString(),
        last_error: null,
      });
      await fulfillPurchase(purchaseId);
    }

    if (event.type === 'charge.refunded') {
      const charge = event.data.object;
      const purchase = await store.findPurchaseByPaymentIntent(charge.payment_intent);
      if (purchase) {
        await store.updatePurchase(purchase.id, {
          status: 'refunded',
          refunded_at: new Date().toISOString(),
        });
      }
    }

    await store.completeWebhookEvent(event.id, {
      status: 'processed',
      processed_at: new Date().toISOString(),
      last_error: null,
    });
    return 'processed';
  } catch (error) {
    await store.completeWebhookEvent(event.id, {
      status: 'failed',
      processed_at: new Date().toISOString(),
      last_error: 'Webhook processing failed.',
    });
    throw error;
  }
}

module.exports = { processStripeEvent };
