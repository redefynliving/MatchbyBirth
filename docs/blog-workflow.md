# MatchByBirth Blog Workflow

This is the operating system for the blog.

## Goal
- Publish one strong post per day.
- Keep every post tailored to MatchByBirth.
- Never repeat a topic or angle.
- Show every draft to the user before publishing live.

## Source of truth
- `docs/blog-ledger.json` is the canonical queue.
- `apps/web/src/data/posts/index.js` is the canonical published archive.
- Before drafting anything, check both for slug and intent collisions.

## Status flow
planned -> drafted -> awaiting_approval -> approved -> scheduled -> published

## Approval gate
Nothing publishes until the user approves the full draft.

## Duplicate prevention rules
- No duplicate slugs.
- No duplicate topic angles inside the 30-day queue.
- No near-duplicate listicles that say the same thing in different words.
- If an angle already exists in the archive, use a new angle or skip it.

## Human-quality rules
- Premium, simple, intentional design.
- No filler, placeholders, or AI slop.
- Keep the tone grounded, specific, and useful.
- Make it feel written for MatchByBirth, not for a generic astrology blog.

## Daily operating loop
1. Pull the next planned item from the ledger.
2. Verify it does not collide with published content.
3. Draft the post in the site’s existing blog structure.
4. Show the draft to the user.
5. Revise if needed.
6. Only publish after explicit approval.
7. Mark the item as published in the archive.

## What to track
- slug
- title
- angle
- category
- primary keyword
- status
- publish date
- approval date
- notes

## What not to do
- Do not auto-publish.
- Do not recycle angles.
- Do not write generic astrology filler.
- Do not create placeholder intros or fake insight.
