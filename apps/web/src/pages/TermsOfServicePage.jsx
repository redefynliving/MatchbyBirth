
import React from 'react';
import { Helmet } from 'react-helmet';
import BackButton from '@/components/BackButton.jsx';

function TermsOfServicePage() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Match by Birth</title>
        <meta name="description" content="Terms of Service for using Match by Birth." />
        <link rel="canonical" href="https://matchbybirth.com/terms" />
      </Helmet>

      <main className="py-16 md:py-24 bg-background min-h-screen relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="pointer-events-none absolute top-0 right-1/4 h-[300px] w-[300px] rounded-full opacity-[0.07] blur-3xl bg-primary" />
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <BackButton fallbackTo="/" label="Back to Calculator" />
          
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm shadow-elevated">
            <header className="mb-10 border-b border-border pb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Terms of Service</h1>
              <p className="text-sm font-medium uppercase tracking-wider text-primary mt-2">
                Last Updated: June 9, 2026
              </p>
            </header>

            <section className="space-y-8">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">1. Welcome to Match by Birth</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using Match by Birth, you agree to follow these Terms of Service. If you don&apos;t agree with them, please refrain from using the site.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">2. Astrology Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All compatibility scores, group vibe percentages, and astrological interpretations provided on this site are for <strong className="text-foreground font-semibold">entertainment purposes only</strong>. Astrology is a symbolic system, not an empirical science. Our results should never be used as the basis for major life decisions, relationship choices, or professional advice.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">3. Group Mode & Functionality</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Match by Birth offers a &quot;Group Mode&quot; that allows users to calculate the compatibility of up to 7 individuals simultaneously. The calculator computes the scores of all possible pairings to generate a &quot;Group Vibe Score.&quot; You agree to only input names and birth dates of individuals you have permission to analyze or whose information is reasonably public within your social circle.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">4. Sharing and URLs</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Shared results use an opaque link that displays the sanitized names, signs, scores, and interpretations associated with that result. Birth dates are not included in new sharing URLs. Anyone with the link can view the result, so you are responsible for sharing it appropriately.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">5. Data Handling</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Birth dates are processed transiently and are not stored. Sanitized result data, purchase records, reports, and consented email subscriptions may be stored as described in our Privacy Policy.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">6. Third-Party Advertising (AdSense)</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use third-party advertising partners, including Google AdSense, to display ads on our website. These partners may use cookies and similar tracking technologies to serve ads based on your prior visits to our site and other sites on the internet.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">7. User Responsibility</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to use Match by Birth responsibly and lawfully. You will not use the service to harass, stalk, or mock others. We provide the tool; how you communicate the results to your friends or partners is entirely up to you.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">8. No Warranty</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Match by Birth is provided &quot;as is&quot; and &quot;as available.&quot; We make no guarantees about the accuracy, reliability, or uninterrupted availability of the calculator.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">9. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To the fullest extent permitted by law, Match by Birth and its operators shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of the site or your reliance on any compatibility scores or readings generated by it.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default TermsOfServicePage;
