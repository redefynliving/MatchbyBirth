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
      body: 'Date-only results still work. MBB uses each calendar birth date to read Sun sign placement, seasonal rhythm, life path number, and the basic timing pattern between people.',
    },
    {
      title: 'Optional time and place',
      icon: Clock3,
      body: 'Exact Mode is optional. Birth time and selected birth place help when someone was born near a sign boundary, where the same month and day can sometimes point to different signs.',
    },
    {
      title: 'Life path number',
      icon: Hash,
      body: 'Life path numbers add a second lens for pace, motivation, and default relationship style. They do not replace the birth-date reading; they give the result more texture.',
    },
    {
      title: 'Pair or group context',
      icon: Users,
      body: 'A two-person comparison is read differently from a group. Pair mode focuses on one direct dynamic; group mode checks every pairing before summarizing the overall room.',
    },
  ];

  const scoreNotes = [
    'A high score means the inputs point to several easy connection patterns, such as similar pace, compatible elements, or fewer obvious tension points.',
    'A middle score usually means a mix of overlap and difference. That can be useful when the people involved can name the difference instead of guessing at it.',
    'A lower score is not a verdict. It points to places where expectations, timing, emotional style, or communication may need more care.',
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
              Match by Birth turns birth details into a compatibility snapshot: where a connection may feel easy, where it may catch, and what is worth talking about next. It is a stronger conversation starter, not a prediction system, not a soulmate detector, and not a relationship verdict.
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
              The score compresses several signals into one readable number so the result is quick to understand. The number is only the entry point. The more useful part is the interpretation around it: strengths, watch areas, and the next conversation prompt.
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
                Pair mode focuses on two people. It is built for romantic, friendship, work, family, or general connection checks where the goal is to understand a direct dynamic: what may feel natural, what may need translation, and what to discuss earlier.
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground">Group mode</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Group mode compares every person against every other person, then summarizes the group rhythm. It is useful for friend groups, teams, families, and group trips because one strong or tense pair can change how the whole group feels.
              </p>
            </article>
          </section>

          <section className="mb-14 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">How relationship timing is framed</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Timing notes are written as conversation prompts, not guarantees. A result may suggest when to name expectations early, slow down a decision, or clarify planning pace. The point is not to tell people what will happen. The point is to make the next honest conversation easier to start.
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
              Birth dates are processed for the calculation and are not used for identity profiling. Optional birth time and place help refine sign placement, especially near cusp dates, but date-only readings remain available. Shared result links are opaque and do not expose raw birth details in the URL.
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
