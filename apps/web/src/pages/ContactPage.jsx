
import React from 'react';
import { Helmet } from 'react-helmet';
import BackButton from '@/components/BackButton.jsx';

function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact Us | Match by Birth</title>
        <meta name="description" content="Get in touch with the Match by Birth team for support, feedback, or inquiries." />
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
          
          <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm shadow-elevated">
            <p className="text-muted-foreground text-center mb-6 leading-relaxed">
              Have a question or feedback? We typically reply within 1-2 business days. Please include as much context as you can so we can help fast.
            </p>
            
            <div className="text-center mb-8 bg-muted/40 py-4 px-6 rounded-2xl border border-border/50">
              <span className="text-xs font-semibold text-muted-foreground block mb-1">Email us at</span>
              <a href="mailto:support@matchbybirth.com" className="text-xl md:text-2xl font-bold text-primary hover:text-primary/95 transition-colors">
                support@matchbybirth.com
              </a>
            </div>
            
            <div className="border-t border-border pt-6">
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Quick Help</h3>
              <ul className="text-muted-foreground space-y-3 leading-relaxed text-sm md:text-base list-disc list-inside">
                <li><strong className="text-foreground font-semibold">Account or email issues:</strong> include the email you used.</li>
                <li><strong className="text-foreground font-semibold">Result mismatch:</strong> paste the URL of the result page.</li>
                <li><strong className="text-foreground font-semibold">Bug report:</strong> steps to reproduce and device/browser info help a lot.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ContactPage;
