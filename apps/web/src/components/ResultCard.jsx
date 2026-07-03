import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  Download,
  FileHeart,
  HeartHandshake,
  MessageCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import SaveResultModal from '@/components/SaveResultModal.jsx';
import { PRIVATE_REPORT_PRICE } from '@/data/privateReportOffer.js';
import { buildPairHighlights } from '@/lib/result-presentation.js';
import { trackEvent } from '@/lib/analytics.js';

const HIGHLIGHT_ICONS = {
  communication: MessageCircle,
  'emotional-style': HeartHandshake,
  differences: Compass,
};

const RELATIONSHIP_LABELS = {
  love: 'Romantic',
  friendship: 'Friendship',
  work: 'Work',
};

function ResultCard({
  canPurchase,
  resultId,
  people,
  score,
  matchLabel,
  explanation,
  relationshipType,
  breakdown,
  resultUrl,
  precisionLabel,
  precisionNote,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadInProgress, setDownloadInProgress] = useState(false);
  const highlights = buildPairHighlights(breakdown);
  const names = people.map((person) => person.name);

  const openPurchaseModal = () => {
    trackEvent('report_upsell_clicked', {
      mode: 'pair',
      price: 999,
      currency: 'usd',
    });
    setIsModalOpen(true);
  };

  const downloadResult = async () => {
    try {
      setDownloadInProgress(true);
      const { default: html2canvas } = await import('html2canvas');
      const element = document.getElementById('result-card');
      if (!element) throw new Error('Result card not found');
      const canvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: '#fffdf9',
        scale: 2,
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'match-by-birth-result.png';
      link.click();
    } catch {
      toast.error('The result image could not be downloaded.');
    } finally {
      setDownloadInProgress(false);
    }
  };

  return (
    <>
      <article
        id="result-card"
        className="animate-scale-up mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-[0_22px_60px_rgba(55,43,65,0.12)]"
      >
        <header className="grid gap-6 p-5 sm:p-7 md:grid-cols-[12rem_minmax(0,1fr)] md:items-center md:p-8">
          <div className="grid min-h-44 place-items-center rounded-2xl bg-[linear-gradient(145deg,hsl(var(--secondary)),hsl(335_45%_94%))] text-center">
            <div>
              <div className="text-6xl font-semibold tracking-[-0.06em] text-foreground">
                {score}%
              </div>
              <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary">
                {matchLabel}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {names.join(' + ')} · {RELATIONSHIP_LABELS[relationshipType] || relationshipType}
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.035em] md:text-4xl">
              Your compatibility result
            </h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              {explanation}
            </p>
            <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-full border border-border bg-muted/35 px-3 py-2 text-xs">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary">
                {precisionLabel}
              </span>
              <span className="text-muted-foreground">{precisionNote}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {people.map((person) => (
                <span
                  key={person.id}
                  className="rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  {person.name} · {person.sign}
                </span>
              ))}
            </div>
          </div>
        </header>

        <section className="border-t border-border">
          {highlights.map((highlight) => {
            const Icon = HIGHLIGHT_ICONS[highlight.key];
            return (
              <div
                key={highlight.key}
                className="grid gap-3 border-b border-border px-5 py-4 last:border-b-0 sm:grid-cols-[2.5rem_10rem_minmax(0,1fr)_3rem] sm:items-center sm:px-7"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <h2 className="text-sm font-semibold">{highlight.label}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{highlight.summary}</p>
                <span className="text-right text-sm font-semibold text-primary">{highlight.score}</span>
              </div>
            );
          })}
        </section>

        <footer className="border-t border-border bg-[#fffdfb] p-5 sm:p-7">
          <div className="rounded-2xl border border-primary/15 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary">
                  Private read
                </p>
                <h2 className="flex items-center gap-2 text-xl font-semibold leading-tight text-foreground">
                  <FileHeart className="h-5 w-5 text-primary" />
                  Unlock the part people usually overthink.
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Get a deeper read on why this feels familiar, where the rhythm may catch, what each person may misread, and what to say next.
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                {canPurchase ? (
                  <button
                    type="button"
                    onClick={openPurchaseModal}
                    className="btn-primary inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm"
                  >
                    Unlock private report · {PRIVATE_REPORT_PRICE}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <p className="text-sm font-medium text-muted-foreground">
                    Private reports are temporarily unavailable.
                  </p>
                )}
                <Link
                  to="/reports/sample"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  View sample report
                </Link>
              </div>
            </div>

            <div className="mt-5 grid gap-3 border-t border-border pt-5 text-sm md:grid-cols-3">
              {[
                'Green flags and yellow flags',
                'What each person may misread',
                'A line you could actually send',
              ].map((item) => (
                <div key={item} className="rounded-xl border border-border bg-[#fbfaf8] px-4 py-3 font-medium text-muted-foreground">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={downloadResult}
            disabled={downloadInProgress}
            className="mx-auto mt-4 inline-flex h-10 w-full items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:w-auto sm:px-5"
          >
            <Download className="h-4 w-4" />
            {downloadInProgress ? 'Preparing image...' : 'Download result image'}
          </button>
        </footer>
      </article>

      {canPurchase && (
        <SaveResultModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          resultId={resultId}
          resultUrl={resultUrl}
          names={names}
        />
      )}
    </>
  );
}

export default ResultCard;
