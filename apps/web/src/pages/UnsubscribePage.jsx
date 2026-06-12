import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Check, Loader2, MailX } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

function UnsubscribePage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const hasValidLink = Boolean(email && token);

  const handleUnsubscribe = async () => {
    setStatus('loading');
    setError('');

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Unable to unsubscribe.');
      }
      setStatus('success');
    } catch (unsubscribeError) {
      setStatus('error');
      setError(unsubscribeError.message || 'Unable to unsubscribe.');
    }
  };

  const Icon = status === 'success' ? Check : MailX;

  return (
    <>
      <Helmet>
        <title>Email Preferences | Match by Birth</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="flex min-h-[70vh] items-center justify-center bg-background p-6">
        <section className="w-full max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-lg md:p-12">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </span>

          {status === 'success' ? (
            <>
              <h1 className="mt-6 text-3xl font-semibold">You are unsubscribed</h1>
              <p className="mt-3 text-muted-foreground">
                You will no longer receive occasional Match by Birth updates.
              </p>
              <Link
                to="/"
                className="mt-8 inline-flex rounded-xl bg-secondary px-6 py-3 font-semibold text-secondary-foreground"
              >
                Return home
              </Link>
            </>
          ) : (
            <>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Email preferences
              </p>
              <h1 className="mt-3 text-3xl font-semibold">Confirm unsubscribe</h1>
              <p className="mt-3 text-muted-foreground">
                {hasValidLink
                  ? `Stop occasional Match by Birth updates to ${email}?`
                  : 'This unsubscribe link is incomplete or invalid.'}
              </p>

              {hasValidLink && (
                <button
                  type="button"
                  onClick={handleUnsubscribe}
                  disabled={status === 'loading'}
                  className="btn-primary mt-8 inline-flex h-12 items-center justify-center rounded-xl px-6 font-semibold"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Confirm unsubscribe'
                  )}
                </button>
              )}

              {status === 'error' && (
                <p role="alert" className="mt-4 text-sm text-destructive">
                  {error}
                </p>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
}

export default UnsubscribePage;
