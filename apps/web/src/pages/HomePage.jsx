import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import CalculatorWithPreview from '@/components/CalculatorWithPreview.jsx';
import HomeEmailCapture from '@/components/HomeEmailCapture.jsx';
import HomeHeroBackdrop from '@/components/home/HomeHeroBackdrop.jsx';
import HomeProofBand from '@/components/home/HomeProofBand.jsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { normalizeCalculatorPrefill } from '@/lib/calculator-prefill.js';
import { SITE_URL } from '@/lib/blogSeo.js';
import {
  scrollToCalculatorFromHash,
} from '@/lib/scroll-to-calculator.js';

function HomePage() {
  const [mode, setMode] = useState('pair');
  const location = useLocation();
  const calculatorPrefill = useMemo(
    () => normalizeCalculatorPrefill(location.state?.calculatorPrefill),
    [location.state?.calculatorPrefill],
  );

  useEffect(() => {
    scrollToCalculatorFromHash();
  }, []);

  useEffect(() => {
    if (calculatorPrefill) {
      setMode('pair');
    }
  }, [calculatorPrefill]);

  return (
    <>
      <Helmet>
        <title>Birth Date Compatibility Calculator | Match by Birth</title>
        <meta name="description" content="Compare two people or a group by birth date. Get a free compatibility score in seconds. No signup, and birth dates are not stored." />
        <meta property="og:title" content="Birth Date Compatibility Calculator | Match by Birth" />
        <meta property="og:description" content="Compare two people or a group by birth date. Get a free compatibility score in seconds." />
        <meta property="og:image" content="https://matchbybirth.com/og-image.png" />
        <meta property="og:url" content={SITE_URL} />
        <link rel="canonical" href={SITE_URL} />

        {/* AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7210866068673514" crossOrigin="anonymous"></script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Match by Birth Compatibility Calculator',
            description: 'Free birth date compatibility calculator for pairs and groups. Get a compatibility score and breakdown in seconds.',
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
            logo: 'https://matchbybirth.com/logo.png',
            description: 'Astrology compatibility tools that explain WHY you work or don\'t work with someone.',
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
                  text: 'No. Match by Birth uses calendar birth dates for a quick compatibility reading.',
                },
              },
              {
                '@type': 'Question',
                name: 'Are birth dates stored?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Birth dates are processed for the calculation and are not stored or included in share links.',
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
        <section className="brand-hero relative overflow-hidden py-16 md:py-24">
          <HomeHeroBackdrop />
          <div className="content-container relative z-10">
            <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
              <p className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary">
                Free birth date compatibility calculator
              </p>
              <h1 className="mx-auto max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-foreground md:text-[3.25rem]">
                Discover your birth date compatibility.
              </h1>
              <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
                Compare two people or a group. Get a compatibility score and a clear breakdown in seconds.
              </p>
              <div className="mt-8">
                <HomeProofBand />
              </div>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Link
                  to="/tools/crush-birthday-compatibility"
                  className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-card/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-primary/5"
                >
                  Crush birthday compatibility
                  <span aria-hidden="true" className="ml-1.5">-&gt;</span>
                </Link>
                <Link
                  to="/tools/life-path-compatibility"
                  className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-card/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-primary/5"
                >
                  Life path compatibility
                  <span aria-hidden="true" className="ml-1.5">-&gt;</span>
                </Link>
                <Link
                  to="/tools/moon-sign-compatibility"
                  className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-card/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-primary/5"
                >
                  Moon sign compatibility
                  <span aria-hidden="true" className="ml-1.5">-&gt;</span>
                </Link>
              </div>
            </div>

            <CalculatorWithPreview mode={mode} setMode={setMode} prefill={calculatorPrefill} />

          </div>
        </section>

        <HomeEmailCapture />

        <section className="section-spacing bg-background/50 border-y border-border/40">
          <div className="content-container max-w-3xl">
            <div className="mb-6 text-center">
              <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">
                Methodology & Trust
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Cosmic Logic & Methodology</h2>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-3">How does Match by Birth calculate compatibility?</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Match by Birth is an astrological compatibility calculator that compares two people or groups using birth date placements. The system determines the exact degree of planetary positions (including the Sun and planetary elements) on your birth dates to compute elemental harmony across Fire, Earth, Air, and Water. We evaluate elements and planetary aspect configurations to calculate compatibility across five main relationship dimensions: Overall Harmony, Emotional Support, Communication Flow, Physical Chemistry, and Conflict Risk. The calculation runs entirely in temporary server memory and birth dates are never stored. The system is designed to provide immediate, actionable relationship insights based on time-tested cosmic patterns, offering a free summary score as well as complete, detailed relationship guide reports. Match by Birth supports quick comparisons for couples, friends, and family, plus a unique 7-person Group Mode that calculates individual compatibility pairs.
              </p>

              <div className="border-t border-border/80 pt-4 flex flex-wrap justify-between items-center text-xs text-muted-foreground gap-2">
                <span>Developer: <strong>Match by Birth Astrological Team</strong></span>
                <span>Last updated: <strong>June 2026</strong></span>
              </div>
            </div>
          </div>
        </section>

        <section className="section-spacing bg-background">
          <div className="content-container max-w-3xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">
                Quick answers
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Frequently asked questions</h2>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="item-1" className="rounded-xl border border-border bg-card px-6 shadow-sm transition-shadow hover:shadow-md">
                <AccordionTrigger className="py-4 text-left font-semibold hover:no-underline hover:text-primary">
                  Do I need an exact birth time?
                </AccordionTrigger>
                <AccordionContent className="pb-4 leading-relaxed text-muted-foreground">
                  No. Match by Birth uses calendar birth dates for a quick compatibility reading.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="rounded-xl border border-border bg-card px-6 shadow-sm transition-shadow hover:shadow-md">
                <AccordionTrigger className="py-4 text-left font-semibold hover:no-underline hover:text-primary">
                  Are birth dates stored?
                </AccordionTrigger>
                <AccordionContent className="pb-4 leading-relaxed text-muted-foreground">
                  Birth dates are processed for the calculation and are not stored or included in share links.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="rounded-xl border border-border bg-card px-6 shadow-sm transition-shadow hover:shadow-md">
                <AccordionTrigger className="py-4 text-left font-semibold hover:no-underline hover:text-primary">
                  Can I compare a group?
                </AccordionTrigger>
                <AccordionContent className="pb-4 leading-relaxed text-muted-foreground">
                  Yes. Group mode compares 3–7 people and ranks every unique pair within the group.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="mt-8 text-center">
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
