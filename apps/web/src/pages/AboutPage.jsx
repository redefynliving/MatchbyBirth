import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Match by Birth</title>
        <meta
          name="description"
          content="Learn who Match by Birth is for, what the compatibility calculator does, what it does not claim, and how privacy works."
        />
        <link rel="canonical" href="https://matchbybirth.com/about" />
      </Helmet>

      <main role="main" className="min-h-screen bg-background py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <article>
            <header>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                About Match by Birth
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                A private compatibility tool for birth-date reflection.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Match by Birth helps people compare birth dates, zodiac signs, life path numbers, and group dynamics in a simple way. When users add time and a selected birth place, MBB Exact Mode can calculate a high-precision Sun sign for cleaner cusp handling. The site is designed for curiosity, conversation, and self-reflection, not for making life decisions on autopilot.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/#calculator" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90">
                  Try the calculator
                </Link>
                <Link to="/how-it-works" className="rounded-md border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-card">
                  Read the methodology
                </Link>
              </div>
            </header>

            <div className="my-10 border-t border-border" />

            <div className="space-y-10">
              <section>
                <h2 className="text-2xl font-semibold text-foreground">Who Match by Birth is for</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Match by Birth is for people who want a quick, understandable way to reflect on romantic, friendship, family, workplace, or group compatibility. It is especially useful when you want a shared vocabulary for communication style, timing, emotional rhythm, and where a connection may need more patience.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">What this tool does</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  The calculator uses birth-date patterns to create a compatibility score and written explanation. Optional birth time and selected birth place can activate MBB Exact Mode for high-precision Sun sign calculation, but they are not required. Pair mode compares two people. Group mode compares every unique pair in a group of 3 to 7 people and summarizes the overall group pattern.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">What this tool does not claim</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Match by Birth does not claim to predict the future, prove love, diagnose a relationship, or replace consent, communication, counseling, or personal judgment. It is for entertainment and reflection, and real behavior should always matter more than a score.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">How privacy works</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  The calculator is built to keep the experience lightweight. Birth dates and optional exact-mode details are used to create the result, and new share links are designed so raw birth dates, times, places, coordinates, and timezones are not placed in the URL. The site also publishes clear privacy and cookie disclosures for analytics, email, and advertising partners.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">Contact</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Questions, corrections, and feedback can be sent to <a href="mailto:support@matchbybirth.com" className="font-semibold text-primary">support@matchbybirth.com</a>. The goal is to keep improving the calculator and guides so they stay useful, responsible, and easy to understand.
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
