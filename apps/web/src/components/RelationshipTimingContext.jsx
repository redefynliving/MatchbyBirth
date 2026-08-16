import React, { useEffect, useRef, useState } from 'react';
import { Moon } from 'lucide-react';
import { trackEvent } from '@/lib/analytics.js';

function formatIllumination(value) {
  if (!Number.isFinite(Number(value))) return null;
  return `${Math.round(Number(value))}% illuminated`;
}

function formatDaysUntil(value) {
  const days = Number(value);
  if (!Number.isFinite(days)) return '';
  if (days < 1) return 'in less than a day';
  const rounded = Math.round(days * 10) / 10;
  return `in ${rounded} ${rounded === 1 ? 'day' : 'days'}`;
}

export default function RelationshipTimingContext({
  shareId = '',
  relationshipType = 'love',
  scoreBand = '',
}) {
  const [context, setContext] = useState(null);
  const trackedView = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function loadTimingContext() {
      try {
        const response = await fetch('/api/cyclecalcs/moon', {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Timing context unavailable.');
        const data = await response.json();
        if (!cancelled) setContext(data);
      } catch (error) {
        if (!cancelled && error.name !== 'AbortError') {
          setContext({ available: false });
        }
      }
    }

    loadTimingContext();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!context?.available || !context.current?.phase || trackedView.current) return;
    trackedView.current = true;
    trackEvent('timing_context_viewed', {
      share_id: shareId,
      relationship_type: relationshipType,
      score_band: scoreBand,
      moon_phase: context.current.phase,
    });
  }, [context, relationshipType, scoreBand, shareId]);

  if (!context?.available || !context.current) return null;

  const illumination = formatIllumination(context.current.illuminationPercent);
  const nextPhaseTiming = formatDaysUntil(context.nextPhase?.daysUntil);

  return (
    <section
      aria-label="Current relationship timing"
      className="mx-auto mt-6 w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-card shadow-sm"
    >
      <div className="p-5 sm:p-6 md:p-7">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
            <Moon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Current relationship timing
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              A current sky lens for the conversation, not a prediction.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 border-y border-border py-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Moon phase</p>
            <p className="mt-2 text-xl font-semibold text-foreground">{context.current.phase}</p>
            {illumination && <p className="mt-1 text-sm text-muted-foreground">{illumination}</p>}
          </div>
          {context.nextPhase?.name && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Next shift</p>
              <p className="mt-2 text-xl font-semibold text-foreground">{context.nextPhase.name}</p>
              {nextPhaseTiming && <p className="mt-1 text-sm text-muted-foreground">{nextPhaseTiming}</p>}
            </div>
          )}
        </div>

        {context.current.summary && (
          <p className="mt-5 max-w-3xl text-sm leading-6 text-muted-foreground">
            {context.current.summary}
          </p>
        )}
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Use the timing as a prompt to check in with each other, not as a prediction about what happens next.
        </p>
      </div>
    </section>
  );
}
