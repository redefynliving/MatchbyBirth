import React from 'react';
import { Helmet } from 'react-helmet';
import BackButton from '@/components/BackButton.jsx';

function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact Us | Match by Birth</title>
        <meta name="description" content="Get in touch with the Match by Birth team for report support, payment help, privacy requests, feedback, or press inquiries." />
        <link rel="canonical" href="https://matchbybirth.com/contact" />
      </Helmet>

      <main className="py-16 md:py-24 bg-background min-h-screen relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="pointer-events-none absolute top-0 right-1/4 h-[300px] w-[300px] rounded-full opacity-[0.07] blur-3xl bg-primary" />

        <div className="content-container max-w-2xl relative z-10">
          <BackButton fallbackTo="/" label="Back to Calculator" />

          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground">We&apos;d love to hear from you.</p>
          </header>

          <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm shadow-elevated space-y-8">
            <div className="text-center bg-muted/40 py-4 px-6 rounded-2xl border border-border/50">
              <span className="text-xs font-semibold text-muted-foreground block mb-1">Email us at</span>
              <a href="mailto:support@matchbybirth.com" className="text-xl md:text-2xl font-bold text-primary hover:text-primary/95 transition-colors">
                support@matchbybirth.com
              </a>
              <p className="text-muted-foreground text-sm mt-2">We typically reply within 1-2 business days.</p>
            </div>

            <section>
              <h2 className="text-base md:text-lg font-semibold text-foreground mb-3">Report delivery and payment help</h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base mb-3">
                If you purchased a compatibility report and something went wrong - a missing or broken report link, a wrong email address at checkout, or a charge you don&apos;t recognize - include:
              </p>
              <ul className="text-muted-foreground space-y-2 leading-relaxed text-sm md:text-base list-disc list-inside">
                <li>The email address used at checkout</li>
                <li>The report link if you have it (check spam first)</li>
                <li>The approximate date of purchase</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base mt-3">
                Payments are processed by Stripe, so we never see your card number - but we can resend report links, fix delivery emails, and review refund requests. See our refund policy and report delivery pages for the details.
              </p>
            </section>

            <section className="border-t border-border pt-6">
              <h2 className="text-base md:text-lg font-semibold text-foreground mb-3">Account, results, and email preferences</h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Questions about a saved or shared result? Paste the result link into your email so we can find it. Every marketing email includes a one-click unsubscribe link at the bottom; if anything about your subscription looks wrong, forward the email you received and we&apos;ll sort it out.
              </p>
            </section>

            <section className="border-t border-border pt-6">
              <h2 className="text-base md:text-lg font-semibold text-foreground mb-3">Privacy requests</h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                You can ask us to delete a shared result, a purchased report, or your email from our systems at any time. Send the relevant link or address to support@matchbybirth.com and read the privacy policy for exactly what we store and why.
              </p>
            </section>

            <section className="border-t border-border pt-6">
              <h2 className="text-base md:text-lg font-semibold text-foreground mb-3">Bugs and feedback</h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Something broken or confusing? Tell us the page URL, what you expected, what happened instead, and your device and browser. Feedback about readings, guides, and features is genuinely welcome - this site improves one email at a time.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default ContactPage;
