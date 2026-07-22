# MatchByBirth Synastry API Product Goal

## Goal
Build MatchByBirth into a real astrology calculation API with a consumer app on top — not just a website calculator.

The API should become valuable because it returns deterministic, evidence-backed astrology data that other apps, creators, coaches, tarot readers, dating products, and content tools can use.

---

## Product Thesis

Most astrology APIs either:

1. return raw chart data with weak interpretation, or
2. return generic horoscope text with poor transparency.

MatchByBirth can sit in the middle:

> Accurate chart and synastry calculations + clean relationship interpretation + evidence objects that explain exactly why the result says what it says.

This creates both:

- consumer revenue: paid reports;
- platform revenue: API access.

---

## The “Whole Shebang” API

### Core API capabilities

#### 1. Natal chart endpoint

`POST /api/v1/chart/natal`

Input:

```json
{
  "birthDate": "1994-08-12",
  "birthTime": "14:35",
  "place": {
    "placeId": "server-issued-place-id"
  },
  "zodiac": "tropical",
  "houseSystem": "whole-sign"
}
```

Output:

```json
{
  "precision": "timed",
  "zodiac": "tropical",
  "houseSystem": "whole-sign",
  "placements": {
    "Sun": { "longitude": 139.22, "sign": "Leo", "degree": 19.22, "house": 9 },
    "Moon": { "longitude": 42.91, "sign": "Taurus", "degree": 12.91, "house": 6 },
    "Venus": { "longitude": 181.14, "sign": "Libra", "degree": 1.14, "house": 11 }
  },
  "angles": {
    "Ascendant": { "longitude": 251.5, "sign": "Sagittarius", "degree": 11.5 },
    "Midheaven": { "longitude": 173.2, "sign": "Virgo", "degree": 23.2 }
  }
}
```

#### 2. Synastry endpoint

`POST /api/v1/chart/synastry`

Input:

```json
{
  "personA": { "birthDate": "1994-08-12", "birthTime": "14:35", "placeId": "..." },
  "personB": { "birthDate": "1992-02-03", "birthTime": "09:10", "placeId": "..." },
  "relationshipType": "love"
}
```

Output:

```json
{
  "precision": "full-synastry",
  "score": 84,
  "breakdown": {
    "emotional": 88,
    "communication": 74,
    "chemistry": 92,
    "stability": 69,
    "growth": 83,
    "friction": 34
  },
  "topSupportiveAspects": [
    {
      "aspect": "trine",
      "from": "A Moon",
      "to": "B Venus",
      "orb": 1.2,
      "strength": 0.86,
      "meaning": "Emotional warmth and affection are easy to exchange."
    }
  ],
  "topTensionAspects": [
    {
      "aspect": "square",
      "from": "A Mercury",
      "to": "B Saturn",
      "orb": 2.7,
      "strength": 0.68,
      "meaning": "Communication can become serious, delayed, or overly corrective."
    }
  ],
  "evidence": []
}
```

#### 3. Interpretation endpoint

`POST /api/v1/interpret/synastry`

Takes calculated synastry evidence and returns clean copy.

Important: this endpoint must not invent aspects. It only interprets supplied evidence.

#### 4. Report endpoint

`POST /api/v1/reports/synastry`

Returns a full structured report object suitable for:

- web rendering;
- PDF export;
- email delivery;
- partner integrations.

---

## API Value Metric

Charge by calculation unit.

Suggested unit names:

- `chart_credit`
- `synastry_credit`
- `report_credit`

Cost hierarchy:

| Operation | Credit cost |
|---|---:|
| Natal chart calculation | 1 |
| Synastry calculation | 3 |
| Full interpreted report | 10 |
| Chart wheel SVG/PDF | 2 |

---

## API Pricing Draft

### Free Developer

Price: `$0`

Includes:

- 100 chart credits/month
- 25 synastry credits/month
- sandbox/non-commercial use
- attribution required

Purpose: developer acquisition.

### Creator

Price: `$19/mo`

Includes:

- 2,000 chart credits/month
- 500 synastry credits/month
- basic interpretations
- no attribution

Target:

- astrology creators;
- tarot readers;
- coaches;
- small websites.

### Startup

Price: `$79/mo`

Includes:

- 15,000 chart credits/month
- 3,000 synastry credits/month
- full synastry interpretations
- webhook support
- commercial use

Target:

- dating apps;
- wellness apps;
- content tools;
- AI companion apps.

### Pro / Agency

Price: `$249/mo`

Includes:

- 75,000 chart credits/month
- 15,000 synastry credits/month
- white-label report rendering
- chart wheel exports
- priority support

Target:

- agencies;
- larger astrology businesses;
- app builders.

### Enterprise

Price: custom

Includes:

- high volume;
- SLA;
- custom interpretation style;
- dedicated deployment if needed.

---

## Consumer Pricing Draft

Keep the consumer product simple.

| Product | Price | Notes |
|---|---:|---|
| Basic compatibility | Free | Acquisition funnel |
| Detailed compatibility report | $9.99 | Current tier |
| Deep Synastry Report | $19.99 | Full planets/aspects |
| Deep Synastry + PDF/chart wheel | $24.99 | Premium bundle |
| Monthly premium | $9.99/mo | Weekly updates + saved reports + future transits |

---

## Technical Architecture

### Do not make Python subprocesses the production core

The current Python synastry route can remain as a prototype, but production should move to a JS/TS core under `shared/`.

Why:

- easier Vercel deployment;
- one language for tests and API;
- no process spawn overhead;
- easier to share with web build/test tooling;
- less deployment fragility.

### Recommended modules

```text
shared/astro/time.cjs
shared/astro/places.cjs
shared/astro/natal-chart.cjs
shared/astro/aspects.cjs
shared/astro/synastry-score.cjs
shared/astro/interpretation-rules.cjs
shared/astro/public-schema.cjs
```

### API route modules

```text
api/_lib/natal-chart.js
api/_lib/synastry.js
api/_lib/synastry-report.js
api/_lib/api-key-auth.js
api/_lib/api-rate-limit.js
api/_lib/api-usage-meter.js
```

### Database tables eventually needed

```text
api_keys
api_usage_events
api_credit_balances
api_customers
api_webhook_deliveries
```

Do not build all of these on day one. Start with private/internal API first, then externalize.

---

## Moat

The API is valuable if it has these qualities:

1. **Accurate calculations** — not LLM-generated astrology.
2. **Evidence-first outputs** — every interpretation cites aspects/placements.
3. **Multiple precision levels** — basic, partial, full timed.
4. **Good developer UX** — clean JSON, stable schemas, examples.
5. **Good human UX** — interpretation copy sounds useful, not generic.
6. **Commercial-ready privacy** — no raw birth data leakage by default.
7. **White-label potential** — partner apps can use it under their own brand.

---

## First Real API Milestone

Ship an internal endpoint first:

`POST /api/internal/synastry-preview`

Capabilities:

- validates two people;
- calculates Sun/Moon/Mercury/Venus/Mars;
- computes cross-chart aspects;
- returns top supportive/tension aspects;
- updates MatchByBirth result page and paid report.

Do not sell external API access until this is stable on your own traffic.

---

## Launch Sequence

### Step 1 — Internal engine

Build and use it inside MatchByBirth.

### Step 2 — Deep report

Sell Deep Synastry Report to consumers.

### Step 3 — API landing page

Create `/api` or `/developers` with docs and waitlist.

### Step 4 — Private beta

Invite 5-10 creators/app builders.

### Step 5 — Paid API plans

Open Creator and Startup plans.

---

## Immediate Next Build Task

Implement the “minimum real synastry” vertical slice:

1. `shared/astro/natal-chart.cjs`
2. `shared/astro/aspects.cjs`
3. `shared/astro/synastry-score.cjs`
4. Tests for Sun/Moon/Mercury/Venus/Mars placements
5. Tests for cross-chart aspects
6. Result payload includes top aspects
7. Paid report cites those aspects

This is the smallest version of the whole shebang that is actually worth money.
