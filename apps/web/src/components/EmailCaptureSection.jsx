import React, { useState } from 'react';

function EmailCaptureSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [error, setError] = useState('');

  // reset status when user edits the email so they can retry
  const handleEmailChange = (value) => {
    setEmail(value);
    if (status !== 'idle') {
      setStatus('idle');
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // simple client-side email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      setStatus('error');
      return;
    }

    setStatus('loading');

    // Try to capture any result context from the URL if present
    let p1 = '';
    let p2 = '';
    let p1_dob = '';
    let p2_dob = '';
    let score = '';
    let label = '';
    try {
      const params = new URLSearchParams(window.location.search);
      p1 = params.get('p1') || params.get('nameA') || '';
      p2 = params.get('p2') || params.get('nameB') || '';
      p1_dob = params.get('p1_dob') || params.get('dobA') || '';
      p2_dob = params.get('p2_dob') || params.get('dobB') || '';
      score = params.get('score') || params.get('s') || '';
      label = params.get('label') || '';
    } catch (err) {
      // ignore URL parse errors
    }

    const payload = { email, p1, p2, p1_dob, p2_dob, score, label, resultUrl: window.location.href };

    try {
      // Allow local development to target a standalone API server by setting VITE_API_BASE.
      // In production we keep the same relative /api/subscribe path so serverless routing still works.
      const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE) || '';
      const endpoint = API_BASE ? `${API_BASE}/subscribe` : '/api/subscribe';

      // Log payload for debugging during QA
      // eslint-disable-next-line no-console
      console.log('Submitting subscribe payload to', endpoint, payload);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Try to parse JSON safely
      let json = null;
      try {
        json = await res.json();
      } catch (e) {
        // ignore JSON parse errors
      }

      if (res.ok && json && json.success) {
        setStatus('success');
      } else {
        setError((json && json.error) || `Server error (${res.status})`);
        setStatus('error');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Subscribe network error', err);
      setError('Network error');
      setStatus('error');
    }
  };

  return (
    <section className="mt-12 py-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl text-center">
      <div className="content-container max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-2">Get your free compatibility mini-report</h2>
        <p className="text-muted-foreground mb-6">Enter your email and we’ll send your score, a short relationship summary, and a link to revisit your results anytime.</p>

        {status === 'success' ? (
          <div className="text-lg font-medium text-foreground">✦ You're in. Check your inbox for your mini-report.</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full">
            <input
              id="email-capture"
              type="email"
              aria-label="Email"
              aria-describedby={status === 'error' ? 'email-capture-error' : undefined}
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="you@example.com"
              className="input"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary px-6 py-3 rounded-lg font-medium"
            >
              {status === 'loading' ? 'Sending...' : "Send My Mini-Report"}
            </button>
          </form>
        )}

        {status === 'error' && <p id="email-capture-error" className="text-red-600 mt-3">{error}</p>}
      </div>
    </section>
  );
}

export default EmailCaptureSection;
