import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const METRICS = [
  ['share_page_view', 'Share views'],
  ['share_page_cta_click', 'CTA clicks'],
  ['share_page_sample_report_click', 'Sample clicks'],
  ['calculation_started_from_share', 'Calculator starts'],
  ['checkout_started_from_share', 'Checkout starts'],
  ['purchase_completed', 'Purchases'],
];

const BAND_LABELS = {
  strong_natural_rhythm: 'Strong natural rhythm',
  good_compatibility: 'Good compatibility',
  mixed_rhythm: 'Mixed rhythm',
  different_rhythms: 'Different rhythms',
  unknown: 'Unknown',
};

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1).replace('.0', '')}%`;
}

function MetricCard({ label, value }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-foreground">
        {value || 0}
      </p>
    </article>
  );
}

function RateCard({ label, value }) {
  return (
    <article className="rounded-2xl border border-primary/15 bg-primary/[0.035] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
        {formatPercent(value)}
      </p>
    </article>
  );
}

export default function FunnelDashboardPage() {
  const [token, setToken] = useState(() => {
    try {
      return window.localStorage.getItem('matchbybirth:funnel-token') || '';
    } catch {
      return '';
    }
  });
  const [weeks, setWeeks] = useState(4);
  const [status, setStatus] = useState('idle');
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  const sortedBands = useMemo(() => (
    Object.entries(summary?.scoreBands || {})
      .sort((left, right) => right[1].share_page_view - left[1].share_page_view)
  ), [summary]);

  async function loadSummary() {
    setStatus('loading');
    setError('');

    try {
      if (token) window.localStorage.setItem('matchbybirth:funnel-token', token);
      const response = await fetch(`/api/funnel-summary?weeks=${weeks}`, {
        headers: token ? { 'x-funnel-token': token } : {},
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to load funnel summary.');
      setSummary(data);
      setStatus('ready');
    } catch (loadError) {
      setStatus('error');
      setError(loadError.message || 'Unable to load funnel summary.');
    }
  }

  useEffect(() => {
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeks]);

  return (
    <>
      <Helmet>
        <title>Weekly Funnel | Match by Birth</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
      </Helmet>

      <main className="min-h-screen bg-background px-4 py-10 md:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-5 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Match by Birth admin
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                Weekly funnel
              </h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Share page views, CTA clicks, calculator starts, checkout starts, and purchases by score band.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[10rem_minmax(12rem,1fr)_auto]">
              <select
                value={weeks}
                onChange={(event) => setWeeks(Number(event.target.value))}
                className="h-11 rounded-xl border border-border bg-card px-3 text-sm font-medium"
              >
                <option value={1}>1 week</option>
                <option value={2}>2 weeks</option>
                <option value={4}>4 weeks</option>
                <option value={8}>8 weeks</option>
                <option value={12}>12 weeks</option>
              </select>
              <input
                type="password"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="Dashboard token"
                className="h-11 rounded-xl border border-border bg-card px-3 text-sm"
              />
              <Button type="button" onClick={loadSummary} disabled={status === 'loading'} className="h-11 rounded-xl">
                <RefreshCw className={`mr-2 h-4 w-4 ${status === 'loading' ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {METRICS.map(([key, label]) => (
              <MetricCard key={key} label={label} value={summary?.totals?.[key]} />
            ))}
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-3">
            <RateCard label="Share view to CTA" value={summary?.conversionRates?.shareViewToCta} />
            <RateCard label="Share view to calculator" value={summary?.conversionRates?.shareViewToCalculator} />
            <RateCard label="Checkout to purchase" value={summary?.conversionRates?.checkoutToPurchase} />
          </section>

          <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="border-b border-border p-5">
              <h2 className="text-xl font-semibold">Score-band funnel</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                This shows which result bands actually move people from curiosity to calculator and purchase.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="bg-muted/35 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  <tr>
                    <th className="px-5 py-4">Score band</th>
                    {METRICS.map(([, label]) => (
                      <th key={label} className="px-5 py-4">{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedBands.length ? sortedBands.map(([band, metrics]) => (
                    <tr key={band} className="border-t border-border">
                      <td className="px-5 py-4 font-semibold">{BAND_LABELS[band] || band}</td>
                      {METRICS.map(([key]) => (
                        <td key={key} className="px-5 py-4 text-muted-foreground">
                          {metrics[key] || 0}
                        </td>
                      ))}
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={METRICS.length + 1} className="px-5 py-10 text-center text-muted-foreground">
                        No funnel events recorded for this window yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-xl font-semibold">How to read this</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              If share views are high but CTA clicks are low, change the shared page copy. If CTA clicks are high but calculator starts are low, the handoff needs work. If checkout starts are high but purchases are low, the paid report framing or price needs testing.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
