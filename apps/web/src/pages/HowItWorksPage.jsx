
import React from 'react';
import { Helmet } from 'react-helmet';
import BackButton from '@/components/BackButton.jsx';
import Footer from '@/components/Footer.jsx';

function HowItWorksPage() {
  return (
    <>
      <Helmet>
        <title>How Compatibility Is Calculated | Match by Birth</title>
        <meta name="description" content="How we read compatibility: zodiac elements, element interactions, and what the score covers." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 py-16">
          <div className="content-container max-w-3xl">
            <BackButton fallbackTo="/" label="Back to Calculator" />
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              How compatibility is calculated
            </h1>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              We compare each person's birth chart using zodiac elements, sign placements, and aspect patterns. The result shows where the relationship is naturally aligned and where it may require more work.
            </p>

            <div className="space-y-10">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">Zodiac elements</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Each sign belongs to one of four elements:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong className="text-foreground">Fire:</strong> Aries, Leo, Sagittarius.</li>
                  <li><strong className="text-foreground">Earth:</strong> Taurus, Virgo, Capricorn.</li>
                  <li><strong className="text-foreground">Air:</strong> Gemini, Libra, Aquarius.</li>
                  <li><strong className="text-foreground">Water:</strong> Cancer, Scorpio, Pisces.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">How the elements interact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Some element pairings tend to flow more easily than others. Fire and Air often support each other, while Earth and Water usually create steadier connections. Mixed pairings can still work well, but they may need more understanding and balance.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">What the score covers</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong className="text-foreground">Overall:</strong> General harmony based on elemental interaction.</li>
                  <li><strong className="text-foreground">Emotional:</strong> How well you support each other's needs.</li>
                  <li><strong className="text-foreground">Communication:</strong> Ease of expressing thoughts and resolving issues.</li>
                  <li><strong className="text-foreground">Chemistry:</strong> Natural attraction and magnetic pull.</li>
                  <li><strong className="text-foreground">Conflict Risk:</strong> Potential areas of tension or recurring friction.</li>
                </ul>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default HowItWorksPage;
