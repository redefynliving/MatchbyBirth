# Life Path Tool Funnel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Life Path Compatibility tool into a clean funnel into the existing full birth-date compatibility calculator and paid report upsell without putting birth details in URLs.

**Architecture:** Add a small route-state prefill helper that carries names and birth dates from the Life Path result into the homepage calculator. The Life Path page gets a soft CTA after a result, the homepage consumes the prefill once, and `CalculatorWithPreview` preserves native form behavior while tracking Life Path-originated completions. The paid report system stays unchanged and remains downstream of the full calculator result.

**Tech Stack:** React, React Router route state, existing `CalculatorWithPreview`, existing analytics helper, Node test runner.

---

## File Structure

- Create: `apps/web/src/lib/calculator-prefill.js`
  - Owns sanitizing and normalizing prefill payloads.
  - Keeps raw birth dates out of query strings.
  - Exposes `buildCalculatorPrefill(input)` and `normalizeCalculatorPrefill(value)`.

- Modify: `apps/web/src/pages/LifePathCompatibilityPage.jsx`
  - Imports `useNavigate`.
  - Builds route-state prefill from the Life Path form values.
  - Adds a result CTA: "Compare full birth-date match".
  - Tracks `life_path_to_full_match_clicked`.

- Modify: `apps/web/src/pages/HomePage.jsx`
  - Imports `useLocation`.
  - Reads `location.state.calculatorPrefill`.
  - Passes normalized prefill into `CalculatorWithPreview`.
  - Keeps the existing `/#calculator` scroll behavior.

- Modify: `apps/web/src/components/CalculatorWithPreview.jsx`
  - Accepts a `prefill` prop.
  - Applies pair-mode prefill to native-input defaults through component state.
  - Tracks `life_path_full_match_completed` after a successful calculation that started from Life Path.
  - Preserves existing uncontrolled input contract with `defaultValue`.

- Create: `tests/life-path-funnel.test.cjs`
  - Verifies the helper sanitizes input and rejects invalid prefill.
  - Verifies Life Path page has the CTA, route-state navigation, and click tracking.
  - Verifies homepage passes prefill to the calculator.
  - Verifies calculator accepts prefill and tracks Life Path-originated completion.

---

### Task 1: Add Calculator Prefill Helper

**Files:**
- Create: `apps/web/src/lib/calculator-prefill.js`
- Create: `tests/life-path-funnel.test.cjs`

- [ ] **Step 1: Write the failing helper tests**

Create `tests/life-path-funnel.test.cjs` with:

```js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('calculator prefill helper sanitizes valid Life Path handoff data', async () => {
  const helper = await import(pathToFileURL(
    path.join(root, 'apps/web/src/lib/calculator-prefill.js'),
  ).href);

  const prefill = helper.buildCalculatorPrefill({
    firstName: '  Alex  ',
    firstDate: '1990-01-09',
    secondName: '  Jordan  ',
    secondDate: '1993-09-09',
    relationshipType: 'friendship',
    source: 'life_path_compatibility',
  });

  assert.deepEqual(prefill, {
    mode: 'pair',
    relationshipType: 'friendship',
    source: 'life_path_compatibility',
    people: [
      { id: 'pair-1', name: 'Alex', birthDate: '1990-01-09', birthTime: '', place: null },
      { id: 'pair-2', name: 'Jordan', birthDate: '1993-09-09', birthTime: '', place: null },
    ],
  });

  assert.deepEqual(helper.normalizeCalculatorPrefill(prefill), prefill);
});

test('calculator prefill helper rejects invalid or incomplete data', async () => {
  const helper = await import(pathToFileURL(
    path.join(root, 'apps/web/src/lib/calculator-prefill.js'),
  ).href);

  assert.equal(helper.buildCalculatorPrefill({
    firstName: 'Alex',
    firstDate: 'bad-date',
    secondName: 'Jordan',
    secondDate: '1993-09-09',
  }), null);

  assert.equal(helper.normalizeCalculatorPrefill({
    mode: 'group',
    relationshipType: 'love',
    source: 'life_path_compatibility',
    people: [],
  }), null);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/life-path-funnel.test.cjs
```

Expected: FAIL with `Cannot find module` or missing `calculator-prefill.js`.

- [ ] **Step 3: Add the helper implementation**

Create `apps/web/src/lib/calculator-prefill.js`:

```js
const allowedRelationshipTypes = new Set(['love', 'friendship', 'work']);

function isValidDateString(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return false;

  const [year, month, day] = String(value).split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
    && date.getTime() <= Date.now();
}

function cleanName(value, fallback) {
  const cleaned = String(value || '').trim().slice(0, 80);
  return cleaned || fallback;
}

function cleanRelationshipType(value) {
  return allowedRelationshipTypes.has(value) ? value : 'love';
}

function cleanSource(value) {
  const cleaned = String(value || '').trim().slice(0, 80);
  return cleaned || 'tool_prefill';
}

export function buildCalculatorPrefill({
  firstName,
  firstDate,
  secondName,
  secondDate,
  relationshipType = 'love',
  source = 'tool_prefill',
} = {}) {
  if (!isValidDateString(firstDate) || !isValidDateString(secondDate)) return null;

  return {
    mode: 'pair',
    relationshipType: cleanRelationshipType(relationshipType),
    source: cleanSource(source),
    people: [
      {
        id: 'pair-1',
        name: cleanName(firstName, 'Person A'),
        birthDate: firstDate,
        birthTime: '',
        place: null,
      },
      {
        id: 'pair-2',
        name: cleanName(secondName, 'Person B'),
        birthDate: secondDate,
        birthTime: '',
        place: null,
      },
    ],
  };
}

export function normalizeCalculatorPrefill(value) {
  if (!value || value.mode !== 'pair' || !Array.isArray(value.people) || value.people.length !== 2) {
    return null;
  }

  return buildCalculatorPrefill({
    firstName: value.people[0]?.name,
    firstDate: value.people[0]?.birthDate,
    secondName: value.people[1]?.name,
    secondDate: value.people[1]?.birthDate,
    relationshipType: value.relationshipType,
    source: value.source,
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
node --test tests/life-path-funnel.test.cjs
```

Expected: PASS for the helper tests.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/calculator-prefill.js tests/life-path-funnel.test.cjs
git commit -m "Add calculator prefill helper"
```

---

### Task 2: Add Life Path Result CTA

**Files:**
- Modify: `apps/web/src/pages/LifePathCompatibilityPage.jsx`
- Modify: `tests/life-path-funnel.test.cjs`

- [ ] **Step 1: Add failing static tests for the Life Path CTA**

Append this test to `tests/life-path-funnel.test.cjs`:

```js
test('Life Path tool routes completed users into the full calculator funnel', () => {
  const page = read('apps/web/src/pages/LifePathCompatibilityPage.jsx');

  assert.match(page, /useNavigate/);
  assert.match(page, /buildCalculatorPrefill/);
  assert.match(page, /life_path_to_full_match_clicked/);
  assert.match(page, /Compare full birth-date match/);
  assert.match(page, /navigate\('\/#calculator'/);
  assert.match(page, /calculatorPrefill/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/life-path-funnel.test.cjs
```

Expected: FAIL because the Life Path page does not import `useNavigate`, does not build prefill, and does not contain the CTA.

- [ ] **Step 3: Update imports**

In `apps/web/src/pages/LifePathCompatibilityPage.jsx`, replace:

```js
import { Link } from 'react-router-dom';
```

with:

```js
import { Link, useNavigate } from 'react-router-dom';
```

Add this import under the analytics import:

```js
import { buildCalculatorPrefill } from '@/lib/calculator-prefill.js';
```

- [ ] **Step 4: Add navigation handler inside `LifePathTool`**

Inside `LifePathTool`, after the state declarations, add:

```js
  const navigate = useNavigate();

  const handleFullMatchClick = () => {
    const calculatorPrefill = buildCalculatorPrefill({
      firstName,
      firstDate,
      secondName,
      secondDate,
      relationshipType: 'love',
      source,
    });

    if (!calculatorPrefill) {
      setError('Enter two valid birth dates before opening the full compatibility calculator.');
      return;
    }

    trackEvent('life_path_to_full_match_clicked', {
      source,
      first_life_path: result?.personA?.lifePath || null,
      second_life_path: result?.personB?.lifePath || null,
    });

    navigate('/#calculator', {
      state: {
        calculatorPrefill,
      },
    });
  };
```

- [ ] **Step 5: Add CTA after the Life Path result grid**

Inside the existing `{result && (...)}` section, after the three-column result grid and before `</section>`, add:

```jsx
          <div className="mt-5 rounded-2xl border border-primary/15 bg-card p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-base font-semibold text-foreground">Want the full birth-date compatibility reading?</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Use the same names and birth dates to see the complete Match by Birth score, strengths, watch area, and report option.
                </p>
              </div>
              <Button
                type="button"
                onClick={handleFullMatchClick}
                className="btn-primary h-11 shrink-0 rounded-xl px-5 text-sm"
              >
                Compare full birth-date match
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
```

- [ ] **Step 6: Run test to verify it passes**

Run:

```bash
node --test tests/life-path-funnel.test.cjs
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/pages/LifePathCompatibilityPage.jsx tests/life-path-funnel.test.cjs
git commit -m "Add Life Path full match CTA"
```

---

### Task 3: Consume Prefill On Homepage

**Files:**
- Modify: `apps/web/src/pages/HomePage.jsx`
- Modify: `tests/life-path-funnel.test.cjs`

- [ ] **Step 1: Add failing homepage test**

Append this test to `tests/life-path-funnel.test.cjs`:

```js
test('homepage reads calculator prefill from route state and passes it into the calculator', () => {
  const page = read('apps/web/src/pages/HomePage.jsx');

  assert.match(page, /useLocation/);
  assert.match(page, /normalizeCalculatorPrefill/);
  assert.match(page, /location\.state\?\.calculatorPrefill/);
  assert.match(page, /prefill=\{calculatorPrefill\}/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/life-path-funnel.test.cjs
```

Expected: FAIL because homepage does not read route state.

- [ ] **Step 3: Update homepage imports**

In `apps/web/src/pages/HomePage.jsx`, replace:

```js
import { Link } from 'react-router-dom';
```

with:

```js
import { Link, useLocation } from 'react-router-dom';
```

Add:

```js
import { normalizeCalculatorPrefill } from '@/lib/calculator-prefill.js';
```

- [ ] **Step 4: Normalize route-state prefill**

Inside `HomePage`, after `const [mode, setMode] = useState('pair');`, add:

```js
  const location = useLocation();
  const calculatorPrefill = normalizeCalculatorPrefill(location.state?.calculatorPrefill);
```

- [ ] **Step 5: Force pair mode when prefill arrives**

After the existing `useEffect` that calls `scrollToCalculatorFromHash()`, add:

```js
  useEffect(() => {
    if (calculatorPrefill) {
      setMode('pair');
    }
  }, [calculatorPrefill]);
```

- [ ] **Step 6: Pass prefill into calculator**

Replace:

```jsx
            <CalculatorWithPreview mode={mode} setMode={setMode} />
```

with:

```jsx
            <CalculatorWithPreview mode={mode} setMode={setMode} prefill={calculatorPrefill} />
```

- [ ] **Step 7: Run test to verify it passes**

Run:

```bash
node --test tests/life-path-funnel.test.cjs
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/pages/HomePage.jsx tests/life-path-funnel.test.cjs
git commit -m "Read calculator prefill on homepage"
```

---

### Task 4: Apply Prefill In Calculator

**Files:**
- Modify: `apps/web/src/components/CalculatorWithPreview.jsx`
- Modify: `tests/life-path-funnel.test.cjs`
- Existing guardrail: `tests/calculator-form-contract.test.cjs`

- [ ] **Step 1: Add failing calculator test**

Append this test to `tests/life-path-funnel.test.cjs`:

```js
test('calculator accepts route-state prefill and tracks Life Path-originated completion', () => {
  const source = read('apps/web/src/components/CalculatorWithPreview.jsx');

  assert.match(source, /prefill/);
  assert.match(source, /setPairPeople\(prefill\.people\)/);
  assert.match(source, /setRelationshipType\(prefill\.relationshipType\)/);
  assert.match(source, /life_path_full_match_completed/);
  assert.match(source, /prefill\.source === 'life_path_compatibility'/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/life-path-funnel.test.cjs
```

Expected: FAIL because `CalculatorWithPreview` does not accept or apply `prefill`.

- [ ] **Step 3: Add `prefill` prop**

In `apps/web/src/components/CalculatorWithPreview.jsx`, update the component signature:

```js
function CalculatorWithPreview({
  mode,
  setMode,
  source = 'homepage',
  title = 'Check compatibility',
  subtitle = 'Start with two people or compare a full group.',
  submitLabel = 'Check compatibility',
  defaultRelationshipType = 'love',
  showModeToggle = true,
  prefill = null,
}) {
```

- [ ] **Step 4: Apply pair prefill**

After the existing state declarations and before the `useEffect` that clears time/place when Exact Mode is off, add:

```js
  useEffect(() => {
    if (!prefill) return;

    setMode('pair');
    setRelationshipType(prefill.relationshipType);
    setPairPeople(prefill.people);
    setExactMode(false);

    trackEvent('calculator_prefilled', {
      source: prefill.source,
      mode: prefill.mode,
      relationship_type: prefill.relationshipType,
    });
  }, [prefill, setMode]);
```

- [ ] **Step 5: Track Life Path-originated full match completion**

Inside `submitCalculation`, after the existing `trackEvent('calculation_completed', ...)` call and before `const navigation = buildResultNavigation(data);`, add:

```js
      if (prefill?.source === 'life_path_compatibility') {
        trackEvent('life_path_full_match_completed', {
          source: prefill.source,
          mode: data.result.mode,
          relationship_type: data.result.relationshipType,
          score_band: Math.floor(
            (data.result.mode === 'group' ? data.result.groupScore : data.result.score) / 10,
          ) * 10,
        });
      }
```

- [ ] **Step 6: Run focused tests**

Run:

```bash
node --test tests/life-path-funnel.test.cjs tests/calculator-form-contract.test.cjs
```

Expected: PASS. The calculator form contract should still confirm native inputs use `defaultValue`.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/components/CalculatorWithPreview.jsx tests/life-path-funnel.test.cjs
git commit -m "Apply calculator prefill from tools"
```

---

### Task 5: Verify Funnel And Build

**Files:**
- No new files.

- [ ] **Step 1: Run focused funnel tests**

Run:

```bash
node --test tests/life-path-funnel.test.cjs tests/life-path-tool.test.cjs tests/calculator-form-contract.test.cjs tests/result-navigation.test.cjs
```

Expected: PASS.

- [ ] **Step 2: Run full test suite**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 3: Run lint**

Run:

```bash
npm run lint --prefix apps/web
```

Expected: PASS with no ESLint output beyond the script header.

- [ ] **Step 4: Run production build**

Run:

```bash
npm run build --prefix apps/web
```

Expected: PASS. The build should still pre-render `/tools/life-path-compatibility`.

- [ ] **Step 5: Manual browser verification**

Run the dev server:

```bash
npm run dev --prefix apps/web
```

Open:

```text
http://localhost:3000/tools/life-path-compatibility
```

Manual checks:

1. Enter two names and birth dates.
2. Submit the Life Path tool.
3. Confirm the result shows the new CTA card.
4. Click **Compare full birth-date match**.
5. Confirm the homepage opens at `/#calculator`.
6. Confirm both names and birth dates are already filled.
7. Confirm the URL does not contain names or birth dates.
8. Submit the full calculator.
9. Confirm the result page still shows **Get the detailed report · $9.99** when the result is persisted.

- [ ] **Step 6: Final commit if verification changes are needed**

If manual verification required fixes:

```bash
git add apps/web/src tests
git commit -m "Verify Life Path to report funnel"
```

If no fixes were needed, do not create an empty commit.

---

## Self-Review

- Spec coverage: The plan adds a Life Path result upsell, pre-fills the full calculator, keeps raw birth details out of URLs, tracks the funnel, and leaves the existing paid report checkout unchanged.
- Placeholder scan: No `TBD`, `TODO`, "similar to", or unspecified validation steps remain.
- Type consistency: `calculatorPrefill`, `buildCalculatorPrefill`, `normalizeCalculatorPrefill`, `prefill.source`, and analytics event names are consistent across tasks.
- Scope check: The plan only covers the Life Path-to-full-calculator monetization funnel. A `/tools` hub and additional tools should be planned separately after this funnel works.
