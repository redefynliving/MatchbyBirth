import React, { useState } from 'react';
import { trackEvent } from '@/lib/analytics.js';

function EmailCaptureSection({ resultId }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

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
          consentSource: 'result_updates',
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to subscribe.');
      setStatus('success');
      trackEvent('email_subscribed', { source: 'result_updates' });
    } catch (subscriptionError) {
      setStatus('error');
      setError(subscriptionError.message || 'Unable to subscribe.');
    }
  };

  return (
    <section className="mt-12 py-9 px-6 bg-card border border-border rounded-2xl text-center">
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-2">Keep exploring your connections</h2>
        <p className="text-muted-foreground mb-6">
          Opt in for occasional Match by Birth insights and product updates. No account required.
        </p>

        {status === 'success' ? (
          <p className="font-medium text-foreground">You’re subscribed. Check your inbox for future updates.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="input h-12"
            />
            <button type="submit" disabled={status === 'loading'} className="btn-primary px-6 h-12 rounded-xl whitespace-nowrap">
              {status === 'loading' ? 'Subscribing...' : 'Opt In'}
            </button>
          </form>
        )}

        {status === 'error' && <p role="alert" className="text-destructive mt-3">{error}</p>}
        <p className="text-xs text-muted-foreground mt-4">
          Optional marketing consent. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}

export default EmailCaptureSection;
