
import React from 'react';
import { Copy, Share2, Twitter } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics.js';
import { getShareBandKey } from '@/lib/share-page.js';
import { getShareBand, getShareText } from '@/lib/share-copy.js';

function ShareButtons({
  mode = 'pair',
  p1,
  p2,
  score,
  groupVibeScore,
  resultUrl,
  shareId,
  relationshipType,
  calculationMode,
  topAspectLabel,
  scoreBand: scoreBandOverride,
  placement = 'share_module',
}) {
  const shareUrl = resultUrl || window.location.href;
  const shareScore = Number(mode === 'group' ? groupVibeScore : score) || 0;
  const scoreBandLabel = getShareBand(shareScore);
  const scoreBand = scoreBandOverride || getShareBandKey(shareScore);
  const shareText = getShareText({
    mode,
    p1,
    p2,
    score,
    groupVibeScore,
    calculationMode,
    topAspectLabel,
  });
  const eventPayload = {
    share_id: shareId || 'unknown',
    mode,
    relationship_type: relationshipType || mode,
    score: Math.round(shareScore),
    score_band: scoreBand,
    placement,
    calculation_mode: calculationMode || 'basic-sun',
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      trackEvent('share_page_copy_link_click', eventPayload);
      trackEvent('result_shared', { ...eventPayload, channel: 'copy' });
      toast.success('Result link copied.');
    } catch {
      toast.error('The link could not be copied.');
    }
  };

  const handleTwitterShare = () => {
    const urlWithUtm = `${shareUrl}${shareUrl.includes('?') ? '&' : '?'}utm_source=x&utm_medium=share`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(urlWithUtm)}`;
    trackEvent('share_page_x_share_click', eventPayload);
    trackEvent('result_shared', { ...eventPayload, channel: 'x' });
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mx-auto w-full max-w-lg rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Share2 className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Share by link</h2>
      </div>
      <p className="mb-3 text-xs leading-5 text-muted-foreground">
        Anyone with the link can view this private-safe result. Birth dates are not shown. {calculationMode === 'full-synastry' ? 'The leading aspect is included.' : `Score band: ${scoreBandLabel}.`}
      </p>
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
