import React from 'react';
import { ArrowRight, LockKeyhole, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackEvent } from '@/lib/analytics.js';
import { setFunnelAttribution } from '@/lib/funnel-attribution.js';

function ShareCta({
  model,
  shareId,
  source,
  placement,
  title,
  body,
  primaryLabel = 'Try your own match',
  secondaryLabel = 'View sample report',
}) {
  const basePayload = {
    share_id: shareId || 'unknown',
    relationship_type: model.relationshipType,
    score: model.score,
    score_band: model.scoreBand,
    placement,
    source,
  };

  const trackPrimary = () => {
    setFunnelAttribution({
      source: 'share_page',
      placement,
      label: 'primary',
      text: primaryLabel,
      variant: model.scoreBand,
      share_id: shareId,
      score_band: model.scoreBand,
    });
    trackEvent('share_page_cta_click', {
      ...basePayload,
      cta_label: primaryLabel,
    });
  };

  const trackSecondary = () => {
    setFunnelAttribution({
      source: 'share_page',
      placement,
      label: 'secondary',
      text: secondaryLabel,
      variant: model.scoreBand,
      share_id: shareId,
      score_band: model.scoreBand,
    });
    trackEvent('share_page_sample_report_click', {
      ...basePayload,
      cta_label: secondaryLabel,
    });
  };

  return (
    <section className="rounded-3xl border border-primary/15 bg-primary/[0.035] p-5 text-center sm:p-6 md:p-8">
      <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground md:text-3xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
        {body}
      </p>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          to="/#calculator"
          onClick={trackPrimary}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {primaryLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>

        <Link
          to="/sample-report"
          onClick={trackSecondary}
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          {secondaryLabel}
        </Link>
      </div>
    </section>
  );
}

export default function SharedResultConversion({ model, shareId, source = 'direct' }) {
  return (
    <section className="mx-auto mt-6 w-full max-w-5xl space-y-6">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Shared result preview
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Strongest area
            </p>
            <h2 className="mt-2 text-xl font-semibold text-foreground">{model.strongestArea}</h2>
          </article>

          <article className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Watch area
            </p>
            <h2 className="mt-2 text-xl font-semibold text-foreground">{model.watchArea}</h2>
          </article>
        </div>

        <p className="mt-5 max-w-3xl text-base leading-7 text-foreground/90 md:text-lg md:leading-8">
          {model.previewInsight}
        </p>
      </div>

      <ShareCta
        model={model}
        shareId={shareId}
        source={source}
        placement="top"
        title={model.ctaTitle}
        body={model.ctaBody}
      />

      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          A small preview
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <p className="rounded-2xl bg-muted/35 p-4 text-sm leading-7 text-muted-foreground">
            {model.previewParagraphOne}
          </p>
          <p className="rounded-2xl bg-muted/35 p-4 text-sm leading-7 text-muted-foreground">
            {model.previewParagraphTwo}
          </p>
        </div>
      </div>

      <ShareCta
        model={model}
        shareId={shareId}
        source={source}
        placement="middle"
        title="Want to see your own result?"
        body="Run your own match to see the score, the strongest area, the watch area, and the private report path built from your details."
        primaryLabel="Start your match"
      />

      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <LockKeyhole className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-semibold text-foreground">Private-safe by design</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Birth dates are not shown on shared pages. Full readings are private and generated only for the people who request them.
            </p>
          </div>
        </div>
      </div>

      <ShareCta
        model={model}
        shareId={shareId}
        source={source}
        placement="bottom"
        title="Ready to try your own match?"
        body="See what flows, what may catch, and what is worth naming before the pattern repeats."
        primaryLabel="Try the comparison"
      />
    </section>
  );
}
