# Match by Birth Launch Checklist

## Already done
- Free calculator works locally
- Exact Mode works
- Result page has back navigation
- Privacy page is crawl-friendly and has a canonical URL
- `robots.txt` and `sitemap.xml` exist
- Report upsell and email capture are wired
- Weekly email send route exists

## Still to do before pushing fully live

### Stripe / payments
- Create the live Stripe product for the private report
- Create the live Stripe price for the report
- Set `STRIPE_SECRET_KEY` in production
- Set `STRIPE_PRICE_ID` in production
- Set `STRIPE_SUBSCRIPTION_PRICE_ID` in production for the recurring premium plan
- Set `STRIPE_WEBHOOK_SECRET` in production
- Set `APP_URL` in production
- Set `REPORT_TOKEN_SECRET` in production
- Add `/api/webhook` as a Stripe webhook endpoint
- Test a real checkout end-to-end in test mode
- Confirm webhook → fulfillment → email delivery works
- Confirm the report link opens after payment

### Subscription
- Create a recurring Stripe subscription product
- Add a recurring price ID for the subscription
- Set up a real recurring checkout path
- Decide what subscribers get:
  - weekly intel emails
  - saved history
  - unlimited checks
  - member-only insights
- Protect subscriber-only features if needed
- Add the subscription CTA and pricing copy

### Email + retention
- Make weekly emails feel like a product, not a generic newsletter
- Personalize weekly emails when a saved `result_id` exists
- Add a welcome/onboarding email sequence
- Add unsubscribe and preference links everywhere needed
- Verify transactional emails deliver reliably

### Analytics
- Track:
  - result viewed
  - email capture viewed
  - email subscribed
  - report upsell viewed
  - report upsell clicked
  - checkout started
  - checkout redirected
  - checkout completed
  - weekly email sent/opened/clicked

### SEO / launch polish
- Request indexing for important pages in Google Search Console
- Make sure the sitemap is submitted
- Confirm the home page and core pages render well on mobile
- Confirm the premium page CTA copy is clear
- Keep the free result fast and clean

## Not to do
- Do not charge for the saved result
- Do not hide the free calculator behind signup
- Do not ship placeholder checkout links
- Do not launch live Stripe with test keys
