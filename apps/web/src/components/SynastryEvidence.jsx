import React from 'react';
import { Orbit, ShieldCheck, TriangleAlert } from 'lucide-react';

const CATEGORY_LABELS = {
  emotional: 'emotional rhythm',
  communication: 'communication',
  chemistry: 'chemistry',
  stability: 'stability',
  growth: 'growth',
};

function formatAspectLabel(aspect) {
  if (!aspect) return '';
  const firstBody = aspect.from?.body || 'Placement';
  const secondBody = aspect.to?.body || 'placement';
  const aspectName = String(aspect.aspect || 'aspect').toLowerCase();
  const orb = Number(aspect.orb);
  const orbLabel = Number.isFinite(orb) ? ` · ${orb.toFixed(1)}° orb` : '';
  return `${firstBody} ${aspectName} ${secondBody}${orbLabel}`;
}

function getAspectContext(aspect, tone) {
  const categories = Array.isArray(aspect?.categoryHints)
    ? aspect.categoryHints.map((category) => CATEGORY_LABELS[category]).filter(Boolean)
    : [];
  const focus = categories.slice(0, 2).join(' and ') || 'the relationship pattern';
  return tone === 'supportive'
    ? `A supportive signal for ${focus}.`
    : `A point to handle more deliberately around ${focus}.`;
}

function AspectList({ title, description, aspects, tone }) {
  if (!Array.isArray(aspects) || aspects.length === 0) return null;
  const Icon = tone === 'supportive' ? ShieldCheck : TriangleAlert;

  return (
    <div>
      <div className="flex items-start gap-3">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${tone === 'supportive' ? 'bg-primary/10 text-primary' : 'bg-amber-50 text-amber-700'}`}>
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-4 divide-y divide-border border-y border-border">
        {aspects.map((aspect) => (
          <div key={aspect.id} className="py-3">
            <p className="text-sm font-semibold capitalize text-foreground">{formatAspectLabel(aspect)}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{getAspectContext(aspect, tone)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const SCORE_LABELS = {
  chemistry: 'Chemistry',
  communication: 'Communication',
  stability: 'Stability',
  growth: 'Growth',
  intuition: 'Intuition',
};

function signedDelta(value) {
  const delta = Number(value || 0);
  return delta > 0 ? `+${delta}` : String(delta);
}

function SynastryEvidence({ synastry, precisionComparison = null }) {
  const supportive = Array.isArray(synastry?.topSupportiveAspects)
    ? synastry.topSupportiveAspects.slice(0, 3)
    : [];
  const tension = Array.isArray(synastry?.topTensionAspects)
    ? synastry.topTensionAspects.slice(0, 2)
    : [];
  const aspectCount = Array.isArray(synastry?.aspects) ? synastry.aspects.length : 0;

  return (
    <section className="border-b border-border bg-muted/20 px-5 py-7 sm:px-8 md:px-10 md:py-9">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <Orbit className="h-4 w-4" />
            Full timed synastry
          </p>
          <h2 className="mt-2 text-2xl font-semibold">The aspects behind this score</h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">
          Based on both birth times and places. {aspectCount} cross-chart aspects were measured; these are the clearest signals.
        </p>
      </div>

      <div className="mt-7 grid gap-8 lg:grid-cols-2 lg:gap-10">
        <AspectList
          title="Supportive aspects"
          description="The strongest easier-flowing contacts in this chart comparison."
          aspects={supportive}
          tone="supportive"
        />
        <AspectList
          title="Tension aspects"
          description="The strongest contacts that may need more awareness or translation."
          aspects={tension}
          tone="tension"
        />
      </div>

      {precisionComparison && (
        <div className="mt-7 rounded-2xl border border-primary/15 bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">What Exact Mode changed</p>
          <p className="mt-2 text-sm leading-6 text-foreground">
            The date-only baseline was {precisionComparison.dateOnlyScore}. Birth times, selected places, and measured cross-chart aspects produced an exact score of {precisionComparison.exactScore} ({signedDelta(precisionComparison.delta)} overall).
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {precisionComparison.categoryDeltas.map((item) => (
              <span key={item.key} className="rounded-full border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                {SCORE_LABELS[item.key] || item.key}: {item.dateOnly} to {item.exact} ({signedDelta(item.delta)})
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="mt-6 text-xs leading-5 text-muted-foreground">
        Aspect labels and orbs are calculated from the submitted birth data. Interpretations are reflective, not predictive.
      </p>
    </section>
  );
}

export default SynastryEvidence;
