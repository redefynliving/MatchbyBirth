import React from 'react';
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react';

function NewsletterCapture({
  className = '',
  title = 'Get Match by Birth updates',
  description = 'Occasional notes when new compatibility guides, tools, or product updates go live. No account required.',
  buttonLabel = 'Subscribe',
  loadingLabel = 'Subscribing...',
  successTitle = "You're on the list.",
  successDescription = 'Check your inbox for a confirmation email.',
  finePrint = 'Free. Unsubscribe anytime.',
  consentSource = 'newsletter_capture',
  resultId,
  onView,
  onSubscribe,
}) {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState('idle');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    onView?.();
  }, [onView]);

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
          resultId,
          consent: true,
          consentSource,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to subscribe.');
      setStatus('success');
      onSubscribe?.();
    } catch (subscriptionError) {
      setStatus('error');
      setError(subscriptionError.message || 'Unable to subscribe.');
    }
  };

  return (
    <section className={className}>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-background/45 px-5 py-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Mail className="h-4 w-4" aria-hidden="true" />
            Email notes
          </div>
        </div>

        <div className="grid gap-6 p-5 md:grid-cols-[1fr_minmax(280px,360px)] md:items-center md:p-7">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              {title}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>

          {status === 'success' ? (
            <div className="rounded-lg border border-border bg-background p-4 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-foreground">{successTitle}</p>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">{successDescription}</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                  className="h-12 min-w-0 flex-1 rounded-lg border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10 placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary h-12 shrink-0 rounded-lg px-5 text-sm disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === 'loading' ? (
                    loadingLabel
                  ) : (
                    <>
                      {buttonLabel}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && (
                <p role="alert" className="text-sm text-destructive">{error}</p>
              )}
              <p className="text-xs text-muted-foreground">{finePrint}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default NewsletterCapture;
