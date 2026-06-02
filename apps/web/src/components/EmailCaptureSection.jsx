import React, { useState } from 'react';

function EmailCaptureSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [error, setError] = useState('');

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

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setStatus('success');
      } else {
        setError(json.error || 'Server error');
        setStatus('error');
      }
    } catch (err) {
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
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="px-4 py-3 rounded-lg border border-border w-full sm:w-auto flex-1"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
            >
              {status === 'loading' ? 'Sending...' : "Send My Mini-Report"}
            </button>
          </form>
        )}

        {status === 'error' && <p className="text-red-600 mt-3">{error}</p>}
      </div>
    </section>
  );
}

export default EmailCaptureSection;
