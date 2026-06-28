import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import BackButton from '@/components/BackButton.jsx';
import { CalendarDays, Hash, Users, LockKeyhole, Clock3, Scale } from 'lucide-react';

function HowItWorksPage() {
  const inputs = [
    {
      title: 'Birth date',
      icon: CalendarDays,
      body: 'The core calculator starts with each person\'s birth date to identify sign placement, seasonal pattern, and date-based compatibility signals.',
    },
    {
      title: 'Optional time and place',
      icon: Clock3,
      body: 'MBB Exact Mode can use birth time and selected birth place when someone is close to a sign boundary and wants a more precise Sun sign check.',
    },
    {
      title: 'Life path number',
      icon: Hash,
      body: 'The reading can include a simple numerology layer to give the score another reflection point beyond zodiac sign alone.',
    },
    {
      title: 'Pair or group context',
      icon: Users,
      body: 'A two-person comparison is read differently from a group. Group mode looks at every pair ranking and the overall group rhythm.',
    },
  ];

  const scoreNotes = [
    'A high score means the inputs point to several easy connection patterns.',
    'A middle score usually means a mix of natural overlap and useful differences.',
    'A lower score is not a verdict. It points to places where expectations, timing, or communication may need more care.',
  ];

  return (
    <>
      <Helmet>
        <title>How Match by Birth Works | Compatibility Methodology</title>
        <meta
          name="description"
          content="Learn how Match by Birth uses birth dates, optional birth time and place, zodiac signs, life path numbers, pair mode, and group mode to frame compatibility responsibly."
        />
        <link rel="canonical" href="https://matchbybirth.com/how-it-works" />
      </Helmet>

      <main className="min-h-screen bg-background py-12 md:py-20">
        <div className="content-container max-w-5xl">
          <BackButton fallbackTo="/" label="Back to Calculator" />

          <header className="max-w-3xl mb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              MBB methodology
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
              How Match by Birth works
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Match by Birth turns birth details into a compatibility snapshot: where a connection may feel easy, where it may catch, and what is worth talking about next. It is a reflection tool, not a prediction system or a relationship verdict.
            </p>
          </header>

          <section className="grid gap-4 md:grid-cols-2 mb-14" aria-label="Inputs used by Match by Birth">
            {inputs.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </article>
              );
            })}
          </section>

          <section className="mb-14 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Scale className="h-5 w-5" />
              </span>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">What the score means</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-5">
              The score compresses several signals into one readable number so the result is quick to understand. The more useful part is the interpretation around it: strengths, watch areas, and the next conversation prompt.
            </p>
            <ul className="space-y-3">
              {scoreNotes.map((note) => (
                <li key={note} className="rounded-xl border border-border/70 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                  {note}
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-6 md:grid-cols-2 mb-14">
            <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground">Pair mode</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Pair mode focuses on two people. It is built for romantic, friendship, work, family, or general connection checks where the goal is to understand a direct dynamic between two birth patterns.
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground">Group mode</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Group mode compares every person against every other person, then summarizes the group rhythm. It is useful for friend groups, teams, families, and group trips where one pair can change the room.
              </p>
            </article>
          </section>

          <section className="mb-14 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">How relationship timing is framed</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Timing notes are written as conversation prompts, not guarantees. A result may suggest when to name expectations early, slow down a decision, or clarify planning pace. It should help people talk sooner and more clearly, not outsource judgment.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <LockKeyhole className="h-5 w-5" />
              </span>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Privacy and limits</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Birth dates are processed for the calculation and are not used for identity profiling. Optional birth time and place help refine sign placement, especially near cusp dates. Shared result links are opaque and do not expose raw birth details in the URL.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/#calculator" className="btn-primary rounded-xl px-5 py-3 text-sm font-semibold text-center">
                Try the calculator
              </Link>
              <Link to="/blog/what-compatibility-score-means" className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-primary text-center hover:bg-secondary/40">
                Read the score guide
              </Link>
              <Link to="/blog" className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-primary text-center hover:bg-secondary/40">
                Browse guides
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default HowItWorksPage;
