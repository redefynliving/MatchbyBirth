import React from 'react';
import { Link2, Sparkles, Users } from 'lucide-react';

function PairRow({ pair, rank }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border/60 last:border-0">
      <div className="min-w-0">
        <span className="text-xs text-muted-foreground mr-3">{rank}.</span>
        <span className="font-medium text-foreground">
          {pair.personA.name} &amp; {pair.personB.name}
        </span>
        <p className="text-xs text-muted-foreground mt-1 ml-7">
          {pair.personA.sign} + {pair.personB.sign}
        </p>
      </div>
      <span className="font-semibold text-primary shrink-0">{pair.score}%</span>
    </div>
  );
}

function GroupCompatibilityResults({ result }) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in">
      <section className="bg-card border border-border rounded-3xl p-8 md:p-12 text-center shadow-lg">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-5">
          <Users className="w-6 h-6" />
        </div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
          Group Vibe
        </p>
        <div className="text-7xl md:text-8xl font-semibold tracking-tight text-foreground my-3">
          {result.groupScore}%
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
          {result.interpretation.label}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          {result.interpretation.explanation} Based on {result.pairs.length} unique connections.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <section className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Link2 className="w-4 h-4" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em]">Strongest Pair</h2>
          </div>
          <p className="text-lg font-semibold">
            {result.bestPair.personA.name} &amp; {result.bestPair.personB.name}
          </p>
          <p className="text-3xl font-semibold text-primary mt-2">{result.bestPair.score}%</p>
        </section>

        <section className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Sparkles className="w-4 h-4" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em]">Group Glue</h2>
          </div>
          <p className="text-lg font-semibold">{result.groupGlue.name}</p>
          <p className="text-3xl font-semibold text-primary mt-2">{result.groupGlue.average}%</p>
        </section>
      </div>

      <section className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-2">Every Connection</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Ranked from the most naturally aligned pairing to the connection that may need more intention.
        </p>
        {result.pairs.map((pair, index) => (
          <PairRow
            key={`${pair.personA.id}-${pair.personB.id}`}
            pair={pair}
            rank={index + 1}
          />
        ))}
      </section>
    </div>
  );
}

export default GroupCompatibilityResults;
