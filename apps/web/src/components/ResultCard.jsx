import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import SaveResultModal from '@/components/SaveResultModal.jsx';

const BREAKDOWN_LABELS = {
  chemistry: 'Chemistry',
  communication: 'Communication',
  stability: 'Stability',
  growth: 'Growth',
  intuition: 'Intuition',
};

function ResultCard({
  resultId,
  people,
  score,
  matchLabel,
  explanation,
  relationshipType,
  breakdown,
  resultUrl,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadInProgress, setDownloadInProgress] = useState(false);

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
      <article id="result-card" className="bg-card border border-border rounded-3xl shadow-lg w-full max-w-2xl mx-auto overflow-hidden animate-scale-up">
        <header className="text-center px-6 py-10 md:px-10 md:py-12 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-5">
            {relationshipType} compatibility
          </p>
          <div className="flex items-start justify-center gap-5 md:gap-10 mb-7">
            {people.map((person) => (
              <div key={person.id} className="min-w-0">
                <h1 className="text-xl md:text-2xl font-semibold truncate">{person.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">{person.sign}</p>
              </div>
            ))}
          </div>
          <div className="text-7xl md:text-8xl font-semibold tracking-tight text-foreground">
            {score}%
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold mt-5">{matchLabel}</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">{explanation}</p>
        </header>

        <section className="px-6 py-8 md:px-10">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-6">
            Compatibility Breakdown
          </h3>
          <div className="space-y-5">
            {Object.entries(BREAKDOWN_LABELS).map(([key, label]) => (
              <div key={key}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium">{label}</span>
                  <span className="text-muted-foreground">{breakdown[key]}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${breakdown[key]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="px-6 pb-8 md:px-10 md:pb-10">
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 mb-4">
            <p className="font-semibold">Go beyond the score</p>
            <p className="text-sm text-muted-foreground mt-1">
              Get a private, detailed report with strengths, friction points, communication guidance, and practical next steps.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-5 h-12 btn-primary rounded-xl font-semibold"
            >
              Get Full Report — $9.99
            </button>
          </div>
          <button
            type="button"
            onClick={downloadResult}
            disabled={downloadInProgress}
            className="w-full inline-flex items-center justify-center gap-2 h-11 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Download className="w-4 h-4" />
            {downloadInProgress ? 'Preparing image...' : 'Download result image'}
          </button>
        </footer>
      </article>

      <SaveResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resultId={resultId}
        resultUrl={resultUrl}
        names={people.map((person) => person.name)}
      />
    </>
  );
}

export default ResultCard;
