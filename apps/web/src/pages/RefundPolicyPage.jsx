import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import BackButton from '@/components/BackButton.jsx';

function RefundPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Refund Policy | Match by Birth</title>
        <meta
          name="description"
          content="Refund and support policy for paid Match by Birth compatibility reports."
        />
        <link rel="canonical" href="https://matchbybirth.com/refund-policy" />
      </Helmet>

      <main className="min-h-screen bg-background py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <BackButton fallbackTo="/" label="Back to Calculator" />

          <article className="rounded-3xl border border-border bg-card p-8 shadow-sm md:p-12">
            <header className="border-b border-border pb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Paid reports
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Refund Policy
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Last updated: July 5, 2026
              </p>
            </header>

            <div className="mt-8 space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-foreground">What you are buying</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  A paid Match by Birth report is a one-time digital compatibility report delivered by private link and email. It expands the free result into strengths, friction points, communication notes, a watch area, and practical conversation prompts.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">When refunds are available</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Email <a href="mailto:support@matchbybirth.com" className="font-semibold text-primary hover:underline">support@matchbybirth.com</a> if you paid and did not receive access, received a broken report link, were charged incorrectly, or the report could not be generated. Include the checkout email and any result or report link you have.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">When refunds may not apply</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Because reports are digital goods delivered after checkout, refunds are not guaranteed simply because a reading is not the answer someone hoped for. Match by Birth is designed for reflection and conversation, not certainty, prediction, or a relationship verdict.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">How fast support replies</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  We review report and payment support requests as quickly as possible, usually within 1-2 business days. If a technical issue blocked delivery, we will either restore access, resend the private link, or help with a refund.
                </p>
              </section>

              <section className="rounded-2xl border border-border bg-muted/20 p-5">
                <h2 className="text-lg font-semibold text-foreground">Need help now?</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Start with the <Link to="/report-delivery" className="font-semibold text-primary hover:underline">report delivery guide</Link>, or email support with your checkout email.
                </p>
              </section>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}

export default RefundPolicyPage;
