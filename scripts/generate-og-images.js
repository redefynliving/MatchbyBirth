const sharp = require('sharp');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 630;

const posts = [
  {
    slug: 'top-10-most-toxic-zodiac-pairings',
    title: 'Top 10 Most Toxic Zodiac Pairings',
    subtitle: 'And Why They Clash',
  },
  {
    slug: '7-surprising-compatible-zodiac-pairs',
    title: '7 Surprising Zodiac Pairs',
    subtitle: 'That Are Weirdly Compatible',
  },
  {
    slug: 'zodiac-compatibility-workplace-career',
    title: 'Zodiac Compatibility at Work',
    subtitle: 'Which Signs Make the Best Teams',
  },
  {
    slug: 'zodiac-sign-myths-legends-stories',
    title: 'The Myths Behind the Zodiac Signs',
    subtitle: 'Stories That Reveal Their Personalities',
  },
  {
    slug: 'group-zodiac-compatibility-friendship-dynamics',
    title: 'Group Zodiac Compatibility',
    subtitle: 'How to Build the Perfect Friend Group',
  },
  {
    slug: 'mercury-retrograde-2026-relationships',
    title: 'Mercury Retrograde 2026',
    subtitle: 'What It Means for Your Relationships',
  },
  {
    slug: 'zodiac-signs-that-need-most-emotional-support',
    title: 'Signs That Need the Most Emotional Support',
    subtitle: 'And How to Give It',
  },
  {
    slug: 'why-opposites-attract-astrology',
    title: 'Why Opposites Attract in Astrology',
    subtitle: 'And When They Don\'t',
  },
  {
    slug: 'zodiac-compatibility-red-flags',
    title: 'Zodiac Red Flags',
    subtitle: 'Which Signs Have the Most (And What They Mean)',
  },
  {
    slug: 'best-zodiac-matches-for-each-sign-2026',
    title: 'Best Zodiac Match for Every Sign in 2026',
    subtitle: 'Your Top Compatibility Pick',
  },
];

function createSVG(title, subtitle) {
  const symbols = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  const symbolPositions = symbols.map((s, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const x = 600 + Math.cos(angle) * 400;
    const y = 315 + Math.sin(angle) * 220;
    return `<text x="${x}" y="${y}" font-size="36" fill="rgba(255,215,0,0.12)" text-anchor="middle" font-family="serif">${s}</text>`;
  }).join('\n    ');

  const stars = Array.from({length: 30}, () => {
    const x = Math.random() * WIDTH;
    const y = Math.random() * HEIGHT;
    const r = Math.random() * 2 + 0.5;
    const o = Math.random() * 0.6 + 0.2;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,${o})"/>`;
  }).join('\n    ');

  // Word-wrap title
  const words = title.split(' ');
  const lines = [];
  let currentLine = '';
  for (const word of words) {
    const test = currentLine ? `${currentLine} ${word}` : word;
    if (test.length > 28 && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = test;
    }
  }
  if (currentLine) lines.push(currentLine);

  const titleLines = lines.map((line, i) => {
    const y = 240 + i * 60;
    return `<text x="600" y="${y}" font-size="52" font-weight="700" fill="#ffffff" text-anchor="middle" font-family="Georgia, serif">${escapeXml(line)}</text>`;
  }).join('\n    ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1a0533"/>
        <stop offset="50%" style="stop-color:#2d1b69"/>
        <stop offset="100%" style="stop-color:#4a1a8a"/>
      </linearGradient>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
    ${stars}
    ${symbolPositions}
    ${titleLines}
    <text x="600" y="${240 + lines.length * 60 + 30}" font-size="22" fill="rgba(255,215,0,0.8)" text-anchor="middle" font-family="Georgia, serif">${escapeXml(subtitle)}</text>
    <text x="600" y="590" font-size="16" letter-spacing="4" fill="rgba(255,255,255,0.5)" text-anchor="middle" font-family="Arial, sans-serif">MATCH BY BIRTH — ASTROLOGY COMPATIBILITY</text>
  </svg>`;
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

async function generateImages() {
  const outDir = path.join(__dirname, 'apps/web/public/og');
  await sharp(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1"/></svg>'))
    .toFile(path.join(outDir, '.gitkeep'))
    .catch(() => {});

  // Ensure output dir exists
  const fs = require('fs');
  fs.mkdirSync(outDir, { recursive: true });

  for (const post of posts) {
    const svg = createSVG(post.title, post.subtitle);
    const outPath = path.join(outDir, `${post.slug}.png`);

    await sharp(Buffer.from(svg))
      .resize(WIDTH, HEIGHT)
      .png({ quality: 90 })
      .toFile(outPath);

    console.log(`✓ ${post.slug}.png`);
  }

  console.log(`\nGenerated ${posts.length} OG images in ${outDir}`);
}

generateImages().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});