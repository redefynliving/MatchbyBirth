import React, { useEffect, useState } from 'react';
import { Check, Loader2, Mail } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { trackEvent } from '@/lib/analytics.js';

export default function ReportSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [state, setState] = useState({
    status: 'checking',
    message: 'Confirming your payment...',
  });

  useEffect(() => {
    if (!sessionId) {
      setState({ status: 'error', message: 'The checkout session is missing.' });
      return undefined;
    }

    let cancelled = false;
    let attempts = 0;
    let timer;

    async function checkStatus() {
      attempts += 1;
      try {
        const response = await fetch(
          `/api/purchase-status?sessionId=${encodeURIComponent(sessionId)}`,
        );
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || 'Unable to check your report.');
        if (cancelled) return;

        if (data.status === 'delivered' && data.reportUrl) {
          trackEvent('report_delivered', { price: 999, currency: 'usd' });
          window.location.replace(data.reportUrl);
          return;
        }

        if (data.status === 'failed') {
          setState({
            status: 'processing',
            message: 'Your payment is confirmed. Delivery is being retried automatically.',
          });
        } else {
          setState({
            status: 'processing',
            message: 'Payment confirmed. Your private report is being prepared.',
          });
        }

        if (attempts < 60) {
          timer = window.setTimeout(checkStatus, 2000);
        } else {
          setState({
            status: 'email',
            message: 'Your report is still processing. We will email the private link when it is ready.',
          });
        }
      } catch (error) {
        if (cancelled) return;
        if (attempts < 10) {
          timer = window.setTimeout(checkStatus, 2000);
        } else {
          setState({
            status: 'email',
            message: error.message || 'We will email your report as soon as it is ready.',
          });
        }
      }
    }

    checkStatus();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [sessionId]);

  const Icon = state.status === 'email'
    ? Mail
    : state.status === 'error'
      ? Check
      : Loader2;

  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-background p-6">
      <div className="max-w-xl w-full text-center bg-card border border-border rounded-3xl p-8 md:p-12 shadow-lg">
        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
          <Icon className={`w-6 h-6 ${state.status === 'processing' || state.status === 'checking' ? 'animate-spin' : ''}`} />
        </div>
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold mb-3">
          Secure payment received
        </p>
        <h1 className="text-3xl font-semibold mb-4">Your report is in progress</h1>
        <p className="text-muted-foreground mb-7">{state.message}</p>
        <p className="text-sm text-muted-foreground">
          You may keep this page open or return home. The report link will also be sent to your checkout email.
        </p>
        <Link to="/" className="inline-flex mt-8 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
