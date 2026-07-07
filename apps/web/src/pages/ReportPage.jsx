import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Loader2, LockKeyhole } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import ReportView from '@/components/report/ReportView.jsx';

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
  return (
    <>
      <Helmet>
        <title>{report.title} | Private Match by Birth Report</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
      </Helmet>
      <ReportView
        report={report}
        result={result}
        reportRef={reportRef}
        onDownload={downloadPdf}
        downloading={downloading}
        isPrivate
        showDownload
        mode="paid"
      />
    </>
  );
}

export default ReportPage;
