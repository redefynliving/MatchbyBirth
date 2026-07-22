import React from 'react';
import { ArrowRight, LockKeyhole } from 'lucide-react';
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
    <section className="text-left">
      <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
        {title}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
        {body}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
    <section className="mx-auto mt-6 grid w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-card shadow-sm lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="p-5 sm:p-7 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Shared result preview</p>
        <div className={`mt-5 grid gap-5 ${model.topAspect ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
          <div className="border-l-2 border-primary pl-4">
            <p className="text-xs font-semibold text-muted-foreground">Strongest area</p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">{model.strongestArea}</h2>
          </div>
          <div className="border-l-2 border-border pl-4">
            <p className="text-xs font-semibold text-muted-foreground">Watch area</p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">{model.watchArea}</h2>
          </div>
          {model.topAspect && (
            <div className="border-l-2 border-primary/50 pl-4">
              <p className="text-xs font-semibold text-muted-foreground">Leading timed aspect</p>
              <h2 className="mt-1 text-lg font-semibold capitalize text-foreground">{model.topAspect}</h2>
            </div>
          )}
        </div>
        <p className="mt-6 max-w-3xl text-base leading-7 text-foreground/90 md:text-lg md:leading-8">
          {model.previewInsight}
        </p>
        <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          Birth dates are not shown on shared pages.
        </p>
      </div>

      <div className="border-t border-border bg-muted/25 p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-8">
        <ShareCta
          model={model}
          shareId={shareId}
          source={source}
          placement="shared_result"
          title={model.ctaTitle}
          body={model.ctaBody}
        />
      </div>
    </section>
  );
}
