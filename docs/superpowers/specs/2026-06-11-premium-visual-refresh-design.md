# Match by Birth Premium Visual Refresh

## Approved Direction

Preserve the existing Match by Birth personality: warm cream backgrounds, lavender accents, soft gradients, rounded white surfaces, Outfit typography, and approachable iconography. Reduce the amount of content competing for attention and give every screen one primary takeaway and one primary action.

The approved visual target is:

`/Users/alijahfox/Documents/Codex/2026-06-08/create-me-a-video-of-matchbybirth/.superpowers/brainstorm/64907-1781169254/content/current-vibe-simplified-content.html`

## Scope

### Homepage

- Replace the current headline with “Every connection has its own rhythm.”
- Keep the calculator above the fold.
- Present the pair/group switch inside the calculator surface.
- Add one compact example-result preview beside the pair form on desktop and below it on mobile.
- Keep only three short trust cues: speed, privacy, and pair/group support.
- Replace the long explanatory grid and seven-item homepage FAQ with a compact benefits section and three focused FAQ items.
- Expose the existing How It Works page in the main navigation.

### Calculator

- Preserve the existing calculation request, validation, analytics, and navigation behavior.
- Reduce visual nesting in pair mode.
- Use compact person rows on desktop while retaining stacked mobile fields.
- Keep group mode functional for 3–7 people with clearer row hierarchy.
- Keep the privacy statement visible near the primary action.

### Pair Result

- Lead with the compatibility score, interpretation, and a short explanation.
- Reduce five equally weighted breakdown bars into three scannable highlights:
  communication, emotional rhythm, and the lowest-scoring growth edge.
- Preserve private sharing, image download, email capture, and report purchase behavior.
- Make private sharing the first secondary action and the paid report the focused conversion action.

### Group Result

- Lead with group score and interpretation.
- Show the three strongest pair connections first.
- Keep all remaining connections available through an explicit expand/collapse control.
- Surface group glue, strongest pair, and the lowest pair as the three summary insights.
- Preserve private sharing and the 3–7-person calculation contract.

### Paid Report Modal

- Keep the existing Stripe checkout request and optional marketing consent.
- Shorten the introductory copy.
- Show three concrete inclusions: communication, strengths/friction, and next steps.
- Keep secure-payment and birth-date privacy language visible.

## Constraints

- No generated people, photography, zodiac illustration, or romance clichés.
- No database, API, Stripe, Supabase, report-generation, or persistence changes.
- No birth dates in result URLs or saved presentation data.
- Existing local edits in the original checkout must remain untouched.
- Desktop and 390px mobile layouts must remain readable and functional.

## Acceptance

- Existing automated tests continue to pass.
- New presentation helper tests pass after first failing against the old code.
- Lint and production build pass.
- Browser verification covers homepage, pair result, group result, sharing, report modal, and 390px mobile behavior.
- `design-qa.md` records a passed comparison against the approved mockup.

