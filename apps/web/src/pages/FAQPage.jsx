
import React from 'react';
import { Helmet } from 'react-helmet';

const faqItems = [
  {
    question: 'What does Match by Birth do?',
    answer: 'Match by Birth compares birthdays for two people or a group and turns the result into a private compatibility reading. The score is meant to start a conversation, not decide the future of a relationship.',
  },
  {
    question: 'Why would I add birth time and place?',
    answer: 'You do not need them for a basic reading. Add birth time and place if you want a more exact sign calculation, especially for birthdays near a zodiac sign change.',
  },
  {
    question: 'What is MBB Exact Mode?',
    answer: 'MBB Exact Mode uses birth date, time, and selected birth place to calculate a high-precision Sun sign. It can improve sign placement, but it does not guarantee relationship compatibility.',
  },
  {
    question: 'Are birth dates stored?',
    answer: 'Raw birth dates, times, places, coordinates, and timezones are not stored in new shared results. The calculator stores a sanitized result with names, signs, scores, interpretations, and an opaque sharing identifier.',
  },
  {
    question: 'Can I compare a group?',
    answer: 'Yes. Group mode compares 3 to 7 people, checks every unique pair, and summarizes the overall group pattern.',
  },
  {
    question: 'Should I use this to make relationship decisions?',
    answer: 'No. Match by Birth is for entertainment and reflection. Real compatibility depends on communication, values, consent, emotional maturity, and how people treat each other.',
  },
];

function FAQPage() {
  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | Match by Birth</title>
        <meta name="description" content="Find answers about Match by Birth, birth time and place, MBB Exact Mode, privacy, group mode, and how to read compatibility results responsibly." />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((item) => ({
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

      <main className="section-spacing bg-background min-h-screen">
        <div className="content-container max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground">Everything you need to know about Match by Birth.</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item) => (
              <section key={item.question} className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">{item.question}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{item.answer}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default FAQPage;
