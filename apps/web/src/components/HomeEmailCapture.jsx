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
    <section className="mx-auto mt-16 max-w-2xl px-4">
      <div
        style={{
          background: 'linear-gradient(135deg, #6c4de6 0%, #8b5cf6 100%)',
          borderRadius: 20,
          padding: '36px 28px',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <Mail style={{ width: 28, height: 28, margin: '0 auto 12px', opacity: 0.9 }} />
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 8px', lineHeight: 1.3 }}>
          See what the stars say about your connections this week
        </h2>
        <p style={{ fontSize: '0.9rem', opacity: 0.85, margin: '0 0 20px', lineHeight: 1.5 }}>
          Free weekly forecasts delivered to your inbox. No spam, unsubscribe anytime.
        </p>

        {status === 'success' ? (
          <div
            style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 12,
              padding: '18px 16px',
            }}
          >
            <p style={{ fontWeight: 600, margin: '0 0 4px', fontSize: '1rem' }}>You&apos;re on the list!</p>
            <p style={{ fontSize: '0.85rem', opacity: 0.85, margin: 0 }}>
              Check your inbox for your first weekly forecast.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              maxWidth: 340,
              margin: '0 auto',
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              required
              style={{
                height: 46,
                borderRadius: 12,
                border: 'none',
                padding: '0 16px',
                fontSize: '0.95rem',
                background: '#fff',
                color: '#1a1a2e',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                height: 46,
                borderRadius: 12,
                border: 'none',
                background: '#fff',
                color: '#6c4de6',
                fontWeight: 700,
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
                'Subscribing...'
              ) : (
                <>
                  Get My Weekly Forecast
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p style={{ color: '#fecaca', marginTop: 10, fontSize: '0.85rem' }}>{error}</p>
        )}

        <p style={{ fontSize: '0.72rem', opacity: 0.65, marginTop: 14 }}>
          Free. Unsubscribe anytime. We&apos;ll never spam you.
        </p>
      </div>
    </section>
  );
}

export default HomeEmailCapture;