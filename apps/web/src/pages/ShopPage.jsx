import { Sparkles, Star, Moon, Heart } from 'lucide-react';
import NewsletterCapture from '@/components/NewsletterCapture.jsx';

/* ── Design system (mirrors MatchByBirth brand tokens) ────────────────────── */
const INK = '#1c1530';
const GOLD = '#c9a24b';
const MIST = '#e9e4f0';
const NIGHT = '#241b3a';

/* Reusable preview canvas: soft garment/print mock on a mist card. */
function Preview({ children, ratio = '4 / 5' }) {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden rounded-lg border border-border bg-[#f6f4fb]"
      style={{ aspectRatio: ratio }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,#ffffff_0%,#f1eef8_100%)]" />
      <div className="relative w-[78%]">{children}</div>
    </div>
  );
}

/* ── SVG design primitives (real previews, no external assets) ────────────── */
function SignPair({ a, b, glyphA, glyphB }) {
  return (
    <Preview>
      <svg viewBox="0 0 200 250" className="w-full" role="img" aria-label={`${a} and ${b} tee`}>
        <rect x="20" y="10" width="160" height="230" rx="14" fill="#fff" stroke={INK} strokeWidth="1.5" />
        <text x="100" y="92" textAnchor="middle" fontSize="46" fill={GOLD} fontFamily="Georgia, serif">{glyphA}</text>
        <text x="100" y="138" textAnchor="middle" fontSize="34" fill={INK} fontFamily="Georgia, serif">♥</text>
        <text x="100" y="186" textAnchor="middle" fontSize="46" fill={GOLD} fontFamily="Georgia, serif">{glyphB}</text>
        <text x="100" y="222" textAnchor="middle" fontSize="13" letterSpacing="2" fill={INK} fontFamily="system-ui, sans-serif">{a.toUpperCase()}　×　{b.toUpperCase()}</text>
      </svg>
    </Preview>
  );
}

function MyPerson({ sign, glyph }) {
  return (
    <Preview>
      <svg viewBox="0 0 200 250" className="w-full" role="img" aria-label={`my person is ${/^[aeiou]/i.test(sign) ? 'an' : 'a'} ${sign}`}>
        <rect x="20" y="10" width="160" height="230" rx="14" fill={NIGHT} />
        <text x="100" y="96" textAnchor="middle" fontSize="40" fill={MIST} fontFamily="system-ui, sans-serif">my person</text>
        <text x="100" y="128" textAnchor="middle" fontSize="22" fill={MIST} fontFamily="system-ui, sans-serif">{/^[aeiou]/i.test(sign) ? 'is an' : 'is a'}</text>
        <text x="100" y="184" textAnchor="middle" fontSize="54" fill={GOLD} fontFamily="Georgia, serif">{glyph}</text>
        <text x="100" y="220" textAnchor="middle" fontSize="18" letterSpacing="3" fill={MIST} fontFamily="system-ui, sans-serif">{sign.toUpperCase()}</text>
      </svg>
    </Preview>
  );
}

function WallArt({ kind, label, sub }) {
  return (
    <Preview ratio="1 / 1">
      <svg viewBox="0 0 220 220" className="w-full" role="img" aria-label={label}>
        <rect x="14" y="14" width="192" height="192" rx="4" fill="#fff" stroke={INK} strokeWidth="1.5" />
        <circle cx="110" cy="110" r="64" fill="none" stroke={GOLD} strokeWidth="1.5" />
        {kind === 'moon' ? (
          <>
            <path d="M110 46 a64 64 0 1 0 0 128 a48 48 0 1 1 0 -128 z" fill={NIGHT} />
          </>
        ) : (
          <>
            <circle cx="110" cy="110" r="58" fill="none" stroke={MIST} strokeWidth="1" />
            <circle cx="110" cy="110" r="40" fill="none" stroke={MIST} strokeWidth="1" />
            <path d="M110 46 L110 174 M46 110 L174 110 M62 62 L158 158 M158 62 L62 158" stroke={MIST} strokeWidth="1" />
          </>
        )}
        <text x="110" y="200" textAnchor="middle" fontSize="13" letterSpacing="2" fill={INK} fontFamily="system-ui, sans-serif">{sub}</text>
      </svg>
    </Preview>
  );
}

/* ── Design previews ─ */
const SIGN_PAIRS = [
  { a: 'Taurus', b: 'Scorpio', gA: '♉', gB: '♏' },
  { a: 'Gemini', b: 'Aquarius', gA: '♊', gB: '♒' },
  { a: 'Leo', b: 'Libra', gA: '♌', gB: '♎' },
  { a: 'Cancer', b: 'Pisces', gA: '♋', gB: '♓' },
  { a: 'Aries', b: 'Sagittarius', gA: '♈', gB: '♐' },
  { a: 'Virgo', b: 'Capricorn', gA: '♍', gB: '♑' },
];
const MY_PERSON = ['Leo', 'Scorpio', 'Pisces', 'Libra', 'Taurus', 'Aquarius']
  .map((s) => ({ sign: s, glyph: { Leo: '♌', Scorpio: '♏', Pisces: '♓', Libra: '♎', Taurus: '♉', Aquarius: '♒' }[s] }));
const ART = [
  { kind: 'moon', label: 'Couple moon-phase poster', sub: 'YOUR MOON × THEIRS' },
  { kind: 'chart', label: 'Birth-chart print', sub: 'FULL NATAL CHART' },
  { kind: 'moon', label: 'Alignment moon print', sub: 'SYNASTRY MOONS' },
];

const PRODUCTS = [
  ...SIGN_PAIRS.map((p) => ({ key: `sp-${p.a}`, name: `${p.a} ♥ ${p.b} Tee`, art: <SignPair {...p} /> })),
  ...MY_PERSON.map((p) => ({ key: `mp-${p.sign}`, name: `My Person Is ${/^[aeiou]/i.test(p.sign) ? 'An' : 'A'} ${p.sign} Tee`, art: <MyPerson {...p} /> })),
  ...ART.map((p) => ({ key: `art-${p.sub}`, name: p.label, art: <WallArt {...p} /> })),
];

const COLLECTIONS = [
  { id: 'sign-pair', icon: Heart, title: 'Sign Pair Tees', blurb: 'Wear the match. "Taurus ♥ Scorpio", "Gemini × Aquarius" — clean typographic tees for the couple that already knows their chart.' },
  { id: 'partner-sign', icon: Star, title: '"My Person Is…"', blurb: 'Partner-sign tees. The low-key flex for people who read the birth chart before the bio.' },
  { id: 'birth-chart-art', icon: Moon, title: 'Birth Chart & Moon Phase Wall Art', blurb: 'Framed birth-chart prints and moon-phase posters. Quiet, personal, gift-ready.' },
];

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <header className="text-center">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Match By Birth Shop
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Astrology you can wear.
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          Sign-pair tees and birth-chart art are coming soon. Preview the designs below
          and sign up to hear when checkout opens.
        </p>
      </header>

      <section className="mt-12 grid gap-5 md:grid-cols-3">
        {COLLECTIONS.map(({ id, icon: Icon, title, blurb }) => (
          <article key={id} className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{blurb}</p>
          </article>
        ))}
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Coming soon</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Preview fifteen designs. Checkout is not open yet.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <article key={p.key} className="flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm">
              {p.art}
              <h3 className="mt-3 text-sm font-semibold text-foreground">{p.name}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          These are previews, not items available for purchase. Sign up below to hear when checkout opens.
        </p>
      </section>

      <section className="mt-10">
        <NewsletterCapture
          consentSource="shop_apparel"
          title="Get the shop when checkout opens"
          description="Leave your email for a note when the shop opens, plus occasional Match by Birth updates."
          buttonLabel="Notify me"
          finePrint="Free. Unsubscribe anytime."
        />
      </section>


    </div>
  );
}
