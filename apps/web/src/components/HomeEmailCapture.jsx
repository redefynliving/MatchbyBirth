import React from 'react';
import NewsletterCapture from '@/components/NewsletterCapture.jsx';

function HomeEmailCapture() {
  return (
    <NewsletterCapture
      className="mx-auto mt-16 max-w-3xl px-4"
      consentSource="home_weekly_forecast"
      successDescription="Check your inbox for the first weekly note."
    />
  );
}

export default HomeEmailCapture;
