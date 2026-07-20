import React from 'react';
import { ArrowRight, Download, LockKeyhole } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackButton from '@/components/BackButton.jsx';
import { getReportSnapshot } from '@/components/report/reportUtils.js';
import { trackEvent } from '@/lib/analytics.js';
import { setFunnelAttribution } from '@/lib/funnel-attribution.js';

const REPORT_CHAPTERS = [
  { title: 'Overview', description: 'The score pattern and the clearest evidence.', start: 0, end: 2 },
  { title: 'Relating', description: 'How communication and emotional translation may show up.', start: 2, end: 4 },
  { title: 'Building', description: 'What steadiness, responsibility, and repair require.', start: 4, end: 6 },
  { title: 'Action plan', description: 'Words, next steps, and a short reality check.', start: 6, end: 9 },
];

export default function ReportView({
  report,
  result,
  reportRef,
  onDownload,
  downloading = false,
  isPrivate = false,
  backLabel = 'Back to Calculator',
  fallbackTo = '/',
  showDownload = false,
  mode = 'paid',
}) {
  const snapshot = getReportSnapshot(report, result);
  const people = result?.people || [];

  const trackSampleCta = () => {
    setFunnelAttribution({
      source: 'sample_report',
      placement: 'score_card',
      label: 'primary',
      text: 'Run a private comparison',
      variant: 'score_card',
    });
    trackEvent('sample_report_cta_clicked', {
      placement: 'score_card',
      label: 'primary',
      text: 'Run a private comparison',
      variant: 'score_card',
    });
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10 md:py-16">
      <div className="mx-auto max-w-4xl">
        <BackButton fallbackTo={fallbackTo} label={backLabel} />
        <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isPrivate && <LockKeyhole className="w-4 h-4" />}
            {isPrivate ? 'Private report' : 'Sample report'}
          </div>
          {showDownload && (
            <button
              type="button"
              onClick={onDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card font-medium"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Creating PDF...' : 'Download PDF'}
            </button>
          )}
        </div>

        <article ref={reportRef} className="overflow-hidden rounded-lg border border-border bg-card shadow-[0_18px_50px_rgba(38,31,43,0.08)]">
          <header className="border-t-4 border-primary px-6 py-9 text-center sm:px-8 md:px-12 md:py-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {isPrivate ? 'Private compatibility report' : 'Sample compatibility report'}
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-foreground md:text-5xl">{report.title}</h1>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {people.map((person) => (
                <span key={`${person.name}-${person.sign}`} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                  {person.name} · {person.sign}
                </span>
              ))}
            </div>

            <div className="mx-auto mt-8 flex h-40 w-40 flex-col items-center justify-center rounded-full border border-primary/25 bg-secondary/45 md:h-48 md:w-48">
              <p className="text-6xl font-semibold leading-none text-primary md:text-7xl">{result.score}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Overall fit</p>
            </div>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-foreground/80 md:text-lg md:leading-8">
              {report.overview}
            </p>

            {(report.focusLabel || report.evidenceSummary) && (
              <div className="mx-auto mt-7 max-w-2xl border-y border-border py-5 text-left">
                {report.focusLabel && (
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    {report.focusLabel}
                  </p>
                )}
                {report.evidenceSummary && (
                  <p className="mt-2 text-sm font-medium leading-6 text-foreground">
                    {report.evidenceSummary}
                  </p>
                )}
                {report.precisionNote && (
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {report.precisionNote}
                  </p>
                )}
              </div>
            )}

            {mode === 'sample' && (
              <div className="mx-auto mt-7 max-w-xl border-t border-border pt-6">
                <p className="text-sm leading-6 text-muted-foreground">
                  Run a private comparison first. Review the free result, then decide whether the full $9.99 report is worth opening.
                </p>
                <Link
                  to="/#calculator"
                  onClick={trackSampleCta}
                  className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Run a private comparison
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </header>

          <section className="border-b border-border px-6 py-7 sm:px-8 md:px-10">
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-primary">
              Report snapshot
            </p>
            <div className="grid divide-y divide-border border-y border-border md:grid-cols-3 md:divide-x md:divide-y-0">
              <div className="py-4 md:px-5 md:first:pl-0">
                <p className="mb-1 text-xs text-muted-foreground">Strongest area</p>
                <p className="text-xl font-semibold text-foreground">{snapshot.strongest}</p>
              </div>
              <div className="py-4 md:px-5">
                <p className="mb-1 text-xs text-muted-foreground">{snapshot.focusLabel}</p>
                <p className="text-xl font-semibold text-foreground">{snapshot.watch} · {snapshot.watchScore}</p>
              </div>
              <div className="py-4 md:px-5 md:last:pr-0">
                <p className="mb-1 text-xs text-muted-foreground">Say this first</p>
                <p className="text-sm font-medium leading-6 text-foreground">"{snapshot.sayThis}"</p>
              </div>
            </div>
          </section>

          <div className="px-6 sm:px-8 md:px-10">
            {REPORT_CHAPTERS.map((chapter, chapterIndex) => {
              const sections = report.sections.slice(chapter.start, chapter.end);
              if (sections.length === 0) return null;
              return (
                <section key={chapter.title} className="border-b border-border py-8 md:py-10">
                  <div className="mb-3 grid gap-2 md:grid-cols-[2.5rem_12rem_minmax(0,1fr)] md:gap-6">
                    <span className="text-xs font-semibold text-primary">Chapter {chapterIndex + 1}</span>
                    <h2 className="text-lg font-semibold text-foreground">{chapter.title}</h2>
                    <p className="text-sm leading-6 text-muted-foreground">{chapter.description}</p>
                  </div>
                  <div className="divide-y divide-border">
                    {sections.map((section, localIndex) => {
                      const sectionNumber = chapter.start + localIndex + 1;
                      return (
                        <section key={section.key} className="grid gap-3 py-7 md:grid-cols-[2.5rem_12rem_minmax(0,1fr)] md:gap-6">
                          <span className="text-xs font-semibold text-primary">{String(sectionNumber).padStart(2, '0')}</span>
                          <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
                          <p className="text-base leading-7 text-foreground/85 md:text-lg md:leading-8">{section.body}</p>
                        </section>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          <footer className="border-t border-border bg-muted/25 px-6 py-8 sm:px-8 md:px-10">
            <p className="max-w-2xl text-base leading-7 text-foreground">{report.closing}</p>
            <p className="mt-6 text-xs text-muted-foreground">
              For entertainment and reflection only. This report is not professional relationship advice.
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
}
