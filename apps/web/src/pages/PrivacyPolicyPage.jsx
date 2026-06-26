import React from 'react';
import { Helmet } from 'react-helmet';

function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Match by Birth</title>
        <meta name="description" content="How Match by Birth processes calculator, result, payment, email, and analytics data." />
      </Helmet>

      <main className="py-20 md:py-24 bg-background min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-slate prose-headings:text-balance prose-h1:text-4xl prose-h1:font-extrabold prose-a:text-primary mx-auto">
            <h1>Privacy Policy</h1>
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-8">
              Last Updated: June 18, 2026
            </p>

            <div className="p-6 bg-primary/10 rounded-2xl border border-primary/20 mb-8 not-prose">
              <p className="font-semibold text-foreground m-0">
                Birth dates, optional birth time and birth place are processed to calculate your result. If you use MBB Exact Mode, your selected birth place, timezone, and coordinates are used to calculate a high-precision Sun sign. Raw birth dates, times, and places are not stored in our database or included in new share links. Raw birth dates, times, places, coordinates, and timezones are not stored; sanitized result precision may include a selected place label so you can understand which city was used.
              </p>
            </div>

            <h2>1. Information You Provide</h2>
            <p>
              The free calculator receives display names or aliases, birth dates, and optional birth time and birth place if you choose to add them. Exact Mode requires a selected birth place suggestion so the calculator can use a real timezone instead of guessing from free text. If you purchase a report or opt into updates, we also receive your email address. Payment card information is collected directly by Stripe and is not handled by Match by Birth.
            </p>

            <h2>2. Calculator Processing and Saved Results</h2>
            <p>
              Names and birth details are transmitted securely to our calculation endpoint. Birth dates, optional times, selected places, timezones, and coordinates are used transiently to determine signs, scores, and precision context, then discarded. We store a sanitized result containing display names, signs, scores, interpretations, precision labels, optional selected place labels, and an opaque sharing identifier.
            </p>
            <p>
              Unpaid shared results expire after approximately 90 days. Purchased results and reports are retained so the buyer can revisit them, unless deletion is requested.
            </p>

            <h2>3. Private Sharing</h2>
            <p>
              New result URLs contain a random share identifier rather than names, birth dates, birth times, or birth places. Anyone who receives that link can view the sanitized result, so only share it with people you trust.
            </p>

            <h2>4. Purchases and Reports</h2>
            <p>
              Stripe processes checkout and payment data. We store the checkout status, amount, currency, delivery email, and provider identifiers needed to fulfill or refund the purchase. Anthropic receives the sanitized signs, scores, and display names needed to generate a paid report; it does not receive birth dates or your email address. Resend receives the delivery email and completed report.
            </p>

            <h2>5. Optional Marketing Email</h2>
            <p>
              Report delivery does not automatically enroll you in marketing. Marketing consent is optional and unchecked by default. If you opt in, we retain your email until you unsubscribe or request deletion.
            </p>

            <h2>6. Analytics and Cookies</h2>
            <p>
              We use Vercel Analytics to measure aggregate events such as calculations, shares, checkout starts, and completed report delivery. Analytics events do not include names, birth dates, optional birth details, emails, or private result tokens.
            </p>
            <p>
              We may use Google AdSense and other advertising partners to display ads. Google and other third-party vendors may place or read cookies, use web beacons, or use similar identifiers to help serve, measure, and personalize ads based on your visits to this site and other sites. You can learn more about how Google uses data from sites and apps that use Google services at <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">Google's partner sites policy</a>.
            </p>
            <p>
              You can adjust cookie preferences in your browser settings. Where required, optional advertising or analytics cookies are subject to your consent choices.
            </p>

            <h2>7. Service Providers</h2>
            <ul>
              <li><strong>Vercel:</strong> website hosting, server functions, and aggregate analytics.</li>
              <li><strong>Google AdSense:</strong> advertising delivery, ad measurement, and cookie-based ad services.</li>
              <li><strong>Supabase:</strong> secure database storage.</li>
              <li><strong>Stripe:</strong> payment processing.</li>
              <li><strong>Anthropic:</strong> paid report generation using sanitized result data.</li>
              <li><strong>Resend:</strong> transactional and opted-in email delivery.</li>
            </ul>

            <h2>8. Your Choices and Rights</h2>
            <p>
              You may ask us to delete a shared result, purchased report, purchase email, or marketing subscription. Send the relevant result or report link and your request to <a href="mailto:support@matchbybirth.com">support@matchbybirth.com</a>. We may ask for reasonable verification before deleting purchase records.
            </p>

            <h2>9. Security and Children</h2>
            <p>
              We use access controls, encrypted connections, private report tokens, and restricted server credentials. No online system is risk-free. Match by Birth is not directed to children under 13, and children should not submit personal information.
            </p>

            <h2>10. Contact</h2>
            <p>
              Privacy questions may be sent to <a href="mailto:support@matchbybirth.com">support@matchbybirth.com</a>.
            </p>
          </article>
        </div>
      </main>
    </>
  );
}

export default PrivacyPolicyPage;
