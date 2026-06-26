import React from 'react';
import { Helmet } from 'react-helmet';
import BackButton from '@/components/BackButton.jsx';
import Footer from '@/components/Footer.jsx';
import { 
  Flame, 
  Globe, 
  Wind, 
  Droplets, 
  Sparkles, 
  Heart, 
  MessageCircle, 
  Zap, 
  AlertTriangle, 
  Info,
  Compass
} from 'lucide-react';

function HowItWorksPage() {
  const elements = [
    {
      name: 'Fire',
      icon: Flame,
      signs: 'Aries, Leo, Sagittarius',
      description: 'Passionate, energetic, and intuitive. Fire signs bring warmth, motivation, and inspiration to relationships.',
      colorClass: 'from-orange-500/10 to-red-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400',
      iconBg: 'bg-orange-500/10 text-orange-500',
    },
    {
      name: 'Earth',
      icon: Globe,
      signs: 'Taurus, Virgo, Capricorn',
      description: 'Practical, grounded, and dependable. Earth signs offer structure, reliability, and security.',
      colorClass: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10 text-emerald-500',
    },
    {
      name: 'Air',
      icon: Wind,
      signs: 'Gemini, Libra, Aquarius',
      description: 'Intellectual, social, and communicative. Air signs focus on ideas, connection, and objective perspective.',
      colorClass: 'from-sky-500/10 to-blue-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400',
      iconBg: 'bg-sky-500/10 text-sky-500',
    },
    {
      name: 'Water',
      icon: Droplets,
      signs: 'Cancer, Scorpio, Pisces',
      description: 'Emotional, sensitive, and empathetic. Water signs bring depth, intuition, and deep feeling.',
      colorClass: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-blue-500/10 text-indigo-500',
    },
  ];

  const scoreDimensions = [
    {
      title: 'Overall Harmony',
      icon: Sparkles,
      description: 'General ease and connection based on how well your astrological elements flow together.',
    },
    {
      title: 'Emotional Support',
      icon: Heart,
      description: 'How naturally you understand and support each other\'s feelings, vulnerabilities, and inner needs.',
    },
    {
      title: 'Communication flow',
      icon: MessageCircle,
      description: 'The ease of exchanging ideas, talking through plans, and finding common ground during discussions.',
    },
    {
      title: 'Chemistry & Attraction',
      icon: Zap,
      description: 'The natural spark, magnetic pull, and physical or energetic attraction between both signs.',
    },
    {
      title: 'Conflict Risk',
      icon: AlertTriangle,
      description: 'Potential friction areas or blind spots where differences can lead to misunderstandings.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>How Compatibility Is Calculated | Match by Birth</title>
        <meta name="description" content="How we read compatibility: zodiac elements, element interactions, and what the score covers." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 py-12 md:py-20 relative overflow-hidden">
          {/* Subtle backdrop decoration */}
          <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full opacity-10 blur-3xl bg-radial-gradient" style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.15), transparent 70%)' }} />

          <div className="content-container max-w-4xl relative z-10">
            <BackButton fallbackTo="/" label="Back to Calculator" />
            
            <header className="mb-12 md:mb-16">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
                How compatibility is calculated
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                We compare each person&apos;s birth chart using zodiac elements, sign placements, and aspect patterns. The result shows where the relationship is naturally aligned and where it may require more work.
              </p>
            </header>

            {/* Elements Section */}
            <section className="mb-16">
              <div className="flex items-center gap-2 mb-6">
                <span className="p-1.5 bg-primary/10 rounded-lg text-primary">
                  <Info className="h-5 w-5" />
                </span>
                <h2 className="text-2xl font-semibold tracking-tight">The Zodiac Elements</h2>
              </div>
              <p className="text-muted-foreground mb-8 leading-relaxed max-w-2xl">
                Every zodiac sign belongs to one of the four main elements. Understanding how these basic elements interact helps reveal the fundamental chemistry of your match.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {elements.map((el) => {
                  const Icon = el.icon;
                  return (
                    <div 
                      key={el.name}
                      className={`rounded-2xl border bg-gradient-to-br p-6 shadow-sm transition-shadow hover:shadow-md ${el.colorClass}`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`grid h-10 w-10 place-items-center rounded-xl ${el.iconBg}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">{el.name}</h3>
                          <p className="text-xs font-medium opacity-85">{el.signs}</p>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {el.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Element Interaction Section */}
            <section className="mb-16 bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="p-1.5 bg-primary/10 rounded-lg text-primary">
                  <Compass className="h-5 w-5" />
                </span>
                <h2 className="text-2xl font-semibold tracking-tight">How elements interact</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Astrological compatibility is not about being identical; it&apos;s about how your energies complement each other.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="border border-border/60 bg-muted/20 rounded-xl p-5">
                  <h4 className="font-semibold text-foreground mb-2">Flowing Connections</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Fire and Air naturally feed and inspire each other, creating relationships filled with excitement, communication, and big ideas. Similarly, Earth and Water signs nurture one another, building highly supportive, secure, and deeply stable connections.
                  </p>
                </div>
                <div className="border border-border/60 bg-muted/20 rounded-xl p-5">
                  <h4 className="font-semibold text-foreground mb-2">Growth Connections</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Pairings with different or contrasting elements (like Fire and Water, or Air and Earth) bring unique strengths to the table. These relationships are often highly transformative, encouraging both partners to learn, balance, and grow together.
                  </p>
                </div>
              </div>
            </section>

            {/* Score Dimensions Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold tracking-tight mb-6">What the score covers</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed max-w-2xl">
                We break compatibility down into five core dimensions to give you a clear, actionable picture of how you connect.
              </p>

              <div className="space-y-4">
                {scoreDimensions.map((dim) => {
                  const Icon = dim.icon;
                  return (
                    <div 
                      key={dim.title}
                      className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-semibold text-foreground">{dim.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{dim.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default HowItWorksPage;
