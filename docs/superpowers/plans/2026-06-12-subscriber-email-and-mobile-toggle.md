# Subscriber Email And Mobile Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Center the Pair/Group selector on mobile and make marketing subscriptions send a welcome email with a secure, user-confirmed unsubscribe flow.

**Architecture:** Supabase remains the subscriber source of truth. A focused subscription service will normalize addresses, create HMAC unsubscribe tokens, upsert consent, send welcome email through Resend, and mark subscribers unsubscribed without making checkout depend on email delivery. A public React route will display unsubscribe confirmation and submit the mutation only after the user presses a button.

**Tech Stack:** React, Express-style Vercel Functions, Supabase REST API, Resend API, Node crypto, Node test runner, Tailwind CSS.

---

### Task 1: Subscription service and email delivery

**Files:**
- Create: `api/lib/subscription-service.cjs`
- Modify: `api/lib/email-service.cjs`
- Test: `tests/subscription-service.test.cjs`
- Test: `tests/email-service.test.cjs`

- [ ] **Step 1: Write failing tests for unsubscribe token creation, token verification, subscriber persistence, welcome delivery status, and escaped welcome-email output**

Test the public service API:

```js
createUnsubscribeToken(email, secret)
verifyUnsubscribeToken(email, token, secret)
subscribeEmail(input, dependencies)
unsubscribeEmail(input, dependencies)
sendWelcomeEmail(input, options)
```

The tests must prove that tampered tokens fail, email addresses are normalized, subscriber consent is stored before delivery, delivery failure returns `welcomeEmailSent: false`, and HTML-sensitive values are escaped.

- [ ] **Step 2: Run focused tests and confirm they fail because the service and welcome sender do not exist**

Run:

```bash
node --test tests/subscription-service.test.cjs tests/email-service.test.cjs
```

Expected: failure for missing exports or missing module.

- [ ] **Step 3: Implement the minimal subscription service and Resend welcome sender**

Use an HMAC-SHA256 token scoped with `unsubscribe:` and compare it with `crypto.timingSafeEqual`. Build the unsubscribe URL from `APP_URL`, include the normalized email and token as query parameters, and send through the existing Resend fetch pattern with an idempotency key.

- [ ] **Step 4: Run focused tests and confirm they pass**

Run:

```bash
node --test tests/subscription-service.test.cjs tests/email-service.test.cjs
```

Expected: all focused tests pass.

### Task 2: Subscriber storage and APIs

**Files:**
- Modify: `api/lib/supabase-store.cjs`
- Modify: `api/subscribe.js`
- Create: `api/unsubscribe.js`
- Test: `tests/subscription-api.test.cjs`

- [ ] **Step 1: Write failing API tests**

Cover:

```text
POST /api/subscribe requires explicit consent.
POST /api/subscribe returns welcomeEmailSent.
POST /api/unsubscribe rejects invalid tokens.
POST /api/unsubscribe updates unsubscribed_at for a valid token.
```

- [ ] **Step 2: Run the API tests and confirm the missing behavior fails**

Run:

```bash
node --test tests/subscription-api.test.cjs
```

Expected: failure because unsubscribe handling and welcome status are absent.

- [ ] **Step 3: Add subscriber update storage and connect both API routes**

Add:

```js
updateSubscriberByEmail(email, values)
```

The subscribe route will call `subscribeEmail`. The unsubscribe route will accept only POST, verify the signed token, and set `unsubscribed_at`. Both routes will return generic public errors while logging server failures without email addresses.

- [ ] **Step 4: Run API tests and confirm they pass**

Run:

```bash
node --test tests/subscription-api.test.cjs
```

Expected: all API tests pass.

### Task 3: Checkout marketing opt-in

**Files:**
- Modify: `api/lib/checkout-service.cjs`
- Modify: `api/create-checkout-session.js`
- Test: `tests/checkout-service.test.cjs`

- [ ] **Step 1: Write a failing checkout regression test**

Prove checkout still returns its Stripe URL when optional marketing subscription delivery fails.

- [ ] **Step 2: Run the focused checkout test and confirm it fails**

Run:

```bash
node --test tests/checkout-service.test.cjs
```

Expected: failure because subscription storage currently runs inside checkout and can block it.

- [ ] **Step 3: Move optional subscription work outside the checkout-critical path**

Return normalized subscriber details from `createCheckout` when consent is true. In the Vercel route, call `subscribeEmail` in a guarded `try/catch` after Stripe checkout creation and never change a successful checkout response because of marketing email failure.

- [ ] **Step 4: Run checkout tests and confirm they pass**

Run:

```bash
node --test tests/checkout-service.test.cjs
```

Expected: all checkout tests pass.

### Task 4: Unsubscribe page and accurate subscriber messaging

**Files:**
- Create: `apps/web/src/pages/UnsubscribePage.jsx`
- Modify: `apps/web/src/App.jsx`
- Modify: `apps/web/src/components/EmailCaptureSection.jsx`
- Test: `tests/visual-refresh.test.cjs`

- [ ] **Step 1: Write failing source-level regressions**

Require `/unsubscribe`, an explicit unsubscribe confirmation button, and separate success messages for welcome-email delivery versus saved subscription without delivery.

- [ ] **Step 2: Run the visual regression test and confirm it fails**

Run:

```bash
node --test --test-name-pattern="homepage and navigation" tests/visual-refresh.test.cjs
```

Expected: failure because the route and messages do not exist.

- [ ] **Step 3: Implement the page and messages**

The GET route renders a confirmation screen from query parameters without mutating data. The button sends POST `/api/unsubscribe`. The subscription success state says either:

```text
You're subscribed. A welcome email is on its way.
You're subscribed, but the welcome email could not be sent. Future updates will still go to this address.
```

- [ ] **Step 4: Run the visual regression test and confirm it passes**

Run:

```bash
node --test --test-name-pattern="homepage and navigation" tests/visual-refresh.test.cjs
```

Expected: the focused visual test passes.

### Task 5: Mobile Pair/Group alignment

**Files:**
- Modify: `apps/web/src/components/CompatibilityCalculator.jsx`
- Modify: `apps/web/src/components/GroupModeToggle.jsx`
- Test: `tests/visual-refresh.test.cjs`

- [ ] **Step 1: Write a failing regression for compact mobile centering**

Require the calculator header to center the toggle on mobile and restore right alignment at `sm` and above. Require the toggle itself to use content width rather than filling the mobile card.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```bash
node --test --test-name-pattern="homepage and navigation" tests/visual-refresh.test.cjs
```

Expected: failure because the current mobile toggle is left-aligned.

- [ ] **Step 3: Implement responsive alignment only**

Wrap the toggle in:

```jsx
<div className="flex justify-center sm:justify-end">
  <GroupModeToggle ... />
</div>
```

Keep desktop spacing, behavior, icons, and selected states unchanged.

- [ ] **Step 4: Run the focused test and confirm it passes**

Run:

```bash
node --test --test-name-pattern="homepage and navigation" tests/visual-refresh.test.cjs
```

Expected: the focused visual test passes.

### Task 6: Full verification

**Files:**
- Verify all modified files.

- [ ] **Step 1: Run all automated checks**

```bash
npm test
npm run lint
npm run build
git diff --check
```

Expected: all commands exit successfully with no test failures, lint errors, build errors, or whitespace errors.

- [ ] **Step 2: Verify browser behavior**

At desktop and 390px mobile:

```text
Pair/Group is centered only on mobile.
The score badge remains intact.
Subscription success messaging matches the API response.
The unsubscribe page does not mutate on load.
The unsubscribe button reaches a clear success state.
No browser console warnings or errors appear.
```

- [ ] **Step 3: Review the final diff**

Confirm no secrets, customer email addresses, unrelated refactors, generated build output, or database schema changes are included.
