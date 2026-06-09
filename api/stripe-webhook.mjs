import Stripe from 'stripe';
import store from './lib/supabase-store.cjs';
import fulfillment from './lib/fulfillment.cjs';
import webhookService from './lib/webhook-service.cjs';

const { fulfillConfiguredPurchase } = fulfillment;
const { processStripeEvent } = webhookService;

export async function POST(request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Stripe webhook configuration is incomplete.');
    return new Response('Server misconfiguration', { status: 500 });
  }
  if (!process.env.REPORT_TOKEN_SECRET || !process.env.APP_URL) {
    console.error('Report fulfillment configuration is incomplete.');
    return new Response('Server misconfiguration', { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  let event;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  try {
    const status = await processStripeEvent(event, {
      store,
      fulfillPurchase: fulfillConfiguredPurchase,
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
