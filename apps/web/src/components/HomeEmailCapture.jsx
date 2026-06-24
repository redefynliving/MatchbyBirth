import React from 'react';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';

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
    <section className="mx-auto mt-16 max-w-2xl px-4">
      <div
        className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center shadow-sm md:p-10"
      >
        {/* Subtle corner accent */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-20 blur-2xl" style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.3), transparent 70%)' }} aria-hidden="true" />

        <div className="relative z-10">
          <div className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            Get your weekly compatibility forecast
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Free weekly insights on love, friendship, and relationship energy. Unsubscribe anytime.
          </p>

          {status === 'success' ? (
            <div className="mt-6 rounded-xl bg-secondary p-5">
              <p className="text-base font-semibold text-foreground">You&apos;re on the list!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Check your inbox for your first weekly forecast.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-6 flex max-w-sm flex-col gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                required
                className="h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-shadow focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold"
              >
                {status === 'loading' ? (
                  'Subscribing...'
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Get My Weekly Forecast
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-3 text-sm text-destructive">{error}</p>
          )}

          <p className="mt-5 text-xs text-muted-foreground">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HomeEmailCapture;
