
import React from 'react';
import { Helmet } from 'react-helmet';
import BackButton from '@/components/BackButton.jsx';

function FAQPage() {
  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | Match by Birth</title>
        <meta name="description" content="Find answers to common questions about astrological compatibility, our calculator, and how to interpret your results." />
      </Helmet>

      <main className="section-spacing bg-background min-h-screen">
        <div className="content-container max-w-3xl">
          <BackButton fallbackTo="/" label="Back to Calculator" />
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground">Everything you need to know about Match by Birth.</p>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-sm">
            <p className="text-muted-foreground">
              Detailed FAQ content is currently being updated. Please check back soon or visit our homepage for common questions.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default FAQPage;
