# Match by Birth — Daily Blog Automation

Hooks a free, slop-gated, multi-vertical blog post into the **existing Sanity blog**
(`matchbybirth.com/blog`). Runs daily at 08:00 PT via GitHub Actions. No new domain,
no new site — it writes straight into the live `blogPost` dataset.

## What it publishes
A rotating pool across your real verticals (not just relationships):
- **Numerology** — life-path connection styles (1–7), master numbers, life-path vs zodiac, life path in friendships
- **Groups / family / workplace** — roommate compatibility, friend-group dynamics, teams
- **Seasonal 2026 astro** — Neptune→Aries, Saturn→Aries, Saturn☌Neptune, eclipses, Mercury/Venus/Jupiter retrogrades, etc. (sign-specific angles)
- **Learn / responsible-use** — exact mode vs sun sign, how to read a score responsibly, when NOT to use one

## Quality & legality
- Every post passes the project's existing `content-quality.mjs` slop gate (min 650 words, no generic phrases, required example + internal link, no weak intros).
- Dedup is enforced **against live Sanity slugs** — it will not recreate the 66 pair pages or your existing seasonal/life-path posts.
- Original phrasing only (no scraping). Entertainment-only disclaimer is already on the site.

## How it runs
1. `queue.mjs` picks the next topic (seasonal on its lead date, else earliest unpublished, deduped vs Sanity).
2. `editorial.mjs` drafts via a free LLM (Groq) or an original template fallback.
3. `run-daily.mjs` gates it, then `publish.mjs` writes it to Sanity.
4. `publish.mjs` triggers the Vercel deploy hook so the static site rebuilds and Google indexes it.

## Secrets (repo Settings → Secrets)
- `SANITY_PROJECT_ID` (default `4qj4p6px`), `SANITY_DATASET` (`production`), `SANITY_API_VERSION` (`2025-01-01`)
- `SANITY_API_TOKEN` — **write** token
- `LLM_API_URL` (`https://api.groq.com/openai/v1`), `LLM_API_KEY` (free Groq key), `LLM_MODEL` (`llama-3.3-70b-versatile`)
- `VERCEL_DEPLOY_HOOK` — from Vercel project → Deploy Hooks
- `BLOG_AUTO_PUBLISH` — `1` to auto-publish, `0` to leave as a raw draft for your weekly review

Without `LLM_API_KEY` it still runs using the template fallback (original, passes the gate).
Without `BLOG_AUTO_PUBLISH=1` posts land as raw drafts for review.

## Local test
```
node automation/run-daily.mjs   # needs the secrets exported in your shell
```
