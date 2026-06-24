
import React from 'react';
import { Helmet } from 'react-helmet';
import BackButton from '@/components/BackButton.jsx';

function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact Us | Match by Birth</title>
        <meta name="description" content="Get in touch with the Match by Birth team for support, feedback, or inquiries." />
      </Helmet>

      <main className="section-spacing bg-background min-h-screen">
        <div className="content-container max-w-2xl">
          <BackButton fallbackTo="/" label="Back to Calculator" />
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground">We'd love to hear from you.</p>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <p className="text-muted-foreground text-center mb-4">
              Have a question or feedback? We typically reply within 1-2 business days. Please include as much context as you can so we can help fast.
            </p>
            <div className="text-center mb-6">
              <a href="mailto:support@matchbybirth.com" className="text-xl font-semibold text-primary hover:underline">
                support@matchbybirth.com
              </a>
            </div>
            <div className="border-t border-border pt-4">
              <h3 className="text-lg font-semibold mb-2">Quick Help</h3>
              <ul className="text-muted-foreground list-disc list-inside">
                <li>Account or email issues — include the email you used.</li>
                <li>Result mismatch — paste the URL of the result page.</li>
                <li>Bug report — steps to reproduce and device/browser info help a lot.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ContactPage;
