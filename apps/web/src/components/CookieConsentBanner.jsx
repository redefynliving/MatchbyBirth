import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4">
      <div className="mx-auto max-w-2xl rounded-[1.5rem] border border-border/70 bg-card/95 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.12)] backdrop-blur-md sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <p className="text-xs leading-5 text-foreground sm:text-sm">
              This site uses cookies for analytics, preferences, and ads measurement. Google and other partners may use cookies as described in our policy.{' '}
              <Link to="/privacy" className="font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
                Learn more
              </Link>
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 shrink-0">
            <button
              onClick={handleDecline}
              className="rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Accept
            </button>
            <button
              onClick={handleDecline}
              className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieConsentBanner;
