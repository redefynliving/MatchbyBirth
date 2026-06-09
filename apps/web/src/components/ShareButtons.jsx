
import React from 'react';
import { Copy, Twitter } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics.js';

function ShareButtons({ mode = 'pair', p1, p2, score, groupVibeScore, resultUrl }) {
  const shareUrl = resultUrl || window.location.href;
  
  const shareText = mode === 'group'
    ? `Our friend group is ${groupVibeScore}% compatible 👀 check yours ➜`
    : `${p1} & ${p2} are ${score}% compatible 👀 check yours ➜`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      trackEvent('result_shared', { mode, channel: 'copy' });
      toast.success('Private result link copied.');
    } catch {
      toast.error('The link could not be copied.');
    }
  };

  const handleTwitterShare = () => {
    const urlWithUtm = `${shareUrl}${shareUrl.includes('?') ? '&' : '?'}utm_source=x&utm_medium=share`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(urlWithUtm)}`;
    trackEvent('result_shared', { mode, channel: 'x' });
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mt-8 space-y-4 w-full max-w-md mx-auto">
      <h4 className="text-sm font-semibold text-center text-muted-foreground uppercase tracking-wider">Share Private Result</h4>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 p-4 rounded-xl bg-card border border-border hover:bg-muted transition-colors shadow-sm"
        >
          <Copy className="w-5 h-5 text-foreground" />
          <span className="font-medium text-foreground">Copy Link</span>
        </button>
        
        <button
          onClick={handleTwitterShare}
          className="flex items-center justify-center gap-2 p-4 rounded-xl bg-black text-white hover:bg-black/80 transition-colors shadow-sm"
        >
          <Twitter className="w-5 h-5" />
          <span className="font-medium">Share to X</span>
        </button>
      </div>
    </div>
  );
}

export default ShareButtons;
