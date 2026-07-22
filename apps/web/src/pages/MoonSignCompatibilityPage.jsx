import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Loader2, MapPin, Moon, ShieldCheck } from 'lucide-react';
import PlaceSearch from '@/components/PlaceSearch.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trackEvent } from '@/lib/analytics.js';
import { requestCompatibilityResult } from '@/lib/compatibility-api.js';
import { buildResultNavigation } from '@/lib/result-navigation.js';
import { calculateMoonSign, compareMoonSigns, moonSignProfiles } from '@/lib/moonSign.js';

const pageUrl = 'https://matchbybirth.com/tools/moon-sign-compatibility';
const pageTitle = 'Moon Sign Calculator & Compatibility | Match by Birth';
const pageDescription = 'Find your Moon sign or compare two Moon signs. See emotional needs, compatibility patterns, watch areas, and one useful conversation prompt.';

const emptyPerson = () => ({
  name: '',
  birthDate: '',
  birthTime: '',
  place: null,
  placeLabel: '',
});

const faqItems = [
  {
    question: 'What does a Moon sign describe?',
    answer: 'In astrology, the Moon sign is used as a shorthand for emotional needs, instinctive reactions, comfort, and the kind of care that feels natural.',
  },
  {
    question: 'Do I need an exact birth time?',
    answer: 'A birth date gives a useful estimate. Birth time and birthplace make the result more precise, especially on a day when the Moon changed signs.',
  },
  {
    question: 'Does a difficult Moon match mean the relationship will fail?',
    answer: 'No. A Moon match is a reflection tool, not a verdict. Different emotional styles can work well when both people name what support and repair look like.',
  },
];

const compatibilityTypes = [
  ['01', 'Easy match', 'The emotional language feels familiar, so comfort and reassurance may register quickly.'],
  ['02', 'Supportive match', 'Different styles complement each other, with each person bringing something the other needs.'],
  ['03', 'Growth match', 'Care may look different to each person, making clear requests more useful than mind reading.'],
];

function PersonFields({ id, label, person, onChange }) {
  const update = (patch) => onChange({ ...person, ...patch });

  return (
    <fieldset className="rounded-2xl border border-border bg-muted/20 p-4">
      <legend className="px-1 text-sm font-semibold text-foreground">{label}</legend>
      <div className="mt-1 grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-name`} className="text-xs text-muted-foreground">Name or nickname</Label>
          <Input
            id={`${id}-name`}
            value={person.name}
            onInput={(event) => update({ name: event.currentTarget.value })}
            placeholder={id === 'moon-a' ? 'You' : 'Them'}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-date`} className="text-xs text-muted-foreground">Birth date</Label>
          <Input
            id={`${id}-date`}
            type="date"
            value={person.birthDate}
            onInput={(event) => update({ birthDate: event.currentTarget.value })}
            max={new Date().toISOString().slice(0, 10)}
            required
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-time`} className="text-xs text-muted-foreground">Birth time <span className="font-normal">(optional)</span></Label>
          <Input
            id={`${id}-time`}
            type="time"
            value={person.birthTime}
            onInput={(event) => update({ birthTime: event.currentTarget.value })}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-place`} className="text-xs text-muted-foreground">Birthplace <span className="font-normal">(optional)</span></Label>
          <PlaceSearch
            id={`${id}-place`}
            value={person.placeLabel}
            onChange={(placeLabel) => update({ placeLabel, place: null })}
            onSelect={(place) => update({ place, placeLabel: place?.label || '' })}
          />
        </div>
      </div>
    </fieldset>
  );
}

function PrecisionNote({ people }) {
  const approximate = people.some((person) => person.precision === 'date-only');
  return (
    <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
      {approximate ? <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> : <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />}
      {approximate
        ? 'Estimated from the birth date at midday UTC. Add birth time and select a birthplace for a more precise Moon sign.'
        : 'Calculated from the selected local birth times and birthplace time zones.'}
    </p>
  );
}

function MoonSignTool({ source = 'moon_sign_compatibility' }) {
  const [mode, setMode] = useState('single');
  const [first, setFirst] = useState(emptyPerson);
  const [second, setSecond] = useState(emptyPerson);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isOpeningFullResult, setIsOpeningFullResult] = useState(false);
  const navigate = useNavigate();

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setResult(null);
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (mode === 'single') {
      trackEvent('moon_sign_single_started', { source });
      const moonSign = calculateMoonSign(first);
      if (!moonSign) {
        setResult(null);
        setError('Enter a valid birth date to find your Moon sign.');
        trackEvent('moon_sign_single_failed', { source });
        return;
      }
      setResult({ type: 'single', person: moonSign });
      trackEvent('moon_sign_single_completed', { source, moon_sign: moonSign.sign, precision: moonSign.precision });
      return;
    }

    trackEvent('moon_sign_match_started', { source });
    const comparison = compareMoonSigns(first, second);
    if (!comparison) {
      setResult(null);
      setError('Enter two valid birth dates to compare Moon signs.');
      trackEvent('moon_sign_match_failed', { source });
      return;
    }
    setResult({ type: 'compare', ...comparison });
    trackEvent('moon_sign_match_completed', {
      source,
      first_moon_sign: comparison.personA.sign,
      second_moon_sign: comparison.personB.sign,
      score_band: Math.floor(comparison.score / 10) * 10,
    });
  };

  const handleFullMatchClick = async () => {
    const firstName = first.name.trim();
    const secondName = second.name.trim();
    if (!firstName || !secondName) {
      setError('Add both names so the full result and report can be written for you.');
      return;
    }

    setError('');
    setIsOpeningFullResult(true);
    trackEvent('moon_sign_to_full_match_clicked', { source });

    try {
      const data = await requestCompatibilityResult({
        mode: 'pair',
        relationshipType: 'love',
        source,
        reportFocus: 'moon_sign',
        clarityGoal: 'repair_after_conflict',
        people: [
          {
            id: 'moon-pair-1',
            name: firstName,
            birthDate: first.birthDate,
            birthTime: first.birthTime,
            place: first.place,
          },
          {
            id: 'moon-pair-2',
            name: secondName,
            birthDate: second.birthDate,
            birthTime: second.birthTime,
            place: second.place,
          },
        ],
      });
      const navigation = buildResultNavigation(data);
      trackEvent('moon_sign_full_match_completed', {
        source,
        calculation_mode: data.result.calculationMode,
        score_band: Math.floor(data.result.score / 10) * 10,
      });
      navigate(navigation.path, { state: navigation.state });
    } catch (calculationError) {
      setError(calculationError.message || 'Unable to open the full Moon result.');
      trackEvent('moon_sign_full_match_failed', { source });
    } finally {
      setIsOpeningFullResult(false);
    }
  };

  return (
    <div id="calculator" className="rounded-3xl border border-primary/10 bg-card p-5 shadow-[0_8px_40px_rgba(55,43,65,0.08)] md:p-7">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Moon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Moon Sign Calculator</h2>
          <p className="mt-1 text-sm text-muted-foreground">Find your Moon sign, then compare emotional styles.</p>
        </div>
      </div>

      <div className="mb-5 grid rounded-2xl bg-muted/40 p-1 text-sm font-semibold text-muted-foreground sm:grid-cols-2">
        {[
          ['single', 'Find my Moon sign'],
          ['compare', 'Compare two people'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => switchMode(value)}
            className={`rounded-xl px-4 py-2.5 transition-colors ${mode === value ? 'bg-card text-foreground shadow-sm' : 'hover:text-foreground'}`}
            aria-pressed={mode === value}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <PersonFields id="moon-a" label={mode === 'single' ? 'Your details' : 'First person'} person={first} onChange={setFirst} />
        {mode === 'compare' && <PersonFields id="moon-b" label="Second person" person={second} onChange={setSecond} />}
        <Button type="submit" className="btn-primary h-12 w-full rounded-xl text-sm">
          {mode === 'single' ? 'Find my Moon sign' : 'Compare Moon signs'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        {error && <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm font-medium text-destructive">{error}</div>}
      </form>

      {result?.type === 'single' && (
        <section className="mt-5 rounded-2xl border border-border bg-muted/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Moon sign result</p>
          <h3 className="mt-1 text-2xl font-semibold text-foreground">
            {first.name || 'Your'} Moon sign is {result.person.sign}{result.person.precision === 'exact' ? ` at ${result.person.degree.toFixed(2)}°` : ''}.
          </h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div><h4 className="text-sm font-semibold">Emotional need</h4><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{result.person.need}</p></div>
            <div><h4 className="text-sm font-semibold">Strength</h4><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{result.person.strength}</p></div>
            <div><h4 className="text-sm font-semibold">Where to notice yourself</h4><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{result.person.watch}</p></div>
          </div>
          <div className="mt-4 rounded-2xl border border-primary/15 bg-card p-4">
            <h4 className="text-sm font-semibold text-primary">Try this</h4>
            <p className="mt-1 text-sm leading-relaxed text-foreground">Tell someone you trust which kind of support would feel most useful this week: {result.person.need}.</p>
          </div>
          <PrecisionNote people={[result.person]} />
          <Button type="button" onClick={() => switchMode('compare')} className="btn-primary mt-4 h-11 rounded-xl px-5 text-sm">
            Compare two Moon signs <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </section>
      )}

      {result?.type === 'compare' && (
        <section className="mt-5 rounded-2xl border border-border bg-muted/20 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Moon sign match</p>
              <h3 className="mt-1 text-2xl font-semibold text-foreground">{first.name || 'Person A'} is {result.personA.sign} Moon. {second.name || 'Person B'} is {result.personB.sign} Moon.</h3>
              <p className="mt-2 text-sm font-semibold text-primary">{result.label}</p>
            </div>
            <div className="rounded-2xl bg-card px-4 py-3 text-center shadow-sm">
              <span className="block text-3xl font-semibold text-primary">{result.score}</span>
              <span className="text-xs text-muted-foreground">emotional fit</span>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div><h4 className="text-sm font-semibold">Evidence</h4><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{first.name || 'Person A'} needs {result.personA.need}; {second.name || 'Person B'} needs {result.personB.need}. The emotional fit score is {result.score}.</p></div>
            <div><h4 className="text-sm font-semibold">Real-life meaning</h4><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{result.pattern} {result.watchArea}</p></div>
            <div><h4 className="text-sm font-semibold">One useful action</h4><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{result.nextStep}</p></div>
          </div>
          <PrecisionNote people={[result.personA, result.personB]} />
          <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-primary/15 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-muted-foreground">See the full birth-date match for chemistry, communication, stability, intuition, and growth.</p>
            <Button
              type="button"
              onClick={handleFullMatchClick}
              disabled={isOpeningFullResult}
              className="btn-primary h-11 shrink-0 rounded-xl px-5 text-sm"
            >
              {isOpeningFullResult ? (
                <>Opening full result <Loader2 className="ml-2 h-4 w-4 animate-spin" /></>
              ) : (
                <>Continue to full Moon result <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </div>
        </section>
      )}

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
        Private, with no signup required. Birth details are not stored.
      </p>
    </div>
  );
}

function MoonSignCompatibilityPage() {
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
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Moon Sign Compatibility Calculator',
          description: pageDescription,
          url: pageUrl,
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        })}</script>
      </Helmet>

      <main className="flex-1 bg-background">
        <section className="border-b border-border/60 bg-[linear-gradient(180deg,#fff_0%,#fbf7fd_100%)] py-12 md:py-16">
          <div className="content-container">
            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
              <div>
                <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary">Moon Sign Calculator & Compatibility</p>
                <h1 className="max-w-xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-foreground md:text-6xl">Your Moon sign shows what care feels like.</h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">Find the emotional habits behind comfort, conflict, and repair. Start with one birth date, then compare two people to see where support feels natural—and where it may need translating.</p>
                <div className="mt-7">
                  <a
                    href="#calculator"
                    className="btn-primary inline-flex min-h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold"
                  >
                    Find my Moon sign
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                  <p className="mt-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Free to use. No signup. Birth details are not stored.
                  </p>
                </div>
                <div className="mt-8 grid max-w-xl gap-4 border-t border-border/70 pt-6 text-sm sm:grid-cols-3">
                  <div>
                    <p className="font-semibold text-foreground">Emotional need</p>
                    <p className="mt-1 leading-5 text-muted-foreground">What helps care register.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Watch area</p>
                    <p className="mt-1 leading-5 text-muted-foreground">What can be misread.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Next prompt</p>
                    <p className="mt-1 leading-5 text-muted-foreground">What to ask for clearly.</p>
                  </div>
                </div>
              </div>
              <MoonSignTool source="moon_sign_compatibility" />
            </div>
          </div>
        </section>

        <section className="section-spacing bg-background">
          <div className="content-container max-w-5xl">
            <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">Why it matters</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">What is a Moon sign?</h2>
              </div>
              <div className="space-y-4">
                <p className="text-xl font-medium leading-8 text-foreground md:text-2xl md:leading-9">It is less about how you appear—and more about what helps you feel safe enough to be yourself.</p>
                <p className="text-base leading-7 text-muted-foreground">Your Moon sign is the zodiac sign occupied by the Moon when you were born. Astrology uses it to describe emotional instincts, reactions under stress, and the kind of care that feels easiest to receive.</p>
              </div>
            </div>
            <div className="mt-10 grid border-y border-border md:grid-cols-3 md:divide-x md:divide-border">
              {compatibilityTypes.map(([number, title, body]) => (
                <article key={title} className="py-6 md:px-6 md:first:pl-0 md:last:pr-0">
                  <p className="text-xs font-semibold tracking-[0.18em] text-primary">{number}</p>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-spacing border-y border-border/60 bg-muted/20">
          <div className="content-container max-w-5xl">
            <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr] md:items-end">
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">A quick reference</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Moon sign meanings</h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:justify-self-end md:text-base md:leading-7">Each sign describes a different route to comfort. Use this index to notice the need beneath the reaction—not to reduce someone to a label.</p>
            </div>
            <div className="mt-8 grid gap-x-8 border-t border-border sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(moonSignProfiles).map(([sign, profile]) => (
                <article key={sign} className="border-b border-border py-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-semibold text-foreground">{sign} Moon</h3>
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary">{profile.element}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Needs {profile.need}.</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-spacing bg-background">
          <div className="content-container max-w-3xl">
            <div className="mb-8 text-center">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">Before you begin</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Moon sign compatibility FAQ</h2>
            </div>
            <div className="border-t border-border">
              {faqItems.map((item) => (
                <details key={item.question} className="group border-b border-border py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-base font-semibold text-foreground">
                    {item.question}
                    <span aria-hidden="true" className="text-xl font-normal text-primary transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="max-w-2xl pt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p>
                </details>
              ))}
            </div>
            <div className="mt-10 flex flex-col items-center border-t border-border pt-8 text-center">
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">Start with the pattern you can feel.</h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Find your Moon sign first. You can compare two emotional styles when you are ready.</p>
              <a href="#calculator" className="btn-primary mt-5 inline-flex min-h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold">
                Find my Moon sign <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <p className="mt-4 text-xs text-muted-foreground">Prefer to learn first? Read the <Link to="/blog/category/moon-signs" className="font-semibold text-primary hover:underline">Moon Sign compatibility guides</Link>.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default MoonSignCompatibilityPage;
