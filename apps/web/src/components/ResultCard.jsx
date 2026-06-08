import React, { useEffect, useState } from 'react';
import { Heart, Users, Briefcase } from 'lucide-react';
import { copyResult } from '@/utils/resultPermalink.js';
import { toast } from 'sonner';

function ResultCard({ person1Name, person2Name, score, matchLabel, relationshipType, breakdown, resultUrl }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadInProgress, setDownloadInProgress] = useState(false);

  // download result card as PNG using html2canvas
  const handleDownloadResultCard = async () => {
    try {
      setDownloadInProgress(true);
      // load html2canvas dynamically to avoid bundling in SSR
      const { default: html2canvas } = await import('html2canvas');
      const el = document.getElementById('result-card');
      if (!el) throw new Error('result-card-not-found');
      const canvas = await html2canvas(el, { useCORS: true, backgroundColor: null });
      const dataUrl = canvas.toDataURL('image/png');
      // create temporary link
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'my-match-result.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setDownloadInProgress(false);
    } catch (err) {
      console.error('download failed', err);
      setDownloadInProgress(false);
      toast.error('Failed to save image.');
    }
  };

  const getIcon = () => {
    switch (relationshipType) {
      case 'love': return <Heart className="w-8 h-8 text-white" />;
      case 'friendship': return <Users className="w-8 h-8 text-white" />;
      case 'work': return <Briefcase className="w-8 h-8 text-white" />;
      default: return <Heart className="w-8 h-8 text-white" />;
    }
  };

  const getGradient = () => {
    if (score >= 80) return 'from-primary to-secondary';
    if (score >= 50) return 'from-secondary to-accent';
    return 'from-muted-foreground to-foreground';
  };

  useEffect(() => {
    // Generate an image for og:image dynamically when the card loads
    const generateShareImage = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 630;
        const ctx = canvas.getContext('2d');

        // Draw gradient background (#fef3f8 to #f0e6f6)
        const grad = ctx.createLinearGradient(0, 0, 1200, 630);
        grad.addColorStop(0, '#fef3f8');
        grad.addColorStop(1, '#f0e6f6');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1200, 630);

        // Draw branding
        ctx.fillStyle = '#9b7eb5'; 
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Match by Birth', 600, 560);

        // Draw explanation / match label
        ctx.fillStyle = '#4a5568';
        ctx.font = 'italic 40px sans-serif';
        ctx.fillText(matchLabel, 600, 480);

        // Draw names
        ctx.fillStyle = '#2d3748';
        ctx.font = 'bold 64px sans-serif';
        ctx.fillText(`${person1Name || 'Person 1'} & ${person2Name || 'Person 2'}`, 600, 150);

        // Draw score
        ctx.fillStyle = '#2d3748';
        ctx.font = 'bold 160px sans-serif';
        ctx.fillText(`${score}/100`, 600, 360);

        // Draw subtle zodiac symbols left and right
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '100px sans-serif';
        ctx.fillText('♈︎', 200, 340);
        ctx.fillText('♎︎', 1000, 340);

        const dataUrl = canvas.toDataURL('image/jpeg');

        // Update og:image tag
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
          ogImage.setAttribute('content', dataUrl);
        }
      } catch (err) {
        console.error('Failed to generate canvas image for OG tag', err);
      }
    };

    generateShareImage();
  }, [person1Name, person2Name, score, matchLabel]);

  // Use the provided resultUrl with params, otherwise fallback to current window URL
  const activeUrl = resultUrl || window.location.href;
  const shareText = `${person1Name || 'Person 1'} & ${person2Name || 'Person 2'} are ${matchLabel} (Score: ${score}/100) 🔮✨ Check your compatibility with Match by Birth!`;

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Match by Birth',
          text: shareText,
          url: activeUrl,
        });
      } else {
        // fallback: copy to clipboard
        copyResult(shareText, activeUrl);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('native share failed', err);
      // if user cancels native share, don't show an error toast
      if (err && err.name !== 'AbortError') {
        toast.error('Failed to share result.');
      }
    }
  };

  return (
    <>
      <div id="result-card" className="card shadow-elevated animate-scale-up w-full max-w-md mx-auto overflow-hidden">
        {/* Top Gradient Section */}
        <div className={`bg-gradient-to-br ${getGradient()} p-6 text-center relative overflow-hidden min-h-[240px]`} style={{maxWidth: '520px', margin: '0 auto'}}>
          <div className="absolute top-4 right-4 opacity-20">
            {getIcon()}
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-xl font-bold text-white">{person1Name || 'Person 1'}</span>
              <span className="text-white/70 font-medium">&</span>
              <span className="text-xl font-bold text-white">{person2Name || 'Person 2'}</span>
            </div>

            <div className="inline-flex flex-col items-center justify-center w-32 h-32 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-inner mb-4">
              <span className="text-4xl font-extrabold text-white tracking-tighter">{score}/100</span>
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1">Score</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">{matchLabel}</h3>
            <p className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {relationshipType} Compatibility
            </p>
          </div>
        </div>

        {/* Breakdown Section */}
        {/* Five-layer breakdown */}
        <div className="p-6 bg-card border-b border-border">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">Compatibility Breakdown</h4>
          <div className="space-y-4">
            {breakdown && (
              <>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-foreground">🔥 Chemistry</span>
                    <span className="text-primary">{breakdown.chemistry}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${breakdown.chemistry}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Magnetic connection and physical spark.</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-foreground">💬 Communication</span>
                    <span className="text-primary">{breakdown.communication}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${breakdown.communication}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Clarity, listening, and mutual understanding.</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-foreground">🏗️ Stability</span>
                    <span className="text-primary">{breakdown.stability}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${breakdown.stability}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Reliability, long-term potential, and shared values.</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-foreground">⚡ Growth</span>
                    <span className="text-primary">{breakdown.growth}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${breakdown.growth}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Potential for mutual development and challenge.</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-foreground">🌙 Intuition</span>
                    <span className="text-primary">{breakdown.intuition}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${breakdown.intuition}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Emotional resonance and subtle understanding.</p>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">Overall</span>
                    <span className="text-2xl font-extrabold text-foreground">{breakdown.overall}%</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action & Share Section (simplified per spec) */}
        <div className="p-6 bg-card">
          <div className="space-y-3">
            {/* Keep only Get Full Report button; fixed price $9.99 */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 mb-4 h-12 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:bg-secondary/90 transition-colors"
              title="Get Full Report — $9.99"
            >
              <span className="font-bold">Get Full Report — $9.99</span>
            </button>

            {/* Single native Share button */}
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 h-12 bg-muted text-foreground font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors"
              title="Share result"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 6l-4-4-4 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 2v14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResultCard;
