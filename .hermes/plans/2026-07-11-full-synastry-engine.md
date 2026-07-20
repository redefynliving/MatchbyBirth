# Full Synastry Engine Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Upgrade MatchByBirth from a Sun-sign compatibility calculator into a deterministic full synastry product that calculates real natal placements, cross-chart aspects, and paid-worthy relationship interpretations.

**Architecture:** Build a tested server-side JavaScript astrology core in `shared/` that calculates natal placements from birth data, compares two charts through aspect rules, and feeds structured evidence into the existing result/report pipeline. Keep the existing Sun-sign model as Basic Mode while adding Full Synastry Mode for complete birth data.

**Tech Stack:** Node.js, CommonJS shared modules, `astronomia`, Luxon/timezone helpers, existing Supabase result storage, existing Vercel API routes, Node test runner.

**Business Goal:** Make the $9.99 report defensible now and create room for a future $14.99-$24.99 “Deep Synastry Report” tier.

---

## Non-Negotiables

1. **No fake planetary claims.** Only display aspects/placements actually calculated.
2. **Deterministic core.** Same birth data must always produce the same chart, aspects, score, and evidence.
3. **LLM only writes from facts.** The model may turn calculated facts into readable copy, but never invent placements, aspects, degrees, or interpretations.
4. **Privacy first.** Raw birth time/place should not leak into shared/public results. Store only what is necessary.
5. **Graceful precision levels.** Missing birth time must produce “partial synastry,” not fabricated houses/Ascendant.
6. **Revenue-first shipping.** Build in phases that can ship safely without waiting for the perfect astrology engine.

---

## Final Product Shape

### Free Basic Mode

For users with birth dates only:

- Astronomical date-only Sun signs.
- Basic compatibility score.
- Clear label: `Basic Sun-sign reading`.
- Upgrade CTA: “Add birth time and place for full synastry.”

### Free Full Synastry Preview

For users with complete birth data:

- Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto.
- Ascendant and Midheaven when birth time/place are available.
- Top 3 supportive aspects.
- Top 2 tension aspects.
- Dimension scores with evidence.
- Clear precision label: `Full timed synastry` or `Partial untimed synastry`.

### Paid Deep Synastry Report

- Both natal chart summaries.
- Major cross-chart aspects with exact orb.
- Emotional compatibility.
- Communication style.
- Chemistry/attraction.
- Stability/long-term friction.
- Growth themes.
- Practical advice tied to exact aspects.
- Future upgrade: chart wheel image/PDF.

---

## Phase 0 — Clean the Ground First

**Objective:** Remove misleading claims before adding real synastry so the live site stops overpromising.

**Files:**
- Modify: `apps/web/src/pages/FAQPage.jsx`
- Modify: `apps/web/src/pages/HomePage.jsx`
- Modify: `apps/web/src/pages/HowItWorksPage.jsx`
- Modify: `apps/web/src/pages/AboutPage.jsx`
- Modify: `tools/build-ssg.mjs`
- Test: existing text/SSG tests where applicable

**Tasks:**

1. Replace “precise planetary degrees/aspects” claims with the current truth.
2. Remove claims that life path contributes to the main compatibility score unless implemented.
3. Add transitional copy: “Full planetary synastry is coming soon.”
4. Run:

```bash
npm test
npm run lint
npm run build
```

**Acceptance:** The site no longer claims full-chart synastry before the engine exists.

---

## Phase 1 — Astronomical Sun Fallback

**Objective:** Make Basic Mode more credible by using astronomical date-only Sun signs instead of fixed cutoffs.

**Files:**
- Modify: `shared/compatibility.cjs`
- Modify: `tests/compatibility.test.cjs`
- Possibly modify: `tests/exact-astrology.test.cjs`

**Tasks:**

1. Add test proving cusp dates use `getSunSignDateOnly` when birth time/place are missing.
2. Update `getSignForPerson()` to call `exactAstrology.getSunSignDateOnly(person.birthDate)`.
3. Keep fixed `getZodiacSign()` only as emergency fallback.
4. Add precision copy for `date-only` results.
5. Run focused tests:

```bash
node --test tests/exact-astrology.test.cjs tests/compatibility.test.cjs
```

**Acceptance:** Date-only mode no longer contradicts the astronomy module on tested ingress dates.

---

## Phase 2 — Natal Chart Core v1

**Objective:** Calculate a deterministic natal chart from birth date/time/timezone.

**Files:**
- Create: `shared/natal-chart.cjs`
- Create: `tests/natal-chart.test.cjs`
- Modify: `shared/exact-astrology.cjs` only if shared helpers are needed

**Placements v1:**

- Sun
- Moon
- Mercury
- Venus
- Mars
- Jupiter
- Saturn
- Uranus
- Neptune
- Pluto

**Output shape:**

```js
{
  precision: 'timed' | 'date-only',
  utc: '2000-01-20T17:30:00.000Z',
  placements: {
    Sun: {
      longitude: 299.42,
      sign: 'Capricorn',
      degree: 29.42,
      retrograde: false
    },
    Moon: { ... }
  }
}
```

**Tasks:**

1. Write tests for output shape and longitude normalization.
2. Implement Julian date conversion reuse.
3. Calculate Sun first using existing exact astrology logic.
4. Add Moon and planets using `astronomia` APIs available in the installed version.
5. If exact planet APIs are awkward, spike in a separate branch before committing production code.
6. Validate against at least 3 reference charts from a reputable source.

**Commands:**

```bash
node --test tests/natal-chart.test.cjs
npm test
```

**Acceptance:** The module returns stable planetary longitudes/signs and has reference-chart tests.

---

## Phase 3 — Ascendant, Midheaven, Houses, and Nodes

**Objective:** Add time/place-sensitive chart points only when the birth data supports them.

**Files:**
- Modify: `shared/natal-chart.cjs`
- Modify: `tests/natal-chart.test.cjs`
- Possibly create: `shared/house-system.cjs`

**Important rule:** If birth time or valid place/timezone is missing, do not calculate Ascendant, Midheaven, or houses.

**Output additions:**

```js
angles: {
  Ascendant: { longitude, sign, degree },
  Midheaven: { longitude, sign, degree }
},
houses: [
  { number: 1, cusp: { longitude, sign, degree } }
],
nodes: {
  NorthNode: { longitude, sign, degree },
  SouthNode: { longitude, sign, degree }
}
```

**Tasks:**

1. Decide initial house system: Whole Sign for simplicity, or Placidus if reliably implemented.
2. Add tests proving untimed charts omit angles/houses.
3. Add tests proving timed charts include angles/houses.
4. Add docs comment explaining precision limits.

**Acceptance:** The engine is honest about timed vs untimed chart capability.

---

## Phase 4 — Cross-Chart Aspect Engine

**Objective:** Compare two natal charts and detect real synastry aspects.

**Files:**
- Create: `shared/synastry-aspects.cjs`
- Create: `tests/synastry-aspects.test.cjs`
- Deprecate or ignore: `apps/api/src/astro/synastry.py` for production path

**Supported aspects v1:**

| Aspect | Angle | Base orb |
|---|---:|---:|
| Conjunction | 0° | 8° |
| Opposition | 180° | 8° |
| Trine | 120° | 7° |
| Square | 90° | 7° |
| Sextile | 60° | 5° |
| Quincunx | 150° | 3° |

**Object orb modifiers:**

- Sun/Moon: +1°
- Personal planets: normal
- Outer planets: -1°
- Angles/Nodes: -2°

**Aspect output:**

```js
{
  id: 'A-Moon__trine__B-Venus',
  from: { chart: 'A', body: 'Moon' },
  to: { chart: 'B', body: 'Venus' },
  aspect: 'trine',
  exactAngle: 120,
  orb: 1.24,
  maxOrb: 8,
  strength: 0.845,
  polarity: 'supportive',
  categoryHints: ['emotional', 'chemistry']
}
```

**Tasks:**

1. Test angular distance across 0°/360° boundary.
2. Test exact aspect detection.
3. Test aspect outside orb is excluded.
4. Test tighter orb produces higher strength.
5. Test duplicate aspect IDs are stable.
6. Sort output by importance/strength.

**Acceptance:** Two natal charts produce a stable list of meaningful cross-chart aspects.

---

## Phase 5 — Synastry Scoring Model

**Objective:** Replace generic Sun-sign scoring with evidence-backed dimension scores.

**Files:**
- Create: `shared/synastry-score.cjs`
- Create: `tests/synastry-score.test.cjs`
- Modify: `shared/compatibility.cjs`

**Dimensions:**

| Dimension | Evidence sources |
|---|---|
| Emotional | Moon-Moon, Sun-Moon, Moon-Venus, Moon-Saturn, Moon-Pluto |
| Communication | Mercury-Mercury, Mercury-Moon, Mercury-Sun, Mercury-Saturn, Mercury-Uranus |
| Chemistry | Venus-Mars, Venus-Pluto, Mars-Pluto, Venus-Asc, Mars-Asc |
| Stability | Saturn-Sun, Saturn-Moon, Saturn-Venus, Saturn-Asc |
| Growth | Jupiter-Sun, Jupiter-Moon, Jupiter-Venus, Nodes, Jupiter-Asc |
| Friction | hard Saturn, Mars-Saturn, Mars-Pluto, Mercury-Neptune, Moon-Uranus |

**Score output:**

```js
{
  score: 82,
  precision: 'full-synastry',
  breakdown: {
    emotional: 88,
    communication: 74,
    chemistry: 91,
    stability: 69,
    growth: 80,
    friction: 38
  },
  topSupportiveAspects: [],
  topTensionAspects: [],
  evidence: []
}
```

**Tasks:**

1. Define aspect weights by body pair and category.
2. Add tests for known synthetic charts.
3. Ensure hard aspects can be productive, not only negative.
4. Ensure one exact aspect cannot dominate the whole chart unrealistically.
5. Add missing-data behavior for partial/untimed charts.

**Acceptance:** Every displayed dimension score is traceable to actual aspect evidence.

---

## Phase 6 — API and Result Schema Integration

**Objective:** Save synastry evidence with results and expose it to the result page/report generator.

**Files:**
- Modify: `api/_lib/result-service.cjs`
- Modify: `shared/compatibility.cjs`
- Modify: `api/_lib/supabase-store.cjs` if persistence shape changes
- Add migration only if required
- Modify tests around result calculation and storage

**Tasks:**

1. Add `calculationMode`: `basic-sun` | `partial-synastry` | `full-synastry`.
2. Add `chartSummary` to sanitized people.
3. Add `synastry` object to result payload.
4. Ensure shared/public result does not expose raw birth time/place.
5. Add tests proving no raw birth data leaks.
6. Keep legacy result pages working.

**Acceptance:** Results carry real aspect evidence without exposing sensitive raw inputs.

---

## Phase 7 — Frontend Integration

**Objective:** Let users understand why birth time/place matter and see synastry evidence cleanly.

**Files:**
- Modify: `apps/web/src/components/CalculatorWithPreview.jsx`
- Modify: `apps/web/src/components/PlaceSearch.jsx`
- Modify: `apps/web/src/pages/ResultPage.jsx`
- Possibly create: `apps/web/src/components/SynastryEvidence.jsx`

**Tasks:**

1. Rename “Exact Mode” to “Full Synastry Mode.”
2. Explain missing birth time produces a partial chart.
3. Show precision badge on result.
4. Display top aspects with plain-English meaning.
5. Add CTA to upgrade/free preview into detailed report.
6. Keep layout clean—no cramped planet tables on mobile.

**Acceptance:** Users can understand the value of full synastry without being overwhelmed.

---

## Phase 8 — Paid Report Upgrade

**Objective:** Make paid reports cite actual synastry facts.

**Files:**
- Modify: `api/_lib/report-generator.cjs`
- Modify: report tests

**Tasks:**

1. Update `buildReportFacts()` to include top aspects and precision.
2. Add validation requiring reports to mention at least 2 real aspects when full synastry exists.
3. Keep fallback report useful without API keys.
4. Add prompt rule: never invent placements/aspects.
5. Add reject patterns for fake certainty.

**Acceptance:** Paid reports become evidence-backed rather than generic compatibility copy.

---

## Phase 9 — Pricing and Positioning

**Objective:** Use full synastry as the monetization upgrade.

**Recommended pricing:**

- Basic compatibility: free
- Detailed compatibility report: keep at `$9.99` during rollout
- Deep Synastry Report: test `$14.99` or `$19.99`
- Future bundle: relationship report + chart wheel PDF at `$24.99`

**Copy direction:**

> “Basic mode compares your Sun-sign pattern. Full Synastry calculates both birth charts and compares real planetary aspects like Moon-Venus, Mercury-Saturn, and Venus-Mars.”

**Acceptance:** Users understand why the paid report is worth money.

---

## Phase 10 — Verification and Launch

**Objective:** Ship without breaking payments, privacy, or credibility.

**Commands:**

```bash
npm test
npm run lint
npm run build
npm audit --omit=dev
```

**Manual checks:**

1. Birth-date-only pair result.
2. Full birth-time/place pair result.
3. Missing birth time partial result.
4. Cusp date result.
5. Shared result page.
6. Paid checkout creation.
7. Report generation fallback.
8. Report generation with model API available.
9. Mobile result page.
10. Privacy: no raw birth time/place in shared public result.

**Launch:**

1. Commit to `main` only after full verification.
2. Push.
3. Verify Vercel deployment.
4. Smoke test live homepage and API.
5. Watch logs for result calculation/report errors.

---

## First Sprint Recommendation

Do **not** start with Pluto, houses, or chart wheels.

Start with this revenue-safe slice:

1. Clean false claims.
2. Use astronomical date-only Sun signs.
3. Build natal chart core for Sun, Moon, Mercury, Venus, Mars.
4. Build aspect engine for those bodies.
5. Show top 3 aspects in result.
6. Feed those aspects into the paid report.

That is enough to honestly market “real synastry” without building a full professional astrology suite on day one.
