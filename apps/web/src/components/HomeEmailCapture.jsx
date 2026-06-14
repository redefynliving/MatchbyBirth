import React from 'react';
import { Mail, Star, ArrowRight } from 'lucide-react';
import EmailCaptureSection from '@/components/EmailCaptureSection.jsx';

function HomeEmailCapture() {
  return (
    <section className="mx-auto mt-16 max-w-2xl">
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
            Get Weekly Forecasts for Your Connections
          </h2>
          <p style={{ fontSize: '0.95rem', opacity: 0.85, margin: 0, lineHeight: 1.5 }}>
            Enter your email and we'll send you personalized weekly insights based on your birth dates — free, no spam, unsubscribe anytime.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // This would connect to your actual email capture logic
            alert('Email capture would connect here - for now, this is a placeholder');
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            maxWidth: 360,
            margin: '0 auto',
          }}
        >
          <input
            type="email"
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
            style={{
              height: 48,
              borderRadius: 12,
              border: 'none',
              background: '#fff',
              color: '#6c4de6',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            Get My Weekly Forecast
            <ArrowRight style={{ width: 18, height: 18 }} />
          </button>
        </form>

        <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: 12 }}>
          Free. Unsubscribe anytime. We'll never spam you.
        </p>
      </div>
    </section>
  );
}

export default HomeEmailCapture;