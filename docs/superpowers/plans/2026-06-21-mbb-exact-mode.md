# MBB Exact Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add MBB Exact Mode so Match by Birth can calculate a precise Sun sign from birth date, birth time, and birth place when users provide all three details, while keeping date-only mode available and privacy-safe.

**Architecture:** Keep the existing React/Vite calculator and `/api/calculate-result` flow. Add a backend exact-astrology layer that resolves a typed birth place into an IANA timezone, converts local birth time to UTC, calculates apparent solar longitude with `astronomia`, maps that longitude to a zodiac sign, and exposes sanitized precision metadata in the result. Date-only mode remains the fallback when time/place is incomplete.

**Tech Stack:** React, Vite, Node/Vercel functions, CommonJS shared modules, `astronomia` for solar longitude, `city-timezones` for city-to-timezone lookup, `luxon` for timezone-aware UTC conversion, Node test runner.

---

## Scope Check

This plan implements **Phase 1: MBB Exact Mode, exact Sun sign first**.

Do not implement user accuracy feedback in this plan. Accuracy feedback is a separate subsystem because it needs storage, aggregation rules, abuse protection, display copy, and privacy language. After this plan lands, create a second plan for feedback collection.

Do not implement Moon, Rising, Venus, Mars, full natal chart scoring, or paid advanced chart features in this plan. Those require a larger chart architecture and a separate design.

## File Structure

- Create `shared/exact-astrology.cjs`
  - Owns place search, place selection validation, local-time-to-UTC conversion, solar longitude calculation, longitude-to-sign mapping, and exact Sun sign result metadata.
  - Exposes deterministic functions that are easy to test without the React app.

- Modify `shared/compatibility.cjs`
  - Continues to own compatibility scoring.
  - Calls `resolvePersonAstrology(person)` from `shared/exact-astrology.cjs`.
  - Uses exact Sun sign when `birthDate`, `birthTime`, and selected birth place metadata are valid.
  - Keeps date-only sign fallback when optional details are incomplete.
  - Sanitizes raw birth date, time, and place out of public result payloads.

- Create `api/search-birth-places.js`
  - Provides a small GET API for place suggestions.
  - Returns sanitized choices: `id`, `label`, `city`, `province`, `country`, `iso2`, `timezone`, `lat`, `lng`.
  - Does not store anything.

- Modify `apps/web/src/components/CalculatorWithPreview.jsx`
  - Replaces free-text birth place with a low-friction place search/select UI.
  - Sends selected place metadata as `birthPlace` while keeping time/place optional.
  - Shows `MBB Exact Mode` readiness when a person has date + time + selected place.

- Modify `apps/web/src/components/ResultCard.jsx`
  - Shows whether the result used date-only mode or MBB Exact Mode.
  - Shows exact-sign copy without exposing raw birth details.

- Modify `apps/web/src/components/GroupCompatibilityResults.jsx`
  - Shows group-level exact-mode count, not raw details.

- Modify `apps/web/src/pages/HomePage.jsx`, `apps/web/src/pages/HowItWorksPage.jsx`, `apps/web/src/pages/AboutPage.jsx`, `apps/web/src/pages/PrivacyPolicyPage.jsx`, and `apps/web/src/pages/TermsOfServicePage.jsx`
  - Update public claims to say high-precision Sun sign calculation when date, time, and place are provided.
  - Keep disclaimers: compatibility is reflective entertainment, not relationship prediction.

- Modify `apps/web/package.json` or root `package.json`
  - Add runtime dependencies `city-timezones` and `luxon` at the root if the API/shared modules load from the repo root dependency tree.
  - Keep existing `astronomia` dependency.

- Create and modify tests:
  - `tests/exact-astrology.test.cjs`
  - `tests/place-search-api.test.cjs`
  - `tests/compatibility.test.cjs`
  - `tests/result-service.test.cjs`
  - `tests/visual-refresh.test.cjs`
  - `tests/trust-pages.test.cjs`
  - `tests/privacy-regression.test.cjs`

## Product Rules

- Date-only mode is still valid and fast.
- Exact Mode requires all of these fields for a person:
  - `birthDate`: `YYYY-MM-DD`
  - `birthTime`: `HH:MM`
  - `birthPlace`: selected place object with `label`, `timezone`, `lat`, and `lng`
- Free-text place is not enough for Exact Mode. Users must select a suggestion so the backend has a real timezone.
- For pair results:
  - If both people have exact details, the result precision label is `MBB Exact Mode`.
  - If one person has exact details and the other does not, the result precision label is `Mixed precision`.
  - If neither person has exact details, the result precision label is `Date-only mode`.
- For group results:
  - Each person can independently be exact or date-only.
  - Group UI reports how many members used Exact Mode.
- Public copy can say:
  - `MBB Exact Mode calculates high-precision Sun signs from birth date, time, and place.`
  - `More precise than date-only zodiac ranges for cusp birthdays.`
- Public copy must not say:
  - `MBB predicts relationship success.`
  - `MBB guarantees compatibility.`
  - `MBB is scientifically proven to measure relationships.`

## Task 1: Add Exact Astrology Core

**Files:**
- Create: `shared/exact-astrology.cjs`
- Test: `tests/exact-astrology.test.cjs`

- [ ] **Step 1: Write the failing exact astrology tests**

Create `tests/exact-astrology.test.cjs` with:

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateExactSunSign,
  findBirthPlaceMatches,
  getZodiacSignFromLongitude,
  hasExactBirthDetails,
  resolvePersonAstrology,
} = require('../shared/exact-astrology.cjs');

test('getZodiacSignFromLongitude maps solar longitude to tropical signs', () => {
  assert.equal(getZodiacSignFromLongitude(0), 'Aries');
  assert.equal(getZodiacSignFromLongitude(29.999), 'Aries');
  assert.equal(getZodiacSignFromLongitude(30), 'Taurus');
  assert.equal(getZodiacSignFromLongitude(359.999), 'Pisces');
  assert.equal(getZodiacSignFromLongitude(390), 'Taurus');
  assert.equal(getZodiacSignFromLongitude(-1), 'Pisces');
});

test('findBirthPlaceMatches returns sanitized city choices with timezone data', () => {
  const matches = findBirthPlaceMatches('Atlanta GA');

  assert.ok(matches.length > 0);
  assert.equal(matches[0].city, 'Atlanta');
  assert.equal(matches[0].timezone, 'America/New_York');
  assert.equal(typeof matches[0].lat, 'number');
  assert.equal(typeof matches[0].lng, 'number');
  assert.match(matches[0].label, /Atlanta/);
  assert.equal(Object.hasOwn(matches[0], 'pop'), false);
});

test('findBirthPlaceMatches returns no more than eight stable choices', () => {
  const matches = findBirthPlaceMatches('Springfield');

  assert.ok(matches.length > 0);
  assert.ok(matches.length <= 8);
  assert.equal(new Set(matches.map((match) => match.id)).size, matches.length);
});

test('hasExactBirthDetails requires date, time, and selected place metadata', () => {
  assert.equal(hasExactBirthDetails({
    birthDate: '1990-03-21',
    birthTime: '08:15',
    birthPlace: {
      label: 'Atlanta, Georgia, United States',
      timezone: 'America/New_York',
      lat: 33.749,
      lng: -84.388,
    },
  }), true);

  assert.equal(hasExactBirthDetails({
    birthDate: '1990-03-21',
    birthTime: '08:15',
    birthPlace: 'Atlanta, GA',
  }), false);

  assert.equal(hasExactBirthDetails({
    birthDate: '1990-03-21',
    birthTime: '',
    birthPlace: {
      label: 'Atlanta, Georgia, United States',
      timezone: 'America/New_York',
      lat: 33.749,
      lng: -84.388,
    },
  }), false);
});

test('calculateExactSunSign uses birth time and place to resolve a cusp birthday', () => {
  const beforeEquinox = calculateExactSunSign({
    birthDate: '2024-03-19',
    birthTime: '20:00',
    birthPlace: {
      label: 'Atlanta, Georgia, United States',
      timezone: 'America/New_York',
      lat: 33.749,
      lng: -84.388,
    },
  });
  const afterEquinox = calculateExactSunSign({
    birthDate: '2024-03-19',
    birthTime: '23:30',
    birthPlace: {
      label: 'Atlanta, Georgia, United States',
      timezone: 'America/New_York',
      lat: 33.749,
      lng: -84.388,
    },
  });

  assert.equal(beforeEquinox.sign, 'Pisces');
  assert.equal(afterEquinox.sign, 'Aries');
  assert.equal(beforeEquinox.calculationMode, 'exact-sun');
  assert.equal(afterEquinox.calculationMode, 'exact-sun');
  assert.ok(beforeEquinox.solarLongitude >= 359);
  assert.ok(afterEquinox.solarLongitude < 1);
});

test('resolvePersonAstrology falls back to date-only when exact details are incomplete', () => {
  const result = resolvePersonAstrology({
    birthDate: '2024-03-19',
    birthTime: '',
    birthPlace: '',
  });

  assert.equal(result.sign, 'Pisces');
  assert.equal(result.calculationMode, 'date-only');
  assert.equal(result.exact, false);
  assert.match(result.note, /Date-only/);
});
```

- [ ] **Step 2: Run the exact astrology test to verify it fails**

Run:

```bash
node --test tests/exact-astrology.test.cjs
```

Expected:

```text
FAIL tests/exact-astrology.test.cjs
Error: Cannot find module '../shared/exact-astrology.cjs'
```

- [ ] **Step 3: Install timezone/place dependencies**

Run:

```bash
NPM_CONFIG_CACHE=/private/tmp/matchbybirth-npm-cache npm install city-timezones luxon
```

Expected:

```text
added ... packages
```

If npm prints peer warnings, continue only if `npm test` still runs after implementation. Do not use `sudo` and do not repair `~/.npm` in this task.

- [ ] **Step 4: Create `shared/exact-astrology.cjs`**

Create `shared/exact-astrology.cjs`:

```js
'use strict';

const cityTimezones = require('city-timezones');
const { DateTime } = require('luxon');
const base = require('astronomia/base').default;
const julian = require('astronomia/julian').default;
const solar = require('astronomia/solar').default;

const SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

function normalizeLongitude(degrees) {
  const value = Number(degrees);
  if (!Number.isFinite(value)) {
    throw new Error('Solar longitude must be a finite number.');
  }
  return ((value % 360) + 360) % 360;
}

function getZodiacSignFromLongitude(degrees) {
  const normalized = normalizeLongitude(degrees);
  return SIGNS[Math.floor(normalized / 30)];
}

function sanitizePlaceMatch(match) {
  const province = match.province || match.exactProvince || '';
  const country = match.country || '';
  const city = match.city || match.city_ascii || '';
  const timezone = match.timezone || '';
  const lat = Number(match.lat);
  const lng = Number(match.lng);

  if (!city || !timezone || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  const region = [province, country].filter(Boolean).join(', ');
  const label = [city, region].filter(Boolean).join(', ');
  const id = [
    city,
    province,
    country,
    timezone,
    lat.toFixed(4),
    lng.toFixed(4),
  ].join('|').toLowerCase();

  return {
    id,
    label,
    city,
    province,
    country,
    iso2: match.iso2 || '',
    timezone,
    lat,
    lng,
  };
}

function findBirthPlaceMatches(searchText, limit = 8) {
  const query = String(searchText || '').trim();
  if (query.length < 2) return [];

  const matches = cityTimezones.findFromCityStateProvince(query);
  const seen = new Set();

  return matches
    .map(sanitizePlaceMatch)
    .filter(Boolean)
    .filter((match) => {
      if (seen.has(match.id)) return false;
      seen.add(match.id);
      return true;
    })
    .sort((left, right) => {
      const leftExact = left.city.toLowerCase() === query.toLowerCase() ? 0 : 1;
      const rightExact = right.city.toLowerCase() === query.toLowerCase() ? 0 : 1;
      if (leftExact !== rightExact) return leftExact - rightExact;
      return left.label.localeCompare(right.label);
    })
    .slice(0, limit);
}

function normalizeSelectedBirthPlace(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const label = String(value.label || '').trim().replace(/\s+/g, ' ').slice(0, 160);
  const timezone = String(value.timezone || '').trim();
  const lat = Number(value.lat);
  const lng = Number(value.lng);

  if (!label || !timezone || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  if (!DateTime.now().setZone(timezone).isValid) {
    return null;
  }

  return {
    label,
    timezone,
    lat,
    lng,
  };
}

function parseBirthDateParts(birthDate) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(birthDate || ''));
  if (!match) throw new Error('Enter a valid birth date.');
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function parseBirthTimeParts(birthTime) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(String(birthTime || '').trim());
  if (!match) throw new Error('Enter birth time as HH:MM.');
  return {
    hour: Number(match[1]),
    minute: Number(match[2]),
  };
}

function hasExactBirthDetails(person) {
  return Boolean(
    person?.birthDate &&
    person?.birthTime &&
    normalizeSelectedBirthPlace(person.birthPlace),
  );
}

function localBirthDateTimeToUtc(person) {
  const place = normalizeSelectedBirthPlace(person.birthPlace);
  if (!place) {
    throw new Error('Select a birth place from the list for Exact Mode.');
  }

  const { year, month, day } = parseBirthDateParts(person.birthDate);
  const { hour, minute } = parseBirthTimeParts(person.birthTime);
  const localTime = DateTime.fromObject(
    { year, month, day, hour, minute, second: 0, millisecond: 0 },
    { zone: place.timezone },
  );

  if (!localTime.isValid) {
    throw new Error(`Birth time could not be resolved for ${place.label}.`);
  }

  return {
    utcDate: localTime.toUTC().toJSDate(),
    isoUtc: localTime.toUTC().toISO(),
    timezone: place.timezone,
    place,
  };
}

function calculateSolarLongitude(utcDate) {
  const jde = julian.DateToJDE(utcDate);
  const longitudeRadians = solar.apparentLongitude(base.J2000Century(jde));
  return normalizeLongitude(longitudeRadians * 180 / Math.PI);
}

function calculateExactSunSign(person) {
  const { utcDate, isoUtc, timezone, place } = localBirthDateTimeToUtc(person);
  const solarLongitude = calculateSolarLongitude(utcDate);
  const sign = getZodiacSignFromLongitude(solarLongitude);

  return {
    sign,
    solarLongitude,
    calculationMode: 'exact-sun',
    exact: true,
    timezone,
    placeLabel: place.label,
    birthTimeUtc: isoUtc,
    note: 'MBB Exact Mode calculated this Sun sign from birth date, time, and place.',
  };
}

function getDateOnlyZodiacSign(birthDate) {
  const { month, day } = parseBirthDateParts(birthDate);

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
}

function resolvePersonAstrology(person) {
  if (hasExactBirthDetails(person)) {
    return calculateExactSunSign(person);
  }

  return {
    sign: getDateOnlyZodiacSign(person.birthDate),
    solarLongitude: null,
    calculationMode: 'date-only',
    exact: false,
    timezone: null,
    placeLabel: '',
    birthTimeUtc: '',
    note: 'Date-only mode uses standard zodiac date ranges. Add birth time and a selected birth place for MBB Exact Mode.',
  };
}

module.exports = {
  calculateExactSunSign,
  calculateSolarLongitude,
  findBirthPlaceMatches,
  getZodiacSignFromLongitude,
  hasExactBirthDetails,
  localBirthDateTimeToUtc,
  normalizeSelectedBirthPlace,
  resolvePersonAstrology,
};
```

- [ ] **Step 5: Run the exact astrology tests**

Run:

```bash
node --test tests/exact-astrology.test.cjs
```

Expected:

```text
tests 6
pass 6
fail 0
```

- [ ] **Step 6: Commit**

Run:

```bash
git add package.json package-lock.json shared/exact-astrology.cjs tests/exact-astrology.test.cjs
git commit -m "feat: add exact sun sign astrology core"
```

Expected:

```text
[codex/fix-calculator-api-load ...] feat: add exact sun sign astrology core
```

## Task 2: Wire Exact Mode Into Compatibility Results

**Files:**
- Modify: `shared/compatibility.cjs`
- Modify: `tests/compatibility.test.cjs`
- Modify: `tests/result-service.test.cjs`

- [ ] **Step 1: Add failing compatibility tests for exact-mode result payloads**

Append these tests to `tests/compatibility.test.cjs`:

```js
test('pair result uses MBB Exact Mode signs when both people provide exact birth details', () => {
  const result = calculatePairResult([
    {
      id: 'one',
      name: 'Before',
      birthDate: '2024-03-19',
      birthTime: '20:00',
      birthPlace: {
        label: 'Atlanta, Georgia, United States',
        timezone: 'America/New_York',
        lat: 33.749,
        lng: -84.388,
      },
    },
    {
      id: 'two',
      name: 'After',
      birthDate: '2024-03-19',
      birthTime: '23:30',
      birthPlace: {
        label: 'Atlanta, Georgia, United States',
        timezone: 'America/New_York',
        lat: 33.749,
        lng: -84.388,
      },
    },
  ], 'love');

  assert.equal(result.precision.mode, 'exact-sun');
  assert.equal(result.precision.label, 'MBB Exact Mode');
  assert.equal(result.people[0].sign, 'Pisces');
  assert.equal(result.people[1].sign, 'Aries');
  assert.equal(result.people[0].precision.level, 'exact-sun');
  assert.equal(result.people[0].precision.exact, true);
  assert.equal(result.people[0].precision.placeLabel, 'Atlanta, Georgia, United States');
  assert.equal(result.people[0].birthTime, undefined);
  assert.equal(result.people[0].birthPlace, undefined);
  assert.equal(JSON.stringify(result).includes('20:00'), false);
  assert.equal(JSON.stringify(result).includes('33.749'), false);
});

test('pair result reports mixed precision when only one person has exact birth details', () => {
  const result = calculatePairResult([
    {
      id: 'one',
      name: 'Exact',
      birthDate: '2024-03-19',
      birthTime: '23:30',
      birthPlace: {
        label: 'Atlanta, Georgia, United States',
        timezone: 'America/New_York',
        lat: 33.749,
        lng: -84.388,
      },
    },
    {
      id: 'two',
      name: 'Date Only',
      birthDate: '1992-09-23',
    },
  ], 'love');

  assert.equal(result.precision.mode, 'mixed');
  assert.equal(result.precision.label, 'Mixed precision');
  assert.equal(result.people[0].precision.level, 'exact-sun');
  assert.equal(result.people[1].precision.level, 'date-only');
});
```

Modify the existing group result test in `tests/compatibility.test.cjs` by adding exact details to one person and these assertions:

```js
  assert.equal(result.precision.mode, 'mixed');
  assert.equal(result.precision.exactCount, 1);
  assert.equal(result.people[0].precision.level, 'exact-sun');
```

- [ ] **Step 2: Add failing result-service sanitization assertions**

In `tests/result-service.test.cjs`, add exact details to the second person in the first test and add these assertions after the existing raw-data checks:

```js
  assert.equal(inserted.result_payload.precision.mode, 'mixed');
  assert.equal(inserted.result_payload.people[1].precision.level, 'exact-sun');
  assert.equal(JSON.stringify(inserted).includes('America/New_York'), false);
  assert.equal(JSON.stringify(inserted).includes('33.749'), false);
  assert.equal(JSON.stringify(inserted).includes('-84.388'), false);
```

- [ ] **Step 3: Run tests to verify they fail**

Run:

```bash
node --test tests/compatibility.test.cjs tests/result-service.test.cjs
```

Expected:

```text
FAIL
Expected values to be strictly equal:
actual: undefined
expected: 'exact-sun'
```

- [ ] **Step 4: Modify `shared/compatibility.cjs` imports and helpers**

At the top of `shared/compatibility.cjs`, add:

```js
const {
  normalizeSelectedBirthPlace,
  resolvePersonAstrology,
} = require('./exact-astrology.cjs');
```

Replace `normalizeBirthPlace` with:

```js
function normalizeBirthPlace(value) {
  const selectedPlace = normalizeSelectedBirthPlace(value);
  if (selectedPlace) return selectedPlace;

  const birthPlace = String(value || '').trim().replace(/\s+/g, ' ');
  if (birthPlace.length > 120) {
    throw new Error('Birth place must be 120 characters or fewer.');
  }
  return birthPlace;
}
```

Add this helper near `buildBirthPrecision`:

```js
function buildResultPrecision(sanitizedPeople) {
  const exactCount = sanitizedPeople.filter((person) => person.precision.exact).length;

  if (exactCount === sanitizedPeople.length) {
    return {
      mode: 'exact-sun',
      label: 'MBB Exact Mode',
      exactCount,
      totalCount: sanitizedPeople.length,
      note: 'Sun signs were calculated from birth date, time, and selected birth place.',
    };
  }

  if (exactCount > 0) {
    return {
      mode: 'mixed',
      label: 'Mixed precision',
      exactCount,
      totalCount: sanitizedPeople.length,
      note: 'Some Sun signs used MBB Exact Mode while others used date-only zodiac ranges.',
    };
  }

  return {
    mode: 'date-only',
    label: 'Date-only mode',
    exactCount,
    totalCount: sanitizedPeople.length,
    note: 'Sun signs used standard date-only zodiac ranges.',
  };
}
```

- [ ] **Step 5: Replace `buildBirthPrecision` and `sanitizePerson`**

Replace the existing `buildBirthPrecision` and `sanitizePerson` in `shared/compatibility.cjs` with:

```js
function buildBirthPrecision(person, astrology) {
  const hasBirthTime = Boolean(person.birthTime);
  const hasBirthPlace = Boolean(normalizeSelectedBirthPlace(person.birthPlace));
  const nearSignTransition = isNearSignTransition(person.birthDate);

  if (astrology.exact) {
    return {
      level: 'exact-sun',
      exact: true,
      hasBirthTime: true,
      hasBirthPlace: true,
      nearSignTransition,
      placeLabel: astrology.placeLabel,
      solarLongitude: Number(astrology.solarLongitude.toFixed(3)),
      note: astrology.note,
    };
  }

  let note = astrology.note;
  if (nearSignTransition && (!hasBirthTime || !hasBirthPlace)) {
    note = 'Near a zodiac transition. Add birth time and select a birth place for MBB Exact Mode.';
  }

  return {
    level: 'date-only',
    exact: false,
    hasBirthTime,
    hasBirthPlace,
    nearSignTransition,
    placeLabel: '',
    solarLongitude: null,
    note,
  };
}

function sanitizePerson(person) {
  const astrology = resolvePersonAstrology(person);
  return {
    id: person.id,
    name: person.name,
    sign: astrology.sign,
    element: getElement(astrology.sign),
    precision: buildBirthPrecision(person, astrology),
  };
}
```

- [ ] **Step 6: Add result-level precision to pair and group results**

In `calculatePairResult`, after `sanitizedPeople` is created, add:

```js
  const precision = buildResultPrecision(sanitizedPeople);
```

Then include `precision` in the returned object:

```js
    precision,
```

In `calculateGroupResult`, after `sanitizedPeople` is created, add:

```js
  const precision = buildResultPrecision(sanitizedPeople);
```

Then include `precision` in the returned object:

```js
    precision,
```

- [ ] **Step 7: Run compatibility and result-service tests**

Run:

```bash
node --test tests/compatibility.test.cjs tests/result-service.test.cjs
```

Expected:

```text
tests ...
pass ...
fail 0
```

- [ ] **Step 8: Commit**

Run:

```bash
git add shared/compatibility.cjs tests/compatibility.test.cjs tests/result-service.test.cjs
git commit -m "feat: use exact sun signs in compatibility results"
```

Expected:

```text
[codex/fix-calculator-api-load ...] feat: use exact sun signs in compatibility results
```

## Task 3: Add Place Search API

**Files:**
- Create: `api/search-birth-places.js`
- Test: `tests/place-search-api.test.cjs`

- [ ] **Step 1: Write failing API tests**

Create `tests/place-search-api.test.cjs`:

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const handler = require('../api/search-birth-places.js');

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(key, value) {
      this.headers[key] = value;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test('search-birth-places returns sanitized Atlanta suggestions', async () => {
  const req = { method: 'GET', query: { q: 'Atlanta GA' } };
  const res = createResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['Cache-Control'], 'public, max-age=86400, s-maxage=86400');
  assert.ok(Array.isArray(res.body.places));
  assert.ok(res.body.places.length > 0);
  assert.equal(res.body.places[0].city, 'Atlanta');
  assert.equal(res.body.places[0].timezone, 'America/New_York');
  assert.equal(Object.hasOwn(res.body.places[0], 'pop'), false);
});

test('search-birth-places rejects unsupported methods', async () => {
  const req = { method: 'POST', query: { q: 'Atlanta' } };
  const res = createResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 405);
  assert.match(res.body.error, /method/i);
});

test('search-birth-places requires at least two query characters', async () => {
  const req = { method: 'GET', query: { q: 'A' } };
  const res = createResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 400);
  assert.match(res.body.error, /at least 2/i);
});
```

- [ ] **Step 2: Run API tests to verify failure**

Run:

```bash
node --test tests/place-search-api.test.cjs
```

Expected:

```text
FAIL
Cannot find module '../api/search-birth-places.js'
```

- [ ] **Step 3: Create `api/search-birth-places.js`**

Create `api/search-birth-places.js`:

```js
'use strict';

const {
  findBirthPlaceMatches,
} = require('../shared/exact-astrology.cjs');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const query = String(req.query?.q || '').trim();
  if (query.length < 2) {
    return res.status(400).json({ error: 'Enter at least 2 characters to search birth places.' });
  }

  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
  return res.status(200).json({
    places: findBirthPlaceMatches(query),
  });
};
```

- [ ] **Step 4: Run API tests**

Run:

```bash
node --test tests/place-search-api.test.cjs
```

Expected:

```text
tests 3
pass 3
fail 0
```

- [ ] **Step 5: Commit**

Run:

```bash
git add api/search-birth-places.js tests/place-search-api.test.cjs
git commit -m "feat: add birth place search API"
```

Expected:

```text
[codex/fix-calculator-api-load ...] feat: add birth place search API
```

## Task 4: Upgrade Calculator UI to Select Real Birth Places

**Files:**
- Modify: `apps/web/src/components/CalculatorWithPreview.jsx`
- Test: `tests/visual-refresh.test.cjs`

- [ ] **Step 1: Add failing UI source tests**

Append this test to `tests/visual-refresh.test.cjs`:

```js
test('calculator uses selected birth places for MBB Exact Mode', () => {
  const calculatorPreview = fs.readFileSync(
    path.join(root, 'apps/web/src/components/CalculatorWithPreview.jsx'),
    'utf8',
  );

  assert.match(calculatorPreview, /searchBirthPlaces/);
  assert.match(calculatorPreview, /\/api\/search-birth-places/);
  assert.match(calculatorPreview, /selectedPlace/);
  assert.match(calculatorPreview, /MBB Exact Mode ready/);
  assert.match(calculatorPreview, /Select a city from the list/);
  assert.match(calculatorPreview, /birthPlace: null/);
});
```

- [ ] **Step 2: Run UI source tests to verify failure**

Run:

```bash
node --test tests/visual-refresh.test.cjs
```

Expected:

```text
FAIL
The input did not match the regular expression /searchBirthPlaces/
```

- [ ] **Step 3: Update person shape and add search helpers**

In `apps/web/src/components/CalculatorWithPreview.jsx`, change `createPerson` to:

```js
const createPerson = (id) => ({
  id,
  name: '',
  birthDate: '',
  birthTime: '',
  birthPlace: null,
  birthPlaceQuery: '',
  birthPlaceMatches: [],
  birthPlaceLoading: false,
  birthPlaceError: '',
});
```

Inside `CalculatorWithPreview`, add this helper after `updatePerson`:

```js
  const patchPerson = (id, patch) => {
    setPeople((prev) => prev.map(
      (person) => person.id === id ? { ...person, ...patch } : person,
    ));
  };

  const searchBirthPlaces = async (id, query) => {
    patchPerson(id, {
      birthPlaceQuery: query,
      birthPlace: null,
      birthPlaceError: '',
    });

    if (query.trim().length < 2) {
      patchPerson(id, {
        birthPlaceMatches: [],
        birthPlaceLoading: false,
      });
      return;
    }

    patchPerson(id, { birthPlaceLoading: true });

    try {
      const response = await fetch(`/api/search-birth-places?q=${encodeURIComponent(query)}`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to search places.');
      patchPerson(id, {
        birthPlaceMatches: Array.isArray(data.places) ? data.places : [],
        birthPlaceLoading: false,
      });
    } catch (placeError) {
      patchPerson(id, {
        birthPlaceMatches: [],
        birthPlaceLoading: false,
        birthPlaceError: placeError.message || 'Unable to search places.',
      });
    }
  };

  const selectBirthPlace = (id, place) => {
    patchPerson(id, {
      birthPlace: place,
      birthPlaceQuery: place.label,
      birthPlaceMatches: [],
      birthPlaceLoading: false,
      birthPlaceError: '',
    });
  };
```

- [ ] **Step 4: Add `BirthPlaceSearch` component in the same file**

Add this component above `OptionalBirthDetails`:

```jsx
function BirthPlaceSearch({ person, searchBirthPlaces, selectBirthPlace, idPrefix }) {
  const selectedPlace = person.birthPlace;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={`${idPrefix}-place-${person.id}`} className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" />
        Birth place
      </Label>
      <Input
        id={`${idPrefix}-place-${person.id}`}
        value={person.birthPlaceQuery}
        onChange={(event) => searchBirthPlaces(person.id, event.target.value)}
        placeholder="Search city, state, or country"
        maxLength={120}
        className="h-10 rounded-xl"
      />
      {person.birthPlaceLoading && (
        <p className="text-xs text-muted-foreground">Searching places...</p>
      )}
      {person.birthPlaceError && (
        <p className="text-xs text-destructive">{person.birthPlaceError}</p>
      )}
      {person.birthPlaceMatches.length > 0 && (
        <div className="max-h-44 overflow-auto rounded-xl border border-border bg-card shadow-sm">
          {person.birthPlaceMatches.map((place) => (
            <button
              key={place.id}
              type="button"
              onClick={() => selectBirthPlace(person.id, place)}
              className="block w-full px-3 py-2 text-left text-xs text-foreground hover:bg-secondary"
            >
              {place.label}
            </button>
          ))}
        </div>
      )}
      {person.birthPlaceQuery && !selectedPlace && !person.birthPlaceLoading && (
        <p className="text-xs text-muted-foreground">
          Select a city from the list to enable MBB Exact Mode.
        </p>
      )}
      {selectedPlace && (
        <p className="text-xs font-medium text-primary">
          Selected: {selectedPlace.label}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Update `OptionalBirthDetails` to use place search**

Change `OptionalBirthDetails` signature to:

```js
function OptionalBirthDetails({
  person,
  updatePerson,
  searchBirthPlaces,
  selectBirthPlace,
  idPrefix,
}) {
```

Inside it, replace the birth place `<Input>` block with:

```jsx
        <BirthPlaceSearch
          person={person}
          searchBirthPlaces={searchBirthPlaces}
          selectBirthPlace={selectBirthPlace}
          idPrefix={idPrefix}
        />
```

Add this readiness variable after `hasOptionalDetails`:

```js
  const exactModeReady = Boolean(person.birthDate && person.birthTime && person.birthPlace);
```

Change the helper paragraph to:

```jsx
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {exactModeReady
          ? 'MBB Exact Mode ready. This will calculate the Sun sign from birth date, time, and selected place.'
          : nearTransition
            ? 'Near a zodiac transition. Add time and select a city to enable MBB Exact Mode.'
            : 'Near a zodiac transition? Time/place can clarify sign context. Otherwise this is optional.'}
        {hasOptionalDetails ? ' Raw time/place are not stored in shared results.' : ''}
      </p>
```

- [ ] **Step 6: Pass search/select helpers into each optional section**

For both pair and group `OptionalBirthDetails` calls, pass:

```jsx
                    searchBirthPlaces={searchBirthPlaces}
                    selectBirthPlace={selectBirthPlace}
```

- [ ] **Step 7: Run UI source tests**

Run:

```bash
node --test tests/visual-refresh.test.cjs
```

Expected:

```text
tests ...
pass ...
fail 0
```

- [ ] **Step 8: Run a local browser smoke check**

Start the dev server if it is not already running:

```bash
npm run dev --prefix apps/web -- --host 127.0.0.1 --port 3000
```

Open `http://127.0.0.1:3000/`.

Manual expected result:

```text
The homepage shows "See how you match".
Each person has "Add birth time/place (optional)".
Typing "Atlanta GA" shows Atlanta suggestions.
Selecting Atlanta changes the helper to show selected place.
Adding birth time shows "MBB Exact Mode ready" for that person.
```

- [ ] **Step 9: Commit**

Run:

```bash
git add apps/web/src/components/CalculatorWithPreview.jsx tests/visual-refresh.test.cjs
git commit -m "feat: select birth places for exact mode"
```

Expected:

```text
[codex/fix-calculator-api-load ...] feat: select birth places for exact mode
```

## Task 5: Show Exact Mode in Results

**Files:**
- Modify: `apps/web/src/components/ResultCard.jsx`
- Modify: `apps/web/src/components/GroupCompatibilityResults.jsx`
- Test: `tests/visual-refresh.test.cjs`

- [ ] **Step 1: Add failing result UI source tests**

Append to `tests/visual-refresh.test.cjs`:

```js
test('results show MBB Exact Mode without raw birth details', () => {
  const resultCard = fs.readFileSync(
    path.join(root, 'apps/web/src/components/ResultCard.jsx'),
    'utf8',
  );
  const groupResult = fs.readFileSync(
    path.join(root, 'apps/web/src/components/GroupCompatibilityResults.jsx'),
    'utf8',
  );

  assert.match(resultCard, /precision\.label/);
  assert.match(resultCard, /MBB Exact Mode/);
  assert.match(resultCard, /exact Sun signs/);
  assert.match(groupResult, /result\.precision/);
  assert.match(groupResult, /Exact Mode members/);
  assert.doesNotMatch(resultCard, /birthTimeUtc/);
});
```

- [ ] **Step 2: Run UI tests to verify failure**

Run:

```bash
node --test tests/visual-refresh.test.cjs
```

Expected:

```text
FAIL
The input did not match the regular expression /precision\.label/
```

- [ ] **Step 3: Update `ResultCard` props and precision copy**

In `apps/web/src/components/ResultCard.jsx`, add `precision` to the prop list:

```js
  precision,
```

Add this block after the sign pills:

```jsx
            {precision && (
              <div className="mt-4 rounded-2xl border border-primary/15 bg-secondary/35 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                  {precision.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {precision.mode === 'exact-sun'
                    ? 'MBB Exact Mode used exact Sun signs calculated from birth date, time, and selected birth place.'
                    : precision.note}
                </p>
              </div>
            )}
```

- [ ] **Step 4: Pass precision from `ResultPage`**

In `apps/web/src/pages/ResultPage.jsx`, inside the `ResultCard` call, add:

```jsx
              precision={result.precision}
```

- [ ] **Step 5: Update `GroupCompatibilityResults` precision summary**

In `apps/web/src/components/GroupCompatibilityResults.jsx`, replace the current `precisionCount` helper with:

```js
  const precision = result.precision || {
    mode: 'date-only',
    label: 'Date-only mode',
    exactCount: 0,
    totalCount: result.people.length,
    note: 'Sun signs used standard date-only zodiac ranges.',
  };
```

Replace the current optional-details paragraph with:

```jsx
          <p className="mt-4 rounded-2xl bg-white/12 p-3 text-xs leading-5 text-primary-foreground/80">
            Exact Mode members: {precision.exactCount} of {precision.totalCount}. {precision.note}
          </p>
```

- [ ] **Step 6: Run result UI source tests**

Run:

```bash
node --test tests/visual-refresh.test.cjs
```

Expected:

```text
tests ...
pass ...
fail 0
```

- [ ] **Step 7: Commit**

Run:

```bash
git add apps/web/src/components/ResultCard.jsx apps/web/src/components/GroupCompatibilityResults.jsx apps/web/src/pages/ResultPage.jsx tests/visual-refresh.test.cjs
git commit -m "feat: show exact mode in results"
```

Expected:

```text
[codex/fix-calculator-api-load ...] feat: show exact mode in results
```

## Task 6: Update Trust, Methodology, Privacy, and Claim Copy

**Files:**
- Modify: `apps/web/src/pages/HomePage.jsx`
- Modify: `apps/web/src/pages/HowItWorksPage.jsx`
- Modify: `apps/web/src/pages/AboutPage.jsx`
- Modify: `apps/web/src/pages/PrivacyPolicyPage.jsx`
- Modify: `apps/web/src/pages/TermsOfServicePage.jsx`
- Test: `tests/trust-pages.test.cjs`
- Test: `tests/privacy-regression.test.cjs`
- Test: `tests/visual-refresh.test.cjs`

- [ ] **Step 1: Add failing copy tests**

In `tests/trust-pages.test.cjs`, add to the existing methodology test:

```js
  assert.match(source, /MBB Exact Mode/i);
  assert.match(source, /high-precision Sun sign/i);
  assert.match(source, /birth date, time, and selected birth place/i);
  assert.doesNotMatch(source, /predicts relationship success/i);
```

In `tests/privacy-regression.test.cjs`, add to the privacy page test:

```js
  assert.match(privacySource, /selected birth place/i);
  assert.match(privacySource, /timezone/i);
  assert.match(privacySource, /Raw birth dates, times, places, coordinates, and timezones are not stored/);
```

In `tests/visual-refresh.test.cjs`, add to the homepage hierarchy test:

```js
  assert.match(homePage, /MBB Exact Mode/);
  assert.match(homePage, /high-precision Sun sign/);
```

- [ ] **Step 2: Run copy tests to verify failure**

Run:

```bash
node --test tests/trust-pages.test.cjs tests/privacy-regression.test.cjs tests/visual-refresh.test.cjs
```

Expected:

```text
FAIL
The input did not match the regular expression /MBB Exact Mode/
```

- [ ] **Step 3: Update homepage copy**

In `apps/web/src/pages/HomePage.jsx`, update the “Date-first matching” card body to:

```jsx
                  Start with the birth date. Add birth time and select a birth place to unlock MBB Exact Mode, which calculates a high-precision Sun sign for cusp birthdays.
```

Update the FAQ answer for exact birth time to:

```jsx
                  No. Date-only mode works with calendar birth dates. Birth time and selected birth place unlock MBB Exact Mode for a high-precision Sun sign calculation.
```

- [ ] **Step 4: Update methodology copy**

In `apps/web/src/pages/HowItWorksPage.jsx`, update the input row labels and descriptions to include:

```js
  ['Selected birth place', 'Used with birth time to resolve timezone and calculate a high-precision Sun sign in MBB Exact Mode.'],
```

Update the “What Match by Birth uses” paragraph to:

```jsx
                The calculator starts with information most people know and can enter quickly. Date-only mode does not require exact birth time or birth location. MBB Exact Mode uses birth date, time, and selected birth place to calculate a high-precision Sun sign, which is especially useful near zodiac sign transitions.
```

Update the “What Match by Birth does not claim” paragraph to include:

```jsx
                Match by Birth does not claim to prove love, predict relationship success, measure loyalty, or decide whether a relationship should continue.
```

- [ ] **Step 5: Update about page copy**

In `apps/web/src/pages/AboutPage.jsx`, update the “What this tool does” paragraph to:

```jsx
                  The calculator uses birth-date patterns to create a compatibility score and written explanation. MBB Exact Mode can calculate a high-precision Sun sign when birth date, birth time, and selected birth place are provided. Pair mode compares two people. Group mode compares every unique pair in a group of 3 to 7 people and summarizes the overall group pattern.
```

- [ ] **Step 6: Update privacy policy copy**

In `apps/web/src/pages/PrivacyPolicyPage.jsx`, update the top callout to:

```jsx
                Birth dates, optional birth time, and selected birth place are processed to calculate your result. Raw birth dates, times, places, coordinates, and timezones are not stored in our database or included in new share links.
```

Update the “Information You Provide” paragraph to:

```jsx
              The free calculator receives display names or aliases, birth dates, optional birth time, and selected birth place details if you choose to add them. Selected birth place details include a city label, timezone, latitude, and longitude so MBB Exact Mode can calculate a high-precision Sun sign. If you purchase a report or opt into updates, we also receive your email address. Payment card information is collected directly by Stripe and is not handled by Match by Birth.
```

Update the “Calculator Processing and Saved Results” paragraph to:

```jsx
              Names and birth details are transmitted securely to our calculation endpoint. Birth dates, optional times, selected places, coordinates, and timezones are used transiently to determine signs, scores, and precision context, then discarded. We store a sanitized result containing display names, signs, scores, interpretations, precision labels, and an opaque sharing identifier.
```

- [ ] **Step 7: Update terms copy**

In `apps/web/src/pages/TermsOfServicePage.jsx`, update the sharing paragraph to:

```jsx
              Shared results use an opaque link that displays the sanitized names, signs, scores, precision labels, and interpretations associated with that result. Birth dates, birth times, birth places, coordinates, and timezones are not included in new sharing URLs. Anyone with the link can view the result, so you are responsible for sharing it appropriately.
```

- [ ] **Step 8: Run copy tests**

Run:

```bash
node --test tests/trust-pages.test.cjs tests/privacy-regression.test.cjs tests/visual-refresh.test.cjs
```

Expected:

```text
tests ...
pass ...
fail 0
```

- [ ] **Step 9: Commit**

Run:

```bash
git add apps/web/src/pages/HomePage.jsx apps/web/src/pages/HowItWorksPage.jsx apps/web/src/pages/AboutPage.jsx apps/web/src/pages/PrivacyPolicyPage.jsx apps/web/src/pages/TermsOfServicePage.jsx tests/trust-pages.test.cjs tests/privacy-regression.test.cjs tests/visual-refresh.test.cjs
git commit -m "docs: clarify exact mode accuracy claims"
```

Expected:

```text
[codex/fix-calculator-api-load ...] docs: clarify exact mode accuracy claims
```

## Task 7: End-to-End Verification

**Files:**
- No source files expected unless verification reveals a bug.

- [ ] **Step 1: Run exact-mode focused tests**

Run:

```bash
node --test tests/exact-astrology.test.cjs tests/place-search-api.test.cjs tests/compatibility.test.cjs tests/result-service.test.cjs tests/visual-refresh.test.cjs tests/trust-pages.test.cjs tests/privacy-regression.test.cjs
```

Expected:

```text
fail 0
```

- [ ] **Step 2: Run full test suite**

Run:

```bash
npm test
```

Expected:

```text
fail 0
```

- [ ] **Step 3: Run production build**

Run:

```bash
npm run build --prefix apps/web
```

Expected:

```text
✓ built
Prerendered 89 blog HTML files
```

- [ ] **Step 4: Start local dev server**

Run:

```bash
npm run dev --prefix apps/web -- --host 127.0.0.1 --port 3000
```

Expected:

```text
Local:   http://127.0.0.1:3000/
```

- [ ] **Step 5: Manual browser verification**

Open `http://127.0.0.1:3000/` and verify:

```text
1. Pair mode loads with name and birth date required.
2. Optional birth time/place section opens.
3. Searching "Atlanta GA" returns selectable city results.
4. Selecting Atlanta and adding time shows Exact Mode readiness.
5. Submitting two exact-mode people reaches the result page.
6. Result page shows "MBB Exact Mode".
7. Result page does not show raw birth date, raw birth time, coordinates, or timezone.
8. Date-only submissions still work.
9. Group mode still accepts 3 to 7 people.
```

- [ ] **Step 6: Inspect generated production files for raw detail leaks**

Run:

```bash
rg -n "birthTimeUtc|America/New_York|33\\.749|-84\\.388|1990-03-21|20:00" dist apps/web/public api shared tests
```

Expected:

```text
Matches are allowed only in tests or source code, not in generated public result payloads.
```

If generated public files include a real user-style raw detail, remove the leak and rerun this task.

- [ ] **Step 7: Commit verification fixes only if needed**

If Task 7 reveals and fixes a bug, run:

```bash
git add <fixed-files>
git commit -m "fix: harden exact mode verification"
```

Expected:

```text
[codex/fix-calculator-api-load ...] fix: harden exact mode verification
```

If Task 7 does not require code changes, do not create an empty commit.

## Self-Review

Spec coverage:
- Exact Sun sign calculation is covered by Task 1.
- Place search and selected-place requirement are covered by Tasks 1, 3, and 4.
- Compatibility result integration is covered by Task 2.
- UI display of exact mode is covered by Tasks 4 and 5.
- Trust/privacy/legal copy is covered by Task 6.
- End-to-end verification is covered by Task 7.

Placeholder scan:
- This plan avoids prohibited placeholder phrases and generic validation-only steps.
- Every code-changing step includes concrete code.

Type consistency:
- Person input uses `birthPlace` as either `null`, a selected place object, or legacy string.
- Sanitized public result uses `precision.level`, `precision.exact`, `precision.placeLabel`, and result-level `precision.mode`.
- Exact-mode result-level mode is consistently `exact-sun`.
- Mixed precision result-level mode is consistently `mixed`.

Known constraint:
- This plan makes the Sun sign accurate from birth time/place. It does not claim accurate relationship prediction and does not implement full natal charts.
