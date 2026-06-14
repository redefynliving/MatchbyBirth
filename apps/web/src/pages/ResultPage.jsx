import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import EmailCaptureSection from '@/components/EmailCaptureSection.jsx';
import GroupCompatibilityResults from '@/components/GroupCompatibilityResults.jsx';
import ResultCard from '@/components/ResultCard.jsx';
import ShareButtons from '@/components/ShareButtons.jsx';
import { Button } from '@/components/ui/button.jsx';
import { trackEvent } from '@/lib/analytics.js';
import { buildResultNavigation } from '@/lib/result-navigation.js';

function parseLegacyInput(searchParams) {
  const groupParam = searchParams.get('group');
  if (groupParam) {
    const parts = groupParam.split(',');
    const people = [];
    for (let index = 0; index < parts.length; index += 2) {
      if (parts[index] && parts[index + 1]) {
        people.push({
          id: `legacy-${index / 2 + 1}`,
          name: decodeURIComponent(parts[index]),
          birthDate: decodeURIComponent(parts[index + 1]),
        });
      }
    }
    return people.length >= 3
      ? { mode: 'group', relationshipType: 'friendship', people }
      : null;
  }

  const firstName = searchParams.get('p1');
  const firstBirthDate = searchParams.get('p1_dob') || searchParams.get('p1_date');
  const secondName = searchParams.get('p2');
  const secondBirthDate = searchParams.get('p2_dob') || searchParams.get('p2_date');
  if (!firstName || !firstBirthDate || !secondName || !secondBirthDate) return null;

  return {
    mode: 'pair',
    relationshipType: searchParams.get('type') || 'love',
    people: [
      { id: 'legacy-1', name: firstName, birthDate: firstBirthDate },
      { id: 'legacy-2', name: secondName, birthDate: secondBirthDate },
    ],
  };
}

function ResultPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const shareSlug = searchParams.get('share');
  const legacyInput = useMemo(() => parseLegacyInput(searchParams), [searchParams]);
  const [resultState, setResultState] = useState(() => {
    if (
      location.state?.result
      && (!shareSlug || location.state.shareSlug === shareSlug)
    ) {
      return {
        status: 'ready',
        resultId: location.state.resultId,
        canPurchase: location.state.canPurchase === true,
        canShare: location.state.canShare === true,
        result: location.state.result,
      };
    }
    return { status: 'loading', resultId: null, result: null, error: '' };
  });
  const [reloadKey, setReloadKey] = useState(0);
  const hasLocalResult = !shareSlug && Boolean(location.state?.result);

  useEffect(() => {
    if (hasLocalResult) return undefined;

    let cancelled = false;

    async function loadResult() {
      setResultState((current) => ({ ...current, status: 'loading', error: '' }));

      try {
        if (shareSlug) {
          const response = await fetch(`/api/result?share=${encodeURIComponent(shareSlug)}`);
          const data = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(data.error || 'Unable to load this result.');
          if (!cancelled) {
            setResultState({
              status: 'ready',
              resultId: data.resultId,
              canPurchase: true,
              canShare: true,
              result: data.result,
              error: '',
            });
            trackEvent('shared_result_viewed', {
              mode: data.result.mode,
              relationship_type: data.result.relationshipType,
              group_size: data.result.people.length,
            });
          }
          return;
        }

        if (legacyInput) {
          const response = await fetch('/api/calculate-result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(legacyInput),
          });
          const data = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(data.error || 'Unable to update this result link.');
          if (!cancelled) {
            const navigation = buildResultNavigation(data);
            navigate(navigation.path, {
              replace: true,
              state: navigation.state,
            });
          }
          return;
        }

        if (!cancelled) setResultState({ status: 'invalid', resultId: null, result: null, error: '' });
      } catch (error) {
        if (!cancelled) {
          setResultState({
            status: 'error',
            resultId: null,
            result: null,
            error: error.message || 'Unable to load this result.',
          });
        }
      }
    }

    loadResult();
    return () => {
      cancelled = true;
    };
  }, [shareSlug, legacyInput, navigate, reloadKey, hasLocalResult]);

  if (resultState.status === 'invalid') {
    return <Navigate to="/" replace />;
  }

  if (resultState.status === 'loading') {
    return (
      <main className="min-h-[65vh] flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <Loader2 className="w-7 h-7 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your result...</p>
        </div>
      </main>
    );
  }

  if (resultState.status === 'error') {
    return (
      <main className="min-h-[65vh] flex items-center justify-center bg-background px-4">
        <div className="max-w-md text-center bg-card border border-border rounded-2xl p-8">
          <h1 className="text-2xl font-semibold mb-3">We couldn’t load this result</h1>
          <p className="text-muted-foreground mb-6">{resultState.error}</p>
          <Button onClick={() => setReloadKey((value) => value + 1)} className="rounded-xl">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </main>
    );
  }

  const {
    canPurchase = Boolean(resultState.resultId),
    canShare = Boolean(shareSlug),
    result,
    resultId,
  } = resultState;
  const isGroup = result.mode === 'group';
  const resultUrl = canShare
    ? `${globalThis.location.origin}/result?share=${encodeURIComponent(shareSlug)}`
    : null;
  const names = result.people.map((person) => person.name);
  const pageTitle = isGroup
    ? `Group Compatibility — ${result.groupScore}% | Match by Birth`
    : `${names[0]} & ${names[1]} Compatibility — ${result.score}% | Match by Birth`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="A shared Match by Birth compatibility result." />
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta property="og:title" content={pageTitle} />
        {canShare && (
          <meta
            property="og:image"
            content={`${globalThis.location.origin}/api/og?share=${encodeURIComponent(shareSlug)}`}
          />
        )}
      </Helmet>

      <main className="result-page-bg min-h-screen py-10 md:py-14">
        <div className="content-container">
          {isGroup ? (
            <GroupCompatibilityResults result={result} />
          ) : (
            <ResultCard
              canPurchase={canPurchase}
              resultId={resultId}
              people={result.people}
              score={result.score}
              matchLabel={result.interpretation.label}
              explanation={result.interpretation.explanation}
              relationshipType={result.relationshipType}
              breakdown={result.breakdown}
              resultUrl={resultUrl}
            />
          )}

          <div className="mx-auto mt-6 max-w-5xl">
            {canShare ? (
              <ShareButtons
                mode={result.mode}
                p1={names[0]}
                p2={names[1]}
                score={result.score}
                groupVibeScore={result.groupScore}
                resultUrl={resultUrl}
              />
            ) : (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Sharing is temporarily unavailable. Your result remains visible in this tab.
              </p>
            )}

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                <ArrowLeft className="w-4 h-4" />
                Try Another Match
              </Link>
            </div>

            {resultId && (
              <div className="mx-auto mt-8 max-w-3xl">
                <EmailCaptureSection
                  resultId={resultId}
                  people={result.people}
                  score={result.score}
                  signs={[result.people[0]?.sign, result.people[1]?.sign]}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default ResultPage;
