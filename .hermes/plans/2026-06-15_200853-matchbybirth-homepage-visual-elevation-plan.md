# MatchByBirth Homepage Visual Elevation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Upgrade the MatchByBirth homepage from a clean-but-generic utility into a premium, trustworthy astrology brand page that improves first impression, clarity, and conversion without bloating the page.

**Architecture:** Keep the current homepage structure and calculator-first UX, but elevate the visual system through targeted hero art direction, tighter proof presentation, stronger CTA copy, and better section styling. Avoid a rebuild. This is a layered refinement pass centered on `HomePage.jsx`, `CalculatorWithPreview.jsx`, and supporting presentation components/styles.

**Tech Stack:** React 18, Vite, Tailwind CSS, Lucide React, existing design tokens/components in `apps/web/src`.

---

## Current context / assumptions

- Product: astrology compatibility calculator for pairs and groups.
- Homepage source is `MatchbyBirth/apps/web/src/pages/HomePage.jsx`.
- Primary calculator shell is `MatchbyBirth/apps/web/src/components/CalculatorWithPreview.jsx`.
- There is also `CompatibilityCalculator.jsx`, but the homepage currently imports `CalculatorWithPreview.jsx`.
- Live audit findings:
  - Structure is good.
  - Hero is clear but emotionally flat.
  - Benefit chips are duplicated and visually weak.
  - CTA copy is awkward (`See our compatibility`).
  - Email capture and FAQ are functional but too generic.
  - Current page already uses a healthy token-based color system; this is a brand-elevation problem, not a total design-system failure.
- Constraint: no fake scores, fake previews, or placeholder “AI slop” content.
- Constraint: maintain responsive behavior and preserve no-signup / privacy-first positioning.

---

## Desired outcome

When finished, the homepage should feel:

1. More premium and intentional.
2. More astrology-native without becoming cheesy.
3. More trustworthy at first glance.
4. More conversion-focused around the calculator.
5. Cleaner, not busier.

Success looks like:
- Better hero atmosphere.
- Stronger visual identity.
- Sharper CTA language.
- One unified proof system instead of scattered micro-bullets.
- Email capture and FAQ visually tied into the same brand world.

---

## Files likely to change

### Primary
- `apps/web/src/pages/HomePage.jsx`
- `apps/web/src/components/CalculatorWithPreview.jsx`
- `apps/web/src/components/HomeEmailCapture.jsx`

### Likely supporting
- `apps/web/src/components/ui/button.jsx` or equivalent only if CTA styling needs token-safe extension
- `apps/web/src/index.css` or `apps/web/src/styles/*` if the project stores shared utility classes there
- Optional new component(s):
  - `apps/web/src/components/home/HomeProofBand.jsx`
  - `apps/web/src/components/home/HomeHeroBackdrop.jsx`
  - `apps/web/src/components/home/HomeTrustStrip.jsx`

### Validation targets
- `apps/web/package.json` scripts:
  - `npm run lint`
  - `npm run build`

---

## Design rules for implementation

1. **Do not add bright synthetic gradients.** Use existing tokens and low-contrast atmosphere.
2. **Do not add fake sample result cards.** If adding supporting visual content, use abstract celestial art, process copy, or trust framing.
3. **Do not increase page length with fluff.** Every new element must justify itself.
4. **Keep calculator first.** Hero still needs to drive directly into use.
5. **Preserve mobile simplicity.** Any decorative layer must degrade cleanly.
6. **Prefer one strong proof band over two weak bullet rows.**
7. **Use astrology cues with restraint.** Think editorial / luxe / cosmic, not novelty shop.

---

## Proposed approach

### 1. Hero art-direction pass
Add a subtle brand atmosphere behind the existing hero content:
- radial glow
- low-contrast celestial texture
- optional constellation or orbit-line motif
- soft depth layers using token-safe opacity

This should make the page feel branded without adding another “content block.”

### 2. Tighten hero copy + CTA language
Keep the H1 unless a stronger one emerges during implementation testing, but improve the action copy in the calculator:
- `See our compatibility` → `Check compatibility` or `See compatibility`

Also refine the supporting trust/proof presentation so the first screen communicates speed, privacy, group mode, and optional paid depth more elegantly.

### 3. Replace scattered benefit rows with a unified proof band
Today there are two separate rows of weak bullets. Consolidate these into one more intentional presentation:
- Fast
- Private
- Pair or group
- Shareable results
- Optional detailed report

Visually: small chips/cards/pills with consistent icon framing and spacing.

### 4. Upgrade calculator shell styling, not structure
The calculator already works. Improve perceived quality via:
- stronger header hierarchy
- better toggle styling
- more premium section spacing
- slightly more intentional form row rhythm
- upgraded CTA copy

### 5. Elevate email capture card
Keep the same function, but make it feel like part of the homepage story instead of a generic newsletter insert:
- tighter offer framing
- slightly more editorial section styling
- clearer benefit language
- optional subtle star motif or framed accent

### 6. Elevate FAQ section styling
Keep content simple, but make the section feel designed:
- stronger section intro
- more deliberate card spacing/borders/shadows
- softer background separation if needed

---

## Step-by-step implementation plan

### Task 1: Inspect homepage support components and shared styling hooks

**Objective:** Confirm the exact components and CSS entry points before editing.

**Files:**
- Read: `apps/web/src/components/HomeEmailCapture.jsx`
- Read: `apps/web/src/components/HomeResultPreview.jsx`
- Read: shared CSS entrypoint(s) such as `apps/web/src/index.css` or equivalent

**Steps:**
1. Read `HomeEmailCapture.jsx` to understand current structure and classes.
2. Read `HomeResultPreview.jsx` to confirm whether any dead preview code or styling still affects homepage composition.
3. Find the global CSS file(s) or utility layers used by the web app.
4. Record whether the hero atmosphere can be built inline with Tailwind classes alone or needs a small shared CSS utility.

**Verification:**
- You can point to the exact files controlling hero, calculator, and email capture styling.

---

### Task 2: Create a dedicated homepage proof data model and remove duplicated utility rows

**Objective:** Replace the two current micro-bullet rows with one clearer, reusable proof structure.

**Files:**
- Modify: `apps/web/src/pages/HomePage.jsx`
- Create (optional): `apps/web/src/components/home/HomeProofBand.jsx`

**Implementation details:**
- Define a single data array for homepage proof items.
- Include 4–5 items max.
- Recommended labels:
  - `Results in seconds`
  - `Birth dates not stored`
  - `Pair or group readings`
  - `Shareable results`
  - `Optional full report`
- Remove the duplicated lower row in `HomePage.jsx`.

**Verification:**
- There is only one proof system on the homepage.
- Messaging is tighter and no meaning is lost.

---

### Task 3: Add subtle celestial hero atmosphere behind existing content

**Objective:** Make the hero feel premium and astrology-native without cluttering it.

**Files:**
- Modify: `apps/web/src/pages/HomePage.jsx`
- Create (optional): `apps/web/src/components/home/HomeHeroBackdrop.jsx`
- Modify (only if needed): shared CSS file

**Implementation details:**
- Use absolutely positioned layers inside `.brand-hero`.
- Candidate layers:
  - one large radial blur near top-center/right
  - one faint secondary blur lower-left
  - one low-opacity orbital/constellation SVG or CSS line motif
  - one subtle grain/noise overlay only if already available or trivial
- Keep all decorative layers `pointer-events-none`.
- Keep contrast gentle; the text must remain dominant.
- Avoid introducing a loud gradient background.

**Verification:**
- Hero reads the same functionally, but visually feels richer.
- Text contrast remains accessible.
- Mobile still looks clean.

---

### Task 4: Tighten hero typography and spacing hierarchy

**Objective:** Make the hero feel more editorial and intentional without rewriting the whole message.

**Files:**
- Modify: `apps/web/src/pages/HomePage.jsx`

**Implementation details:**
- Keep the eyebrow, H1, and subhead structure.
- Adjust spacing so the stack feels slightly more luxurious.
- Consider narrowing the subhead width a bit.
- Preserve the current H1 unless experimentation clearly shows a stronger alternative.
- If changing copy, test only these safe variants:
  - H1 stays the same, or
  - `See your compatibility by birth date.`
- Do not overcomplicate the message.

**Verification:**
- Hero looks less “default SaaS block” and more branded/editorial.
- Above-the-fold content remains fast to scan.

---

### Task 5: Upgrade calculator shell styling and CTA copy

**Objective:** Improve perceived quality and remove awkward language without changing calculator behavior.

**Files:**
- Modify: `apps/web/src/components/CalculatorWithPreview.jsx`

**Implementation details:**
- Keep form logic intact.
- Replace CTA text:
  - primary recommendation: `Check compatibility`
  - fallback: `See compatibility`
- Review and improve:
  - card padding rhythm
  - header spacing
  - mode toggle visual treatment
  - divider strength
  - supportive privacy line styling
- Optional copy refinement:
  - `Check your connection` can stay, but consider `Check compatibility` if it reads better in the card header.

**Verification:**
- Interaction still works exactly as before.
- Visual polish improves without making the form heavier.
- CTA language feels natural.

---

### Task 6: Create a compact trust/process bridge below the calculator or integrated into proof band

**Objective:** Add one stronger conversion-supporting trust layer without bloating the page.

**Files:**
- Modify: `apps/web/src/pages/HomePage.jsx`
- Create (optional): `apps/web/src/components/home/HomeTrustStrip.jsx`

**Implementation details:**
Choose one of these approaches, not both:

**Option A — Trust strip**
- A compact row of 3 cards:
  - No signup required
  - Birth dates not stored
  - Pair and group support

**Option B — 3-step “How it works” micro-strip**
- Enter names and birth dates
- Get a score and breakdown
- Share or unlock a deeper report

Prefer whichever feels more additive after the proof band is designed. If the proof band already communicates enough, skip this task to avoid bloat.

**Verification:**
- The homepage gains trust/support clarity without becoming longer for no reason.

---

### Task 7: Elevate `HomeEmailCapture.jsx` styling and offer framing

**Objective:** Make the forecast signup feel like a premium secondary offer instead of a generic email form.

**Files:**
- Modify: `apps/web/src/components/HomeEmailCapture.jsx`

**Implementation details:**
- Keep form function intact.
- Improve heading/subhead/CTA framing.
- Possible copy direction:
  - Headline: `Get your weekly compatibility forecast`
  - Support: `A free weekly read on love, friendship, and relationship energy. No spam.`
- Style direction:
  - card framing with better spacing
  - subtle accent motif
  - stronger internal hierarchy
  - consistent radius/border/shadow with hero calculator world
- Keep this section compact.

**Verification:**
- Email block feels designed, relevant, and on-brand.
- It no longer reads like a generic newsletter module.

---

### Task 8: Elevate FAQ section styling while keeping copy concise

**Objective:** Preserve clarity but make the lower page feel intentionally designed.

**Files:**
- Modify: `apps/web/src/pages/HomePage.jsx`

**Implementation details:**
- Keep FAQ count minimal.
- Add optional intro line above the H2 if it helps continuity.
- Consider a subtle background wrapper or tone shift to separate the section from the rest of the page.
- Tighten accordion card styling so it feels more premium than basic utility boxes.

**Verification:**
- FAQ remains readable and scannable.
- The section feels like part of the same brand system.

---

### Task 9: Review mobile layout and trim any desktop-only excess

**Objective:** Ensure the new polish does not create mobile clutter.

**Files:**
- Review all modified homepage components

**Implementation details:**
- Hide or simplify decorative layers on small screens.
- Ensure proof items wrap cleanly.
- Verify form controls remain comfortably tappable.
- Avoid text lines that become too long or too compressed.

**Verification:**
- Mobile remains simple and premium.
- No decorative artifact harms readability.

---

### Task 10: Run validation and create before/after QA notes

**Objective:** Verify the refinement pass is production-safe.

**Files:**
- Review modified files

**Run:**
```bash
cd /Users/alijahfox/MatchbyBirth/apps/web
npm run lint
npm run build
```

**Expected:**
- Lint passes.
- Build passes.
- No new console/runtime errors on homepage.

**Manual QA checklist:**
- Homepage loads with no layout shift disasters.
- CTA text updated correctly.
- Proof band appears once, not duplicated.
- Hero atmosphere is visible but restrained.
- Email block still submits.
- FAQ accordions still open/close.
- Mobile layout remains clean.

---

## Recommended copy updates

### Primary CTA
- Replace `See our compatibility`
- With `Check compatibility`

### Calculator support text
Current:
- `Start with two people or compare a full group.`

Possible keep:
- Keep as-is unless visual rhythm demands a shorter variant.

### Email capture
Current section is generic.

Recommended direction:
- Headline: `Get your weekly compatibility forecast`
- Support: `Free weekly insights on love, friendship, and relationship energy. Unsubscribe anytime.`
- CTA can remain close to current if already wired and sensible.

---

## Risks / tradeoffs

1. **Over-design risk**
   - If the celestial styling becomes too visible, the site will lose credibility.
   - Bias toward subtlety.

2. **Bloat risk**
   - Adding both a proof band and extra trust strip may over-stack the page.
   - Prefer one strong system.

3. **Mobile clutter risk**
   - Decorative hero layers may look good on desktop but noisy on mobile.
   - Test mobile early.

4. **Token drift risk**
   - New styling must use the existing design system rather than introducing one-off colors.

---

## Open questions to resolve during implementation

1. Should the H1 stay exactly as-is or tighten to `See your compatibility by birth date`?
2. Does the email capture perform better as `weekly forecast` or `compatibility forecast` language?
3. Is a separate trust strip necessary once the proof band is improved, or is that redundant?
4. Is there already an internal decorative asset/SVG that can support hero atmosphere without creating new art from scratch?

---

## Shipping sequence recommendation

If implementing in order of ROI:
1. Task 5 — CTA + calculator shell cleanup
2. Task 2 — unify proof band
3. Task 3 — hero atmosphere
4. Task 7 — email capture elevation
5. Task 8 — FAQ polish
6. Task 9/10 — responsive QA + validation

This gets the biggest brand lift fast while keeping risk controlled.

---

## Acceptance criteria

The redesign pass is complete when:
- The homepage still centers the calculator.
- The page feels more premium and astrology-native at first glance.
- There is no fake preview content.
- Benefit/proof messaging is unified and less repetitive.
- The main CTA copy is improved.
- Email capture and FAQ visually match the rest of the page.
- Lint/build pass.
- Manual QA confirms no regressions in calculator flow.
