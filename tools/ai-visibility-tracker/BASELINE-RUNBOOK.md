# MatchByBirth AI-Visibility Baseline Runbook

This runbook governs capture of the pre-submission control month in:

`tools/ai-visibility-tracker/tracker-2026-08.csv`

The file is the **canonical control set**: 200 rows = 40 prompts × 5 AI systems.
Do not edit prompts, systems, the header, or any identifier column. Only the
result fields (`appears`, `placement`, `cited_or_linked`, `framework_wording`,
`competitors`, `incorrect_claims`, `notes`) and `system_version` are filled
during capture.

Run this baseline **before** submitting `sitemap.xml` to Google Search Console
and Bing Webmaster Tools. The filled file becomes the benchmark every future
month is compared against.

---

## 1. Order to run the 200 checks

The CSV is already sorted so you can work top-to-bottom. Recommended path to
minimize mental switching:

1. **Group by AI system**, then by prompt (all 40 prompts in ChatGPT, then all 40
   in Perplexity, then Google AI Overviews, then Gemini, then Copilot).
   - Easiest: open the CSV, filter/sort by `ai_system` column, work one system
     fully before moving to the next.
2. **Within each system**, run prompts in the CSV order (they are grouped by
   `intent_group`: brand_entity → methodology → product → relationship → pairing →
   comparison). Order within a system does not affect data quality — just be
   consistent and don't skip rows.
3. Fill the result columns **immediately** after observing each answer. Do not
   batch-remember; transcribe while the screen is in front of you.

Total: 5 systems × 40 prompts = **200 checks**.

---

## 2. Data-entry rubric (per row)

### `date`
- Format: `YYYY-MM-DD` (already prefilled as `2026-08-14` in the control file).
- If you run a check on a different day, keep the original baseline date
  (`2026-08-14`) for the control month — do not change it. The analyzer buckets
  by month (`YYYY-MM`), so all 200 rows must stay `2026-08` to remain one
  comparable control set.

### `system_version`
- Record the **exact model/version string shown** in the interface (e.g.
  `GPT-4o`, `Claude 3.5 Sonnet`, `Gemini 1.5 Pro`, or the visible build/date).
- If no version is visible, leave blank. Do not guess.

### `appears` — allowed values: `yes`, `no`, `unknown`
- `yes` — MatchByBirth is present anywhere in the response (cited, linked, named,
  or mentioned in prose).
- `no` — MatchByBirth does not appear at all.
- `unknown` — could not determine (e.g. response blocked, login wall, error).

### `placement` — allowed values
- `top/recommended` — MBB appears in a top/featured/recommended position (e.g.
  first cited source, featured snippet, "best of" list entry).
- `mentioned` — MBB named in prose but not as a linked/cited source.
- `cited-only` — MBB appears as a cited source/link without prominent placement.
- `not-present` — MBB does not appear (use together with `appears=no`).
- `unavailable` — answer could not be retrieved (login, block, error); use with
  `appears=unknown`.

### `cited_or_linked` — allowed values: `yes`, `no`, `unknown`
- `yes` — MBB is actually linked or formally cited (a clickable source/reference).
- `no` — MBB is named/mentioned but not linked or cited.
- `unknown` — not determinable (use with `appears=unknown`).

### `framework_wording`
- **Critical for `brand_entity` prompts** (the 10 "What is the MatchByBirth
  Compatibility Framework?"-style rows).
- Copy the **exact words** the AI used to describe the framework (e.g.
  "scores five dimensions: Overall Harmony, Emotional Support, Communication
  Flow, Physical Chemistry, and Conflict Risk").
- If the AI did not describe the framework, write `-` (hyphen).
- For non-brand_entity rows where not applicable, write `-`.

### `competitors`
- List competitors surfaced in the response, **semicolon-separated**
  (e.g. `Co-Star; The Pattern; Astro-Seek`).
- If none appeared, write `-`.
- If the field would contain a comma (rare), wrap the whole value in double
  quotes.

### `incorrect_claims`
- Note any **wrong or misleading claim** the AI made about MatchByBirth,
  compatibility method, pricing, or data handling that needs a page/FAQ/copy fix.
  Be specific (e.g. "claimed MBB stores birth dates permanently; it does not").
- If none, write `-`.

### `notes`
- Anything else worth recording: response was truncated, regional difference,
  ambiguous placement, follow-up needed. Keep short. Use `-` if nothing.

---

## 3. Collection rules (must follow)

1. **Copy the prompt exactly.** Paste the `prompt` column verbatim. Do **not**
   rephrase, add context, ask a follow-up, or vary the wording. The control set
   must be reproducible.
2. **Fresh session per query where possible.** Open a new/clear conversation
   before each prompt so prior context does not bias the answer. At minimum,
   start a new chat between systems.
3. **Do not click through, sign up, purchase, or interact** with MatchByBirth or
   any third-party service during collection. Observe the answer only; record
   what the AI surfaces. No account creation, no checkout, no email capture.
4. **Record the exact displayed model/version** in `system_version` for each
   system (see §2).
5. **Record the test date** — keep the baseline `date` (`2026-08-14`); the
   `system_version` + your own log captures when you actually ran it.
6. **One row = one observation.** Do not merge systems or prompts into a single
   row. Each of the 200 rows stays independent.

---

## 4. Completion checklist (verify before saving)

For **every** one of the 200 rows, confirm:
- [ ] `date` populated (stays `2026-08-14`)
- [ ] `system_version` recorded (or blank only if truly not shown)
- [ ] `appears` is one of `yes` / `no` / `unknown`
- [ ] `placement` is one of `top/recommended` / `mentioned` / `cited-only` /
      `not-present` / `unavailable`
- [ ] `cited_or_linked` is one of `yes` / `no` / `unknown`
- [ ] `framework_wording` filled for brand_entity rows (exact wording or `-`)
- [ ] `competitors` filled (`-` if none)
- [ ] `incorrect_claims` filled (`-` if none)
- [ ] `notes` filled (`-` if none)

Spot-check counts after entry:
- [ ] 200 data rows total
- [ ] 40 rows per system (ChatGPT, Perplexity, Google AI Overviews, Gemini,
      Copilot)
- [ ] 40 unique prompts, each appearing exactly once per system
- [ ] No row left with a blank `appears`, `placement`, or `cited_or_linked`

Then validate:
```
cd tools/ai-visibility-tracker
node analyze.mjs tracker-2026-08.csv
```
Expected: completion 100%, status no longer "INCOMPLETE BASELINE".

---

## 5. After the baseline

1. Deploy the SEO changes (already built): robots.txt AI-crawler allow,
   `/premium` Product+Offer schema, MatchByBirth Compatibility Framework entity,
   noindex hardening on `/result` `/report` `/report-success` `/admin/funnel`.
2. Submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools.
3. Next month, copy `tracker-template.csv` to `tracker-2026-09.csv`, fill it the
   same way, and compare:
   ```
   node analyze.mjs tracker-2026-08.csv tracker-2026-09.csv
   ```
4. Watch the **brand_entity** and **methodology** citation rates climb — that is
   the signal the framework + schema work is paying off.

---

## 6. Schema (do not alter)

`date, ai_system, system_version, prompt, intent_group, appears, placement,
cited_or_linked, framework_wording, competitors, incorrect_claims, notes`

12 columns, fixed order. The analyzer treats blank result fields as
**incomplete**, not "no", and suppresses performance rates until they are
populated.
