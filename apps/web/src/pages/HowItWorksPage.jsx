import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const inputRows = [
  ['Birth date', 'Used to identify the calendar-based compatibility pattern for each person.'],
  ['Optional birth time', 'Used with a selected place in MBB Exact Mode to calculate a high-precision Sun sign.'],
  ['Birth place', 'A selected birth place supplies timezone context so the same clock time is interpreted correctly.'],
  ['Zodiac sign', 'Used for sign, element, and modality comparisons that explain relationship style.'],
  ['Life path number', 'Used as a numerology layer for motivation, pacing, and personal direction.'],
  ['Pair or group context', 'Used to decide whether the result should explain one relationship or many pair dynamics.'],
];

const scoreRows = [
  ['High score', 'Usually means the symbolic patterns are easier to translate into shared rhythm, communication, or attraction.'],
  ['Middle score', 'Usually means the connection has useful strengths plus areas that need clearer expectations.'],
  ['Low score', 'Usually means the relationship may involve stronger differences in pace, needs, or conflict style.'],
];

function HowItWorksPage() {
  return (
    <>
      <Helmet>
        <title>How Match by Birth Works | Methodology</title>
        <meta
          name="description"
          content="Learn the Match by Birth methodology: how birth dates, MBB Exact Mode, zodiac signs, life path numbers, pair mode, and group mode shape compatibility scores."
        />
        <link rel="canonical" href="https://matchbybirth.com/how-it-works" />
      </Helmet>

      <main className="bg-background py-16 md:py-20">
        <div className="content-container max-w-4xl">
          <header className="mb-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Match by Birth methodology
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              How Match by Birth works
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Match by Birth turns simple birth dates into a compatibility snapshot for pairs and groups. Date-only mode stays fast, while MBB Exact Mode uses birth date, time, and selected birth place to calculate a high-precision Sun sign when users want more precise sign placement. The goal is not to predict a relationship. The goal is to give people a clear, private way to compare relationship patterns and start better conversations.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/#calculator" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90">
                Try the calculator
              </Link>
              <Link to="/blog" className="rounded-md border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-card">
                Read the guides
              </Link>
            </div>
          </header>

          <div className="space-y-12">
            <section className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-foreground">What Match by Birth uses</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                The calculator starts with information most people know and can enter quickly. It does not require exact birth time, birth location, or a full natal chart. When a user provides birth date, time, and selected birth place, MBB Exact Mode calculates a high-precision Sun sign that is more precise than date-only zodiac ranges for cusp birthdays.
              </p>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-foreground">
                      <th className="py-3 pr-4 font-semibold">Input</th>
                      <th className="py-3 font-semibold">How it helps the reading</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inputRows.map(([label, body]) => (
                      <tr key={label} className="border-b border-border/70">
                        <td className="py-4 pr-4 font-semibold text-foreground">{label}</td>
                        <td className="py-4 text-muted-foreground">{body}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <article className="rounded-lg border border-border bg-card p-6">
                <h2 className="text-2xl font-semibold text-foreground">Pair mode</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Pair mode compares two people directly. It is best for dating, friendship, family, or any one-to-one relationship where you want a score plus a plain-language explanation.
                </p>
              </article>
              <article className="rounded-lg border border-border bg-card p-6">
                <h2 className="text-2xl font-semibold text-foreground">Group mode</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Group mode compares 3 to 7 people, checks every unique pair, and summarizes the overall group pattern. It is useful for friend groups, family dynamics, teams, or event planning.
                </p>
              </article>
            </section>

            <section className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-foreground">How MBB Exact Mode improves sign accuracy</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Date-only mode uses standard zodiac date ranges, which is enough for most birthdays. MBB Exact Mode is different: it converts the local birth date and time through the selected birth place timezone, then calculates the Sun sign from that moment. This matters most near zodiac transitions, where one month can include multiple signs and a birthday can fall close to a sign change.
              </p>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Exact Mode improves the astrology input, not the certainty of the relationship outcome. A more precise Sun sign can make the reading cleaner, but the score is still a reflection tool rather than a prediction or guarantee.
              </p>
            </section>

            <section className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-foreground">What the score means</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                The score is a summary of symbolic relationship patterns. The explanation matters more than the number because it tells you what to discuss: pacing, communication, emotional needs, conflict style, trust, or timing.
              </p>
              <div className="mt-6 grid gap-3">
                {scoreRows.map(([label, body]) => (
                  <div key={label} className="rounded-md border border-border bg-background p-4">
                    <h3 className="font-semibold text-foreground">{label}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-foreground">What Match by Birth does not claim</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Match by Birth does not claim to prove love, predict commitment, measure loyalty, or decide whether a relationship should continue. It is for entertainment and reflection. Real compatibility still depends on consent, values, emotional maturity, communication, and how people treat each other over time.
              </p>
            </section>

            <section className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-foreground">Relationship timing and privacy</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Timing articles on Match by Birth are written as reflection tools, not forecasts. They help users ask whether a relationship has enough readiness, clarity, and patience for the moment they are in.
              </p>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                For privacy, birth dates are used for the result and are not meant to identify people. If optional time and selected birth place are provided, they are used only for calculation context, including timezone lookup for Exact Mode. New share links avoid putting raw birth dates, times, places, coordinates, or timezones in the URL, and the calculator focuses on signs, scores, and interpretation.
              </p>
            </section>

            <section className="rounded-lg border border-border bg-background p-6">
              <h2 className="text-xl font-semibold text-foreground">Go deeper</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Link to="/blog/what-is-birth-matching" className="rounded-md border border-border bg-card p-4 font-semibold text-primary hover:bg-primary/5">
                  What Is Birth Matching?
                </Link>
                <Link to="/blog/how-birth-date-compatibility-is-calculated" className="rounded-md border border-border bg-card p-4 font-semibold text-primary hover:bg-primary/5">
                  How Birth Date Compatibility Is Calculated
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default HowItWorksPage;
