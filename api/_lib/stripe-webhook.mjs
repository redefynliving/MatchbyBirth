import store from './supabase-store.cjs';
import fulfillment from './fulfillment.cjs';
import webhookService from './webhook-service.cjs';
import backend from '../backend.cjs';

const { fulfillConfiguredPurchase } = fulfillment;
const { processStripeEvent } = webhookService;
const { getServerConfig, getStripeClient, subscribePaidReportBuyer } = backend;

export async function POST(request) {
  const config = getServerConfig();
  if (!config.stripeSecretKey || !config.stripeWebhookSecret) {
    console.error('Stripe webhook configuration is incomplete.');
    return new Response('Server misconfiguration', { status: 500 });
  }
  if (!config.reportTokenSecret || !config.appUrl) {
    console.error('Report fulfillment configuration is incomplete.');
    return new Response('Server misconfiguration', { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  let event;
  try {
    const stripe = getStripeClient(config.stripeSecretKey);
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      config.stripeWebhookSecret,
    );
  } catch {
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  try {
    const status = await processStripeEvent(event, {
      store,
      fulfillPurchase: fulfillConfiguredPurchase,
      subscribeMarketing: subscribePaidReportBuyer,
    });
    return Response.json({ received: true, status });
  } catch (error) {
    console.error('Stripe event recorded for retry', {
      eventId: event.id,
      eventType: event.type,
      message: error.message,
    });
    return Response.json({ received: true, status: 'retry_scheduled' });
  }
}
