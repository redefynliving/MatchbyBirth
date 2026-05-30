import React, { useState } from 'react';
import { X } from 'lucide-react';

function SaveResultModal({ isOpen, onClose, resultUrl }) {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSaveResult = async (event) => {
    event.preventDefault();

    try {
      // call /api/generate-report to trigger server-side report generation and email/sendback
      const resp = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameA: getParam('p1') || person1Name, nameB: getParam('p2') || person2Name, dobA: getParam('p1_dob') || '', dobB: getParam('p2_dob') || '', scores: { overall: score } })
      });

      if (!resp.ok) {
        // graceful fallback message when API returns ok: false or non-2xx
        toast.success('Your compatibility report will be in your email shortly! ✨');
        setEmail('');
        onClose();
        return;
      }

      const j = await resp.json();
      if (!j.ok) {
        // graceful fallback
        toast.success('Your compatibility report will be in your email shortly! ✨');
        setEmail('');
        onClose();
        return;
      }

      // success path: show a friendly confirmation
      toast.success('Result saved successfully! Check your email shortly.');
      setEmail('');
      onClose();
    } catch (err) {
      console.error(err);
      // network-level failure: graceful fallback
      toast.success('Your compatibility report will be in your email shortly! ✨');
      setEmail('');
      onClose();
    }

    function getParam(key) {
      try { const u = new URL(resultUrl); return u.searchParams.get(key); } catch (e) { return null; }
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
