import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Calculator, Loader2, LockKeyhole, MessageCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trackEvent } from '@/lib/analytics.js';
import { requestCompatibilityResult } from '@/lib/compatibility-api.js';
import { buildResultNavigation } from '@/lib/result-navigation.js';
import {
  calculateLifePathNumber,
  compareLifePaths,
  getLifePathProfile,
  lifePathMeanings,
} from '@/lib/lifePath.js';

const pageUrl = 'https://matchbybirth.com/tools/life-path-compatibility';
const pageTitle = 'Life Path Compatibility Calculator & Chart | Match by Birth';
const pageDescription = 'Compare two birth dates with a free Life Path compatibility calculator. See every number pairing in a 1–9 chart, including master numbers 11, 22, and 33.';

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

const compatibilityChart = [
  { number: '1', easyFlow: '3, 5, 8', moreTranslation: '4, 6, 7', need: 'Independence without turning decisions into a contest.' },
  { number: '2', easyFlow: '4, 6, 9', moreTranslation: '5, 8', need: 'Reassurance, reciprocity, and direct communication.' },
  { number: '3', easyFlow: '1, 5, 9', moreTranslation: '4, 7', need: 'Expression and play with enough follow-through.' },
  { number: '4', easyFlow: '2, 6, 8', moreTranslation: '1, 3, 5', need: 'Reliability with room for plans to change.' },
  { number: '5', easyFlow: '1, 3, 9', moreTranslation: '2, 4, 6', need: 'Freedom that still makes trust feel steady.' },
  { number: '6', easyFlow: '2, 4, 9', moreTranslation: '1, 5', need: 'Mutual care without one person carrying everything.' },
  { number: '7', easyFlow: '4, 6, 9', moreTranslation: '1, 3', need: 'Privacy and depth without disappearing from the conversation.' },
  { number: '8', easyFlow: '1, 4, 6', moreTranslation: '2, 3', need: 'Shared ambition without control becoming the measure of love.' },
  { number: '9', easyFlow: '2, 3, 6', moreTranslation: '1, 4', need: 'Compassion with clear limits and specific asks.' },
];

const readingModes = [
  {
    title: 'Easy match',
    body: 'The numbers support each other without much translation. This does not mean perfect; it means the default pace, care style, or priorities may be easier to understand.',
  },
  {
    title: 'Growth match',
    body: 'The numbers are different enough to create balance. One person may bring structure while the other brings movement, expression, care, or depth.',
  },
  {
    title: 'Challenging match',
    body: 'The numbers may clash more often, so the connection needs clearer expectations, flexibility, and real-world communication before friction becomes a story.',
  },
];

const relatedGuides = [
  ['Life Path Number Compatibility Guide', '/blog/life-path-number-compatibility-guide'],
  ['Birth Date Compatibility vs. Zodiac Compatibility', '/blog/birth-date-compatibility-vs-zodiac-compatibility'],
  ['How to Use Compatibility Results Responsibly', '/blog/how-to-use-compatibility-results-responsibly'],
];

function LifePathTool({ source = 'life_path_compatibility' }) {
  const [mode, setMode] = useState('compare');
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [firstDate, setFirstDate] = useState('');
  const [secondDate, setSecondDate] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isOpeningFullResult, setIsOpeningFullResult] = useState(false);
  const navigate = useNavigate();

  const handleFullMatchClick = async () => {
    const normalizedFirstName = firstName.trim();
    const normalizedSecondName = secondName.trim();
    if (!normalizedFirstName || !normalizedSecondName) {
      setError('Add both names so the full result and report can be written for you.');
      return;
    }

    setError('');
    setIsOpeningFullResult(true);
    trackEvent('life_path_to_full_match_clicked', {
      source,
      first_life_path: result?.personA?.lifePath || null,
      second_life_path: result?.personB?.lifePath || null,
    });

    try {
      const data = await requestCompatibilityResult({
        mode: 'pair',
        relationshipType: 'love',
        source,
        reportFocus: 'life_path',
        clarityGoal: 'long_term_fit',
        people: [
          { id: 'life-path-pair-1', name: normalizedFirstName, birthDate: firstDate },
          { id: 'life-path-pair-2', name: normalizedSecondName, birthDate: secondDate },
        ],
      });
      const navigation = buildResultNavigation(data);
      trackEvent('life_path_full_match_completed', {
        source,
        score_band: Math.floor(data.result.score / 10) * 10,
      });
      navigate(navigation.path, { state: navigation.state });
    } catch (calculationError) {
      setError(calculationError.message || 'Unable to open the full Life Path result.');
      trackEvent('life_path_full_match_failed', { source });
    } finally {
      setIsOpeningFullResult(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (mode === 'single') {
      const lifePath = calculateLifePathNumber(firstDate);
      const profile = getLifePathProfile(lifePath);
      trackEvent('life_path_single_started', { source });

      if (!lifePath || !profile) {
        setResult(null);
        setError('Enter a valid birth date to find your life path number.');
        trackEvent('life_path_single_failed', { source });
        return;
      }

      setResult({
        type: 'single',
        person: {
          name: firstName,
          lifePath,
          ...profile,
        },
      });
      trackEvent('life_path_single_completed', {
        source,
        life_path: lifePath,
      });
      return;
    }

    const comparison = compareLifePaths(firstDate, secondDate);
    trackEvent('life_path_tool_started', { source });

    if (!comparison) {
      setResult(null);
      setError('Enter two valid birth dates to compare life path numbers.');
      trackEvent('life_path_tool_failed', { source });
      return;
    }

    setResult({
      type: 'compare',
      ...comparison,
    });
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
          <h2 className="text-xl font-semibold tracking-tight">Life Path Number Calculator & Compatibility</h2>
          <p className="mt-1 text-sm text-muted-foreground">Compare two birth dates, or switch modes to calculate one Life Path number.</p>
        </div>
      </div>

      <div className="mb-5 grid rounded-2xl bg-muted/40 p-1 text-sm font-semibold text-muted-foreground sm:grid-cols-2">
        {[
          ['single', 'Find my number'],
          ['compare', 'Compare two people'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setMode(value);
              setResult(null);
              setError('');
            }}
            className={`rounded-xl px-4 py-2.5 transition-colors ${
              mode === value
                ? 'bg-card text-foreground shadow-sm'
                : 'hover:text-foreground'
            }`}
            aria-pressed={mode === value}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="life-path-name-a" className="text-xs text-muted-foreground">
              {mode === 'single' ? 'Name or nickname' : 'First name or nickname'}
            </Label>
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
          {mode === 'compare' && (
            <>
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
            </>
          )}
        </div>

        <Button type="submit" className="btn-primary h-12 w-full rounded-xl text-sm">
          {mode === 'single' ? 'Find my life path number' : 'Compare life paths'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        {error && (
          <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm font-medium text-destructive">
            {error}
          </div>
        )}
      </form>

      {result?.type === 'single' && (
        <section className="mt-5 rounded-2xl border border-border bg-muted/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Life path result</p>
          <h3 className="mt-1 text-2xl font-semibold text-foreground">
            {result.person.name || 'Your'} Life Path number is {result.person.lifePath}.
          </h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Theme</h4>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{result.person.theme}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Strength</h4>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{result.person.strength}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Where to notice yourself</h4>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{result.person.watch}</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-primary/15 bg-card p-4">
            <h4 className="text-sm font-semibold text-primary">Try this</h4>
            <p className="mt-1 text-sm leading-relaxed text-foreground">{result.person.action}</p>
          </div>
          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-primary/15 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Want to see how this number reads with someone else's birth date?
            </p>
            <Button
              type="button"
              onClick={() => {
                setMode('compare');
                setResult(null);
                setError('');
              }}
              className="btn-primary h-11 shrink-0 rounded-xl px-5 text-sm"
            >
              Compare two people
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      )}

      {result?.type === 'compare' && (
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
              <h4 className="text-sm font-semibold text-foreground">Evidence</h4>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Life Path {result.personA.lifePath} centers on {result.personA.theme}; Life Path {result.personB.lifePath} centers on {result.personB.theme}. The fit score is {result.score}.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Real-life meaning</h4>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{result.sharedTranslation} {result.watchArea}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">One useful action</h4>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{result.nextStep}</p>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-primary/15 bg-card p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-base font-semibold text-foreground">Want the full birth-date compatibility reading?</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Use the same names and birth dates to see the complete Match by Birth score, strengths, watch area, timing notes, and report option.
                </p>
              </div>
              <Button
                type="button"
                onClick={handleFullMatchClick}
                disabled={isOpeningFullResult}
                className="btn-primary h-11 shrink-0 rounded-xl px-5 text-sm"
              >
                {isOpeningFullResult ? (
                  <>Opening full result <Loader2 className="ml-2 h-4 w-4 animate-spin" /></>
                ) : (
                  <>Continue to full Life Path result <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
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
                  Birth date numerology calculator
                </p>
                <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground md:text-6xl">
                  Life Path Compatibility Calculator & Number Chart
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  Compare two birth dates for free, see both Life Path numbers, and get a relationship pattern, watch area, and practical conversation prompt.
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
                    Single or pair mode
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
              A life path number is a numerology shorthand made from the digits in a birth date. On Match by Birth, it is used as one reflection layer beside zodiac and birthday-based compatibility. You can use this page as a life path number calculator for one person or as a compatibility calculator for two people.
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
          <div className="content-container max-w-5xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">How to read the match</p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Life Path compatibility is a lens, not a yes-or-no test
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Use the result to compare two people's core patterns: pacing, communication, emotional needs, and lifestyle preferences. The point is not to reduce someone to a number. The point is to notice where a connection may flow, where it may need translation, and what to talk about first.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {readingModes.map((mode) => (
                <article key={mode.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-foreground">{mode.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{mode.body}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-primary/15 bg-card p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-foreground">A simple example</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                A Life Path 3 and Life Path 7 can work well, but they may need different rhythms. The 3 often brings expression, play, and outward energy. The 7 often brings reflection, privacy, and depth. The useful question is not "are these numbers good?" It is "can both people respect the other person's pace?"
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                After you compare the numbers, use the <Link to="/#calculator" className="font-semibold text-primary hover:underline">full birth date compatibility calculator</Link> to add zodiac, timing, and relationship context.
              </p>
            </div>
          </div>
        </section>

        <section className="section-spacing bg-background">
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

        <section className="section-spacing border-y border-border/60 bg-muted/20">
          <div className="content-container max-w-5xl">
            <div className="mb-8 text-center">
              <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">Compatibility table</p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Life Path number compatibility chart</h2>
              <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Use this 1–9 chart as a quick starting point, then run the calculator for the actual pairing. “More translation” means the two patterns may need clearer expectations; it does not mean the relationship cannot work.
              </p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <div className="hidden grid-cols-[0.45fr_0.8fr_0.9fr_1.6fr] gap-3 border-b border-border bg-muted/40 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground md:grid">
                <span>Life Path</span>
                <span>Easier flow</span>
                <span>More translation</span>
                <span>Core relationship need</span>
              </div>
              {compatibilityChart.map((row) => (
                <div key={row.number} className="grid gap-3 border-b border-border p-5 last:border-b-0 md:grid-cols-[0.45fr_0.8fr_0.9fr_1.6fr] md:items-center">
                  <h3 className="font-semibold text-foreground">Life Path {row.number}</h3>
                  <p className="text-sm text-muted-foreground"><strong className="text-foreground md:hidden">Easier flow: </strong>{row.easyFlow}</p>
                  <p className="text-sm text-muted-foreground"><strong className="text-foreground md:hidden">More translation: </strong>{row.moreTranslation}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{row.need}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-primary/15 bg-card p-5 text-sm leading-relaxed text-muted-foreground">
              <h3 className="font-semibold text-foreground">How master numbers fit the chart</h3>
              <p className="mt-2">
                Life Path 11 uses the relationship pattern of 2, 22 uses 4, and 33 uses 6. The calculator keeps the master number visible while adding its heightened sensitivity, responsibility, or care to the reading.
              </p>
              <p className="mt-2">
                For example, Life Path 1 and 4 compatibility can feel productive but firm: 1 pushes for movement while 4 protects structure. It works best when both agree on who leads, what stays flexible, and which promises cannot move.
              </p>
            </div>
            <p className="mt-5 text-center text-sm leading-relaxed text-muted-foreground">
              Want the zodiac layer too? Try the <Link to="/#calculator" className="font-semibold text-primary hover:underline">birth date compatibility calculator</Link> or read <Link to="/how-it-works" className="font-semibold text-primary hover:underline">how Match by Birth works</Link>.
            </p>
          </div>
        </section>

        <section className="section-spacing border-y border-border/60 bg-muted/20">
          <div className="content-container max-w-5xl">
            <div className="mb-8 text-center">
              <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">Related guides</p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Read next</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedGuides.map(([title, href]) => (
                <Link
                  key={href}
                  to={href}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/30"
                >
                  <h3 className="text-base font-semibold text-foreground">{title}</h3>
                  <p className="mt-3 inline-flex items-center text-sm font-semibold text-primary">
                    Open guide
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </p>
                </Link>
              ))}
            </div>
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
