import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';

function HomeEmailCapture() {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState('idle');
  const [error, setError] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          consent: true,
          consentSource: 'home_weekly_forecast',
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to subscribe.');
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Unable to subscribe.');
    }
  };

  return (
    <section className="mt-12 border-y border-border bg-card">
      <div className="content-container py-8 md:py-10">
        <div className="grid gap-6 md:grid-cols-[1.08fr_0.92fr] md:items-center">
          <div className="flex gap-4">
            <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-primary">
              <Mail className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Weekly compatibility notes
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-normal text-foreground md:text-3xl">
                Get clear relationship insight in your inbox.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                One weekly email with timing notes, compatibility insights, and new Match by Birth guides.
                Unsubscribe anytime.
              </p>
            </div>
          </div>

          <div>
            {status === 'success' ? (
              <div className="rounded-lg border border-primary/20 bg-background p-4">
                <p className="text-sm font-semibold text-foreground">You&apos;re on the list.</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Check your inbox for your first weekly note.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                  className="h-12 rounded-md border border-input bg-background px-4 text-base text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'loading' ? (
                    'Subscribing...'
                  ) : (
                    <>
                      Get weekly notes
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            )}

            {status === 'error' && (
              <p role="alert" className="mt-3 text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Free. Unsubscribe anytime. No spam.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeEmailCapture;
