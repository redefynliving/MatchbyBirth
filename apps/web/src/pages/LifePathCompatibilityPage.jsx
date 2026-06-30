import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Calculator, LockKeyhole, MessageCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trackEvent } from '@/lib/analytics.js';
import { buildCalculatorPrefill } from '@/lib/calculator-prefill.js';
import {
  compareLifePaths,
  lifePathMeanings,
} from '@/lib/lifePath.js';

const pageUrl = 'https://matchbybirth.com/tools/life-path-compatibility';
const pageTitle = 'Life Path Compatibility Calculator | Match by Birth';
const pageDescription = 'Compare two birth dates by life path number. Learn what each number means, how life path compatibility works, and what to talk about next.';

const faqItems = [
  {
    question: 'Is a life path number the same as a zodiac sign?',
    answer: 'No. A zodiac sign is based on the season of birth. A life path number is calculated from the digits in a birth date. Match by Birth treats it as a reflection layer, not a prediction.',
  },
  {
    question: 'Do I need birth time or place?',
    answer: 'No. Life path numbers only need a calendar birth date. Time and place can matter for astrology, but they are not needed for this numerology layer.',
  },
  {
    question: 'Are master numbers included?',
    answer: 'Yes. Most life path numbers reduce to one digit, but Match by Birth keeps 11, 22, and 33 when the final calculation lands on one of those master numbers.',
  },
];

const compatibilityRows = [
  ['Usually easy', '2 and 6, 3 and 5, 4 and 8, 6 and 9', 'Shared pace, mutual support, or similar priorities.'],
  ['Strong but intense', '1 and 8, 3 and 8, 5 and 8, 7 and 8', 'The connection may have drive, attraction, or ambition, but it needs clear expectations.'],
  ['Master number layer', '11, 22, and 33', 'These numbers keep the root-number theme but add more sensitivity, responsibility, or care to the reading.'],
  ['Needs more translation', '2 and 5, 3 and 7, 4 and 5, 5 and 6', 'Different needs can work, but both people have to name what feels safe.'],
];

function LifePathTool({ source = 'life_path_compatibility' }) {
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [firstDate, setFirstDate] = useState('');
  const [secondDate, setSecondDate] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFullMatchClick = () => {
    const calculatorPrefill = buildCalculatorPrefill({
      firstName,
      firstDate,
      secondName,
      secondDate,
      relationshipType: 'love',
      source,
    });

    if (!calculatorPrefill) {
      setError('Enter two valid birth dates before opening the full compatibility calculator.');
      return;
    }

    trackEvent('life_path_to_full_match_clicked', {
      source,
      first_life_path: result?.personA?.lifePath || null,
      second_life_path: result?.personB?.lifePath || null,
    });

    navigate('/#calculator', {
      state: {
        calculatorPrefill,
      },
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    const comparison = compareLifePaths(firstDate, secondDate);
    trackEvent('life_path_tool_started', { source });

    if (!comparison) {
      setResult(null);
      setError('Enter two valid birth dates to compare life path numbers.');
      trackEvent('life_path_tool_failed', { source });
      return;
    }

    setResult(comparison);
    trackEvent('life_path_tool_completed', {
      source,
      score_band: Math.floor(comparison.score / 10) * 10,
      first_life_path: comparison.personA.lifePath,
      second_life_path: comparison.personB.lifePath,
    });
  };

  return (
    <div id="calculator" className="rounded-3xl border border-primary/10 bg-card p-5 shadow-[0_8px_40px_rgba(55,43,65,0.08)] md:p-7">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Calculator className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Compare two life paths</h2>
          <p className="mt-1 text-sm text-muted-foreground">Two birth dates in. Life path numbers, compatibility pattern, and one next step out.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="life-path-name-a" className="text-xs text-muted-foreground">First name or nickname</Label>
            <Input
              id="life-path-name-a"
              value={firstName}
              onChange={(event) => setFirstName(event.currentTarget.value)}
              placeholder="You"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="life-path-date-a" className="text-xs text-muted-foreground">First birth date</Label>
            <Input
              id="life-path-date-a"
              type="date"
              value={firstDate}
              onChange={(event) => setFirstDate(event.currentTarget.value)}
              max={new Date().toISOString().slice(0, 10)}
              required
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="life-path-name-b" className="text-xs text-muted-foreground">Second name or nickname</Label>
            <Input
              id="life-path-name-b"
              value={secondName}
              onChange={(event) => setSecondName(event.currentTarget.value)}
              placeholder="Them"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="life-path-date-b" className="text-xs text-muted-foreground">Second birth date</Label>
            <Input
              id="life-path-date-b"
              type="date"
              value={secondDate}
              onChange={(event) => setSecondDate(event.currentTarget.value)}
              max={new Date().toISOString().slice(0, 10)}
              required
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <Button type="submit" className="btn-primary h-12 w-full rounded-xl text-sm">
          Compare life paths
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        {error && (
          <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm font-medium text-destructive">
            {error}
          </div>
        )}
      </form>

      {result && (
        <section className="mt-5 rounded-2xl border border-border bg-muted/20 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Life path result</p>
              <h3 className="mt-1 text-2xl font-semibold text-foreground">
                {firstName || 'Person A'} is {result.personA.lifePath}. {secondName || 'Person B'} is {result.personB.lifePath}.
              </h3>
            </div>
            <div className="rounded-2xl bg-card px-4 py-3 text-center shadow-sm">
              <span className="block text-3xl font-semibold text-primary">{result.score}</span>
              <span className="text-xs text-muted-foreground">fit score</span>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Pattern</h4>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{result.pattern}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Watch area</h4>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{result.watchArea}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Next step</h4>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{result.nextStep}</p>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-primary/15 bg-card p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-base font-semibold text-foreground">Want the full birth-date compatibility reading?</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Use the same names and birth dates to see the complete Match by Birth score, strengths, watch area, and report option.
                </p>
              </div>
              <Button
                type="button"
                onClick={handleFullMatchClick}
                className="btn-primary h-11 shrink-0 rounded-xl px-5 text-sm"
              >
                Compare full birth-date match
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      )}

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
        Private, with no signup required. Birth dates are not stored.
      </p>
    </div>
  );
}

function LifePathCompatibilityPage() {
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content="https://matchbybirth.com/og-image.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Life Path Compatibility Calculator',
            description: pageDescription,
            url: pageUrl,
            applicationCategory: 'LifestyleApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          })}
        </script>
      </Helmet>

      <main className="flex-1 bg-background">
        <section className="border-b border-border/60 bg-[linear-gradient(180deg,#fff_0%,#fbf7fd_100%)] py-12 md:py-16">
          <div className="content-container">
            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
              <div>
                <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary">
                  Birth date numerology compatibility
                </p>
                <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground md:text-6xl">
                  Life Path Compatibility Calculator
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  Compare two birth dates by life path number. See each number, the relationship pattern between them, and one practical conversation prompt.
                </p>
                <div className="mt-7 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3 lg:max-w-xl">
                  <span className="flex items-center gap-2">
                    <LockKeyhole className="h-4 w-4 text-primary" />
                    Date only
                  </span>
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Birth dates not stored
                  </span>
                  <span className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    Built for reflection
                  </span>
                </div>
              </div>

              <LifePathTool source="life_path_compatibility" />
            </div>
          </div>
        </section>

        <section className="section-spacing bg-background">
          <div className="content-container max-w-4xl">
            <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">Method</p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">What is a life path number?</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              A life path number is a numerology shorthand made from the digits in a birth date. On Match by Birth, it is used as one reflection layer beside zodiac and birthday-based compatibility. It does not decide a relationship, but it can make patterns easier to name.
            </p>

            <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-foreground">How to calculate your life path number</h3>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <li><strong className="text-foreground">1.</strong> Start with the full birth date.</li>
                <li><strong className="text-foreground">2.</strong> Add the month, day, and year separately, then reduce each part to one digit.</li>
                <li><strong className="text-foreground">3.</strong> Add those three results together.</li>
                <li><strong className="text-foreground">4.</strong> Reduce again, unless the final number is 11, 22, or 33.</li>
              </ol>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Example: August 24, 1995 becomes month 8, day 6, and year 6. Together that is 20, then 2 + 0 = 2, so the life path number is 2.
              </p>
              <h4 className="mt-5 text-base font-semibold text-foreground">Master numbers</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Most totals reduce to a single digit. The exception is 11, 22, or 33. Numerology treats those as master numbers, so Match by Birth keeps them instead of reducing 11 to 2, 22 to 4, or 33 to 6.
              </p>
            </div>
          </div>
        </section>

        <section className="section-spacing border-y border-border/60 bg-muted/20">
          <div className="content-container max-w-6xl">
            <div className="mb-8 text-center">
              <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">Life path meanings</p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Root numbers and master numbers</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(lifePathMeanings).map(([number, profile]) => (
                <article key={number} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-lg font-semibold text-primary">{number}</span>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{profile.theme}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{profile.strength}</p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">Watch:</strong> {profile.watch}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-spacing bg-background">
          <div className="content-container max-w-5xl">
            <div className="mb-8 text-center">
              <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">Compatibility table</p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">How to read life path compatibility</h2>
            </div>
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              {compatibilityRows.map(([label, examples, meaning]) => (
                <div key={label} className="grid gap-3 border-b border-border p-5 last:border-b-0 md:grid-cols-[0.7fr_1fr_1.4fr]">
                  <h3 className="font-semibold text-foreground">{label}</h3>
                  <p className="text-sm text-muted-foreground">{examples}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{meaning}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-center text-sm leading-relaxed text-muted-foreground">
              Want the zodiac layer too? Try the <Link to="/#calculator" className="font-semibold text-primary hover:underline">birth date compatibility calculator</Link> or read <Link to="/how-it-works" className="font-semibold text-primary hover:underline">how Match by Birth works</Link>.
            </p>
          </div>
        </section>

        <section className="section-spacing bg-background">
          <div className="content-container max-w-3xl">
            <div className="mb-8 text-center">
              <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">Quick answers</p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Life path compatibility FAQ</h2>
            </div>
            <div className="space-y-3">
              {faqItems.map((item) => (
                <article key={item.question} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <h3 className="text-base font-semibold text-foreground">{item.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default LifePathCompatibilityPage;
