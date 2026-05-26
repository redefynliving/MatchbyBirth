
import React, { useState } from 'react';
import { X } from 'lucide-react';

function SaveResultModal({ isOpen, onClose, resultUrl }) {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSaveResult = async (event) => {
    event.preventDefault();
    if (!email) return;

    const savedData = {
      email,
      resultUrl,
      timestamp: new Date().toISOString()
    };

    // POST to serverless API to send email via Resend
    try {
      const resp = await fetch('/api/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, p1: getNameFromUrl(resultUrl, 'p1') || '', p2: getNameFromUrl(resultUrl, 'p2') || '', p1_dob: getNameFromUrl(resultUrl, 'p1_dob') || '', p2_dob: getNameFromUrl(resultUrl, 'p2_dob') || '', score: getNameFromUrl(resultUrl, 'score') || '' })
      });
      const j = await resp.json();
      if (resp.ok && j.success) {
        alert('Result saved successfully! Check your email shortly.');
        setEmail('');
        onClose();
      } else {
        alert('Failed to save result. Please try again later.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save result. Please try again later.');
    }

    function getNameFromUrl(url, key) {
      try {
        const u = new URL(url);
        return u.searchParams.get(key);
      } catch (e) { return null; }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl p-6 md:p-8 animate-scale-up">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-2xl font-bold text-foreground mb-2">Save Your Result</h3>
        <p className="text-muted-foreground mb-6">
          Enter your email to save this compatibility reading and access it later.
        </p>

        <form onSubmit={handleSaveResult} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="resultEmail" className="block text-sm font-medium text-foreground">
              Email Address
            </label>
            <input
              id="resultEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-[0.98]"
          >
            Save Result
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-muted-foreground leading-relaxed">
          <strong>Privacy Note:</strong> We'll email you a link to your result. Your birth dates are never stored.
        </p>
      </div>
    </div>
  );
}

export default SaveResultModal;
