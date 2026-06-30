import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { LockKeyhole, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import CalculatorWithPreview from '@/components/CalculatorWithPreview.jsx';

const pageUrl = 'https://matchbybirth.com/tools/crush-birthday-compatibility';
const pageTitle = 'Crush Birthday Compatibility Calculator | Match by Birth';
const pageDescription = "Compare your birthday with your crush's birthday. Get a private compatibility score, strengths, watch area, and conversation prompt in seconds.";

const faqItems = [
  {
    question: 'Do I need their birth time?',
    answer: 'No. You can start with names and birth dates only. Birth time and place are optional for people who want a more precise Sun sign check near a sign boundary.',
  },
  {
    question: 'Will they know I checked?',
    answer: 'No. Match by Birth does not notify anyone. You can use the result privately or share it only if you choose to.',
  },
  {
    question: 'Is this a relationship verdict?',
    answer: 'No. The score is a conversation starter. It points to strengths, possible friction, and one useful next step, but it should not replace your own judgment.',
  },
];

function CrushBirthdayCompatibilityPage() {
  const [mode, setMode] = useState('pair');

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
            name: 'Crush Birthday Compatibility Calculator',
            description: pageDescription,
            url: pageUrl,
            applicationCategory: 'LifestyleApplication',
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
                  Private birthday compatibility check
                </p>
                <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground md:text-6xl">
                  Crush Birthday Compatibility
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  Enter your birthday and theirs. See the connection pattern in seconds: where it flows, where it may catch, and what to talk about next.
                </p>
                <div className="mt-7 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3 lg:max-w-xl">
                  <span className="flex items-center gap-2">
                    <LockKeyhole className="h-4 w-4 text-primary" />
                    No signup
                  </span>
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Birth dates not stored
                  </span>
                  <span className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    Built for conversation
                  </span>
                </div>
              </div>

              <CalculatorWithPreview
                mode={mode}
                setMode={setMode}
                source="crush_birthday_compatibility"
                title="Check your crush connection"
                subtitle="Start with two names and birth dates. Time and place are optional."
                submitLabel="See the compatibility"
                defaultRelationshipType="love"
                showModeToggle={false}
              />
            </div>
          </div>
        </section>

        <section className="section-spacing bg-background">
          <div className="content-container max-w-5xl">
            <div className="mb-8 text-center">
              <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">
                What this checks
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                A quick read on the pattern between you two
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                ['Natural rhythm', 'Where the connection may feel easy, familiar, or energizing.'],
                ['Watch area', 'Where timing, communication, or expectations may need more care.'],
                ['Next step', 'One simple prompt you can use instead of overthinking the result.'],
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
              <h2 className="text-3xl font-semibold tracking-tight">Not a verdict. A better starting point.</h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Crush compatibility can be fun, but the point is not to decide the whole connection from one score. Match by Birth is designed to give language to what you already notice: chemistry, pace, friction, and timing.
              </p>
              <p>
                For a deeper explanation of the system, read <Link to="/how-it-works" className="font-semibold text-primary hover:underline">how Match by Birth works</Link>. For more guides, visit the <Link to="/blog" className="font-semibold text-primary hover:underline">blog</Link>.
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
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Crush compatibility FAQ</h2>
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

export default CrushBirthdayCompatibilityPage;
