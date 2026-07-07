import React from 'react';
import { Link } from 'react-router-dom';
import { trackEvent } from '@/lib/analytics.js';

export default function ReportCta({
  title,
  body,
  primaryLabel = 'Get your full private report',
  primaryTo = '/#calculator',
  secondaryLabel = 'Run your own match',
  secondaryTo = '/#calculator',
  compact = false,
  placement = 'sample',
}) {
  const trackClick = (label) => {
    trackEvent('sample_report_cta_clicked', {
      placement,
      label,
    });
  };

  return (
    <section
      className={`rounded-3xl border border-primary/15 bg-primary/[0.035] text-center ${
        compact ? 'p-5 md:p-6' : 'p-6 md:p-8'
      }`}
    >
      <h2 className={`${compact ? 'text-2xl' : 'text-3xl'} font-serif text-foreground`}>
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-xl text-muted-foreground leading-relaxed">
        {body}
      </p>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          to={primaryTo}
          onClick={() => trackClick('primary')}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground"
        >
          {primaryLabel}
        </Link>

        <Link
          to={secondaryTo}
          onClick={() => trackClick('secondary')}
          className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3 font-semibold text-foreground"
        >
          {secondaryLabel}
        </Link>
      </div>
    </section>
  );
}
