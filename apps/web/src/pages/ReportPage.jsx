import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Download, Loader2, LockKeyhole } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import BackButton from '@/components/BackButton.jsx';

function titleCase(value) {
  return String(value || '')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getReportSnapshot(report, result) {
  const breakdownEntries = Object.entries(result?.breakdown || {})
    .filter(([key, value]) => key !== 'overall' && Number.isFinite(Number(value)))
    .sort((left, right) => Number(right[1]) - Number(left[1]));
  const strongest = titleCase(breakdownEntries[0]?.[0] || 'connection');
  const watch = titleCase(breakdownEntries[breakdownEntries.length - 1]?.[0] || 'timing');
  const practical = report.sections.find((section) => section.key === 'practical_advice')?.body || '';
  const sayThis = practical.match(/"([^"]+)"/)?.[1] || `Name where ${strongest.toLowerCase()} feels easy, then talk about ${watch.toLowerCase()} before it turns into guessing.`;

  return { strongest, watch, sayThis };
}

function ReportPage() {
  const [searchParams] = useSearchParams();
  const purchase = searchParams.get('purchase');
  const token = searchParams.get('token');
  const reportRef = useRef(null);
  const [state, setState] = useState({ status: 'loading', report: null, result: null, error: '' });
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadReport() {
      if (!purchase || !token) {
        setState({ status: 'error', report: null, result: null, error: 'This report link is incomplete.' });
        return;
      }

      try {
        const query = new URLSearchParams({ purchase, token });
        const response = await fetch(`/api/report?${query.toString()}`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || 'Unable to load this report.');
        if (!cancelled) {
          setState({
            status: 'ready',
            report: data.report,
            result: data.result,
            error: '',
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: 'error',
            report: null,
            result: null,
            error: error.message || 'Unable to load this report.',
          });
        }
      }
    }

    loadReport();
    return () => {
      cancelled = true;
    };
  }, [purchase, token]);

  const downloadPdf = async () => {
    if (!reportRef.current) return;
    setDownloading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ unit: 'pt', format: 'letter' });
      await pdf.html(reportRef.current, {
        margin: [42, 42, 42, 42],
        autoPaging: 'text',
        width: 528,
        windowWidth: 760,
        callback: (document) => document.save('match-by-birth-report.pdf'),
      });
    } catch {
      toast.error('The PDF could not be created. Try printing this page instead.');
    } finally {
      setDownloading(false);
    }
  };

  if (state.status === 'loading') {
    return (
      <main className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
      </main>
    );
  }

  if (state.status === 'error') {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <LockKeyhole className="w-8 h-8 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-3">Private report unavailable</h1>
          <p className="text-muted-foreground mb-6">{state.error}</p>
          <Link to="/" className="btn-primary inline-flex px-6 py-3 rounded-xl">Return Home</Link>
        </div>
      </main>
    );
  }

  const { report, result } = state;
  const snapshot = getReportSnapshot(report, result);
  return (
    <>
      <Helmet>
        <title>{report.title} | Private Match by Birth Report</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
      </Helmet>
      <main className="bg-background min-h-screen py-12 md:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <BackButton fallbackTo="/" label="Back to Calculator" />
          <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LockKeyhole className="w-4 h-4" />
              Private report
            </div>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card font-medium"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Creating PDF...' : 'Download PDF'}
            </button>
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
	                <div className="rounded-2xl bg-card border border-border p-4 md:col-span-1">
	                  <p className="text-xs text-muted-foreground mb-1">Say this first</p>
	                  <p className="font-serif text-base leading-7 text-foreground">"{snapshot.sayThis}"</p>
	                </div>
	              </div>
	            </section>

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

            <footer className="pt-8 border-t border-border">
              <p className="font-serif text-lg italic leading-8 text-muted-foreground">{report.closing}</p>
              <p className="text-xs text-muted-foreground mt-8">
                For entertainment and reflection only. This report is not professional relationship advice.
              </p>
            </footer>
          </article>
        </div>
      </main>
    </>
  );
}

export default ReportPage;
