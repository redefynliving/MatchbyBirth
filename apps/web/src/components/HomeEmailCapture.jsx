import React from 'react';
import NewsletterCapture from '@/components/NewsletterCapture.jsx';

function HomeEmailCapture() {
  return (
    <NewsletterCapture
      className="mx-auto mt-16 max-w-3xl px-4"
      consentSource="home_updates"
      successDescription="Check your inbox for a confirmation email."
    />
  );
}

export default HomeEmailCapture;
