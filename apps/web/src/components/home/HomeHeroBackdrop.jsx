/**
 * Subtle celestial atmosphere layer for the homepage hero.
 * Purely decorative — pointer-events-none, aria-hidden.
 * Uses only existing design-token colours via Tailwind arbitrary values.
 */
export default function HomeHeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden" aria-hidden="true">
      {/* Primary radial glow — top-right */}
      <div
        className="absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.18), transparent 70%)' }}
      />
      {/* Secondary warm glow — bottom-left */}
      <div
        className="absolute -bottom-32 -left-20 h-[320px] w-[320px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, hsl(335 45% 82% / 0.22), transparent 70%)' }}
      />
      {/* Subtle constellation dots — top-left cluster */}
      <svg className="absolute top-8 left-12 hidden opacity-[0.12] lg:block" width="120" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="20" r="1.5" fill="hsl(var(--primary))" />
        <circle cx="40" cy="10" r="1" fill="hsl(var(--primary))" />
        <circle cx="70" cy="35" r="1.5" fill="hsl(var(--primary))" />
        <circle cx="100" cy="15" r="1" fill="hsl(var(--primary))" />
        <circle cx="55" cy="60" r="1" fill="hsl(var(--primary))" />
        <line x1="10" y1="20" x2="40" y2="10" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.5" />
        <line x1="40" y1="10" x2="70" y2="35" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.5" />
        <line x1="70" y1="35" x2="100" y2="15" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.5" />
        <line x1="40" y1="10" x2="55" y2="60" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.5" />
      </svg>
      {/* Subtle constellation dots — right-center cluster */}
      <svg className="absolute top-1/3 right-8 hidden opacity-[0.08] lg:block" width="90" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="15" r="1" fill="hsl(var(--primary))" />
        <circle cx="60" cy="40" r="1.5" fill="hsl(var(--primary))" />
        <circle cx="35" cy="75" r="1" fill="hsl(var(--primary))" />
        <circle cx="80" cy="85" r="1" fill="hsl(var(--primary))" />
        <line x1="20" y1="15" x2="60" y2="40" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.4" />
        <line x1="60" y1="40" x2="35" y2="75" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.4" />
        <line x1="35" y1="75" x2="80" y2="85" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.4" />
      </svg>
    </div>
  );
}
