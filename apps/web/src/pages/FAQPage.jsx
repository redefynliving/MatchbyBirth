import React from 'react';
import { Helmet } from 'react-helmet';
import BackButton from '@/components/BackButton.jsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

function FAQPage() {
  const faqs = [
    {
      q: 'Do I need an exact birth time?',
      a: 'No. Match by Birth is designed to give you compatibility insights using calendar birth dates alone. If you do have your exact birth time and place, you can toggle "Exact Mode" on the calculator to get a highly precise placement of your Sun sign.',
    },
    {
      q: 'Are birth dates stored?',
      a: 'No. We respect your privacy. Birth dates are processed transiently in server memory to calculate your compatibility scores and astrological signs, and are immediately discarded. They are never saved to our database or included in sharing links.',
    },
    {
      q: 'Can I compare a group of people?',
      a: 'Yes! Group Mode allows you to compare 3 to 7 people at the same time. The calculator ranks every unique pair within the group, shows the strongest cosmic relationships, and computes an overall "Group Vibe Score." It is perfect for families, friend groups, or work teams.',
    },
    {
      q: 'How are compatibility scores calculated?',
      a: 'We determine the precise degree of planetary placements on your birth date. Then, we analyze element interactions (Fire, Earth, Air, Water) and aspect patterns to generate compatibility scores across five key areas: Overall Harmony, Emotional Support, Communication Flow, Chemistry, and Conflict Risk.',
    },
    {
      q: 'What is the detailed PDF report?',
      a: 'For a one-time purchase of $9.99, you can get a comprehensive 9-section PDF report detailing your match. It covers communication patterns, physical chemistry, emotional alignment, conflict resolution styles, and practical, actionable relationship guidance. The report is delivered securely to your email.',
    },
    {
      q: 'Is payment security guaranteed?',
      a: 'Yes. All payments are processed securely by Stripe, a world-class payment provider. Match by Birth does not store, see, or process your credit card numbers on our servers.',
    },
    {
      q: 'What happens if I subscribe for email updates?',
      a: 'If you opt in, we may send occasional Match by Birth updates when new guides, tools, or product changes go live. It is free, no account is required, and you can unsubscribe at any time with the link at the bottom of any email.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | Match by Birth</title>
        <meta name="description" content="Find answers to common questions about astrological compatibility, our calculator, and how to interpret your results." />
        <link rel="canonical" href="https://matchbybirth.com/faq" />
      </Helmet>

      <main className="py-16 md:py-24 bg-background min-h-screen relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="pointer-events-none absolute top-0 right-1/4 h-[300px] w-[300px] rounded-full opacity-[0.07] blur-3xl bg-primary" />
        
        <div className="content-container max-w-3xl relative z-10">
          <BackButton fallbackTo="/" label="Back to Calculator" />
          
          <header className="text-center mb-12">
            <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <HelpCircle className="h-6 w-6" />
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground">Everything you need to know about Match by Birth.</p>
          </header>
          
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm shadow-elevated">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className="rounded-xl border border-border bg-card px-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <AccordionTrigger className="py-4 text-left font-semibold text-foreground hover:no-underline hover:text-primary transition-colors">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 leading-relaxed text-muted-foreground text-sm md:text-base">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
    </>
  );
}

export default FAQPage;
