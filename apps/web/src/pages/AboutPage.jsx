import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { CalendarDays, Lock, MessageCircle, UserRound } from 'lucide-react';
import BackButton from '@/components/BackButton.jsx';

const trustNotes = [
  {
    title: 'For the connection you keep thinking about',
    body: 'Romantic, friendship, family, work, or group. If the dynamic has a shape but not a name yet, this gives you a place to start.',
  },
  {
    title: 'What it reads',
    body: 'Birth date, zodiac sign, life path number, and the kind of relationship. Time and place are optional for sharper sign placement near cusp dates.',
  },
  {
    title: 'What it refuses to do',
    body: 'No soulmate verdict. No future prediction. No pretending a score knows more than the people in the relationship.',
  },
];

const principles = [
  {
    icon: CalendarDays,
    title: 'Start simple',
    body: 'Names and birth dates are enough. Add time and place only when precision matters.',
  },
  {
    icon: MessageCircle,
    title: 'Give it language',
    body: 'A good result names what feels easy, what catches, and what to ask next.',
  },
  {
    icon: Lock,
    title: 'Keep it private',
    body: 'Birth details are used for the reading, not identity profiling. Shared links stay opaque.',
  },
];

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

      <main role="main" className="min-h-screen bg-background">
        <section className="border-b border-border/70 bg-muted/20 py-12 md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <BackButton fallbackTo="/" label="Back to Calculator" />

            <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <header className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  About Match by Birth
                </p>
                <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl">
                  Some people feel familiar right away.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  Match by Birth started with a question: why do some people feel familiar before you know much about them? This site turns that curiosity into a simple way to explore connection.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/#calculator"
                    aria-label="Try the calculator"
                    className="btn-primary inline-flex justify-center rounded-xl px-5 py-3 text-sm font-semibold"
                  >
                    Try the calculator
                  </Link>
                  <Link
                    to="/how-it-works"
                    className="inline-flex justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-secondary/40"
                  >
                    Read how it works
                  </Link>
                </div>
              </header>

              <aside className="border-l-4 border-primary bg-card px-6 py-6 shadow-sm md:px-8 md:py-8">
                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-full border border-primary/20 bg-primary/10 text-base font-semibold text-primary">
                    AJ
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                      Written and edited by
                    </p>
                    <p className="text-2xl font-semibold tracking-tight text-foreground">AJ FOX</p>
                  </div>
                </div>
                <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                  I kept guessing birthdays before people said them out loud. That weird little habit turned into this project.
                </p>
                <div className="mt-6 border-t border-border pt-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    The first clue
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-foreground">
                    If someone felt like my sister, I'd bet on a May birthday. No logic, just a gut feeling.
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    It still feels strange when the feeling is right. Leo Sun, Cancer Moon, Libra Rising. Make of that what you will.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-5 md:grid-cols-[1fr_1.12fr_0.92fr]">
              {principles.map((principle) => {
                const Icon = principle.icon;
                return (
                  <article key={principle.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h2 className="mt-5 text-xl font-semibold tracking-tight text-foreground">{principle.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{principle.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-border/70 bg-card py-14 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                What this is
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                A lens, not a verdict.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                The point is not to flatten someone into a sign or number. The point is to notice the rhythm: timing, communication, friction, ease.
              </p>
            </div>

            <div className="space-y-7 pt-3 lg:pt-0">
              {trustNotes.map((note) => (
                <article key={note.title} className="max-w-2xl border-t border-border pt-5 first:ml-6 first:border-t-0 first:pt-0 md:odd:ml-8 md:even:ml-0">
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">{note.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">{note.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  How privacy works
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  Private by default, useful by design.
                </h2>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                  Birth dates are used for the reading, not identity profiling. Shared result links use opaque URLs. Paid report checkout is handled by Stripe, and email features include unsubscribe controls.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-muted/20 p-6">
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <UserRound className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">Support and feedback</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Questions, corrections, and support requests can be sent to{' '}
                      <a href="mailto:support@matchbybirth.com" className="font-semibold text-primary hover:underline">
                        support@matchbybirth.com
                      </a>
                      . I actually read it. That is where the sharper version of this tool will come from.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 border-t border-border pt-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    Start with two dates
                  </p>
                  <p className="mt-2 text-lg font-semibold text-foreground">
                    See what shows up.
                  </p>
                </div>
                <Link
                  to="/#calculator"
                  className="btn-primary inline-flex justify-center rounded-xl px-5 py-3 text-sm font-semibold"
                >
                  Try Match by Birth
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default AboutPage;
