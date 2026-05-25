
import React from 'react';
import { Helmet } from 'react-helmet';

function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Match by Birth</title>
        <meta name="description" content="Privacy Policy for Match by Birth, outlining our secure URL-based data handling." />
      </Helmet>

      <main className="py-20 md:py-24 bg-background min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-slate dark:prose-invert prose-headings:text-balance prose-h1:text-4xl prose-h1:font-extrabold prose-a:text-primary mx-auto">
            <h1>Privacy Policy</h1>
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-8">
              Last Updated: May 24, 2026
            </p>

            <div className="p-6 bg-primary/10 rounded-2xl border border-primary/20 mb-8 not-prose">
              <p className="font-semibold text-foreground m-0">
                TL;DR: We don't save your names or birthdates to a database. The data you enter is stored securely inside the URL so you can easily share your results with friends.
              </p>
            </div>

            <h2>1. Data Collection</h2>
            <p>
              When you use our compatibility calculator, you provide names (or aliases) and birth dates. This information is required strictly to calculate accurate astrological placements and dynamics. 
            </p>

            <h2>2. URL Parameters & Group Mode Data</h2>
            <p>
              We designed Match by Birth to be entirely stateless to protect your privacy. When you calculate a match (including our up to 7-person Group Mode), your input data is encoded directly into the web address (URL parameters). 
            </p>
            <p>
              <strong>We do not transmit this data to our servers, nor do we store it in a backend database.</strong> Anyone who receives your shared URL will be able to see the names and dates embedded within it, so please share your result links responsibly.
            </p>

            <h2>3. Data Retention</h2>
            <p>
              Because your personal input data is processed locally and encoded in the URL, it is not retained by us after you close your browser. We do not have a database of users' birth charts.
            </p>

            <h2>4. Third-Party Services</h2>
            <p>
              We use third-party services to support the operation of our website:
            </p>
            <ul>
              <li><strong>Google AdSense:</strong> We use Google AdSense to display advertisements. Google uses cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting Google Ads Settings.</li>
              <li><strong>Analytics:</strong> We may use basic analytics to understand aggregate site traffic (such as page views and browser types). This data is anonymized and not linked to your compatibility inputs.</li>
            </ul>

            <h2>5. Cookies</h2>
            <p>
              Our third-party advertising and analytics partners use cookies to collect technical data. You can manage or disable cookies through your browser settings, though doing so may affect the display of advertisements.
            </p>

            <h2>6. User Rights</h2>
            <p>
              Because we do not store your personal compatibility data in a database, there is no account to delete or data profile to request. If you clear your browser history and do not share your generated URLs, your data is gone.
            </p>

            <h2>7. Contact Information</h2>
            <p>
              If you have any questions or concerns about this privacy policy or how your data is handled, please contact us at <a href="mailto:support@matchbybirth.com">support@matchbybirth.com</a>.
            </p>
          </article>
        </div>
      </main>
    </>
  );
}

export default PrivacyPolicyPage;
