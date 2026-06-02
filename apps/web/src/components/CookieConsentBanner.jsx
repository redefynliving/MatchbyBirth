
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Small delay so it doesn't jarringly appear instantly
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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 md:pb-8 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl shadow-lg p-5 sm:p-6 pointer-events-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex-1 pr-4">
          <h3 className="text-base font-semibold text-foreground mb-1">We value your privacy</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
          </p>
        </div>
        <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto shrink-0">
          <button
            onClick={handleAccept}
            className="flex-1 sm:flex-none btn-primary text-sm"
          >
            Accept
          </button>
          <div className="flex gap-3 sm:flex-col w-full sm:w-auto">
            <Link
              to="/privacy"
              className="flex-1 sm:flex-none text-center px-4 py-2.5 bg-muted text-foreground text-sm font-medium rounded-lg hover:bg-muted/80 transition-colors"
              onClick={() => setIsVisible(false)}
            >
              Learn More
            </Link>
          </div>
        </div>
        <button 
          onClick={handleDecline}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default CookieConsentBanner;
