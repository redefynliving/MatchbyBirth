import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ArrowLeft, ChevronDown, Loader2, RefreshCw, Share2, Star } from 'lucide-react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import EmailCaptureSection from '@/components/EmailCaptureSection.jsx';
import BackButton from '@/components/BackButton.jsx';
import GroupCompatibilityResults from '@/components/GroupCompatibilityResults.jsx';
import ResultCard from '@/components/ResultCard.jsx';
import ShareButtons from '@/components/ShareButtons.jsx';
import SharedResultConversion from '@/components/share/SharedResultConversion.jsx';
import { Button } from '@/components/ui/button.jsx';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics.js';
import { buildResultNavigation } from '@/lib/result-navigation.js';
import { getResultPrecisionDetails } from '@/lib/result-presentation.js';
import { buildSharePageModel } from '@/lib/share-page.js';
import { getShareDescription, getShareTitle } from '@/lib/share-copy.js';

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

function getShareSource(searchParams) {
  const utmSource = searchParams.get('utm_source');
  if (utmSource) return utmSource;
  if (typeof document !== 'undefined' && document.referrer) return 'referral';
  return 'direct';
}

function ResultPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const shareSlug = searchParams.get('share');
  const legacyInput = useMemo(() => parseLegacyInput(searchParams), [searchParams]);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submittedRating, setSubmittedRating] = useState(false);

  const handleRate = (score) => {
    setRating(score);
    setSubmittedRating(true);
    trackEvent('result_rated', {
      score,
      resultId: resultState.resultId,
      mode: resultState.result?.mode,
    });
    toast.success('Thank you for rating your compatibility result!');
  };
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

  useEffect(() => {
    if (!shareSlug || resultState.status !== 'ready' || !resultState.result) return;

    const shareModel = buildSharePageModel(resultState.result);
    trackEvent('share_page_view', {
      share_id: shareSlug,
      relationship_type: shareModel.relationshipType,
      score: shareModel.score,
      score_band: shareModel.scoreBand,
      source: getShareSource(searchParams),
    });
  }, [shareSlug, resultState.status, resultState.result, searchParams]);

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
  const precision = getResultPrecisionDetails(result.people);
  const shareModel = canShare ? buildSharePageModel(result) : null;
  const shareSource = canShare ? getShareSource(searchParams) : 'direct';
  const isFreshCalculation = Boolean(
    location.state?.result
    && location.state?.shareSlug === shareSlug,
  );
  const shareFunnelContext = shareModel ? {
    funnel_source: 'share_page',
    share_id: shareSlug,
    score_band: shareModel.scoreBand,
    source: shareSource,
    cta_placement: 'result_card',
    cta_label: 'direct_report_upsell',
  } : null;
  const pageTitle = getShareTitle(result);
  const pageDescription = getShareDescription(result);
  const canonicalResultUrl = canShare
    ? `${globalThis.location.origin}/result?share=${encodeURIComponent(shareSlug)}`
    : `${globalThis.location.origin}/`;
  const ogImageUrl = canShare
    ? `${globalThis.location.origin}/api/og?share=${encodeURIComponent(shareSlug)}`
    : `${globalThis.location.origin}/og-image.png`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalResultUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
      </Helmet>

      <main className="result-page-bg min-h-screen py-10 md:py-14">
        <div className="content-container">
          <BackButton fallbackTo="/" label="Back to Calculator" />
          {isGroup ? (
            <GroupCompatibilityResults
              result={result}
              precisionLabel={precision.label}
              precisionNote={precision.note}
            />
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
              precisionLabel={precision.label}
              precisionNote={precision.note}
              calculationMode={result.calculationMode}
              synastry={result.synastry}
              precisionComparison={result.precisionComparison}
              reportContext={result.reportContext}
              funnelContext={shareFunnelContext}
            />
          )}

          {canShare && shareModel && !isFreshCalculation && (
            <SharedResultConversion
              model={shareModel}
              shareId={shareSlug}
              source={shareSource}
            />
          )}

          <section className="mx-auto mt-5 max-w-5xl overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <p className="text-sm font-semibold text-foreground">
                  {submittedRating ? `You rated this ${rating}/5` : 'Did this result feel useful?'}
                </p>
                {!submittedRating && (
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRate(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`Rate ${star} stars out of 5`}
                      >
                        <Star
                          className={`h-5 w-5 transition-colors ${
                            star <= (hoverRating || rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-transparent text-muted-foreground/35'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <ArrowLeft className="w-4 h-4" />
                Try another match
              </Link>
            </div>

            {(canShare || resultId) && (
              <details className="group border-t border-border">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-6">
                  <span className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-primary" />
                    Save, share, or email this result
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <div className="grid gap-6 border-t border-border bg-muted/20 p-5 sm:p-6 lg:grid-cols-2">
                  {canShare ? (
                    <ShareButtons
                      mode={result.mode}
                      p1={names[0]}
                      p2={names[1]}
                      score={result.score}
                      groupVibeScore={result.groupScore}
                      resultUrl={resultUrl}
                      shareId={shareSlug}
                      relationshipType={shareModel?.relationshipType}
                      calculationMode={result.calculationMode}
                      topAspectLabel={shareModel?.topAspect}
                      scoreBand={shareModel?.scoreBand}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Sharing is temporarily unavailable. Your result remains visible in this tab.
                    </p>
                  )}

                  {resultId && (
                    <EmailCaptureSection
                      resultId={resultId}
                      people={result.people}
                      score={result.score}
                      signs={[result.people[0]?.sign, result.people[1]?.sign]}
                    />
                  )}
                </div>
              </details>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default ResultPage;
