
import React, { useEffect, useState } from 'react';
import { Heart, Users, Briefcase, Download, Copy } from 'lucide-react';
import { shareResult, copyResult } from '@/utils/resultPermalink.js';
import SaveResultModal from './SaveResultModal.jsx';
import { toast } from 'sonner';

function ResultCard({ person1Name, person2Name, score, matchLabel, relationshipType, breakdown, resultUrl }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleCopy = () => {
    copyResult(shareText, activeUrl);
    toast.success('Result URL copied to clipboard!');
  };

  const handleShareClick = (platform) => {
    shareResult(platform, activeUrl, shareText);
  };

  const shareToTikTok = (url) => {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      // mobile: deep link to TikTok share sheet (best-effort)
      const tiktokShare = `https://www.tiktok.com/share?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
      window.location.href = tiktokShare;
    } else {
      // desktop: copy link instead and show toast
      copyResult(shareText, url);
      toast.success('Link copied! Paste it into TikTok.');
    }
  };

  return (
    <>
      <div id="result-card" className="animate-scale-up w-full max-w-md mx-auto bg-card rounded-3xl shadow-xl overflow-hidden border border-border">
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

        {/* Action & Share Section */}
        <div className="p-6 bg-card">
          <div className="space-y-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 mb-2 h-12 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary/20 transition-colors"
            >
              <Download className="w-5 h-5" />
              Save Result
            </button>

            <button
              onClick={() => window.open('/#', '_self')}
              className="w-full flex items-center justify-center gap-2 mb-4 h-12 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:bg-secondary/90 transition-colors"
              title="Get Full Report — $4.99"
            >
              <span className="font-bold">Get Full Report — $4.99</span>
            </button>
          </div>

          <h4 className="text-xs font-semibold text-center text-muted-foreground uppercase tracking-wider mb-4">
            Share Result
          </h4>
          
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            <button
              onClick={() => handleShareClick('twitter')}
              className="flex items-center justify-center h-10 rounded-lg bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              title="Twitter / X"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </button>
            <button
              onClick={() => handleShareClick('whatsapp')}
              className="flex items-center justify-center h-10 rounded-lg bg-muted text-foreground hover:bg-green-500 hover:text-white transition-colors"
              title="WhatsApp"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 21.056h-.002c-1.895 0-3.754-.51-5.385-1.478l-.387-.229-4.001 1.05.1.488 1.063-3.899-.253-.401a11.97 11.97 0 0 1-1.831-6.401c0-6.611 5.378-11.99 11.989-11.99 3.204 0 6.215 1.25 8.48 3.518s3.518 5.275 3.518 8.48-1.25 6.215-3.518 8.48c-2.264 2.264-5.275 3.513-8.479 3.513zm0-19.98c-2.667 0-5.174 1.04-7.06 2.925C3.084 5.888 2.046 8.394 2.046 11.06c0 1.708.448 3.376 1.3 4.846L2.3 20.373l4.57-1.2c1.41.776 3.012 1.186 4.659 1.186h.001c4.418 0 8.013-3.595 8.013-8.012 0-2.14-.833-4.152-2.347-5.666C15.68 5.168 13.669 4.335 11.53 4.335h.5zM16.32 14.156c-.227-.113-1.343-.663-1.551-.739-.209-.076-.361-.113-.513.113-.152.227-.589.739-.721.891-.133.152-.266.17-.493.057-.227-.113-.96-.353-1.829-1.129-.676-.605-1.132-1.353-1.265-1.58-.133-.227-.014-.35.099-.463.102-.102.227-.266.342-.398.114-.133.152-.227.227-.38.076-.152.038-.285-.019-.398-.057-.114-.513-1.235-.703-1.691-.185-.445-.373-.384-.513-.391-.133-.007-.285-.007-.437-.007-.152 0-.399.057-.608.285-.209.227-.798.779-.798 1.899 0 1.12.817 2.203.931 2.355.114.152 1.605 2.451 3.885 3.435.543.234 1.055.4 1.417.514.545.172 1.041.147 1.433.09.435-.064 1.343-.549 1.533-1.079.19-.53.19-.985.133-1.079-.057-.095-.209-.152-.437-.266z"/></svg>
            </button>
            <button
              onClick={() => handleShareClick('facebook')}
              className="flex items-center justify-center h-10 rounded-lg bg-muted text-foreground hover:bg-blue-600 hover:text-white transition-colors"
              title="Facebook"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </button>
            <button
              onClick={() => handleShareClick('pinterest')}
              className="flex items-center justify-center h-10 rounded-lg bg-muted text-foreground hover:bg-red-600 hover:text-white transition-colors"
              title="Pinterest"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.604 0 12.017 0z"/></svg>
            </button>
            <button
              onClick={() => shareToTikTok(activeUrl)}
              className="flex items-center justify-center h-10 rounded-lg bg-muted text-foreground hover:bg-black hover:text-white transition-colors"
              title="TikTok"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.95-.53 3.93-1.64 5.51-1.35 1.94-3.5 3.17-5.91 3.18-2.62.01-5.18-1.29-6.62-3.48-1.38-2.1-1.61-4.88-.63-7.14 1.11-2.55 3.65-4.28 6.43-4.34.13-.01.27-.01.4-.01v4.03c-1.61.16-3.15 1.18-3.9 2.58-.6 1.11-.73 2.47-.28 3.67.43 1.17 1.34 2.15 2.53 2.53 1.19.38 2.53.25 3.63-.34 1.25-.68 2.1-2 2.1-3.44V.02h-2.79z"/></svg>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center h-10 rounded-lg bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              title="Copy URL"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <SaveResultModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        resultUrl={activeUrl}
      />
    </>
  );
}

export default ResultCard;
