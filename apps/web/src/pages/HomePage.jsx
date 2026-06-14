import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  FileHeart,
  LockKeyhole,
  Share2,
  Users,
  Zap,
} from 'lucide-react';
import CompatibilityCalculator from '@/components/CompatibilityCalculator.jsx';
import HomeResultPreview from '@/components/HomeResultPreview.jsx';
import HomeEmailCapture from '@/components/HomeEmailCapture.jsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  scrollToCalculatorFromHash,
} from '@/lib/scroll-to-calculator.js';

function HomePage() {
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

            <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-primary/15 bg-card shadow-[0_24px_65px_rgba(55,43,65,0.14)] lg:grid-cols-[1.25fr_0.75fr]">
              <CompatibilityCalculator />
              <HomeResultPreview />
            </div>

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

        <section className="section-spacing border-y border-border bg-card">
          <div className="content-container">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Clear and easy to scan</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                What your result includes
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                See the overall score, where you connect, and which differences may take more effort.
              </p>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {[
                ['01', 'Your compatibility score', 'See the overall match at a glance.'],
                ['02', 'Where you connect', 'See what tends to work well between you.'],
                ['03', 'Where you differ', 'See which areas may take more effort.'],
              ].map(([number, title, description]) => (
                <article key={number} className="rounded-2xl border border-border bg-background/70 p-6">
                  <span className="text-xs font-semibold tracking-[0.16em] text-primary">{number}</span>
                  <h3 className="mt-3 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </article>
              ))}
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
