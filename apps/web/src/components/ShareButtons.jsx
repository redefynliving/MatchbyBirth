
import React from 'react';
import { Copy, Share2, Twitter } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics.js';

function ShareButtons({ mode = 'pair', p1, p2, score, groupVibeScore, resultUrl }) {
  const shareUrl = resultUrl || window.location.href;
  
  const shareText = mode === 'group'
    ? `Our group compatibility is ${groupVibeScore}%. Explore yours with Match by Birth.`
    : `${p1} and ${p2} are ${score}% compatible. Explore yours with Match by Birth.`;

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
    <div className="mx-auto mt-6 w-full max-w-lg rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Share2 className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Share privately</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background text-sm font-semibold transition-colors hover:bg-muted"
        >
          <Copy className="h-4 w-4 text-primary" />
          <span>Copy link</span>
        </button>
        
        <button
          type="button"
          onClick={handleTwitterShare}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-semibold text-background transition-colors hover:bg-foreground/85"
        >
          <Twitter className="h-4 w-4" />
          <span>Share to X</span>
        </button>
      </div>
    </div>
  );
}

export default ShareButtons;
