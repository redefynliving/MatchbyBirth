import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, LockKeyhole, MessageSquareText } from 'lucide-react';
import {
  PRIVATE_REPORT_PRICE,
  privateReportSections,
  sampleReport,
} from '@/data/privateReportOffer.js';

const pageUrl = 'https://matchbybirth.com/reports/sample';
const pageTitle = 'Sample Compatibility Report | Match by Birth';
const pageDescription = 'See a fictional sample of the private Match by Birth compatibility report before unlocking your own deeper read.';

function SampleReportPage() {
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
            '@type': 'WebPage',
            name: pageTitle,
            description: pageDescription,
            url: pageUrl,
            isPartOf: {
              '@type': 'WebSite',
              name: 'Match by Birth',
              url: 'https://matchbybirth.com',
            },
          })}
        </script>
      </Helmet>

      <main className="bg-[#fbfaf8] text-foreground">
        <section className="border-b border-border/70 bg-white">
          <div className="content-container py-14 md:py-20">
            <div className="mx-auto max-w-4xl text-center">
              <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary">
                Fictional sample
              </p>
              <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
                Sample private compatibility read
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                This is not a live result. It shows the kind of specificity the paid report is meant to deliver: what feels natural, where it may catch, and what to say next.
              </p>
            </div>
          </div>
        </section>

        <section className="section-spacing">
          <div className="content-container max-w-5xl">
            <article className="overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-[0_24px_80px_rgba(42,32,57,0.08)]">
              <header className="border-b border-border bg-[#fffdfb] p-6 md:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Private report sample</p>
                    <h2 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">{sampleReport.people}</h2>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">{sampleReport.headline}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-white px-6 py-5 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Overall fit</p>
                    <p className="mt-2 text-5xl font-semibold text-foreground">{sampleReport.score}</p>
                  </div>
                </div>
                <p className="mt-6 max-w-3xl text-sm leading-6 text-muted-foreground">{sampleReport.summary}</p>
              </header>

              <div className="grid gap-5 p-6 md:p-8">
                {sampleReport.sections.map((section) => (
                  <section key={section.title} className="rounded-2xl border border-border bg-[#fbfaf8] p-5">
                    <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{section.body}</p>
                  </section>
                ))}

                <section className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-5">
                  <div className="flex gap-3">
                    <LockKeyhole className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">In your report, the rest is personal.</h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        Your private read includes the full section set: green flags, yellow flags, what each person may misread, what to ask before getting attached, and a final read on chemistry, comfort, or chaos.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </article>
          </div>
        </section>

        <section className="border-y border-border/70 bg-white">
          <div className="content-container py-14">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary">Full report sections</p>
                <h2 className="text-3xl font-semibold leading-tight md:text-4xl">What your unlock covers</h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  The full report costs {PRIVATE_REPORT_PRICE} after you run a free comparison. The sample is intentionally fictional so you can see the shape without exposing anyone&apos;s real result.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {privateReportSections.map((section) => (
                  <div key={section.title} className="rounded-2xl border border-border bg-[#fbfaf8] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{section.label}</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{section.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-spacing">
          <div className="content-container max-w-4xl">
            <div className="rounded-[1.75rem] border border-border bg-white p-6 shadow-sm md:p-8">
              <MessageSquareText className="h-6 w-6 text-primary" />
              <h2 className="mt-4 text-3xl font-semibold leading-tight">The point is not a bigger score.</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                The point is a better conversation. Match by Birth should help you tell the difference between easy chemistry, steady comfort, and a pattern that keeps turning into confusion.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link to="/#calculator" className="btn-primary inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold">
                  Run your comparison
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/reports/private-compatibility-read" className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white px-6 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary">
                  Read what is included
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default SampleReportPage;
