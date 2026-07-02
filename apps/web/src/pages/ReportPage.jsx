import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  ClipboardList,
  Download,
  Loader2,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import BackButton from '@/components/BackButton.jsx';

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
  const reportIncludes = [
    [ClipboardList, '9 personalized sections'],
    [MessageCircle, 'Conversation prompts'],
    [ShieldCheck, 'Private access link'],
  ];

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
                Private Match by Birth Report
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-medium">{report.title}</h1>
              <p className="text-6xl font-semibold text-primary mt-5">{result.score}%</p>
              <p className="text-muted-foreground mt-5 max-w-xl mx-auto leading-relaxed">
                {report.overview}
              </p>
              <div className="mt-7 grid gap-3 text-left sm:grid-cols-3">
                {reportIncludes.map(([Icon, label]) => (
                  <div key={label} className="rounded-2xl border border-border bg-muted/35 p-4">
                    <Icon className="h-4 w-4 text-primary" />
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </header>

            <div className="py-4">
              {report.sections.map((section, index) => (
                <section key={section.key} className="py-7 border-b border-border last:border-0">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    <h2 className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold">
                      {section.title}
                    </h2>
                  </div>
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
