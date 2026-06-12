# Premium Visual Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved “same visual personality, less to process” redesign without changing compatibility, persistence, sharing, or payment behavior.

**Architecture:** Keep route and service boundaries unchanged. Add one pure presentation helper for reduced result summaries, one homepage preview component, and focused visual changes to the existing calculator, result, sharing, and checkout components.

**Tech Stack:** React 18, React Router, Tailwind CSS, Lucide React, Node test runner, Vite, Vercel.

---

### Task 1: Lock Presentation Contracts

**Files:**
- Create: `tests/visual-refresh.test.cjs`
- Create: `apps/web/src/lib/result-presentation.js`

- [ ] **Step 1: Write failing tests**

Test that `buildPairHighlights()` returns communication, emotional rhythm, and the lowest-scoring growth edge, and that `getVisibleGroupPairs()` returns three pairs until expanded.

- [ ] **Step 2: Run the focused test**

Run: `node --test tests/visual-refresh.test.cjs`

Expected: FAIL because `result-presentation.js` does not exist.

- [ ] **Step 3: Implement the pure helper**

Create exported functions with no React or browser dependencies. Clamp missing scores to zero, derive emotional rhythm from chemistry/stability/intuition, and identify the lowest non-overall breakdown category.

- [ ] **Step 4: Verify green**

Run: `node --test tests/visual-refresh.test.cjs`

Expected: all focused tests pass.

### Task 2: Simplify Homepage and Calculator

**Files:**
- Create: `apps/web/src/components/HomeResultPreview.jsx`
- Modify: `apps/web/src/pages/HomePage.jsx`
- Modify: `apps/web/src/components/CompatibilityCalculator.jsx`
- Modify: `apps/web/src/components/GroupModeToggle.jsx`
- Modify: `apps/web/src/components/GroupInputForm.jsx`
- Modify: `apps/web/src/components/Header.jsx`
- Modify: `apps/web/src/App.jsx`
- Modify: `apps/web/src/index.css`
- Test: `tests/visual-refresh.test.cjs`

- [ ] **Step 1: Add failing source-contract assertions**

Assert that the homepage includes the approved headline and preview component, the header exposes How It Works, and the calculator includes the approved concise privacy/action copy.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `node --test tests/visual-refresh.test.cjs`

Expected: FAIL on missing approved copy/components.

- [ ] **Step 3: Implement the homepage and input hierarchy**

Use the current color tokens and Outfit font. Keep form labels and native date inputs accessible. Make the preview responsive and purely illustrative.

- [ ] **Step 4: Verify focused and full tests**

Run: `node --test tests/visual-refresh.test.cjs && npm test`

Expected: all tests pass.

### Task 3: Simplify Pair and Group Results

**Files:**
- Modify: `apps/web/src/components/ResultCard.jsx`
- Modify: `apps/web/src/components/GroupCompatibilityResults.jsx`
- Modify: `apps/web/src/components/ShareButtons.jsx`
- Modify: `apps/web/src/pages/ResultPage.jsx`
- Test: `tests/visual-refresh.test.cjs`

- [ ] **Step 1: Add failing result-layout assertions**

Assert that pair results consume `buildPairHighlights`, group results consume `getVisibleGroupPairs`, and sharing is labeled as private.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `node --test tests/visual-refresh.test.cjs`

Expected: FAIL because the old result components render five equal bars and all group pairs immediately.

- [ ] **Step 3: Implement pair and group hierarchy**

Keep the same props and result data. Add a local expand state for group pairs and keep download/share/report actions functional.

- [ ] **Step 4: Verify focused and full tests**

Run: `node --test tests/visual-refresh.test.cjs && npm test`

Expected: all tests pass.

### Task 4: Improve Report Checkout Framing

**Files:**
- Modify: `apps/web/src/components/SaveResultModal.jsx`
- Test: `tests/visual-refresh.test.cjs`

- [ ] **Step 1: Add failing checkout-content assertions**

Assert the modal names the three report inclusions and retains Stripe and birth-date privacy language.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `node --test tests/visual-refresh.test.cjs`

Expected: FAIL on missing inclusion copy.

- [ ] **Step 3: Implement the simplified modal**

Do not change `startCheckout`, request payloads, consent state, or redirect behavior.

- [ ] **Step 4: Verify tests, lint, and build**

Run: `npm test && npm run lint && npm run build`

Expected: zero test failures, zero lint errors, and a successful Vite build.

### Task 5: Browser and Design QA

**Files:**
- Create: `design-qa.md`
- Create: `artifacts/visual-qa/*`

- [ ] **Step 1: Run the local app**

Run: `npm run dev`

- [ ] **Step 2: Capture approved reference and implementation states**

Capture desktop and 390px mobile homepage, pair result, group result, sharing, and report modal states using synthetic data.

- [ ] **Step 3: Compare and fix**

Compare the approved visual target and implementation at equivalent viewports. Fix all P0/P1/P2 findings.

- [ ] **Step 4: Record passing QA**

Write `design-qa.md` with source path, implementation screenshot paths, viewport/state details, findings, applied patches, and `final result: passed`.

### Task 6: Publish Preview

**Files:**
- No production source changes expected.

- [ ] **Step 1: Run final verification**

Run: `npm test && npm run lint && npm run build && git diff --check`

- [ ] **Step 2: Commit and push the feature branch**

Commit only the visual refresh, tests, plan, and QA evidence. Push `feature/premium-visual-refresh`.

- [ ] **Step 3: Create or verify the Vercel preview**

Use the repository’s linked Vercel project or branch integration. Verify the deployed homepage and result routes before handoff.

