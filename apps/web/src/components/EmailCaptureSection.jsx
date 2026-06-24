import React, { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/analytics.js';
import { Mail, Star, ArrowRight } from 'lucide-react';

function EmailCaptureSection({ resultId, people, score, signs }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    trackEvent('email_capture_viewed', { source: 'result_updates' });
  }, []);

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

  const names = people ? `${people[0]?.name || signs?.[0] || 'You'} & ${people[1]?.name || signs?.[1] || 'Your Partner'}` : 'Your Relationship';

  return (
    <section className="mt-8">
      <div style={{
        borderRadius: 20,
        padding: '32px 24px',
        background: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        textAlign: 'center',
      }}>
        <div style={{ marginBottom: 16 }}>
          <Mail style={{ width: 24, height: 24, margin: '0 auto 12px', color: 'hsl(var(--primary))' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 6px', color: 'hsl(var(--foreground))' }}>
            Get your result by email and weekly insights
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', margin: 0, lineHeight: 1.5 }}>
            Enter your email and we&apos;ll send a private copy of <strong>{names}</strong> along with weekly compatibility insights.
          </p>
        </div>

        {status === 'success' ? (
          <div style={{ background: 'hsl(var(--secondary))', borderRadius: 12, padding: '20px 16px' }}>
            <Star style={{ width: 20, height: 20, margin: '0 auto 8px', display: 'block', color: 'hsl(var(--primary))' }} />
            <p style={{ fontWeight: 600, margin: 0, color: 'hsl(var(--foreground))' }}>You&apos;re on the list!</p>
            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginTop: 4, margin: 0 }}>
              Check your inbox for your result copy and weekly updates.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360, margin: '0 auto' }}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              required
              style={{
                height: 44,
                borderRadius: 12,
                border: '1px solid hsl(var(--border))',
                padding: '0 16px',
                fontSize: '0.95rem',
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                height: 44,
                borderRadius: 12,
                border: 'none',
                background: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: status === 'loading' ? 0.7 : 1,
              }}
            >
              {status === 'loading' ? (
                'Saving your result...'
              ) : (
                <>
                  Send Me My Result
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p role="alert" style={{ color: 'hsl(var(--destructive))', marginTop: 12, fontSize: '0.875rem' }}>{error}</p>
        )}

        <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', marginTop: 12 }}>
          Free. Unsubscribe anytime. We&apos;ll never spam you.
        </p>
      </div>
    </section>
  );
}

export default EmailCaptureSection;
