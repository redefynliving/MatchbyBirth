import React, { useState } from 'react';
import {
  ArrowRight,
  Compass,
  Download,
  FileHeart,
  HeartHandshake,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import SaveResultModal from '@/components/SaveResultModal.jsx';
import SynastryEvidence from '@/components/SynastryEvidence.jsx';
import {
  buildPairHighlights,
  buildPairScoreProfile,
  buildPairSnapshot,
} from '@/lib/result-presentation.js';
import { trackEvent } from '@/lib/analytics.js';
import { getFunnelAttribution, setFunnelAttribution } from '@/lib/funnel-attribution.js';
import { getReportFocusConfig } from '@/lib/report-focus.js';

const HIGHLIGHT_ICONS = {
  communication: MessageCircle,
  'emotional-style': HeartHandshake,
  differences: Compass,
};

const RELATIONSHIP_LABELS = {
  love: 'Romantic',
  friendship: 'Friendship',
  work: 'Work',
};

function ResultCard({
  canPurchase,
  resultId,
  people,
  score,
  matchLabel,
  explanation,
  relationshipType,
  breakdown,
  resultUrl,
  precisionLabel,
  precisionNote,
  calculationMode = 'basic-sun',
  synastry = null,
  precisionComparison = null,
  reportContext = null,
  funnelContext = null,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadInProgress, setDownloadInProgress] = useState(false);
  const highlights = buildPairHighlights(breakdown);
  const scoreProfile = buildPairScoreProfile(breakdown);
  const snapshot = buildPairSnapshot(breakdown);
  const names = people.map((person) => person.name);
  const synastryEvidenceCount = Array.isArray(synastry?.evidence) ? synastry.evidence.length : 0;
  const isFullSynastry = calculationMode === 'full-synastry' && synastryEvidenceCount > 0;
  const reportFocus = reportContext?.focus || 'full_compatibility';
  const reportConfig = getReportFocusConfig(reportFocus);
  const reportOffer = {
    type: isFullSynastry ? 'deep_synastry' : 'standard',
    priceCents: 999,
    priceLabel: '$9.99',
    eyebrow: reportConfig.eyebrow,
    cta: `Get the ${reportConfig.shortLabel}`,
  };

  const openPurchaseModal = () => {
    if (funnelContext) {
      setFunnelAttribution({
        source: funnelContext.funnel_source || 'share_page',
        placement: funnelContext.cta_placement || 'result_card',
        label: funnelContext.cta_label || 'direct_report_upsell',
        text: 'Get the full report',
        variant: funnelContext.score_band || 'default',
        share_id: funnelContext.share_id,
        score_band: funnelContext.score_band,
      });
    }
    trackEvent('report_upsell_clicked', {
      mode: 'pair',
      report_type: reportOffer.type,
      report_focus: reportFocus,
      price: reportOffer.priceCents,
      currency: 'usd',
      ...(funnelContext || {}),
      ...getFunnelAttribution(),
    });
    setIsModalOpen(true);
  };

  const trackSampleReportView = () => {
    trackEvent('report_sample_opened_from_result', {
      mode: 'pair',
      score,
      strongest_area: snapshot.strongest.key,
      watch_area: snapshot.watch.key,
      ...(funnelContext || {}),
      ...getFunnelAttribution(),
    });
  };

  const downloadResult = async () => {
    try {
      setDownloadInProgress(true);
      const { default: html2canvas } = await import('html2canvas');
      const element = document.getElementById('result-card');
      if (!element) throw new Error('Result card not found');
      const canvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: '#fffdf9',
        scale: 2,
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'match-by-birth-result.png';
      link.click();
    } catch {
      toast.error('The result image could not be downloaded.');
    } finally {
      setDownloadInProgress(false);
    }
  };

  return (
    <>
      <article
        id="result-card"
        className="animate-scale-up mx-auto w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-card shadow-[0_20px_55px_rgba(38,31,43,0.1)]"
      >
        <header className="grid bg-foreground text-background md:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="p-6 sm:p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-background/60">
              {RELATIONSHIP_LABELS[relationshipType] || relationshipType} compatibility
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-background md:text-5xl">
              {names.join(' + ')}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-background/75 md:text-lg md:leading-8">
              {explanation}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {people.map((person) => (
                <span
                  key={person.id}
                  className="rounded-full border border-background/20 px-3 py-1.5 text-xs font-medium text-background/80"
                >
                  {person.name} · {person.sign}
                </span>
              ))}
            </div>
          </div>

          <div className="flex min-h-56 flex-col justify-between border-t border-background/15 bg-primary p-6 text-primary-foreground md:min-h-0 md:border-l md:border-t-0 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">
              Overall fit
            </p>
            <div>
              <div className="text-7xl font-semibold leading-none text-primary-foreground md:text-8xl">
                {score}
              </div>
              <p className="mt-3 text-base font-semibold text-primary-foreground">{matchLabel}</p>
            </div>
            <p className="text-xs leading-5 text-primary-foreground/75">
              A pattern to discuss, not a verdict.
            </p>
          </div>
        </header>

        <section className="border-b border-border px-5 py-7 sm:px-8 md:px-10 md:py-9">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">The short read</p>
              <h2 className="mt-2 text-2xl font-semibold">What stands out first</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Three useful signals from the score, before the deeper interpretation.
            </p>
          </div>

          <div className="mt-6 grid divide-y divide-border border-y border-border md:grid-cols-3 md:divide-x md:divide-y-0">
            {highlights.map((highlight) => {
              const Icon = HIGHLIGHT_ICONS[highlight.key];
              return (
                <div
                  key={highlight.key}
                  className="px-1 py-5 md:px-6 md:first:pl-0 md:last:pr-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-lg font-semibold text-primary">{highlight.score}</span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{highlight.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{highlight.summary}</p>
                </div>
              );
            })}
          </div>
        </section>

        {isFullSynastry && (
          <SynastryEvidence
            synastry={synastry}
            precisionComparison={precisionComparison}
          />
        )}

        <section className="grid border-b border-border lg:grid-cols-[minmax(0,1fr)_19rem]">
          <div className="px-5 py-7 sm:px-8 md:px-10 md:py-9">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Score profile</p>
            <h2 className="mt-2 text-2xl font-semibold">How the connection is distributed</h2>
            <div className="mt-7 space-y-6">
              {scoreProfile.map((item) => (
                <div key={item.key}>
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold">{item.label}</h3>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-foreground">{item.score}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="border-t border-border bg-muted/30 px-5 py-7 sm:px-8 lg:border-l lg:border-t-0 lg:px-7 md:py-9">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Read this carefully</p>
            <div className="mt-5 space-y-6">
              <div>
                <p className="text-xs font-semibold text-primary">Strongest area</p>
                <h3 className="mt-1 text-lg font-semibold">{snapshot.strongest.label}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{snapshot.strongest.summary}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-primary">{snapshot.watch.eyebrow}</p>
                <h3 className="mt-1 text-lg font-semibold">{snapshot.watch.label}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{snapshot.watch.summary}</p>
              </div>
              <div className="border-t border-border pt-5">
                <p className="text-xs font-semibold text-primary">Talk about next</p>
                <p className="mt-2 text-sm font-medium leading-6 text-foreground">{snapshot.nextStep}</p>
              </div>
            </div>
          </aside>
        </section>

        <section className="grid bg-secondary/55 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="p-5 sm:p-8 md:p-10">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <FileHeart className="h-4 w-4" />
              Inside the full report
            </p>
            <h2 className="mt-3 max-w-xl text-2xl font-semibold md:text-3xl">
              {reportConfig.resultHeadline}
            </h2>
            <div className="mt-6 border-l-2 border-primary pl-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">Your report preview</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground">
                {`${names[0]} and ${names[1]} score ${snapshot.strongest.score} in ${snapshot.strongest.label.toLowerCase()}. ${snapshot.watch.label.toLowerCase()} scores ${snapshot.watch.score} — the area the full report turns into repair words. ${reportConfig.resultPreview}${isFullSynastry ? ` It also uses ${synastryEvidenceCount} supplied timed aspect signals and measured orbs.` : ''}`}
              </p>
            </div>
            <div className="mt-6 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              {[
                ...reportConfig.includes,
                ...(isFullSynastry ? ['Calculated aspect labels and measured orbs'] : []),
              ].map((item) => (
                <p key={item} className="flex items-start gap-2 font-medium text-foreground">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </p>
              ))}
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs leading-5 text-muted-foreground">
              <LockKeyhole className="h-4 w-4 shrink-0 text-primary" />
              Private link and PDF by email. One-time purchase. No subscription.
            </p>
          </div>

          <div className="flex flex-col justify-center border-t border-primary/15 bg-card p-5 sm:p-8 lg:border-l lg:border-t-0">
            {canPurchase ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{reportOffer.eyebrow}</p>
                <p className="mt-2 text-4xl font-semibold text-foreground">{reportOffer.priceLabel}</p>
                <button
                  type="button"
                  onClick={openPurchaseModal}
                  className="btn-primary mt-5 h-12 w-full rounded-lg px-5 text-sm"
                >
                  {reportOffer.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <Link
                  to="/sample-report"
                  onClick={trackSampleReportView}
                  className="mt-3 block text-center text-xs font-semibold text-primary hover:underline"
                >
                  See exactly what is included
                </Link>
              </div>
            ) : (
              <p className="text-sm font-medium text-muted-foreground">
                Detailed reports are temporarily unavailable.
              </p>
            )}
          </div>
        </section>

        <footer className="border-t border-border px-5 py-4 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary">
                {isFullSynastry ? 'Full timed synastry' : precisionLabel}
              </span>
              <span>{isFullSynastry ? 'Both birth times and places were used to compare cross-chart aspects.' : precisionNote}</span>
            </div>
            <button
              type="button"
              onClick={downloadResult}
              disabled={downloadInProgress}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Download className="h-4 w-4" />
              {downloadInProgress ? 'Preparing image...' : 'Download result image'}
            </button>
          </div>
        </footer>
      </article>

      {canPurchase && (
        <SaveResultModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          resultId={resultId}
          resultUrl={resultUrl}
          names={names}
          reportType={reportOffer.type}
          reportFocus={reportFocus}
          defaultClarityGoal={reportContext?.clarityGoal || reportConfig.defaultClarityGoal}
          funnelContext={funnelContext}
          strongest={snapshot.strongest}
          watch={snapshot.watch}
        />
      )}
    </>
  );
}

export default ResultCard;
