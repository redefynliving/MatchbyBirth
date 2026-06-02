import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import CompatibilityCalculator from '@/components/CompatibilityCalculator.jsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EmailCaptureSection from '@/components/EmailCaptureSection.jsx';

function AdBanner() {
  useEffect(() => {
    try {
      if (window && typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense initialization error:', error);
    }
  }, []);

  return (
    <div className="w-full my-6 min-h-[90px] flex items-center justify-center bg-muted/20 rounded-2xl border border-dashed border-border p-2">
      <ins 
        className="adsbygoogle w-full"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7210866068673514"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

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
        {/* 1. Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1623833269143-570fb7bcf54b?auto=format&fit=crop&q=80&w=2000" 
              alt="Starry night sky background" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background to-background"></div>
          </div>
          
          <div className="content-container relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight max-w-xl mx-auto">
                Do your birth dates actually match?
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto">
                Check compatibility for just the two of you — or bring the whole friend group. Up to 7 people, instant results.
              </p>
              <div className="mt-6">
                <button onClick={(e)=>{e.preventDefault(); const el=document.getElementById('calculator'); if(el) el.scrollIntoView({behavior:'smooth'});}} className="btn-primary inline-block px-6 py-3 rounded-lg font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">See Your Match</button>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">No signup required. Results in seconds.</div>
            </div>

            {/* 2. Calculator Component */}
            <CompatibilityCalculator />

            {/* Ad Banner Placed After Calculator Results Focus */}
            <div className="mt-6 max-w-2xl mx-auto">
              <AdBanner />
            </div>

            {/* How it works row */}
            <div className="mt-8">
              <div className="max-w-4xl mx-auto px-6">
                <div className="bg-background border border-border rounded-2xl p-6 text-center">
                  <div className="max-w-3xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                      <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-primary/10">
                        <div className="w-14 h-14 rounded-full bg-white text-primary flex items-center justify-center text-lg font-bold">1</div>
                        <div className="font-semibold text-lg">Enter two birth dates</div>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-primary/10">
                        <div className="w-14 h-14 rounded-full bg-white text-primary flex items-center justify-center text-lg font-bold">2</div>
                        <div className="font-semibold text-lg">We analyze zodiac compatibility</div>
                      </div>

                      <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-primary/10">
                        <div className="w-14 h-14 rounded-full bg-white text-primary flex items-center justify-center text-lg font-bold">3</div>
                        <div className="font-semibold text-lg">Get your score instantly</div>
                      </div>
                    </div>
                  </div>
                </div>
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
