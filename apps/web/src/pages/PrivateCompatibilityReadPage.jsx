import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  FileText,
  LockKeyhole,
  MessageSquareText,
  ShieldCheck,
} from 'lucide-react';
import {
  PRIVATE_REPORT_PRICE,
  privateReportFaq,
  privateReportProofPoints,
  privateReportSections,
} from '@/data/privateReportOffer.js';

const pageUrl = 'https://matchbybirth.com/reports/private-compatibility-read';
const pageTitle = 'Private Compatibility Report | Match by Birth';
const pageDescription = 'Preview the private Match by Birth compatibility report: a deeper read on rhythm, friction, green flags, yellow flags, and what to say next.';

function PrivateCompatibilityReadPage() {
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content="https://matchbybirth.com/og-image.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Private Compatibility Report',
            description: pageDescription,
            brand: {
              '@type': 'Brand',
              name: 'Match by Birth',
            },
            offers: {
              '@type': 'Offer',
              price: '9.99',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              url: pageUrl,
            },
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: privateReportFaq.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          })}
        </script>
      </Helmet>

      <main className="bg-[#fbfaf8] text-foreground">
        <section className="border-b border-border/70 bg-[linear-gradient(180deg,#fff_0%,#fbfaf8_100%)]">
          <div className="content-container py-14 md:py-20">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary">
                  Private compatibility report
                </p>
                <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-foreground md:text-6xl">
                  A private read for the connection you keep thinking about.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                  Run the free comparison first. If the result feels like something you need to understand, unlock the deeper read: what pulls you together, where the rhythm catches, and what to say next.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to="/#calculator" className="btn-primary inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold">
                    Run the free comparison
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/reports/sample" className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white px-6 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary">
                    View sample report
                  </Link>
                </div>
              </div>

              <aside className="rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_20px_70px_rgba(42,32,57,0.08)] md:p-7">
                <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">One-time unlock</p>
                    <p className="mt-2 text-4xl font-semibold text-foreground">{PRIVATE_REPORT_PRICE}</p>
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-[#fbfaf8] text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {privateReportProofPoints.map((point) => (
                    <div key={point} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl border border-border bg-[#fbfaf8] p-4">
                  <p className="text-sm font-semibold text-foreground">What this is not</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    No soulmate verdict. No future prediction. No professional relationship advice. It is a private read that helps you name the pattern and decide what to talk about next.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="section-spacing">
          <div className="content-container max-w-6xl">
            <div className="max-w-2xl">
              <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary">
                What you get
              </p>
              <h2 className="text-3xl font-semibold leading-tight md:text-5xl">
                The report is built around the questions people actually have.
              </h2>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {privateReportSections.map((section) => (
                <article key={section.title} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{section.label}</p>
                  <h3 className="mt-3 text-lg font-semibold leading-snug text-foreground">{section.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{section.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/70 bg-white">
          <div className="content-container py-14">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: MessageSquareText,
                  title: 'Sharper than a sign blurb',
                  body: 'The report is based on the actual comparison result, relationship context, and score pattern.',
                },
                {
                  icon: LockKeyhole,
                  title: 'Built after the free result',
                  body: 'You only unlock it after the free comparison, so the paid read has something real to respond to.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Private by default',
                  body: 'Checkout is handled by Stripe. Shared public links do not expose raw birth details.',
                },
              ].map(({ icon: Icon, title, body }) => (
                <article key={title} className="rounded-2xl border border-border bg-[#fbfaf8] p-5">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-spacing">
          <div className="content-container max-w-4xl">
            <div className="text-center">
              <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary">
                Questions
              </p>
              <h2 className="text-3xl font-semibold md:text-4xl">Before you unlock the deeper read</h2>
            </div>
            <div className="mt-8 space-y-3">
              {privateReportFaq.map((item) => (
                <article key={item.question} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                  <h3 className="text-base font-semibold text-foreground">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border/70 bg-white">
          <div className="content-container flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold text-foreground">Start with the free comparison.</p>
              <p className="mt-1 text-sm text-muted-foreground">If it hits, unlock the private report from your result page.</p>
            </div>
            <Link to="/#calculator" className="btn-primary inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold">
              Try the comparison
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

export default PrivateCompatibilityReadPage;
