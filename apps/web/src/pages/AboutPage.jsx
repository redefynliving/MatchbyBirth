import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { CalendarDays, Lock, MessageCircle, UserRound } from 'lucide-react';
import BackButton from '@/components/BackButton.jsx';

const trustNotes = [
  {
    title: 'Who it is for',
    body: 'People comparing a romantic connection, friendship, family dynamic, work relationship, or group. It is useful when a connection feels obvious, confusing, easy, tense, or hard to explain.',
  },
  {
    title: 'What the tool does',
    body: 'The calculator uses birth date, zodiac sign, life path number, and pair or group context to create a compatibility snapshot. Optional birth time and place can refine sign placement for cusp birthdays.',
  },
  {
    title: 'What it does not claim',
    body: 'Match by Birth does not predict the future, diagnose relationships, promise outcomes, or decide whether someone is right for you. It is for reflection, entertainment, and better conversation.',
  },
];

const principles = [
  {
    icon: CalendarDays,
    title: 'Birth details stay practical',
    body: 'Names and dates are enough for a quick reading. Time and place are optional when someone wants a more precise sign check.',
  },
  {
    icon: MessageCircle,
    title: 'The result should start a real conversation',
    body: 'A useful reading names a strength, a friction point, and one thing worth talking about next.',
  },
  {
    icon: Lock,
    title: 'Privacy matters',
    body: 'Birth dates are processed for the calculation and are not used for identity profiling. Shared links do not expose raw birth details.',
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
                  Built from a pattern I kept noticing.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  Match by Birth was created by AJ FOX as a private compatibility tool for people who want language for the connections they already feel. It turns simple birth details into strengths, watch areas, and conversation prompts you can actually use.
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
                  Leo Sun, Cancer Moon, and Libra Rising. That mix is part of why this site is built around both instinct and explanation: what you notice first, and how you finally put words to it.
                </p>
                <div className="mt-6 border-t border-border pt-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    The first clue
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-foreground">
                    Before there was a calculator, AJ kept guessing May birthdays. People who reminded him of his sister had a familiar rhythm, and he would guess May before knowing their birthday. Match by Birth grew from that kind of question: why do some people feel familiar before you can explain why?
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-5 md:grid-cols-3">
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
                A compatibility tool, not a verdict.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                The point is not to flatten someone into a sign or number. The point is to notice patterns in timing, communication, emotional style, and group rhythm so people have something clearer to talk about.
              </p>
            </div>

            <div className="space-y-5">
              {trustNotes.map((note) => (
                <article key={note.title} className="border-t border-border pt-5 first:border-t-0 first:pt-0">
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
                  Birth dates are processed for the calculation and are not used for identity profiling. Shared result links use opaque URLs and do not put raw birth details in the address. Paid report checkout is handled by Stripe, and email features include unsubscribe controls.
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
                      . Feedback helps make the calculator clearer, more useful, and easier to understand.
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
                    See the pattern, then decide what conversation comes next.
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
