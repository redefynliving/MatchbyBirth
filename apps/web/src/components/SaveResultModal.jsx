import React, { useState } from 'react';
import { X } from 'lucide-react';
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
      <div role="dialog" aria-modal="true" aria-labelledby="report-modal-title" className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold mb-3">
          Private compatibility report
        </p>
        <h2 id="report-modal-title" className="text-2xl font-semibold pr-8">
          {names.join(' & ')}
        </h2>
        <p className="text-muted-foreground mt-3 mb-6">
          Enter the email where your report should be delivered after the secure $9.99 checkout.
        </p>

        <form onSubmit={startCheckout} className="space-y-4">
          <div>
            <label htmlFor="report-email" className="block text-sm font-medium mb-2">
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
              className="input h-12"
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(event) => setMarketingConsent(event.target.checked)}
              className="mt-1"
            />
            <span>Send me occasional Match by Birth updates. Optional, and you can unsubscribe anytime.</span>
          </label>

          <button type="submit" className="w-full h-12 btn-primary rounded-xl font-semibold" disabled={status === 'loading'}>
            {status === 'loading' ? 'Opening secure checkout...' : 'Continue to Checkout — $9.99'}
          </button>
        </form>

        <p className="mt-5 text-xs text-center text-muted-foreground">
          Payment is handled by Stripe. Your birth dates are not stored.
        </p>
      </div>
    </div>
  );
}

export default SaveResultModal;
