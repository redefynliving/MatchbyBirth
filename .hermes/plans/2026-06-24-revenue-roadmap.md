# Match by Birth Revenue Roadmap

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Turn the free compatibility calculator into a revenue engine with premium checkout, subscriptions, email capture, and SEO-driven traffic.

**Architecture:** Keep the free calculator as the top-of-funnel entry point. Add a paid report funnel directly after result reveal, then layer email capture, recurring subscription, and share/referral loops on top. In parallel, expand content into programmatic SEO pages so traffic compounds without paid acquisition.

**Tech Stack:** React, React Router, Vite, Node/Express API routes, Stripe, email delivery, existing report service, existing analytics, existing blog system.

---

## Phase 1 — Monetize intent immediately

### Task 1: Replace the premium placeholder with a real paid offer

**Objective:** Turn the current premium page into a real conversion path for the deep reading.

**Files:**
- Modify: `apps/web/src/pages/premium.jsx`
- Modify: `apps/web/src/pages/ResultPage.jsx`
- Modify: `apps/web/src/components/ResultCard.jsx`
- Modify: `apps/web/src/components/GroupCompatibilityResults.jsx`
- Modify: `apps/web/src/lib/analytics.js`
- Modify: `apps/api/src/routes/index.js`
- Modify/new API route(s): whichever route currently handles purchase creation / report delivery

**Step 1: Add a clear upsell on the result page**
- Add a premium CTA after the free score.
- Copy should explain exactly what the paid report unlocks:
  - emotional compatibility
  - long-term potential
  - conflict patterns
  - deeper guidance

**Step 2: Wire the CTA to a real product flow**
- Replace the test Stripe link with the actual checkout path used by the backend.
- Make sure the checkout session is created server-side.

**Step 3: Track the click**
- Fire analytics events when the upsell is shown and when it is clicked.

**Step 4: Verify the flow**
- Open a result page.
- Confirm the upsell renders.
- Confirm the CTA points to the real purchase flow.
- Confirm analytics does not break the page.

**Suggested verification commands:**
- `npm run build --prefix apps/web`
- `npm run lint`
- Smoke test the result page in the browser

---

### Task 2: Make report delivery feel premium

**Objective:** Turn the paid report from a transaction into a polished product.

**Files:**
- Modify: `apps/web/src/pages/ReportPage.jsx`
- Modify: `apps/web/src/pages/ReportSuccess.jsx`
- Modify: `apps/web/src/pages/PrivacyPolicyPage.jsx`
- Modify: `apps/web/src/pages/TermsOfServicePage.jsx`
- Modify: `apps/web/src/pages/DisclaimerPage.jsx`
- Modify: `apps/web/src/pages/AboutPage.jsx` if needed for trust messaging

**Step 1: Polish the report page**
- Make the report look like a premium deliverable.
- Add a short intro, summary block, and clear download/email cues.

**Step 2: Improve the success page**
- Make the post-checkout page explain what happens next.
- Reassure the user that the report is being delivered.

**Step 3: Align trust pages**
- Make sure the legal pages clearly explain payment/report handling.
- Keep the privacy story strong: no birth dates stored, paid report handled securely.

**Step 4: Verify**
- Run through checkout success in local dev.
- Confirm the success page and report page render without errors.

**Suggested verification commands:**
- `npm run lint`
- `npm run build --prefix apps/web`
- Browser smoke test of `/report-success` and `/report`

---

### Task 3: Add a stronger email capture loop

**Objective:** Convert free users into owned audience members before they leave.

**Files:**
- Modify: `apps/web/src/components/EmailCaptureSection.jsx`
- Modify: `apps/web/src/pages/ResultPage.jsx`
- Modify: `apps/web/src/lib/analytics.js`
- Modify: API endpoint(s) used for email capture

**Step 1: Make the value proposition explicit**
- Use copy like:
  - "Get your full reading by email"
  - "Save your compatibility result"
  - "Receive weekly love insights"

**Step 2: Reduce friction**
- Keep the form short.
- Avoid extra fields.
- Make the CTA obvious.

**Step 3: Track conversion**
- Log result-to-email capture conversions.

**Step 4: Verify**
- Submit a sample email.
- Confirm success state.
- Confirm the backend receives the lead.

**Suggested verification commands:**
- `npm run lint`
- `npm run build --prefix apps/web`
- API smoke test for the email capture endpoint

---

## Phase 2 — Increase lifetime value

### Task 4: Launch a subscription offer

**Objective:** Add recurring revenue instead of relying only on one-time purchases.

**Files:**
- Modify/new: `apps/web/src/pages/premium.jsx`
- Modify/new: subscription UI components if needed
- Modify/new: purchase / subscription backend route(s)
- Modify: `apps/web/src/pages/ReportSuccess.jsx`
- Modify: `apps/web/src/pages/ResultPage.jsx`

**Step 1: Define the subscription promise**
- Weekly compatibility summary
- Unlimited checks
- Priority reports
- New match alerts

**Step 2: Build a dedicated subscription landing page**
- Keep it short and direct.
- Explain who it is for.
- Show price and benefits.

**Step 3: Connect recurring billing**
- Make sure the payment flow supports subscription checkout.
- Confirm the backend stores the subscription state.

**Step 4: Verify**
- Test checkout.
- Test subscription success page.
- Test cancellation / status handling if already supported.

**Suggested verification commands:**
- `npm run build --prefix apps/web`
- `npm run lint`
- End-to-end checkout smoke test

---

### Task 5: Add the weekly retention email system

**Objective:** Bring users back after the first visit.

**Files:**
- Modify/new: email template files
- Modify/new: scheduled send logic
- Modify: result capture flow if needed

**Step 1: Create the email sequence**
- Welcome / report delivery
- Value email
- Compatibility tip email
- Premium reminder
- Weekly digest

**Step 2: Add a resend or follow-up path**
- If a user signs up but doesn’t buy, follow up with the core value proposition.

**Step 3: Verify**
- Trigger the sequence on a test lead.
- Confirm the content is clear and brand-consistent.

---

### Task 6: Add a referral/share loop

**Objective:** Turn every result into a potential new user.

**Files:**
- Modify: `apps/web/src/components/ShareButtons.jsx`
- Modify: `apps/web/src/pages/ResultPage.jsx`
- Modify: analytics helpers if needed

**Step 1: Improve the share CTA**
- Make sharing feel like part of the experience.
- Add language like "Send this to your partner".

**Step 2: Add incentive logic if desired**
- Optional: unlock a bonus reading after a referral action.

**Step 3: Verify**
- Confirm share links still work.
- Confirm analytics records shares.

---

## Phase 3 — Grow traffic cheaply

### Task 7: Build programmatic SEO pages

**Objective:** Capture high-intent search traffic at scale.

**Files:**
- Modify/new: `apps/web/src/data/posts/index.js`
- Modify/new: sign-pair landing page routes/components
- Modify: router config in `apps/web/src/App.jsx` if needed
- Modify: metadata helpers / SEO helpers

**Step 1: Pick the first page set**
- Best zodiac matches for each sign
- Sign pair compatibility pages
- Relationship type pages: love, friendship, work

**Step 2: Create one template first**
- Build one reusable page template.
- Feed it structured data.

**Step 3: Expand to the full set**
- Add the remaining sign pairs and categories.

**Step 4: Verify**
- Confirm metadata renders.
- Confirm internal links point back to the calculator.
- Confirm pages are indexable.

**Suggested verification commands:**
- `npm run build --prefix apps/web`
- `npm run lint`
- Check rendered page source / metadata in browser

---

### Task 8: Turn blog posts into conversion assets

**Objective:** Make content drive calculator usage and leads.

**Files:**
- Modify: `apps/web/src/pages/BlogPage.jsx`
- Modify: `apps/web/src/pages/BlogPostPage.jsx`
- Modify: `apps/web/src/data/posts/index.js`

**Step 1: Add stronger CTAs inside posts**
- Every post should point to the calculator.
- Add a mid-article and end-of-article CTA.

**Step 2: Improve post taxonomy**
- Make sure posts map cleanly to sign / category / intent.

**Step 3: Verify**
- Open a few posts.
- Confirm the CTAs render and point to the calculator.

---

### Task 9: Add affiliate / digital product revenue

**Objective:** Add low-maintenance secondary income.

**Files:**
- Modify/new: blog pages, resource pages, footer links, or a dedicated resources page

**Step 1: Pick one product category**
- Books
- Journals
- Printable compatibility guides
- Lightweight astrology courses

**Step 2: Add one clear recommendations page**
- Keep it curated, not spammy.

**Step 3: Verify**
- Confirm links work.
- Confirm it doesn’t dilute the main funnel.

---

## Execution order

### Week 1
1. Finish premium checkout flow
2. Strengthen result-page upsell
3. Tighten email capture
4. Verify checkout/report delivery end-to-end

### Week 2
5. Add subscription landing + billing
6. Add weekly retention emails
7. Add share/referral improvements

### Week 3
8. Build the first programmatic SEO template
9. Expand to sign-pair pages
10. Add stronger blog CTAs

### Week 4
11. Add affiliate/digital product layer
12. Review analytics and improve conversion bottlenecks

---

## Metrics to watch
- Result-to-purchase conversion rate
- Result-to-email capture rate
- Upsell click-through rate
- Subscription conversion rate
- Shares per result
- Organic traffic growth
- Revenue per visitor

---

## Implementation rule
Do not move on to the next phase until the current phase is verified in browser and with build/lint checks.
