import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  FileHeart,
  LockKeyhole,
  Share2,
  Users,
  Zap,
} from 'lucide-react';
import CalculatorWithPreview from '@/components/CalculatorWithPreview.jsx';
import HomeEmailCapture from '@/components/HomeEmailCapture.jsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  scrollToCalculatorFromHash,
} from '@/lib/scroll-to-calculator.js';

function HomePage() {
  const [mode, setMode] = useState('pair');
  useEffect(() => {
    scrollToCalculatorFromHash();
  }, []);

  return (
    <>
      <Helmet>
        <title>Birth Date Compatibility Calculator | Match by Birth</title>
        <meta name="description" content="Compare two people or a group by birth date. Add optional time and selected birth place for MBB Exact Mode, with no signup and no stored raw birth details." />
        <meta property="og:title" content="Birth Date Compatibility Calculator | Match by Birth" />
        <meta property="og:description" content="Compare two people or a group by birth date, with optional MBB Exact Mode for high-precision Sun signs." />
        <meta property="og:image" content="https://matchbybirth.com/og-image.png" />
        <meta property="og:url" content={`${window.location.origin}/`} />
        <link rel="canonical" href={`${window.location.origin}/`} />

        {/* AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7210866068673514" crossOrigin="anonymous"></script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Match by Birth Compatibility Calculator',
            description: 'Free birth date compatibility calculator for pairs and groups, with optional MBB Exact Mode for high-precision Sun sign calculation.',
            url: 'https://matchbybirth.com',
            applicationCategory: 'LifestyleApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          })}
        </script>

        {/* Structured Data: Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Match by Birth',
            url: 'https://matchbybirth.com',
            logo: 'https://matchbybirth.com/og-image.png',
            description: 'Birth date compatibility tools for pairs and groups, with privacy-focused results and responsible relationship reflection.',
            sameAs: [
              'https://twitter.com/matchbybirth',
            ],
          })}
        </script>

        {/* Structured Data: FAQPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Do I need an exact birth time?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No. Match by Birth works with calendar birth dates. If you add birth date, time, and selected birth place, MBB Exact Mode calculates a high-precision Sun sign that is more useful around cusp birthdays.',
                },
              },
              {
                '@type': 'Question',
                name: 'Are birth dates stored?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Birth dates and optional exact-mode details are processed for the calculation, then raw birth dates, times, places, coordinates, and timezones are excluded from stored result payloads and share links.',
                },
              },
              {
                '@type': 'Question',
                name: 'Can I compare a group?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. Group mode compares 3–7 people and ranks every unique pair within the group.',
                },
              },
            ],
          })}
        </script>
      </Helmet>

      <main className="flex-1 bg-background">
        <section className="brand-hero relative overflow-hidden py-14 md:py-20">
          <div className="content-container relative z-10">
            <div className="mx-auto mb-8 max-w-3xl text-center md:mb-10">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Free birth date compatibility calculator
              </p>
              <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-[1] tracking-normal text-foreground md:text-6xl">
                See how you match
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Compare two people or a group. Add optional time and selected birth place for MBB Exact Mode when you want a high-precision Sun sign.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  Results in seconds
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <LockKeyhole className="h-3.5 w-3.5 text-primary" />
                  Birth details not stored
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  Pair or group
                </span>
              </div>
            </div>

            <CalculatorWithPreview mode={mode} setMode={setMode} />

            <div className="mx-auto mt-5 flex max-w-4xl flex-wrap items-center justify-center gap-x-7 gap-y-2 text-xs font-medium text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" />
                Groups of 3–7
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Share2 className="h-3.5 w-3.5 text-primary" />
                Share by link
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FileHeart className="h-3.5 w-3.5 text-primary" />
                Optional detailed report
              </span>
            </div>
          </div>
        </section>

        <HomeEmailCapture />

        <section className="section-spacing bg-card">
          <div className="content-container max-w-5xl">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Built for quick relationship insight
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Why Match by Birth is different
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                Match by Birth turns simple birth dates into a private compatibility snapshot for pairs and groups.
                MBB Exact Mode can calculate a high-precision Sun sign from birth date, time, and selected birth place.
                The score is a starting point for reflection, not a verdict about your relationship.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <article className="rounded-2xl border border-border bg-background p-5">
                <Zap className="mb-4 h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold">Date-first, exact when needed</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Start with the birth date. Add time and a selected birth place to turn on MBB Exact Mode for cusp birthdays or anyone who wants more precise sign placement.
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-background p-5">
                <Users className="mb-4 h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold">Pair or group mode</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Compare two people directly or check a group of 3 to 7 people to see every pair ranking and the overall group vibe.
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-background p-5">
                <LockKeyhole className="mb-4 h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold">Privacy-first results</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Birth dates, times, places, coordinates, and timezones are processed for the calculation and kept out of new share links, so results stay focused on signs, scores, and interpretation.
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-background p-5">
                <FileHeart className="mb-4 h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold">Scores with context</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  High and low scores are explained in plain language so you can talk about communication, timing, trust, and expectations more clearly.
                </p>
              </article>
            </div>

            <div className="mt-8 text-center">
              <Link to="/blog" className="text-sm font-semibold text-primary hover:underline">
                Read the birth matching guides
              </Link>
            </div>
          </div>
        </section>

        <section className="section-spacing bg-background">
          <div className="content-container max-w-3xl">
            <div className="mb-9 text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">A few quick answers</h2>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="item-1" className="bg-card border border-border rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary py-4">
                  Do I need an exact birth time?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  No. Match by Birth works with calendar birth dates. Birth time and selected birth place are optional and most helpful near zodiac sign transitions because MBB Exact Mode can calculate a high-precision Sun sign.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card border border-border rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary py-4">
                  Are birth dates stored?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  Birth dates and optional exact-mode details are processed for the calculation, then raw birth dates, times, places, coordinates, and timezones are excluded from stored result payloads and share links.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card border border-border rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary py-4">
                  Can I compare a group?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  Yes. Group mode compares 3–7 people and ranks every unique pair within the group.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="mt-6 text-center">
              <Link to="/faq" className="text-sm font-semibold text-primary hover:underline">
                Read all frequently asked questions
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default HomePage;
