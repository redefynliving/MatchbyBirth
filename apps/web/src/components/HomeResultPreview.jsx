import React, { useMemo } from 'react';
import {
  FileHeart,
  MessageCircle,
  Share2,
  Sparkles,
} from 'lucide-react';

const SCORE_EXAMPLES = [
  { score: 87, label: 'Strong match', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { score: 74, label: 'Good compatibility', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
  { score: 61, label: 'Mixed signals', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  { score: 45, label: 'Challenging', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
];

function getScoreBand(score) {
  if (score >= 80) return SCORE_EXAMPLES[0];
  if (score >= 65) return SCORE_EXAMPLES[1];
  if (score >= 50) return SCORE_EXAMPLES[2];
  return SCORE_EXAMPLES[3];
}

function HomeResultPreview({ pairPeople, groupPeople, mode }) {
  const people = mode === 'pair' ? pairPeople : groupPeople;
  const filledPeople = people.filter((p) => p.name.trim() || p.birthDate);
  const hasInput = filledPeople.length >= 2;

  // Generate a deterministic but varied score preview based on names
  const preview = useMemo(() => {
    if (!hasInput) return null;
    const names = filledPeople.map((p) => p.name.trim() || p.birthDate).join('');
    let hash = 0;
    for (let i = 0; i < names.length; i++) {
      hash = ((hash << 5) - hash) + names.charCodeAt(i);
      hash |= 0;
    }
    const score = 40 + Math.abs(hash % 55);
    const band = getScoreBand(score);
    return { score, ...band };
  }, [hasInput, filledPeople]);

  const firstName = filledPeople[0]?.name || 'Person 1';
  const secondName = filledPeople[1]?.name || 'Person 2';

  return (
    <aside className="flex h-full flex-col border-t border-border bg-[linear-gradient(155deg,hsl(var(--secondary))_0%,hsl(335_45%_95%)_100%)] p-6 lg:border-l lg:border-t-0 lg:p-7">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary">
        {hasInput ? 'Your preview' : 'Example result'}
      </p>

      {hasInput && preview ? (
        <>
          <div className="mt-6 flex items-center gap-4">
            <div
              className={`grid h-20 w-20 shrink-0 place-items-center rounded-full border ${preview.border} ${preview.bg} shadow-sm`}
              role="img"
              aria-label={`Compatibility score: ${preview.score}%`}
            >
              <span className={`text-2xl font-semibold tracking-tight ${preview.color}`}>
                {preview.score}%
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{preview.label}</h3>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {firstName} &amp; {secondName}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-primary/15 bg-card/70 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MessageCircle className="h-4 w-4 text-primary" />
              What works well
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {preview.score >= 70
                ? 'You are likely to understand each other without much explaining.'
                : 'You bring different strengths that can complement each other.'}
            </p>
          </div>

          <div className="mt-3 rounded-2xl border border-border bg-card/70 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Where you differ
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {preview.score >= 70
                ? 'Handling disagreements may take more effort than expected.'
                : 'Some areas will need patience and intentional communication.'}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="mt-6 flex items-center gap-4">
            <div
              className="grid h-20 w-20 shrink-0 place-items-center rounded-full border border-primary/20 bg-primary/10 shadow-sm"
              role="img"
              aria-label="Example compatibility score"
            >
              <span className="text-2xl font-semibold tracking-tight text-primary">—</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Your result here</h3>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                Fill in the form to see a preview
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-primary/15 bg-card/70 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MessageCircle className="h-4 w-4 text-primary" />
              What works well
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Your strengths will appear here after you calculate.
            </p>
          </div>

          <div className="mt-3 rounded-2xl border border-border bg-card/70 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Where you differ
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Areas that need more effort will be highlighted here.
            </p>
          </div>
        </>
      )}

      <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
        <div className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary/15 bg-card/70 text-xs font-semibold text-primary">
          <Share2 className="h-3.5 w-3.5" />
          Share result
        </div>
        <div className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-foreground text-xs font-semibold text-background">
          <FileHeart className="h-3.5 w-3.5" />
          See report details
        </div>
      </div>
    </aside>
  );
}

export default HomeResultPreview;