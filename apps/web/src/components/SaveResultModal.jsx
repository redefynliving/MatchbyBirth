import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

function SaveResultModal({ isOpen, onClose, resultUrl, person1Name, person2Name, score }) {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSaveResult = async (event) => {
    event.preventDefault();

    try {
      const nameA = person1Name || getParam('p1') || '';
      const nameB = person2Name || getParam('p2') || '';
      const dobA = getParam('p1_dob') || '';
      const dobB = getParam('p2_dob') || '';
      const scores = { overall: score ?? Number(getParam('score')) ?? 0 };

      await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameA, nameB, dobA, dobB, scores, email })
      });

      // Show success message regardless of backend outcome (silent failures)
      toast.success('Your report is on its way! Check your inbox ✨');
    } catch (err) {
      console.error(err);
      // Silent failure: still show success message
      toast.success('Your report is on its way! Check your inbox ✨');
    } finally {
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

        <h3 className="text-2xl font-bold text-foreground mb-2">Get Full Report</h3>
        <p className="text-muted-foreground mb-6">
          Enter your email and we'll send the full AI-generated compatibility report.
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
            Submit
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-muted-foreground leading-relaxed">
          <strong>Privacy Note:</strong> We'll email you a copy of the AI report. Your birth dates are never stored.
        </p>
      </div>
    </div>
  );
}

export default SaveResultModal;
