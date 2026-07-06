import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { SITE_URL } from '@/lib/blogSeo.js';
import { Check, Crown, Heart, Mail, Sparkles, Stars, Zap } from 'lucide-react';
import BackButton from '@/components/BackButton.jsx';

const SUBSCRIPTION_PRICE = '$9.99/month';

export default function PremiumPage() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const resultId = searchParams.get('result_id') || searchParams.get('resultId') || '';
  const subscribed = searchParams.get('subscribed') === '1';
  const cancelled = searchParams.get('subscribed') === '0';

  const highlights = useMemo(() => ([
    {
      title: 'Weekly relationship intel',
      text: 'A concise email every Monday with compatibility insights you can actually use.',
      icon: Mail,
    },
    {
      title: 'Saved result connection',
      text: 'If you paste the same email you used on your result, we connect the dots for future intel.',
      icon: Heart,
    },
    {
      title: 'Premium depth without noise',
      text: 'Short, practical emails with timing notes, reflection prompts, and new compatibility guides.',
      icon: Stars,
    },
  ]), []);

  const startSubscription = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const response = await fetch('/api/create-subscription-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resultId }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Unable to start subscription checkout.');
      }
      if (!data.url) throw new Error('Checkout did not return a payment link.');
      window.location.assign(data.url);
    } catch (subscriptionError) {
      setStatus('error');
      setError(subscriptionError.message || 'Unable to start subscription checkout.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Weekly Match Intel | Match by Birth</title>
	        <meta
	          name="description"
	          content="Get weekly Match by Birth compatibility notes by email, with private delivery, unsubscribe controls, and practical relationship prompts."
	        />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={`${SITE_URL}/premium`} />
      </Helmet>

      <main className="relative overflow-hidden bg-background">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(275_86%_78%_/_0.32),transparent_28%),radial-gradient(circle_at_80%_10%,hsl(331_86%_78%_/_0.22),transparent_24%),linear-gradient(180deg,hsl(var(--secondary)/0.55),transparent_35%)]" />
        <div className="section-spacing relative">
          <div className="content-container max-w-6xl">
            <BackButton fallbackTo="/" label="Back to Calculator" />

            {(subscribed || cancelled) && (
              <div className={`mb-8 rounded-3xl border px-5 py-4 shadow-sm ${subscribed ? 'border-primary/20 bg-primary/10' : 'border-border bg-card'}`}>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  {subscribed ? 'You are in' : 'No problem'}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {subscribed
                    ? 'Your subscription checkout is complete. Watch your inbox for the welcome email and first weekly intel.'
                    : 'Your subscription checkout was cancelled. You can come back anytime.'}
                </p>
              </div>
            )}

            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <section className="relative overflow-hidden rounded-[2rem] border border-border bg-[linear-gradient(145deg,hsl(var(--card)),hsl(334_55%_97%))] p-6 shadow-[0_24px_80px_rgba(53,34,79,0.12)] sm:p-8 lg:p-12">
                <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-fuchsia-400/10 blur-3xl" />

                <div className="relative z-10 max-w-2xl">
                  <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary backdrop-blur">
                    <Crown className="h-3.5 w-3.5" />
                    Weekly match intel
                  </p>
	                  <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">
	                    Compatibility notes you can actually use.
	                  </h1>
	                  <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
	                    Get one polished email a week with timing notes, compatibility prompts, and a private path back to your saved result. It is built for reflection and conversation, not predictions.
	                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Free calculator stays free
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2">
                      <Zap className="h-4 w-4 text-primary" />
                      Cancel anytime
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2">
                      <Heart className="h-4 w-4 text-primary" />
                      No birth dates stored
                    </span>
                  </div>

                  <div className="mt-10 grid gap-4 sm:grid-cols-3">
                    {highlights.map(({ title, text, icon: Icon }) => (
                      <div key={title} className="rounded-3xl border border-border bg-white/80 p-5 shadow-sm backdrop-blur">
                        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h2 className="mt-4 text-sm font-semibold text-foreground">{title}</h2>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <aside className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_18px_50px_rgba(53,34,79,0.08)] sm:p-8 lg:sticky lg:top-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  <Mail className="h-3.5 w-3.5" />
                  Monthly membership
                </div>
                <p className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-foreground">
                  {SUBSCRIPTION_PRICE}
                </p>
	                <p className="mt-2 text-sm leading-6 text-muted-foreground">
	                  A recurring subscription for weekly notes, saved-result connections, and practical relationship prompts. Birth dates are not stored.
	                </p>

                <form onSubmit={startSubscription} className="mt-8 space-y-4">
                  <div>
                    <label htmlFor="subscription-email" className="mb-2 block text-sm font-medium text-foreground">
                      Email address
                    </label>
                    <input
                      id="subscription-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className="input h-12 bg-muted/25"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary h-12 w-full rounded-2xl text-sm font-semibold shadow-lg shadow-primary/20"
                  >
                    {status === 'loading' ? 'Opening secure checkout...' : 'Join weekly intel'}
                  </button>

	                  <p className="text-center text-xs leading-5 text-muted-foreground">
	                    By continuing, you agree to recurring billing. Cancel anytime. This is reflection content, not professional advice.
	                  </p>
                </form>

                <div className="mt-8 space-y-3 rounded-3xl border border-border bg-muted/25 p-5">
                  {[
	                    'Weekly email with practical compatibility notes',
	                    'Private path back to your saved result',
	                    'No birth dates stored, ever',
	                    'Unsubscribe controls included',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="leading-6">{item}</span>
                    </div>
                  ))}
                </div>

                {status === 'error' && error && (
                  <p role="alert" className="mt-4 text-sm text-destructive">
                    {error}
                  </p>
                )}
              </aside>
            </div>

            <section className="mt-8 grid gap-4 rounded-[2rem] border border-border bg-card p-6 shadow-sm md:grid-cols-3 md:p-8">
              {[
                ['Step 1', 'Free result', 'Run the calculator and get a polished compatibility score.'],
                ['Step 2', 'Subscribe', 'Enter your email and join the weekly intel membership.'],
	                ['Step 3', 'Use the prompts', 'Read the weekly note, save what feels useful, and unsubscribe anytime.'],
              ].map(([step, title, text]) => (
                <div key={step} className="rounded-2xl border border-border bg-muted/20 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{step}</p>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              ))}
	            </section>

	            <section className="mt-8 rounded-[2rem] border border-border bg-card p-6 shadow-sm md:p-8">
	              <h2 className="text-xl font-semibold tracking-tight text-foreground">Paid report support</h2>
	              <p className="mt-3 text-sm leading-6 text-muted-foreground">
	                One-time compatibility reports are delivered by private link and email after Stripe checkout. Birth dates and checkout emails are not sent to the AI provider.
	              </p>
	              <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
	                <Link to="/report-delivery" className="text-primary hover:underline">Report delivery</Link>
	                <Link to="/refund-policy" className="text-primary hover:underline">Refund policy</Link>
	                <a href="mailto:support@matchbybirth.com" className="text-primary hover:underline">support@matchbybirth.com</a>
	              </div>
	            </section>
	          </div>
        </div>
      </main>
    </>
  );
}
