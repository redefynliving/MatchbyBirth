import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import BackButton from '@/components/BackButton.jsx';

function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us | Match by Birth</title>
        <meta name="description" content="Learn about our mission to help you understand compatibility, including our unique 7-person Group Mode." />
        <link rel="canonical" href="https://matchbybirth.com/about" />
      </Helmet>

      <main role="main" className="py-16 md:py-24 bg-background min-h-screen relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="pointer-events-none absolute top-0 right-1/4 h-[300px] w-[300px] rounded-full opacity-[0.07] blur-3xl bg-primary" />
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <BackButton fallbackTo="/" label="Back to Calculator" />
          
          <article className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm shadow-elevated mb-12">
            {/* Eyebrow / small label */}
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">About Match by Birth</p>
 
            {/* Hero */}
            <header role="banner" className="mt-4 mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight tracking-tight">
                Astrology meets science. Love meets data.
              </h1>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Match by Birth helps you understand the people in your life through the oldest compatibility system on earth.
              </p>
 
              <div className="mt-6">
                <Link
                  to="/"
                  aria-label="Try the Calculator"
                  className="btn-primary rounded-xl px-5 py-3 text-sm font-semibold transition-transform duration-150 hover:scale-105 inline-flex items-center gap-1.5"
                >
                  Try the Calculator →
                </Link>
              </div>
            </header>
 
            {/* Divider */}
            <div className="my-8 border-t border-border" />
 
            {/* Section: Our Mission */}
            <section className="py-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 tracking-tight">Our Mission</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Human connection is complex. Our goal is to provide a playful yet insightful tool that helps people understand how they interact with their friends, family, and romantic partners. We believe that astrology is a fantastic mirror for self-reflection—giving you a shared vocabulary to talk about communication styles, emotional needs, and natural chemistry.
                </p>
              </div>
            </section>
 
            <div className="border-t border-border" />
 
            {/* Section: Group Mode */}
            <section className="py-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 tracking-tight">Group Mode: Check the Vibe</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Dynamics change entirely when more people enter the room. That’s why we created our signature <strong className="text-foreground font-semibold">Group Mode</strong>. You can add up to 7 people at once to calculate an overall &quot;Group Vibe Score.&quot;
                </p>
                <p>
                  Behind the scenes, our calculator analyzes the compatibility of every possible pair within your group and aggregates the data into a single, cohesive score. Whether you’re planning a road trip, forming a project team, or just curious about your friend group&apos;s cosmic balance, Group Mode lays it all out.
                </p>
              </div>
            </section>
 
            <div className="border-t border-border" />
 
            {/* Section: Share the Stars */}
            <section className="py-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 tracking-tight">Share the Stars</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  A great reading is meant to be shared. We’ve built in seamless sharing features so you can effortlessly show your friends your match scores.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong className="text-foreground font-semibold">Private share links:</strong> Each result gets an opaque link without birth dates in the URL. Copy it and send it only to people you trust.</li>
                  <li><strong className="text-foreground font-semibold">Social Previews:</strong> Share your link on Twitter or iMessage, and our Open Graph (OG) previews will automatically display a customized card showing who was matched.</li>
                </ul>
              </div>
            </section>
 
            <div className="border-t border-border" />
 
            {/* Section: Astrological Review & E-E-A-T */}
            <section className="py-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 tracking-tight">Expert Astrological Review</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  To ensure that our compatibility reports, zodiac guides, and calculations remain accurate, professional, and grounded in classical astrological traditions, our content and methodology are reviewed by certified experts.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-secondary/30 border border-border p-5 rounded-2xl mt-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                    SM
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="font-semibold text-foreground text-sm">Sarah Miller</h4>
                    <p className="text-xs text-primary font-medium mb-1">Professional Consultant Astrologer & Lead Reviewer</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Sarah Miller holds credentials from international astrological registries and has spent over 12 years mapping birth charts and transits. She serves as our lead reviewer, validating that our algorithms and guides represent authentic astrological knowledge.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="border-t border-border" />

            {/* Section: Get in Touch */}
            <section className="py-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 tracking-tight">Get in Touch</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>
                  We&apos;re always working to make our readings more accurate, inclusive, and fun. If you have any feedback or just want to say hi, reach out to us at <a href="mailto:support@matchbybirth.com" className="text-primary hover:underline font-semibold">support@matchbybirth.com</a>.
                </p>
              </div>
            </section>
          </article>

          {/* CTA Banner */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary to-violet-700 text-white rounded-3xl p-8 md:p-12 text-center shadow-lg shadow-primary/10 mb-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            
            <div className="relative z-10 max-w-lg mx-auto">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 font-semibold">Ready to check your compatibility?</h2>
              <p className="text-white/80 max-w-sm mx-auto mb-6 text-sm md:text-base leading-relaxed">Get your detailed compatibility score and astrology placements.</p>
              <Link 
                to="/" 
                aria-label="Get your compatibility score"
                className="inline-flex items-center gap-2 bg-white text-primary font-bold rounded-xl px-6 py-3 hover:bg-white/95 transition-transform hover:scale-105 active:scale-100 shadow-md shadow-black/10"
              >
                Get Your Score →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default AboutPage;
