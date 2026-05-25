
import React from 'react';
import { Helmet } from 'react-helmet';

function TermsAndConditionsPage() {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions | Match by Birth</title>
        <meta name="description" content="Terms and Conditions for using Match by Birth, covering user responsibilities, service limitations, and astrological disclaimers." />
      </Helmet>

      <main className="section-spacing bg-background min-h-screen">
        <div className="content-container">
          <article className="legal-content">
            <h1>Terms and Conditions</h1>
            <p className="text-sm font-medium uppercase tracking-wider text-primary mb-8">
              Effective Date: May 22, 2026
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Match by Birth and our Relationship Compatibility Calculator, you accept and agree to be bound by the terms and provision of this agreement ("Terms"). If you do not agree to abide by these Terms, please do not use this Website.
            </p>

            <h2>2. Entertainment and Informational Purposes Only</h2>
            <p>
              All compatibility readings, group dynamics, matrix visualizations, and dynamic score interpretations provided by Match by Birth are for entertainment and informational purposes only. The Website is designed to offer fun, reflective insights into human relationships based on traditional astrological archetypes. It does not provide factual guarantees or certified advice.
            </p>

            <h2>3. Astrological Compatibility Disclaimer</h2>
            <p>
              Astrological compatibility—including our scores, detailed insights, strengths, challenges, and long-term potential outlooks—is an interpretive art and is not a factual guarantee of relationship success or failure. Real-world relationships require mutual effort, communication, empathy, and respect.
            </p>
            <p>
              You agree that you will not use our platform's results as the sole basis for making significant relationship, personal, professional, or financial decisions. A high score does not guarantee effortless harmony, and a low score does not mean a connection is doomed.
            </p>

            <h2>4. User Responsibilities</h2>
            <p>
              When using the calculator, you are responsible for the information you input. You agree to only input names and dates of birth for yourself or individuals you have permission to analyze. You are responsible for interpreting the results reasonably and making your own independent decisions regarding your relationships.
            </p>

            <h2>5. Service Limitations</h2>
            <p>
              Match by Birth provides automated, algorithm-driven summaries based on generalized astrological data (elements, modalities, and sun signs). The service does not constitute professional psychological, medical, financial, or relationship counseling. We do not provide one-on-one consulting, therapy, or psychic readings.
            </p>

            <h2>6. Accuracy and Reliability Disclaimer</h2>
            <p>
              Because astrology is a highly symbolic and interpretive system, we make no representations or warranties of any kind, express or implied, about the completeness, factual accuracy, reliability, or suitability of the information contained on the Website. Any reliance you place on such information is therefore strictly at your own risk.
            </p>

            <h2>7. User Conduct Guidelines</h2>
            <p>
              You agree to use the Website only for lawful purposes. You agree not to:
            </p>
            <ul>
              <li>Use the Website or its readings to harass, stalk, abuse, or harm another person.</li>
              <li>Attempt to scrape, reverse engineer, or extract the algorithms and logic used by the Compatibility Calculator.</li>
              <li>Use the Website in any manner that could disable, overburden, or impair the site's functionality.</li>
            </ul>

            <h2>8. Intellectual Property Rights</h2>
            <p>
              All content, features, methodology, dynamic scoring logic, text, graphics, logos, and software on this Website are the exclusive property of Match by Birth or its licensors and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works of our specific reading texts or calculator logic without our express written permission.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              In no event shall Match by Birth, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages—including without limitation, loss of relationships, emotional distress, loss of profits, data, use, goodwill, or other intangible losses—resulting from (i) your access to or use of or inability to access or use the Website; (ii) any life choices or actions you take based on the readings provided by the Website; or (iii) any conduct or content of any third party on the Website.
            </p>

            <h2>10. Third-Party Links</h2>
            <p>
              Our Website may contain links to third-party web sites, advertisers (such as Google AdSense), or services that are not owned or controlled by Match by Birth. We have no control over, and assume no responsibility for, the content or practices of any third-party web sites.
            </p>

            <h2>11. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Website after those revisions become effective, you agree to be bound by the revised terms.
            </p>

            <h2>12. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            <p className="mt-4">
              <strong>Match by Birth</strong><br />
              Email: <a href="mailto:Redefynliving@gmail.com">Redefynliving@gmail.com</a>
            </p>
          </article>
        </div>
      </main>
    </>
  );
}

export default TermsAndConditionsPage;
