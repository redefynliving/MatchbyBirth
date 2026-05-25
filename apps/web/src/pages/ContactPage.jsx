
import React from 'react';
import { Helmet } from 'react-helmet';

function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact Us | Match by Birth</title>
        <meta name="description" content="Get in touch with the Match by Birth team for support, feedback, or inquiries." />
      </Helmet>

      <main className="section-spacing bg-background min-h-screen">
        <div className="content-container max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground">We'd love to hear from you.</p>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <p className="text-muted-foreground text-center mb-6">
              Have a question or feedback? Reach out to us directly at:
            </p>
            <div className="text-center">
              <a href="mailto:support@matchbybirth.com" className="text-xl font-semibold text-primary hover:underline">
                support@matchbybirth.com
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ContactPage;
