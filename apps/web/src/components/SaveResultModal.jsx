import React, { useEffect, useState } from 'react';
import {
  Compass,
  HeartHandshake,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  TriangleAlert,
  X,
  Eye,
  Timer,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics.js';

function SaveResultModal({ isOpen, onClose, resultId, resultUrl, names }) {
  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [status, setStatus] = useState('idle');
  const [timeRemaining, setTimeRemaining] = useState(900);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isOpen) {
      trackEvent('report_upsell_viewed', {
        mode: 'pair',
        price: 999,
        currency: 'usd',
      });

      // Initialize or read offer expiry time
      let expiry = localStorage.getItem('mb_offer_expires');
      if (!expiry) {
        expiry = (Date.now() + 15 * 60 * 1000).toString();
        localStorage.setItem('mb_offer_expires', expiry);
      }

      const updateTimer = () => {
        const remaining = Math.max(0, Math.floor((parseInt(expiry, 10) - Date.now()) / 1000));
        setTimeRemaining(remaining);
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startCheckout = async (event) => {
    event.preventDefault();
    setStatus('loading');
    trackEvent('checkout_started', {
      mode: 'pair',
      price: timeRemaining > 0 ? 699 : 999,
      currency: 'usd',
      discount_applied: timeRemaining > 0,
    });

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resultId,
          email,
          marketingConsent,
          resultUrl,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Unable to start checkout.');
      }
      if (!data.url) throw new Error('Checkout did not return a payment link.');
      trackEvent('checkout_redirected', {
        mode: 'pair',
        price: timeRemaining > 0 ? 699 : 999,
        currency: 'usd',
      });
      window.location.assign(data.url);
    } catch (error) {
      setStatus('error');
      toast.error(error.message || 'Unable to start checkout.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
        className="relative grid max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl md:grid-cols-[1.05fr_0.95fr] overflow-hidden"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-card/80 p-2 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Close checkout"
        >
          <X className="h-5 w-5" />
        </button>

        {/* SAMPLE REPORT PREVIEW OVERLAY */}
        {showPreview && (
          <div className="absolute inset-0 z-20 bg-background/95 flex flex-col p-6 md:p-8 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-foreground">Premium Report Preview</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="btn-secondary rounded-lg px-3 py-1.5 text-xs font-semibold"
              >
                Return to Purchase
              </button>
            </div>

            <div className="flex-1 space-y-6 max-w-xl mx-auto text-left">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">Section 1 of 9</span>
                <h4 className="font-extrabold text-foreground mt-2 mb-3">Solar ego alignments & life directions</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The Sun represents your core identity, ego drive, and where you seek expression. {names[0]}'s Sun in Aries forms a trine aspect to {names[1]}'s Sun in Leo, creating a powerful flow of mutual creative encouragement.
                </p>
                <div className="mt-4 filter blur-[3.5px] select-none text-xs text-muted-foreground leading-relaxed space-y-2">
                  <p>In this solar relationship, your wills are aligned. You push one another to lead and take calculated risks, finding validation in each other's achievements. You operate at a fast pace and share a love for active recognition.</p>
                  <p>However, when Martian impulses conflict, Aries may spark Leo's pride, creating a localized storm of wills. This can be mitigated by remembering to delegate roles rather than trying to rule the same space at once.</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent flex flex-col justify-end items-center p-6 text-center pb-8 z-10">
                  <LockKeyhole className="h-8 w-8 text-primary mb-3" />
                  <p className="font-bold text-sm text-foreground">Purchase to unlock sections 2-9</p>
                  <p className="text-xs text-muted-foreground max-w-xs mt-1">Unlock emotional synastry, communication flows, planetary houses, and conflict mitigation guides.</p>
                </div>
                <div className="filter blur-[5px] select-none text-xs text-muted-foreground leading-relaxed space-y-2">
                  <h4 className="font-bold text-foreground">Section 2: Emotional synastry (Lunar elements)</h4>
                  <p>The Moon represents your emotional safety, pacing, and subconscious habits. Here we calculate how your watery and earthy moon placements connect, showing why you find intuitive comfort in each other's quiet presence.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <section className="p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Detailed compatibility report
          </p>
          <h2 id="report-modal-title" className="mt-3 pr-8 text-3xl font-semibold tracking-tight">
            A closer look at your match
          </h2>
          <p className="mt-2 text-sm font-medium text-foreground">
            {names.join(' + ')}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>A 9-section report based on your compatibility result.</span>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="text-primary hover:text-primary/80 font-bold inline-flex items-center gap-1 hover:underline"
            >
              <Eye className="h-3.5 w-3.5" /> Preview Report
            </button>
          </p>

          <div className="mt-6 divide-y divide-border">
            {[
              [MessageCircle, 'How you communicate', 'Where conversations may feel easy or get crossed.'],
              [HeartHandshake, 'Where you connect naturally', 'The qualities that may work well between you.'],
              [TriangleAlert, 'Where misunderstandings may happen', 'Differences that could cause confusion or conflict.'],
              [Compass, 'Practical ways to handle differences', 'Simple suggestions based on your scores.'],
            ].map(([Icon, title, description]) => (
              <div key={title} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-[linear-gradient(145deg,hsl(var(--secondary)),hsl(335_45%_95%))] p-6 md:border-l md:border-t-0 md:p-8 flex flex-col justify-between">
          <div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-card text-primary shadow-sm">
              <LockKeyhole className="h-4 w-4" />
            </span>
            <h3 className="mt-5 text-xl font-semibold text-foreground">Get the full report</h3>
            <p className="mt-2 text-sm leading-6 text-foreground/90">
              Private link and PDF delivered by email.
            </p>

            {timeRemaining > 0 ? (
              <div className="mt-5 bg-card/60 border border-primary/20 rounded-2xl p-4 space-y-1 text-left relative overflow-hidden">
                <p className="text-xs font-bold text-primary flex items-center gap-1 uppercase tracking-wider">
                  <Timer className="h-3.5 w-3.5 animate-pulse" /> 15m Urgency Discount
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black tracking-tight text-foreground">$6.99</p>
                  <p className="text-sm line-through text-muted-foreground">$9.99</p>
                </div>
                <p className="text-[10px] text-muted-foreground/95 leading-relaxed">
                  Enter coupon code <strong className="text-primary font-bold">COSMIC30</strong> in checkout. Expires in <strong>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</strong>
                </p>
              </div>
            ) : (
              <p className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
                $9.99 <span className="text-xs font-medium tracking-normal text-foreground/80">one-time</span>
              </p>
            )}
          </div>

          <form onSubmit={startCheckout} className="mt-4 space-y-4">
            <div>
              <label htmlFor="report-email" className="mb-2 block text-sm font-semibold text-foreground">
                Email address
              </label>
              <input
                id="report-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="input h-12 bg-card text-foreground placeholder:text-muted-foreground border-border w-full"
              />
            </div>

            <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-foreground/90">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(event) => setMarketingConsent(event.target.checked)}
                className="mt-1"
              />
              <span>Send me occasional Match by Birth updates. Optional, and you can unsubscribe anytime.</span>
            </label>

            <button
              type="submit"
              className="btn-primary h-12 w-full rounded-xl font-semibold cursor-pointer"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Opening secure checkout...' : timeRemaining > 0 ? 'Claim Offer for $6.99' : 'Buy report for $9.99'}
            </button>
          </form>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-foreground/80">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Payment is handled by Stripe. Your birth dates are not stored.
          </p>
        </section>
      </div>
    </div>
  );
}

export default SaveResultModal;
