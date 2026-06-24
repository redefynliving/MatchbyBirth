import React from 'react';
import { Link } from 'react-router-dom';
import { Check, LockKeyhole, Sparkles } from 'lucide-react';
import BackButton from '@/components/BackButton.jsx';

export default function PremiumPage() {
  return (
    <main className="section-spacing bg-background min-h-screen">
      <div className="content-container max-w-3xl mx-auto">
        <BackButton fallbackTo="/" label="Back to Calculator" />

        <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
          <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 md:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Premium reading</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                Go deeper than the free score.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                Unlock a private compatibility report with clear guidance on communication, emotional fit,
                likely friction points, and the practical side of making the relationship work.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  '9-section personalized report',
                  'Private email delivery',
                  'Relationship strengths and risks',
                  'Actionable next steps',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-border bg-muted/25 px-4 py-3 text-sm font-medium">
                    <Check className="h-4 w-4 text-primary" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Sparkles className="h-4 w-4" />
                  Run the calculator
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  <LockKeyhole className="h-4 w-4" />
                  See what’s inside
                </a>
              </div>
            </div>

            <aside id="how-it-works" className="border-t border-border bg-[linear-gradient(145deg,hsl(var(--secondary)),hsl(335_45%_96%))] p-8 md:border-l md:border-t-0 md:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">What you get</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">$9.99 one-time</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                The paid report is the fastest path to the deeper reading — but you’ll only see the checkout
                after you generate a free result.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  'Communication style breakdown',
                  'Emotional compatibility',
                  'Conflict patterns to watch',
                  'How to keep the connection strong',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                Privacy-first: no birth dates are stored.
              </p>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
