import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import BackButton from '@/components/BackButton.jsx';

function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Match by Birth | Compatibility Tool</title>
        <meta
          name="description"
          content="Learn about AJ FOX, why Match by Birth was created, what the compatibility calculator does, what it does not claim, and how birth details are handled."
        />
        <link rel="canonical" href="https://matchbybirth.com/about" />
      </Helmet>

      <main role="main" className="min-h-screen bg-background py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <BackButton fallbackTo="/" label="Back to Calculator" />

          <article className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              About Match by Birth
            </p>

            <header className="mt-4 mb-10 max-w-3xl">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                A clearer way to talk about compatibility.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Match by Birth was created by AJ FOX as a private compatibility tool for people who want a quick, readable way to compare birth patterns. It turns birth details into strengths, watch areas, and conversation prompts you can actually use.
              </p>
              <div className="mt-6">
                <Link
                  to="/#calculator"
                  aria-label="Try the calculator"
                  className="btn-primary inline-flex rounded-xl px-5 py-3 text-sm font-semibold"
                >
                  Try the calculator
                </Link>
              </div>
            </header>

            <div className="space-y-8">
              <section className="border-t border-border pt-8">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Who writes Match by Birth</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Match by Birth is written and edited by AJ FOX. AJ has a Leo Sun, Cancer Moon, and Libra Rising, which is part of why the site is built around both instinct and explanation. Before building the calculator, AJ noticed a strange pattern: people who reminded him of his sister often felt like May birthdays. He would guess May before knowing their actual birthday, not because there was a system yet, but because the personality pattern felt familiar.
                </p>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Astrology and numerology later gave that habit more language. Match by Birth grew out of that same question: why do some people feel familiar before you can explain why?
                </p>
              </section>

              <section className="border-t border-border pt-8">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Who it is for</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Match by Birth is for people comparing romantic partners, friendships, families, work relationships, or groups. It is useful when you want language for a connection that feels obvious, confusing, easy, tense, or hard to explain.
                </p>
              </section>

              <section className="border-t border-border pt-8">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">What the tool does</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  The calculator uses birth date, zodiac sign, life path number, and pair or group context to create a compatibility snapshot. Optional birth time and place can refine sign placement for cusp birthdays or anyone who wants a more precise reading.
                </p>
              </section>

              <section className="border-t border-border pt-8">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">What it does not claim</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Match by Birth does not predict the future, diagnose relationships, promise outcomes, or decide whether someone is right for you. It is better used as entertainment, reflection, and a conversation starter.
                </p>
              </section>

              <section className="border-t border-border pt-8">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">How privacy works</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Birth dates are processed for the calculation and are not used for identity profiling. Shared result links use opaque URLs and do not put raw birth details in the address. Paid report checkout is handled by Stripe, and email features include unsubscribe controls.
                </p>
              </section>

              <section className="border-t border-border pt-8">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Support and feedback</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Questions, corrections, and support requests can be sent to{' '}
                  <a href="mailto:support@matchbybirth.com" className="font-semibold text-primary hover:underline">
                    support@matchbybirth.com
                  </a>
                  . We review feedback to make the calculator clearer, more useful, and easier to understand.
                </p>
              </section>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}

export default AboutPage;
