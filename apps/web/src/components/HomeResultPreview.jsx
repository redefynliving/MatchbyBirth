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
        Example result
      </p>

      <div className="mt-6 flex items-center gap-4">
        <div
          aria-label="Example compatibility score: 82%"
          className="grid h-20 w-20 shrink-0 place-items-center rounded-full border border-primary/20 bg-primary/10 shadow-sm"
          role="img"
        >
          <span className="text-2xl font-semibold tracking-tight text-primary">82%</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Good compatibility</h3>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            Communication looks strong. Handling disagreements may take more effort.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-primary/15 bg-card/70 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MessageCircle className="h-4 w-4 text-primary" />
          What works well
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          You are likely to understand each other without much explaining.
        </p>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
        <div className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary/15 bg-card/70 text-xs font-semibold text-primary">
          <Share2 className="h-3.5 w-3.5" />
          Share result
        </div>
        <div className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-foreground text-xs font-semibold text-background">
          <FileHeart className="h-3.5 w-3.5" />
          See report details
        </div>
      </div>
    </aside>
  );
}

export default HomeResultPreview;
