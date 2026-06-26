import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Link2,
  Route,
  Sparkles,
} from 'lucide-react';
import { getVisibleGroupPairs } from '@/lib/result-presentation.js';

function PairRow({ pair, rank }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_5.5rem_2.5rem] items-center gap-3 rounded-xl bg-muted/35 px-3.5 py-3 text-sm sm:grid-cols-[minmax(0,1fr)_8rem_2.5rem]">
      <div className="min-w-0">
        <span className="mr-2 text-xs text-muted-foreground">{rank}.</span>
        <span className="font-medium text-foreground">
          {pair.personA.name} + {pair.personB.name}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(335_36%_65%))]"
          style={{ width: `${pair.score}%` }}
        />
      </div>
      <span className="text-right font-semibold text-primary">{pair.score}</span>
    </div>
  );
}

function GroupCompatibilityResults({ result }) {
  const [showAllPairs, setShowAllPairs] = useState(false);
  const visiblePairs = getVisibleGroupPairs(result.pairs, showAllPairs);
  const lowestPair = result.pairs[result.pairs.length - 1];
  const precision = result.precision || {
    mode: 'date-only',
    label: 'Date-only mode',
    exactCount: 0,
    totalCount: result.people.length,
    note: 'Sun signs used standard date-only zodiac ranges.',
  };

  return (
    <div className="animate-fade-in mx-auto w-full max-w-5xl space-y-4">
      <div className="grid gap-4 md:grid-cols-[0.72fr_1.28fr]">
        <section className="rounded-3xl bg-[linear-gradient(145deg,hsl(var(--primary)),hsl(270_35%_61%))] p-7 text-primary-foreground shadow-[0_20px_45px_rgba(118,80,168,0.23)]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/70">
            Group vibe
          </p>
          <div className="my-5 text-7xl font-semibold tracking-[-0.06em]">
            {result.groupScore}%
          </div>
          <h1 className="text-2xl font-semibold text-primary-foreground">
            {result.interpretation.label}
          </h1>
          <p className="mt-3 text-sm leading-6 text-primary-foreground/75">
            {result.interpretation.explanation}
          </p>
          <p className="mt-4 rounded-2xl bg-white/12 p-3 text-xs leading-5 text-primary-foreground/80">
            Exact Mode members: {precision.exactCount} of {precision.totalCount}. {precision.note}
          </p>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <h2 className="text-xl font-semibold">Your strongest connections</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {result.people.length} people · {result.pairs.length} unique connections
          </p>
          <div className="mt-5 space-y-2">
            {visiblePairs.map((pair, index) => (
              <PairRow
                key={`${pair.personA.id}-${pair.personB.id}`}
                pair={pair}
                rank={index + 1}
              />
            ))}
          </div>
          {result.pairs.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAllPairs((value) => !value)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-expanded={showAllPairs}
            >
              {showAllPairs ? (
                <>
                  Show strongest 3
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  View all {result.pairs.length} connections
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </section>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <article className="rounded-2xl border border-border bg-card p-5">
          <Link2 className="h-5 w-5 text-primary" />
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Group glue
          </p>
          <h2 className="mt-1 text-lg font-semibold">{result.groupGlue.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Connects with the group at an average of {result.groupGlue.average}%.
          </p>
        </article>

        <article className="rounded-2xl border border-border bg-card p-5">
          <Sparkles className="h-5 w-5 text-primary" />
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Best dynamic
          </p>
          <h2 className="mt-1 text-lg font-semibold">
            {result.bestPair.personA.name} + {result.bestPair.personB.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Highest-scoring pair at {result.bestPair.score}%.
          </p>
        </article>

        <article className="rounded-2xl border border-border bg-card p-5">
          <Route className="h-5 w-5 text-primary" />
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Lowest-scoring pair
          </p>
          <h2 className="mt-1 text-lg font-semibold">
            {lowestPair.personA.name} + {lowestPair.personB.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This pair has more differences to work through.
          </p>
        </article>
      </div>
    </div>
  );
}

export default GroupCompatibilityResults;
