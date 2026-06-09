import React from 'react';
import { Helmet } from 'react-helmet';
import CompatibilityCalculator from '@/components/CompatibilityCalculator.jsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function HomePage() {
  return (
    <>
      <Helmet>
        <title>Match by Birth | The connection behind every relationship.</title>
        <meta name="description" content="Match by Birth: discover your connection with our free birth date compatibility tool. No signup—just enter two birth dates and get your match." />
        <meta property="og:title" content="Match by Birth - The connection behind every relationship." />
        <meta property="og:description" content="Discover your astrological compatibility instantly with Match by Birth. No signup needed—enter two birth dates and check your match." />
        <meta property="og:image" content="https://matchbybirth.com/og-image.png" />
        <meta property="og:url" content={window.location.origin} />
      </Helmet>

      <main className="flex-1 bg-background">
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[620px] h-[620px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="content-container relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-5">
                The connection behind every relationship
              </p>
              <h1 className="text-4xl md:text-6xl font-semibold text-foreground mb-5 leading-[1.05] max-w-2xl mx-auto">
                See how your connection naturally fits.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Compare two people or a full friend group and get a clear compatibility reading in seconds.
              </p>
              <div className="mt-7">
                <button onClick={(event) => { event.preventDefault(); document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary inline-block px-7 py-3.5 rounded-xl font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
                  Check Compatibility
                </button>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                No signup. Birth dates are not stored. Groups support 3–7 people.
              </div>
            </div>

            <CompatibilityCalculator />

            <div className="mt-9 max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden">
                {[
                  ['01', 'Add names and birth dates'],
                  ['02', 'We compare every connection'],
                  ['03', 'See and privately share the result'],
                ].map(([number, text]) => (
                  <div key={number} className="bg-card px-6 py-5 text-center">
                    <span className="text-xs font-semibold text-primary tracking-[0.16em]">{number}</span>
                    <p className="font-medium text-foreground mt-2">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Result preview removed from homepage; Email capture moved to result page */}
        {/* 3. Explanatory Content Section */}
        <section className="section-spacing bg-card border-y border-border">
          <div className="content-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
              
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Quick Compatibility Check</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our birthdate compatibility test analyzes the core astrological elements of two individuals. Whether you're looking for love compatibility by birthdate or assessing a new connection, this relationship compatibility calculator provides personalized insights into how your energies interact.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Free No-Signup Compatibility</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Astrological compatibility goes beyond just sun signs. The interaction between different elements shapes how you communicate and express emotion. Our free compatibility test synthesizes these factors into an easy-to-understand reading, giving you a comprehensive match by birth.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Understanding Your Compatibility Score</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A high compatibility score indicates natural harmony, while a lower score suggests areas where conscious effort is needed. Because this is a birth date compatibility check, contrasting signs often provide the greatest opportunities for dynamic balance and personal growth.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Why Birth Dates Are Enough</h2>
                <p className="text-muted-foreground leading-relaxed">
                  While a full natal chart uses exact times, this compatibility calculator uses birth dates to provide a highly accurate foundation for relationship dynamics. Discover your match by birth date quickly, securely, and completely free.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 4. Comprehensive FAQ Section */}
        <section className="section-spacing bg-background">
          <div className="content-container max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Everything you need to know about astrological compatibility.</p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="bg-card border border-border rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary py-4">
                  How accurate is this compatibility calculator?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  Our calculator uses established astrological principles based on sun signs and elemental interactions. While it provides highly accurate insights into natural tendencies and archetypal dynamics, real-world relationships always depend on mutual effort, communication, and personal choices.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card border border-border rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary py-4">
                  Do I need my exact birth time?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  No, this specific birth date compatibility calculator only requires birth dates to determine sun signs and core elemental compatibility. Exact birth times aren't necessary for this foundational compatibility test.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card border border-border rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary py-4">
                  What does the compatibility score mean?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  The compatibility score (out of 100) represents the natural ease and harmony between your astrological signs. Scores above 75 indicate strong natural alignment, 50-74 suggest a balanced dynamic requiring some effort, and below 50 indicates contrasting energies that offer high growth potential.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card border border-border rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary py-4">
                  How is my privacy handled?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  We do not sell your data. Email is used only to deliver your mini-report and occasional account-related messages if you opt in. You can request deletion by contacting support.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-card border border-border rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary py-4">
                  How are zodiac signs calculated from birth dates?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  Zodiac sun signs are determined by the birth date falling within standardized sign date ranges. We map dates to sun signs using established western astrology boundaries.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-card border border-border rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary py-4">
                  What's the difference between sun sign and a full birth chart?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  The sun sign is one piece of a full natal chart. A full chart uses exact birth time and place to calculate planetary positions, ascendants, and houses. This tool focuses on birth dates for quick compatibility insights.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="bg-card border border-border rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary py-4">
                  Can I check compatibility for groups?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  Yes — use Group mode in the calculator to add multiple people and see group compatibility summaries.
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </div>
        </section>
      </main>
    </>
  );
}

export default HomePage;
