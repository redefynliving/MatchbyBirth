import React, { useState } from 'react';
import { trackEvent } from '@/lib/analytics.js';
import { Mail, Star, ArrowRight } from 'lucide-react';

function EmailCaptureSection({ resultId, people, score, signs }) {
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

  const names = people ? `${people[0]?.name || signs?.[0] || 'You'} & ${people[1]?.name || signs?.[1] || 'Your Partner'}` : 'Your Relationship';

  return (
    <section className="mt-8">
      <div style={{
        background: 'linear-gradient(135deg, #6c4de6 0%, #8b5cf6 100%)',
        borderRadius: 20,
        padding: '32px 24px',
        color: '#fff',
        textAlign: 'center',
      }}>
        <div style={{ marginBottom: 16 }}>
          <Mail style={{ width: 32, height: 32, margin: '0 auto 12px', opacity: 0.9 }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 8px' }}>
            Get Your Weekly Relationship Forecast
          </h2>
          <p style={{ fontSize: '0.95rem', opacity: 0.85, margin: 0, lineHeight: 1.5 }}>
            Enter your email and we'll send you a personalized weekly forecast for <strong>{names}</strong> based on current planetary transits.
          </p>
        </div>

        {status === 'success' ? (
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '20px 16px' }}>
            <Star style={{ width: 24, height: 24, margin: '0 auto 8px', display: 'block' }} />
            <p style={{ fontWeight: 600, margin: 0 }}>You're on the list!</p>
            <p style={{ fontSize: '0.85rem', opacity: 0.85, marginTop: 4, margin: 0 }}>
              Check your inbox for a welcome email and your first forecast.
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
                height: 48,
                borderRadius: 12,
                border: 'none',
                padding: '0 16px',
                fontSize: '1rem',
                background: '#fff',
                color: '#1a1a2e',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                height: 48,
                borderRadius: 12,
                border: 'none',
                background: '#fff',
                color: '#6c4de6',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: status === 'loading' ? 0.7 : 1,
              }}
            >
              {status === 'loading' ? (
                'Subscribing...'
              ) : (
                <>
                  Get My Weekly Forecast
                  <ArrowRight style={{ width: 18, height: 18 }} />
                </>
              )}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p role="alert" style={{ color: '#fecaca', marginTop: 12, fontSize: '0.875rem' }}>{error}</p>
        )}

        <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: 12 }}>
          Free. Unsubscribe anytime. We'll never spam you.
        </p>
      </div>
    </section>
  );
}

export default EmailCaptureSection;
