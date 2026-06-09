# Match by Birth Launch Checklist

## 1. Supabase

1. Create or select the production Supabase project.
2. Link the repository:

   ```bash
   npx supabase link --project-ref <project-ref>
   ```

3. Review and apply `supabase/migrations/20260609042235_matchbybirth_core.sql`:

   ```bash
   npx supabase db push
   ```

4. Confirm RLS is enabled on `results`, `purchases`, `reports`, `webhook_events`, and `email_subscribers`.
5. Confirm `anon` and `authenticated` cannot read or write those tables.

## 2. Vercel Environment

Add every variable from `.env.example` to Preview and Production. Generate `REPORT_TOKEN_SECRET` and `CRON_SECRET` as independent random values with at least 32 bytes of entropy.

The Supabase service-role key, Stripe secret, webhook secret, Anthropic key, Resend key, and token secrets must remain server-only.

## 3. Stripe and Email

1. Create a one-time Stripe Price for `$9.99 USD` and set its ID as `STRIPE_PRICE_ID`.
2. Register `https://matchbybirth.com/api/stripe-webhook`.
3. Subscribe the webhook to:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `charge.refunded`
4. Verify `support@matchbybirth.com` as a Resend sender.

## 4. Verification

Run:

```bash
npm ci
npm test
npm run lint --prefix apps/web
npm run build --prefix apps/web
npm run lint --prefix promo-video
```

Then complete one Stripe sandbox purchase and verify:

- The purchase reaches `delivered`.
- Only one report and one delivery email are created.
- The private report link opens.
- The PDF downloads.
- Raw birth dates are absent from URLs, Stripe metadata, analytics events, and Supabase rows.
- Pair and 3–7-person group results work on mobile and desktop.
