import React from 'react';
import {
  FileHeart,
  MessageCircle,
  Share2,
} from 'lucide-react';

function HomeResultPreview() {
  return (
    <aside className="flex h-full flex-col border-t border-border bg-[linear-gradient(155deg,hsl(var(--secondary))_0%,hsl(335_45%_95%)_100%)] p-6 lg:border-l lg:border-t-0 lg:p-7">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary">
        What you will see
      </p>

      <div className="mt-6 flex items-center gap-4">
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[conic-gradient(hsl(var(--primary))_0_82%,rgba(255,255,255,0.65)_82%)] shadow-[inset_0_0_0_9px_rgba(255,255,255,0.82)]">
          <span className="text-2xl font-semibold tracking-tight text-foreground">82%</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Strong natural fit</h3>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            Warm communication with one clear growth edge.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-primary/15 bg-card/70 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MessageCircle className="h-4 w-4 text-primary" />
          Your strongest quality
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          You understand each other&apos;s intentions quickly and communicate with natural ease.
        </p>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
        <div className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary/15 bg-card/70 text-xs font-semibold text-primary">
          <Share2 className="h-3.5 w-3.5" />
          Private sharing
        </div>
        <div className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-foreground text-xs font-semibold text-background">
          <FileHeart className="h-3.5 w-3.5" />
          Go deeper
        </div>
      </div>
    </aside>
  );
}

export default HomeResultPreview;

