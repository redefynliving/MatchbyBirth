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
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics.js';
import { getFunnelAttribution } from '@/lib/funnel-attribution.js';
import { getReportFocusConfig } from '@/lib/report-focus.js';

const FEATURE_ICONS = {
  alert: TriangleAlert,
  compass: Compass,
  heart: HeartHandshake,
  message: MessageCircle,
  sparkles: Sparkles,
};

function SaveResultModal({
  isOpen,
  onClose,
  resultId,
  resultUrl,
  names,
  reportType = 'standard',
  reportFocus = 'full_compatibility',
  defaultClarityGoal = null,
  funnelContext = null,
}) {
  const reportConfig = getReportFocusConfig(reportFocus);
  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [status, setStatus] = useState('idle');
  const [showPreview, setShowPreview] = useState(false);
  const [clarityGoal, setClarityGoal] = useState(
    defaultClarityGoal || reportConfig.defaultClarityGoal,
  );
  const offer = {
    ...reportConfig,
    type: reportType === 'deep_synastry' ? 'deep_synastry' : 'standard',
    priceCents: 999,
    priceLabel: '$9.99',
    features: [
      ...reportConfig.features,
      ...(reportType === 'deep_synastry'
        ? [['sparkles', 'Timed aspect evidence', 'Calculated aspect labels and measured orbs are added without changing the report focus.']]
        : []),
    ],
  };

  useEffect(() => {
    if (isOpen) {
      setClarityGoal(defaultClarityGoal || reportConfig.defaultClarityGoal);
      trackEvent('report_upsell_viewed', {
        mode: 'pair',
        report_type: offer.type,
        report_focus: reportFocus,
        price: offer.priceCents,
        currency: 'usd',
        ...(funnelContext || {}),
        ...getFunnelAttribution(),
      });
    }
    return undefined;
  }, [isOpen, defaultClarityGoal, reportConfig.defaultClarityGoal, reportFocus, offer.type]);

  if (!isOpen) return null;

  const checkoutTrustBadges = [
    [ShieldCheck, 'Refund support available'],
    [LockKeyhole, 'Secure Stripe checkout'],
    [MessageCircle, 'Instant email delivery'],
  ];

  const startCheckout = async (event) => {
    event.preventDefault();
    setStatus('loading');
	    trackEvent('checkout_started', {
	      mode: 'pair',
	      report_type: offer.type,
	      report_focus: reportFocus,
	      clarity_goal: clarityGoal,
	      price: offer.priceCents,
	      currency: 'usd',
	      discount_applied: false,
	      ...(funnelContext || {}),
	      ...getFunnelAttribution(),
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
          reportType: offer.type,
          reportFocus,
          clarityGoal,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Unable to start checkout.');
      }
      if (!data.url) throw new Error('Checkout did not return a payment link.');
	      trackEvent('checkout_redirected', {
	        mode: 'pair',
	        report_type: offer.type,
	        report_focus: reportFocus,
	        clarity_goal: clarityGoal,
	        price: offer.priceCents,
	        currency: 'usd',
	        ...(funnelContext || {}),
	        ...getFunnelAttribution(),
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
                <h3 className="font-bold text-foreground">{offer.previewTitle}</h3>
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
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">Chapter 1 · Section 1 of 9</span>
	                <h4 className="font-extrabold text-foreground mt-2 mb-3">{offer.previewHeading}</h4>
	                <p className="text-xs text-muted-foreground leading-relaxed">{offer.previewCopy}</p>
	                <div className="mt-4 filter blur-[3.5px] select-none text-xs text-muted-foreground leading-relaxed space-y-2">
	                  <p>The first section uses your calculated evidence and score spread to explain one situation you can recognize in daily life.</p>
	                  <p>The later sections add a direct question, a script you can use, and a short way to check the reading against real behavior.</p>
	                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent flex flex-col justify-end items-center p-6 text-center pb-8 z-10">
                  <LockKeyhole className="h-8 w-8 text-primary mb-3" />
	                  <p className="font-bold text-sm text-foreground">Purchase to unlock all four chapters</p>
	                  <p className="text-xs text-muted-foreground max-w-xs mt-1">Unlock all nine sections across Overview, Relating, Building, and Action plan, plus private link access and a PDF copy.</p>
	                </div>
	                <div className="filter blur-[5px] select-none text-xs text-muted-foreground leading-relaxed space-y-2">
	                  <h4 className="font-bold text-foreground">Section 2: Built for this report focus</h4>
	                  <p>Each section has a different job and stays tied to the Moon, Crush, Life Path, or full compatibility evidence selected for this result.</p>
	                </div>
              </div>
            </div>
          </div>
        )}

        <section className="p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {offer.eyebrow}
          </p>
          <h2 id="report-modal-title" className="mt-3 pr-8 text-3xl font-semibold tracking-tight">
            {offer.title}
          </h2>
          <p className="mt-2 text-sm font-medium text-foreground">
            {names.join(' + ')}
          </p>
	          <p className="mt-3 text-sm leading-6 text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1">
	            <span>{offer.summary}</span>
	            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="text-primary hover:text-primary/80 font-bold inline-flex items-center gap-1 hover:underline"
            >
              <Eye className="h-3.5 w-3.5" /> Preview Report
            </button>
          </p>

          <div className="mt-6 divide-y divide-border">
            {offer.features.map(([iconKey, title, description]) => {
              const Icon = FEATURE_ICONS[iconKey];
              return (
              <div key={title} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
                </div>
              </div>
              );
            })}
          </div>
        </section>

        <section className="border-t border-border bg-[linear-gradient(145deg,hsl(var(--secondary)),hsl(335_45%_95%))] p-6 md:border-l md:border-t-0 md:p-8 flex flex-col justify-between">
          <div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-card text-primary shadow-sm">
              <LockKeyhole className="h-4 w-4" />
            </span>
            <h3 className="mt-5 text-xl font-semibold text-foreground">Get the full report</h3>
	            <p className="mt-2 text-sm leading-6 text-foreground/90">
	              Private link and PDF delivered by email. Birth dates and your email stay out of the report-writing request.
	            </p>

	            <div className="mt-5 rounded-2xl border border-primary/20 bg-card/70 p-4">
	              <p className="text-xs font-bold uppercase tracking-wider text-primary">
	                One-time digital report
	              </p>
	              <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
	                {offer.priceLabel} <span className="text-xs font-medium tracking-normal text-foreground/80">one-time</span>
	              </p>
	              <p className="mt-2 text-xs leading-5 text-muted-foreground">
	                {offer.detail} Refund support is available for delivery or access issues.
	              </p>
	            </div>
          </div>

          <form onSubmit={startCheckout} className="mt-4 space-y-4">
            <fieldset>
              <legend className="mb-2 block text-sm font-semibold text-foreground">
                {offer.clarityPrompt}
              </legend>
              <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-1">
                {offer.clarityGoals.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setClarityGoal(value)}
                    aria-pressed={clarityGoal === value}
                    className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-colors ${
                      clarityGoal === value
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-foreground hover:border-primary/50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

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

            <div className="grid gap-2 rounded-2xl border border-border/80 bg-card/70 p-3 text-left">
              {checkoutTrustBadges.map(([Icon, label]) => (
                <span key={label} className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {label}
                </span>
              ))}
            </div>

            <button
              type="submit"
              className="btn-primary h-12 w-full rounded-xl font-semibold cursor-pointer"
              disabled={status === 'loading'}
            >
	              {status === 'loading' ? 'Opening secure checkout...' : offer.button}
            </button>
          </form>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-foreground/80">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
	            Payment is handled by Stripe. Reports are for reflection and conversation, not professional advice.
	          </p>
        </section>
      </div>
    </div>
  );
}

export default SaveResultModal;
