import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import BackButton from '@/components/BackButton.jsx';

function ReportDeliveryPage() {
  return (
    <>
      <Helmet>
        <title>Report Delivery | Match by Birth</title>
        <meta
          name="description"
          content="How paid Match by Birth compatibility reports are generated, delivered, and handled privately."
        />
        <link rel="canonical" href="https://matchbybirth.com/report-delivery" />
      </Helmet>

      <main className="min-h-screen bg-background py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <BackButton fallbackTo="/" label="Back to Calculator" />

          <article className="rounded-3xl border border-border bg-card p-8 shadow-sm md:p-12">
            <header className="border-b border-border pb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Private paid reports
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                How report delivery works
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Paid reports are designed to be clear, private, and useful without turning compatibility into a verdict.
              </p>
            </header>

            <div className="mt-8 space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-foreground">What the report includes</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Every paid report has nine substantial sections, but the sections change with the calculator you used. Moon reports focus on emotional needs and repair. Crush reports focus on chemistry, mixed signals, consistency, and the next move. Life Path reports focus on effort, goals, responsibility, and long-term fit. The full compatibility report connects all five score areas with emotional pace and follow-through.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">How delivery happens</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  After Stripe checkout, Match by Birth prepares the report and sends a private report link to the checkout email. The success page also checks for the report and redirects you when it is ready. If delivery takes longer than expected, the email link is still sent when generation finishes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">What data is used</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  The report uses sanitized compatibility data: display names, calculated signs, Life Path numbers, score dimensions, relationship type, and any supplied aspect evidence. Raw birth dates, birth times, birthplaces, and the checkout email are not sent to the text provider. Payment details are handled by Stripe.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">If something goes wrong</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  If the first report attempt fails, delivery is retried automatically. If you paid but cannot access the report, email <a href="mailto:support@matchbybirth.com" className="font-semibold text-primary hover:underline">support@matchbybirth.com</a> with your checkout email and any result link you have.
                </p>
              </section>

              <section className="rounded-2xl border border-border bg-muted/20 p-5">
                <h2 className="text-lg font-semibold text-foreground">Refund support</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Read the <Link to="/refund-policy" className="font-semibold text-primary hover:underline">refund policy</Link> for payment and delivery support details.
                </p>
              </section>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}

export default ReportDeliveryPage;
