import React from 'react';
import { ArrowUpRight, Sparkles, Star, Moon, Heart } from 'lucide-react';
import NewsletterCapture from '@/components/NewsletterCapture.jsx';

const COLLECTIONS = [
  {
    id: 'sign-pair',
    icon: Heart,
    title: 'Sign Pair Tees',
    blurb: 'Wear the match. "Taurus ♥ Scorpio", "Gemini × Aquarius" — clean typographic tees for the couple that already knows their chart.',
    cta: 'Shop sign-pair tees',
    href: 'https://matchbybirth.printful.me/sign-pair',
  },
  {
    id: 'partner-sign',
    icon: Star,
    title: '"My Person Is A…"',
    blurb: 'Partner-is-a-sign shirts and mugs. The low-key flex for people who read the birth chart before the bio.',
    cta: 'Shop partner-sign',
    href: 'https://matchbybirth.printful.me/partner-sign',
  },
  {
    id: 'birth-chart-art',
    icon: Moon,
    title: 'Birth Chart & Moon Phase Wall Art',
    blurb: 'Framed birth-chart prints and moon-phase posters. Highest margin in the shop — quiet, premium, gift-ready.',
    cta: 'Shop wall art',
    href: 'https://matchbybirth.printful.me/wall-art',
  },
];

const PRODUCTS = [
  { name: 'Sign-Pair Unisex Tee', price: '$32', note: '200–300% margin · no inventory' },
  { name: '"My Person Is A Leo" Tee', price: '$32', note: 'relationship identity' },
  { name: 'Couple Moon-Phase Mug', price: '$22', note: 'gift-driven' },
  { name: 'Birth Chart Poster', price: '$38', note: '2–3× margin' },
  { name: 'Rising Sign Hoodie', price: '$48', note: 'evergreen' },
  { name: 'Compatibility Throw Pillow', price: '$34', note: 'home decor' },
];

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      {/* Hero */}
      <header className="text-center">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Match By Birth Shop
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Astrology you can wear.
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          Identity merch for people who already know their sign. Printed on demand — made
          after you order, shipped straight to you. No warehouse, no waste.
        </p>
      </header>

      {/* Collections */}
      <section className="mt-12 grid gap-5 md:grid-cols-3">
        {COLLECTIONS.map(({ id, icon: Icon, title, blurb, cta, href }) => (
          <article
            key={id}
            className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{blurb}</p>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              {cta}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </article>
        ))}
      </section>

      {/* Product grid */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">In the shop</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Printed to order via Printful. Each piece is made after you check out.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <div
              key={p.name}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-sm font-semibold text-foreground">{p.name}</h3>
                <span className="shrink-0 text-sm font-semibold text-primary">{p.price}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{p.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Spine capture — reuses the existing list + /api/subscribe */}
      <section className="mt-14">
        <NewsletterCapture
          consentSource="shop_apparel"
          title="New drops + timing notes for the shop"
          description="Get first look at new sign-pair designs and the occasional relationship-timing note. Same list, no spam."
          buttonLabel="Notify me"
          finePrint="Free. Unsubscribe anytime."
        />
      </section>

      <p className="mt-10 text-center text-xs text-muted-foreground">
        Fulfilled by Printful. Match By Birth handles design + astrology; Printful handles print,
        pack, and ship.
      </p>
    </div>
  );
}
