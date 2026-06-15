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
        <meta name="description" content="Compare two people or a group by birth date. Get a free compatibility score in seconds. No signup, and birth dates are not stored." />
        <meta property="og:title" content="Birth Date Compatibility Calculator | Match by Birth" />
        <meta property="og:description" content="Compare two people or a group by birth date. Get a free compatibility score in seconds." />
        <meta property="og:image" content="https://matchbybirth.com/og-image.png" />
        <meta property="og:url" content={`${window.location.origin}/`} />
        <link rel="canonical" href={`${window.location.origin}/`} />

        {/* Structured Data: WebApplication */}
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
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '1247',
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
        <section className="brand-hero relative overflow-hidden py-14 md:py-20">
          <div className="content-container relative z-10">
            <div className="mx-auto mb-8 max-w-3xl text-center md:mb-10">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Free birth date compatibility calculator
              </p>
              <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-[1] tracking-[-0.045em] text-foreground md:text-6xl">
                See how you match by birth date.
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Compare two people or a group. Get a compatibility score and a clear breakdown in seconds.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  Results in seconds
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <LockKeyhole className="h-3.5 w-3.5 text-primary" />
                  Birth dates not stored
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
                  No. Match by Birth uses calendar birth dates for a quick compatibility reading.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card border border-border rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary py-4">
                  Are birth dates stored?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  Birth dates are processed for the calculation and are not stored or included in share links.
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
