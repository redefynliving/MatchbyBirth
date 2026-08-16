# MatchByBirth AI-Visibility Tracker

Run this **before** submitting the sitemap to Google Search Console and Bing
Webmaster Tools. It establishes a baseline so you can later tell whether the
MatchByBirth Compatibility Framework, the pricing Product schema, and the
static crawler-visible copy actually move inclusion or citations.

The baseline prompt library here (40 prompts × 5 AI systems = 200 rows) was
authored as `AI Visibility Baseline 2026.csv` and is the canonical starting set.
Do not change the prompts without recording why — they are the control.

## Files

- `queries.csv` — the master prompt library derived from the real baseline
  (40 prompts across 6 intent groups). Reference only; `tracker-*.csv` is what
  you fill.
- `tracker-2026-08.csv` — the pre-submission baseline, copied verbatim from
  `AI Visibility Baseline 2026.csv`. Result columns are blank; fill this month,
  then compare future months against it.
- `tracker-template.csv` — empty logging schema matching the real columns, for
  copying to `tracker-YYYY-MM.csv` each subsequent month.
- `analyze.mjs` — reads one or more monthly CSVs and prints appearance/citation
  rates, framework-mention rate, competitor frequency, incorrect-claim log, and
  month-over-month delta.
- `README.md` — this file.

## Monthly process

1. Copy `tracker-template.csv` to `tracker-YYYY-MM.csv` (e.g. `tracker-2026-09.csv`).
   Keep the `date` in `YYYY-MM-DD` form (the analyzer buckets by `YYYY-MM`).
2. For every row, open the exact prompt in the named AI system and record:
   - `appears` — does MatchByBirth show up at all? (yes/no)
   - `placement` — cited source #, mentioned in prose, featured snippet, or absent
   - `cited_or_linked` — is MBB actually linked or cited? (yes/no)
   - `framework_wording` — the exact words the AI used for the framework
     (critical for the brand_entity group; use `-` if not applicable)
   - `competitors` — which competitors surfaced (semicolon-separated)
   - `incorrect_claims` — any wrong claim that needs a page/FAQ/copy fix (`-` if none)
   - `system_version` — optional, note the model/version if known
3. Run: `node analyze.mjs tracker-2026-08.csv tracker-2026-09.csv`
4. Log the summary in your monthly report. After GSC/Bing submission, a rising
   citation rate on the brand_entity and methodology groups is the signal the
   framework + schema are working.

## Column reference (exact match to baseline CSV)

| Column | Meaning |
|---|---|
| date | YYYY-MM-DD |
| ai_system | ChatGPT / Perplexity / Google AI Overviews / Gemini / Microsoft Copilot |
| system_version | optional model/version string |
| prompt | exact query text |
| intent_group | brand_entity / methodology / product / relationship / pairing / comparison |
| appears | yes/no |
| placement | e.g. "cited source #2", "prose mention", "absent" |
| cited_or_linked | yes/no |
| framework_wording | exact wording used for the framework, or `-` |
| competitors | semicolon-separated list |
| incorrect_claims | claim needing a fix, or `-` |
| notes | anything else worth recording |

## When to submit the sitemap

After you have captured the **first** baseline month (this file, filled). Then
submit `sitemap.xml` in GSC and Bing WMT and continue monthly. The baseline is
your control; later months show whether the work moved the needle.

## Caveats

- AI systems change answers over time and by account; treat single-month numbers
  as directional, not absolute.
- This measures *visibility*, not revenue. Pair it with the funnel metrics
  (organic visit → calculator start → result → email → paid conversion).
- CSV `competitors`/`notes` fields may contain commas — wrap them in double quotes.
