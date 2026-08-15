import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Briefcase, ShieldCheck, UsersRound, Sparkles } from 'lucide-react';
import CalculatorWithPreview from '@/components/CalculatorWithPreview.jsx';

const pageUrl = 'https://matchbybirth.com/tools/team-compatibility';
const pageTitle = 'Team Compatibility Calculator | Match by Birth';
const pageDescription =
  'Compare your work team by birth date. See the group rhythm, collaboration strengths, and where friction may show — free, no signup.';

const faqItems = [
  {
    question: 'Is this a performance review?',
    answer:
      'No. Team compatibility points to working styles and collaboration patterns, not ability or fit. Use it as a conversation tool, not a verdict.',
  },
  {
    question: 'Do I need everyone’s birth time?',
    answer:
      'No. Names and birth dates are enough to start. Birth time and place are optional for a more precise Sun sign check near a sign boundary.',
  },
  {
    question: 'Will the people I add see this?',
    answer:
      'No. Match by Birth does not notify anyone. You can explore your team privately and share the result only if you choose to.',
  },
];

function TeamCompatibilityPage() {
  const [mode, setMode] = useState('group');

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content="https://matchbybirth.com/og-image.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Team Compatibility Calculator',
            description: pageDescription,
            url: pageUrl,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          })}
        </script>
      </Helmet>

      <main className="flex-1 bg-background">
        <section className="border-b border-border/60 bg-[linear-gradient(180deg,#fff_0%,#fbf7fd_100%)] py-12 md:py-16">
          <div className="content-container">
            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
              <div>
                <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary">
                  Workplace compatibility, by birth date
                </p>
                <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground md:text-6xl">
                  Team Compatibility
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  Add 3 to 7 teammates. See the group rhythm: where collaboration flows, where friction may show, and who naturally bridges gaps.
                </p>
                <div className="mt-7 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3 lg:max-w-xl">
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Built for teams
                  </span>
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Birth dates not stored
                  </span>
                  <span className="flex items-center gap-2">
                    <UsersRound className="h-4 w-4 text-primary" />
                    Groups of 3–7
                  </span>
                </div>
              </div>

              <CalculatorWithPreview
                mode={mode}
                setMode={setMode}
                source="team_compatibility"
                title="Map your team's rhythm"
                subtitle="Enter each teammate's name and birth date. Time and place are optional."
                submitLabel="See team compatibility"
                defaultRelationshipType="work"
                showModeToggle={false}
              />
            </div>
          </div>
        </section>

        <section className="section-spacing bg-background">
          <div className="content-container max-w-5xl">
            <div className="mb-8 text-center">
              <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">
                What this shows
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                A read on how your team works together
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                ['Collaboration strength', 'The pairings and overall rhythm most likely to move work forward smoothly.'],
                ['Watch areas', 'Where communication style or pace may need more explicit alignment.'],
                ['Bridging roles', 'Which teammates tend to connect different working styles across the group.'],
              ].map(([title, body]) => (
                <article key={title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <Sparkles className="mb-4 h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-spacing border-y border-border/60 bg-muted/20">
          <div className="content-container grid max-w-5xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
            <div>
              <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">
                Use it responsibly
              </p>
              <h2 className="text-3xl font-semibold tracking-tight">A starting point, not a verdict.</h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Team compatibility is a lens on working styles, not a measure of skill or a substitute for management judgment. Match by Birth gives your team language for what they already notice: pace, communication, and where friction comes from.
              </p>
              <p>
                For the thinking behind the system, read <Link to="/how-it-works" className="font-semibold text-primary hover:underline">how Match by Birth works</Link>. For more on the workplace angle, see our guide on <Link to="/blog/compatibility-for-teams" className="font-semibold text-primary hover:underline">birth-chart compatibility for teams</Link>.
              </p>
            </div>
          </div>
        </section>

        <section className="section-spacing bg-background">
          <div className="content-container max-w-3xl">
            <div className="mb-8 text-center">
              <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">
                Quick answers
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Team compatibility FAQ</h2>
            </div>
            <div className="space-y-3">
              {faqItems.map((item) => (
                <article key={item.question} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <h3 className="text-base font-semibold text-foreground">{item.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default TeamCompatibilityPage;
