import React from 'react';
import { Helmet } from 'react-helmet';
import { SITE_URL } from '@/lib/blogSeo.js';
import BackButton from '@/components/BackButton.jsx';

function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Match by Birth</title>
        <meta name="description" content="How Match by Birth processes calculator, result, payment, email, and analytics data." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={`${SITE_URL}/privacy`} />
      </Helmet>

      <main className="py-16 md:py-24 bg-background min-h-screen relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="pointer-events-none absolute top-0 right-1/4 h-[300px] w-[300px] rounded-full opacity-[0.07] blur-3xl bg-primary" />
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <BackButton fallbackTo="/" label="Back to Calculator" />
          
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm shadow-elevated">
            <header className="mb-10 border-b border-border pb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Privacy Policy</h1>
              <p className="text-sm font-medium uppercase tracking-wider text-primary mt-2">
                Last Updated: July 19, 2026
              </p>
            </header>

            <div className="p-6 bg-primary/10 rounded-2xl border border-primary/20 mb-8">
              <p className="font-semibold text-foreground m-0 leading-relaxed text-sm md:text-base">
                Birth dates are processed to calculate your result, but they are not stored in our database or included in new share links.
              </p>
            </div>

            <section className="space-y-8">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">1. Information You Provide</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The free calculator receives display names or aliases and birth dates. If you purchase a report or opt into updates, we also receive your email address. Payment card information is collected directly by Stripe and is not handled by Match by Birth.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">2. Calculator Processing and Saved Results</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Names and birth dates are transmitted securely to our calculation endpoint. Birth dates are used transiently to determine signs and scores, then discarded. We store a sanitized result containing display names, signs, scores, interpretations, and an opaque sharing identifier.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Unpaid shared results expire after approximately 90 days. Purchased results and reports are retained so the buyer can revisit them, unless deletion is requested.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">3. Private Sharing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  New result URLs contain a random share identifier rather than names or birth dates. Anyone who receives that link can view the sanitized result, so only share it with people you trust.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">4. Purchases and Reports</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Stripe processes checkout and payment data. We store the checkout status, amount, currency, delivery email, and provider identifiers needed to fulfill or refund the purchase. Anthropic receives the sanitized signs, scores, and display names needed to generate a paid report; it does not receive birth dates or your email address. Resend receives the delivery email and completed report.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">5. Optional Marketing Email</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Report delivery does not automatically enroll you in marketing. Marketing consent is optional and unchecked by default. If you opt in, we retain your email until you unsubscribe or request deletion.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">6. Analytics and Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use Vercel Analytics to measure aggregate events such as calculations, shares, checkout starts, and completed report delivery. With your consent, we also use Microsoft Clarity to understand page interactions, such as clicks, scrolling, and navigation. Analytics events do not include names, birth dates, emails, or private result tokens. Advertising or other optional services may use cookies where disclosed by the site and permitted by your browser or consent settings.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">7. Service Providers</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 leading-relaxed">
                  <li><strong className="text-foreground font-semibold">Vercel:</strong> website hosting, server functions, and aggregate analytics.</li>
                  <li><strong className="text-foreground font-semibold">Microsoft Clarity:</strong> consent-based website interaction analytics.</li>
                  <li><strong className="text-foreground font-semibold">Supabase:</strong> secure database storage.</li>
                  <li><strong className="text-foreground font-semibold">Stripe:</strong> payment processing.</li>
                  <li><strong className="text-foreground font-semibold">Anthropic:</strong> paid report generation using sanitized result data.</li>
                  <li><strong className="text-foreground font-semibold">Resend:</strong> transactional and opted-in email delivery.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">8. Your Choices and Rights</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You may ask us to delete a shared result, purchased report, purchase email, or marketing subscription. Send the relevant result or report link and your request to <a href="mailto:support@matchbybirth.com" className="text-primary hover:underline font-semibold">support@matchbybirth.com</a>. We may ask for reasonable verification before deleting purchase records.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">9. Security and Children</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use access controls, encrypted connections, private report tokens, and restricted server credentials. No online system is risk-free. Match by Birth is not directed to children under 13, and children should not submit personal information.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">10. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Privacy questions may be sent to <a href="mailto:support@matchbybirth.com" className="text-primary hover:underline font-semibold">support@matchbybirth.com</a>.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default PrivacyPolicyPage;
