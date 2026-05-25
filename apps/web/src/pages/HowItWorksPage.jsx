
import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

function HowItWorksPage() {
  return (
    <>
      <Helmet>
        <title>How It Works - Compatibility Calculator</title>
        <meta name="description" content="Learn how our compatibility calculator uses zodiac signs and birth dates to analyze relationship dynamics." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 py-16">
          <div className="content-container">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              How our compatibility calculator works
            </h1>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Understanding the framework behind our astrological relationship analysis.
            </p>

            <div className="space-y-12">
              <section className="bg-card p-8 rounded-xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold text-foreground mb-4">The Foundation: Zodiac Elements</h2>
                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    At the heart of our compatibility calculator lies the ancient system of zodiac signs. Each person's birth date determines their sun sign. The twelve zodiac signs are divided into four elements:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong className="text-foreground">Fire signs</strong> (Aries, Leo, Sagittarius): Passionate, energetic, and action-oriented.</li>
                    <li><strong className="text-foreground">Earth signs</strong> (Taurus, Virgo, Capricorn): Practical, grounded, and reliable.</li>
                    <li><strong className="text-foreground">Air signs</strong> (Gemini, Libra, Aquarius): Intellectual, communicative, and social.</li>
                    <li><strong className="text-foreground">Water signs</strong> (Cancer, Scorpio, Pisces): Emotional, intuitive, and sensitive.</li>
                  </ul>
                </div>
              </section>

              <section className="bg-card p-8 rounded-xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold text-foreground mb-4">Elemental Compatibility Patterns</h2>
                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    The elements interact in predictable ways that form the basis of compatibility analysis:
                  </p>
                  <div className="space-y-4 mt-6">
                    <div className="bg-muted/30 p-5 rounded-lg border border-border/50">
                      <h3 className="text-lg font-bold text-foreground mb-2">Harmonious Combinations</h3>
                      <p className="text-base">Signs of the same element naturally understand each other's motivations. Fire and air signs also complement each other well, just as earth and water signs create stable connections.</p>
                    </div>
                    <div className="bg-muted/30 p-5 rounded-lg border border-border/50">
                      <h3 className="text-lg font-bold text-foreground mb-2">Challenging Combinations</h3>
                      <p className="text-base">Fire and water can create steam but also conflict. Earth and air may struggle, as earth finds air too abstract while air sees earth as limiting. These pairs require conscious communication.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-card p-8 rounded-xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Scoring System</h2>
                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    We analyze multiple dimensions of your relationship to provide a complete picture:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Overall:</strong> The general harmony based on elemental interactions.</li>
                    <li><strong>Emotional:</strong> How well you support each other's needs.</li>
                    <li><strong>Communication:</strong> The ease of expressing thoughts and resolving issues.</li>
                    <li><strong>Chemistry:</strong> Natural attraction and magnetic pull.</li>
                    <li><strong>Conflict Risk:</strong> Potential areas of tension or recurring friction.</li>
                  </ul>
                </div>
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
