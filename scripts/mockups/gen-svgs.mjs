// Generate the 15 on-brand mockup SVGs as standalone files (path-based zodiac glyphs, no fonts).
import fs from 'fs';
import path from 'path';

const INK = '#1c1530', GOLD = '#c9a24b', MIST = '#e9e4f0', NIGHT = '#241b3a';
const OUT = path.resolve('scripts/mockups/svg');
fs.mkdirSync(OUT, { recursive: true });

// Geometric astrological glyph paths (AstroGlyph, MIT-style), viewBox ~ -50..50.
const GLYPH = {
  aries: 'M -34 28 C -30 -20 -10 -46 0 -6 C 10 -46 30 -20 34 28 M 0 -6 L 0 38',
  taurus: 'M -30 -36 C -16 -12 16 -12 30 -36 M 0 -18 A 30 30 0 1 1 0 42 A 30 30 0 1 1 0 -18',
  gemini: 'M -30 -36 C -10 -28 10 -28 30 -36 M -30 36 C -10 28 10 28 30 36 M -20 -30 L -20 30 M 20 -30 L 20 30',
  cancer: 'M -36 -10 C -18 -32 22 -26 22 -4 A 16 16 0 1 1 6 -20 M 36 10 C 18 32 -22 26 -22 4 A 16 16 0 1 1 -6 20',
  leo: 'M -30 22 C -10 32 6 14 0 -2 C -8 -24 12 -38 28 -26 C 42 -16 34 8 16 16 C 2 22 4 40 28 36',
  virgo: 'M -38 22 C -34 -10 -28 -22 -18 -18 C -8 -14 -8 12 -8 30 M -8 -18 C 4 -28 14 -14 14 28 M 14 -12 C 28 -26 36 -4 24 12 C 12 28 28 40 40 20',
  libra: 'M -42 30 L 42 30 M -36 12 L -10 12 C -18 -14 18 -14 10 12 L 36 12',
  scorpio: 'M -40 22 C -36 -10 -30 -22 -20 -18 C -10 -14 -10 12 -10 30 M -10 -18 C 2 -28 10 -12 10 28 M 10 -12 C 22 -26 30 -6 24 20 L 40 20 M 40 20 L 30 10 M 40 20 L 30 30',
  sagittarius: 'M -34 34 L 34 -34 M 6 -34 L 34 -34 L 34 -6 M -18 0 L 0 18',
  capricorn: 'M -38 -18 C -26 -38 -14 -6 -8 30 M -8 -18 C 4 -36 12 -4 16 22 C 22 52 54 20 30 2 C 18 -8 8 10 16 22',
  aquarius: 'M -42 -8 L -24 -20 L -8 -8 L 8 -20 L 24 -8 L 42 -20 M -42 18 L -24 6 L -8 18 L 8 6 L 24 18 L 42 6',
  pisces: 'M -26 -36 C -8 -12 -8 12 -26 36 M 26 -36 C 8 -12 8 12 26 36 M -36 0 L 36 0',
};

// glyph centered in a 0..200 box at (cx,cy), scaled
const glyphSvg = (name, cx, cy, scale, color) => {
  const d = GLYPH[name];
  return `<path d="${d}" transform="translate(${cx} ${cy}) scale(${scale})" fill="none" stroke="${color}" stroke-width="${3/scale}" stroke-linecap="round" stroke-linejoin="round"/>`;
};

const signPair = (a, b, gA, gB) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 200 250">
  <rect x="20" y="10" width="160" height="230" rx="14" fill="#fff" stroke="${INK}" stroke-width="1.5"/>
  ${glyphSvg(gA, 100, 80, 1.05, GOLD)}
  <text x="100" y="138" text-anchor="middle" font-size="30" fill="${INK}" font-family="Georgia, serif">♥</text>
  ${glyphSvg(gB, 100, 175, 1.05, GOLD)}
  <text x="100" y="228" text-anchor="middle" font-size="13" letter-spacing="2" fill="${INK}" font-family="system-ui, sans-serif">${a.toUpperCase()}　×　${b.toUpperCase()}</text>
</svg>`;

const myPerson = (sign, glyph) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 200 250">
  <rect x="20" y="10" width="160" height="230" rx="14" fill="${NIGHT}"/>
  <text x="100" y="92" text-anchor="middle" font-size="40" fill="${MIST}" font-family="system-ui, sans-serif">my person</text>
  <text x="100" y="120" text-anchor="middle" font-size="22" fill="${MIST}" font-family="system-ui, sans-serif">is a</text>
  ${glyphSvg(glyph, 100, 175, 1.25, GOLD)}
  <text x="100" y="224" text-anchor="middle" font-size="18" letter-spacing="3" fill="${MIST}" font-family="system-ui, sans-serif">${sign.toUpperCase()}</text>
</svg>`;

const wallArt = (kind, sub) => {
  const inner = kind === 'moon'
    ? '<path d="M110 46 a64 64 0 1 0 0 128 a48 48 0 1 1 0 -128 z" fill="' + NIGHT + '"/>'
    : '<circle cx="110" cy="110" r="58" fill="none" stroke="' + MIST + '" stroke-width="1"/><circle cx="110" cy="110" r="40" fill="none" stroke="' + MIST + '" stroke-width="1"/><path d="M110 46 L110 174 M46 110 L174 110 M62 62 L158 158 M158 62 L62 158" stroke="' + MIST + '" stroke-width="1"/>';
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 220 220">
  <rect x="14" y="14" width="192" height="192" rx="4" fill="#fff" stroke="${INK}" stroke-width="1.5"/>
  <circle cx="110" cy="110" r="64" fill="none" stroke="${GOLD}" stroke-width="1.5"/>
  ${inner}
  <text x="110" y="205" text-anchor="middle" font-size="13" letter-spacing="2" fill="${INK}" font-family="system-ui, sans-serif">${sub}</text>
</svg>`;
};

const SIGN_PAIRS = [
  ['Taurus','Scorpio','taurus','scorpio'], ['Gemini','Aquarius','gemini','aquarius'],
  ['Leo','Libra','leo','libra'], ['Cancer','Pisces','cancer','pisces'],
  ['Aries','Sagittarius','aries','sagittarius'], ['Virgo','Capricorn','virgo','capricorn'],
];
const MY_PERSON = [['Leo','leo'],['Scorpio','scorpio'],['Pisces','pisces'],['Libra','libra'],['Taurus','taurus'],['Aquarius','aquarius']];
const ART = [['moon','YOUR MOON × THEIRS'],['chart','FULL NATAL CHART'],['moon','SYNASTRY MOONS']];

const files = [];
SIGN_PAIRS.forEach(([a,b,gA,gB]) => { const n=`sp-${a}-${b}`; fs.writeFileSync(path.join(OUT,`${n}.svg`), signPair(a,b,gA,gB)); files.push(n); });
MY_PERSON.forEach(([s,g]) => { const n=`mp-${s}`; fs.writeFileSync(path.join(OUT,`${n}.svg`), myPerson(s,g)); files.push(n); });
ART.forEach(([k,sub]) => { const n=`art-${sub.replace(/[^a-z]/gi,'')}`; fs.writeFileSync(path.join(OUT,`${n}.svg`), wallArt(k,sub)); files.push(n); });

console.log('WROTE', files.length, 'SVGs (path glyphs) to', OUT);
