import React, { useState } from 'react';
import {
  Compass,
  HeartHandshake,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics.js';

function SaveResultModal({ isOpen, onClose, resultId, resultUrl, names }) {
  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [status, setStatus] = useState('idle');

  if (!isOpen) return null;

  const startCheckout = async (event) => {
    event.preventDefault();
    setStatus('loading');
    trackEvent('checkout_started', {
      mode: 'pair',
      price: 999,
      currency: 'usd',
    });

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resultId,
          email,
          marketingConsent,
          resultUrl,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Unable to start checkout.');
      }
      if (!data.url) throw new Error('Checkout did not return a payment link.');
      window.location.assign(data.url);
    } catch (error) {
      setStatus('error');
      toast.error(error.message || 'Unable to start checkout.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
        className="relative grid max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl md:grid-cols-[1.05fr_0.95fr]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-card/80 p-2 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Close checkout"
        >
          <X className="h-5 w-5" />
        </button>

        <section className="p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Private compatibility report
          </p>
          <h2 id="report-modal-title" className="mt-3 pr-8 text-3xl font-semibold tracking-tight">
            Go beyond the score.
          </h2>
          <p className="mt-2 text-sm font-medium text-foreground">
            {names.join(' + ')}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            A focused reading with useful language for understanding this relationship.
          </p>

          <div className="mt-6 divide-y divide-border">
            {[
              [MessageCircle, 'Communication and conflict', 'How you express needs and repair misunderstandings.'],
              [HeartHandshake, 'Strengths and friction patterns', 'What creates trust and what needs more care.'],
              [Compass, 'Practical next steps', 'Clear prompts tailored to this connection.'],
            ].map(([Icon, title, description]) => (
              <div key={title} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-[linear-gradient(145deg,hsl(var(--secondary)),hsl(335_45%_95%))] p-6 md:border-l md:border-t-0 md:p-8">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-card text-primary shadow-sm">
            <LockKeyhole className="h-4 w-4" />
          </span>
          <h3 className="mt-5 text-xl font-semibold">Send your private report</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Delivered to your email after checkout.
          </p>
          <p className="mt-5 text-3xl font-semibold tracking-tight">
            $9.99 <span className="text-xs font-medium tracking-normal text-muted-foreground">one-time</span>
          </p>

          <form onSubmit={startCheckout} className="mt-4 space-y-4">
            <div>
              <label htmlFor="report-email" className="mb-2 block text-sm font-medium">
                Email address
              </label>
              <input
                id="report-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="input h-12 bg-card/90"
              />
            </div>

            <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-muted-foreground">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(event) => setMarketingConsent(event.target.checked)}
                className="mt-1"
              />
              <span>Send me occasional Match by Birth updates. Optional, and you can unsubscribe anytime.</span>
            </label>

            <button
              type="submit"
              className="btn-primary h-12 w-full rounded-xl font-semibold"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Opening secure checkout...' : 'Continue to Checkout'}
            </button>
          </form>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Payment is handled by Stripe. Your birth dates are not stored.
          </p>
        </section>
      </div>
    </div>
  );
}

export default SaveResultModal;
