import React from 'react';
import { trackEvent } from '@/lib/analytics.js';
import NewsletterCapture from '@/components/NewsletterCapture.jsx';

function EmailCaptureSection({ resultId, people, score, signs }) {
  const names = people ? `${people[0]?.name || signs?.[0] || 'You'} & ${people[1]?.name || signs?.[1] || 'Your Partner'}` : 'Your Relationship';

  return (
    <NewsletterCapture
      className="mt-8"
      title="Get your result by email"
      description={(
        <>
          Enter your email and we&apos;ll send a private copy of <strong>{names}</strong>, plus your personalized compatibility insights.
        </>
      )}
      buttonLabel="Send result"
      loadingLabel="Saving..."
      successTitle="You're on the list."
      successDescription="Check your inbox for your result copy and future notes."
      finePrint="Free. Unsubscribe anytime."
      consentSource="result_updates"
      resultId={resultId}
      onView={() => trackEvent('email_capture_viewed', { source: 'result_updates' })}
      onSubscribe={() => trackEvent('email_subscribed', { source: 'result_updates' })}
    />
  );
}

export default EmailCaptureSection;
