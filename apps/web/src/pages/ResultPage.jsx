
import React, { useMemo, useEffect, useState } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft } from 'lucide-react';
import ResultCard from '@/components/ResultCard.jsx';
import GroupCompatibilityResults from '@/components/GroupCompatibilityResults.jsx';
import ShareButtons from '@/components/ShareButtons.jsx';
import AdUnit from '@/components/AdUnit.jsx';
import { getZodiacSign, calculateBaseCompatibility } from '@/lib/zodiac.js';
import { getScoreInterpretation } from '@/lib/scoreInterpretation.js';
import EmailCaptureSection from '@/components/EmailCaptureSection.jsx';

function ResultPage() {
  const [searchParams] = useSearchParams();
  
  // Extract all params at top level
  const groupParam = searchParams.get('group');
  const p1 = searchParams.get('p1');
  const p1_dob = searchParams.get('p1_dob');
  const p2 = searchParams.get('p2');
  const p2_dob = searchParams.get('p2_dob');
  const type = searchParams.get('type') || 'love';

  // Local UI state so we can render immediately when URL params are present
  const [mountedFromLink, setMountedFromLink] = useState(false);

  // Determine mode
  const isGroupMode = !!groupParam;

  // HOOK 1: Parse Group Data - called unconditionally at top level
  const groupData = useMemo(() => {
    if (!groupParam) return null;
    const parts = groupParam.split(',');
    const members = [];
    for (let i = 0; i < parts.length; i += 2) {
      if (parts[i] && parts[i+1]) {
        members.push({ name: decodeURIComponent(parts[i]), birthDate: decodeURIComponent(parts[i+1]) });
      }
    }
    return members.length >= 3 ? members : null;
  }, [groupParam]);

  // HOOK 2: Parse Pair Data - called unconditionally at top level
  const pairData = useMemo(() => {
    // support params set either as p1/p2 with p1_dob/p2_dob OR older format p1/p2 without dob
    const dob1 = p1_dob || searchParams.get('p1_dob') || searchParams.get('p1_date');
    const dob2 = p2_dob || searchParams.get('p2_dob') || searchParams.get('p2_date');
    const name1 = p1 || searchParams.get('p1') || null;
    const name2 = p2 || searchParams.get('p2') || null;

    if (!name1 || !dob1 || !name2 || !dob2) return null;

    const sign1 = getZodiacSign(dob1);
    const sign2 = getZodiacSign(dob2);
    const score = calculateBaseCompatibility(sign1, sign2);
    const interpretation = getScoreInterpretation(score, type);

    return { p1: name1, p2: name2, score, interpretation, type };
  }, [p1, p1_dob, p2, p2_dob, type]);

  // HOOK 3: Calculate Group Vibe Score - called unconditionally at top level
  const groupVibeScore = useMemo(() => {
    if (!groupData || groupData.length < 3) return 0;
    let total = 0;
    let count = 0;
    for (let i = 0; i < groupData.length; i++) {
      for (let j = i + 1; j < groupData.length; j++) {
        const s1 = getZodiacSign(groupData[i].birthDate);
        const s2 = getZodiacSign(groupData[j].birthDate);
        total += calculateBaseCompatibility(s1, s2);
        count++;
      }
    }
    return count > 0 ? Math.round(total / count) : 0;
  }, [groupData]);

  // HOOK 4: Generate Full Share URL - includes calculated score values
  const resultUrl = useMemo(() => {
    const url = new URL(window.location.origin + window.location.pathname);
    if (isGroupMode && groupData) {
      url.searchParams.set('group', groupParam);
      url.searchParams.set('groupScore', groupVibeScore.toString());
    } else if (pairData) {
      url.searchParams.set('p1', pairData.p1);
      url.searchParams.set('p1_dob', p1_dob || '');
      url.searchParams.set('p2', pairData.p2);
      url.searchParams.set('p2_dob', p2_dob || '');
      url.searchParams.set('score', pairData.score.toString());
      url.searchParams.set('type', pairData.type);
    }
    return url.toString();
  }, [isGroupMode, groupData, groupParam, groupVibeScore, pairData, p1_dob, p2_dob]);

  // Append generated parameters to the browser's address bar without reloading
  useEffect(() => {
    if (resultUrl && window.history.replaceState && !mountedFromLink) {
      window.history.replaceState(null, '', resultUrl);
    }
  }, [resultUrl, mountedFromLink]);

  // If the page loads with full pair params, mark as mountedFromLink so we render immediately
  useEffect(() => {
    if (p1 && p1_dob && p2 && p2_dob && !isGroupMode && !mountedFromLink) {
      setMountedFromLink(true);
    }
  }, [p1, p1_dob, p2, p2_dob, isGroupMode, mountedFromLink]);

  // Now use the hook results conditionally
  if (!isGroupMode && !pairData && !mountedFromLink) {
    return <Navigate to="/" replace />;
  }
  if (isGroupMode && !groupData) {
    return <Navigate to="/" replace />;
  }

  const pageTitle = isGroupMode 
    ? `Group Compatibility Score - ${groupVibeScore}% | Match by Birth`
    : `${pairData?.p1} & ${pairData?.p2} Compatibility - ${pairData?.score}% | Match by Birth`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta property="og:image" content={
          (() => {
            const u = new URL(window.location.href);
            const p1 = u.searchParams.get('p1') || u.searchParams.get('group') || 'Alex';
            const p2 = u.searchParams.get('p2') || 'Jordan';
            const s = u.searchParams.get('score') || '';
            const label = 'See your Match by Birth result';
            return `https://matchbybirth.com/api/og?p1=${encodeURIComponent(p1)}&p2=${encodeURIComponent(p2)}&score=${encodeURIComponent(s)}&label=${encodeURIComponent(label)}`;
          })()
        } />
      </Helmet>

      <main className="section-spacing bg-background min-h-screen">
        <div className="content-container">
          
          {isGroupMode && groupData ? (
            <GroupCompatibilityResults 
              groupData={groupData} 
              resultUrl={resultUrl}
            />
          ) : pairData ? (
            <ResultCard 
              person1Name={pairData.p1}
              person2Name={pairData.p2}
              score={pairData.score}
              matchLabel={pairData.interpretation.label}
              relationshipType={pairData.type}
              resultUrl={resultUrl}
            />
          ) : null}

          <div className="max-w-3xl mx-auto mt-12">

            
            {isGroupMode && groupData ? (
              <ShareButtons 
                mode="group"
                groupVibeScore={groupVibeScore}
                resultUrl={resultUrl}
              />
            ) : pairData ? (
              <ShareButtons 
                mode="pair"
                p1={pairData.p1}
                p2={pairData.p2}
                score={pairData.score}
                resultUrl={resultUrl}
              />
            ) : null}

            <div className="mt-12 text-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:bg-secondary/80 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                Try It Yourself
              </Link>
            </div>
            
            <div className="mt-8">
              <div className="max-w-3xl mx-auto">
                <EmailCaptureSection />
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}

export default ResultPage;
