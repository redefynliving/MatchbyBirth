import React from 'react';

export default function PremiumPage() {
  return (
    <main className="section-spacing bg-background min-h-screen">
      <div className="content-container max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold mb-4">Premium — Weekly Compatibility</h1>
        <p className="mb-6">Subscribe for weekly compatibility summaries and priority reports.</p>
        <a href="https://checkout.stripe.com/test_payment_link_placeholder" className="inline-flex items-center justify-center px-6 py-3 btn-primary rounded-xl font-semibold">Subscribe — $9.99/mo (test)</a>
      </div>
    </main>
  );
}
