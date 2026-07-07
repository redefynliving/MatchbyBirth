import React from 'react';
import { Download, LockKeyhole } from 'lucide-react';
import BackButton from '@/components/BackButton.jsx';
import ReportCta from '@/components/report/ReportCta.jsx';
import { getReportSnapshot } from '@/components/report/reportUtils.js';

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

  return (
    <main className="bg-background min-h-screen py-12 md:py-20 px-4">
      <div className="max-w-3xl mx-auto">
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

        <article ref={reportRef} className="bg-card border border-border rounded-3xl p-7 md:p-12 shadow-sm">
          <header className="text-center pb-10 border-b border-border">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-4">
              Match by Birth
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-medium">{report.title}</h1>
            <p className="text-6xl font-semibold text-primary mt-5">{result.score}%</p>
            <p className="text-muted-foreground mt-5 max-w-xl mx-auto leading-relaxed">
              {report.overview}
            </p>
          </header>

          {mode === 'sample' && (
            <div className="mt-8">
              <ReportCta
                title="See your own private report"
                body="This sample shows the format. Your full report is built from your actual birth details and gives you a more personal compatibility reading."
                primaryLabel="Get your full private report"
                secondaryLabel="Run your own match"
                placement="top"
                compact
              />
            </div>
          )}

          <section className="my-8 rounded-3xl border border-primary/15 bg-primary/[0.035] p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-primary font-semibold mb-4">
              Report snapshot
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-card border border-border p-4">
                <p className="text-xs text-muted-foreground mb-1">Strongest area</p>
                <p className="font-serif text-xl text-foreground">{snapshot.strongest}</p>
              </div>
              <div className="rounded-2xl bg-card border border-border p-4">
                <p className="text-xs text-muted-foreground mb-1">Watch area</p>
                <p className="font-serif text-xl text-foreground">{snapshot.watch}</p>
              </div>
              <div className="rounded-2xl bg-card border border-border p-4">
                <p className="text-xs text-muted-foreground mb-1">Say this first</p>
                <p className="font-serif text-base leading-7 text-foreground">"{snapshot.sayThis}"</p>
              </div>
            </div>
          </section>

          {mode === 'sample' && (
            <div className="mb-8">
              <ReportCta
                title="Want a report that's actually yours?"
                body="The sample gives you the feel of the experience. Your private report is based on your real match, with deeper insight and a personalized reading."
                primaryLabel="Unlock my full report"
                secondaryLabel="Try the calculator"
                placement="middle"
                compact
              />
            </div>
          )}

          <div className="py-4">
            {report.sections.map((section) => (
              <section key={section.key} className="py-7 border-b border-border last:border-0">
                <h2 className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold mb-3">
                  {section.title}
                </h2>
                <p className="font-serif text-lg leading-8 text-foreground/90">{section.body}</p>
              </section>
            ))}
          </div>

          {mode === 'sample' && (
            <div className="pt-8 border-t border-border">
              <ReportCta
                title="Ready to see your real match?"
                body="Run your own birth match and get the complete private report."
                primaryLabel="Get my report"
                secondaryLabel="Start with a match"
                placement="bottom"
              />
            </div>
          )}

          <footer className="pt-8 border-t border-border">
            <p className="font-serif text-lg italic leading-8 text-muted-foreground">{report.closing}</p>
            <p className="text-xs text-muted-foreground mt-8">
              For entertainment and reflection only. This report is not professional relationship advice.
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
}
