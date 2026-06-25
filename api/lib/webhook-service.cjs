'use strict';

async function processStripeEvent(event, dependencies) {
  const { store, fulfillPurchase } = dependencies;
  const claimed = await store.claimWebhookEvent(event.id, event.type);
  if (!claimed) {
    console.log(`WEBHOOK DUPLICATE: ${event.type} (${event.id}) — already processed`);
    return 'duplicate';
  }

  try {
    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      const session = event.data.object;
      const checkoutType = session.metadata?.checkout_type || 'report';
      const email = session.customer_details?.email || session.customer_email || session.metadata?.email;
      const resultId = session.metadata?.result_id || null;

      if (checkoutType === 'subscription') {
        if (!email) throw new Error('Stripe subscription session is missing an email.');
        await store.upsertSubscriber({
          email,
          result_id: resultId || null,
          consent_source: 'subscription_checkout',
          consented_at: new Date().toISOString(),
          unsubscribed_at: null,
        });
        console.log(`WEBHOOK SUBSCRIPTION: ${event.type} → ${email}`);
      } else {
        const purchaseId = session.metadata?.purchase_id;
        console.log(`WEBHOOK PAYMENT: ${event.type} → purchase ${purchaseId}`);

        if (!purchaseId) throw new Error('Stripe event is missing purchase metadata.');

        await store.updatePurchase(purchaseId, {
          status: 'paid',
          stripe_payment_intent_id: session.payment_intent || null,
          paid_at: new Date().toISOString(),
          last_error: null,
        });
        console.log(`WEBHOOK FULFILLING: purchase ${purchaseId}`);

        await fulfillPurchase(purchaseId);
        console.log(`WEBHOOK FULFILLED: purchase ${purchaseId}`);
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const email = subscription.metadata?.email;
      if (email) {
        await store.updateSubscriberByEmail(email, {
          unsubscribed_at: new Date().toISOString(),
        });
        console.log(`WEBHOOK SUBSCRIPTION CANCELLED: ${email}`);
      }
    }

    if (event.type === 'charge.refunded') {
      const charge = event.data.object;
      const purchase = await store.findPurchaseByPaymentIntent(charge.payment_intent);
      if (purchase) {
        await store.updatePurchase(purchase.id, {
          status: 'refunded',
          refunded_at: new Date().toISOString(),
        });
        console.log(`WEBHOOK REFUND: purchase ${purchase.id}`);
      }
    }

    await store.completeWebhookEvent(event.id, {
      status: 'processed',
      processed_at: new Date().toISOString(),
      last_error: null,
    });
    return 'processed';
  } catch (error) {
    console.error(`WEBHOOK ERROR: ${event.type} (${event.id})`, {
      message: error.message,
      stack: error.stack,
    });
    await store.completeWebhookEvent(event.id, {
      status: 'failed',
      processed_at: new Date().toISOString(),
      last_error: error.message || 'Webhook processing failed.',
    });
    throw error;
  }
}

module.exports = { processStripeEvent };
