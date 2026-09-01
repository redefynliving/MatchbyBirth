// Push the 15 mockup PNGs to Printful as products via the v2 API (binary upload).
import fs from 'fs';
import path from 'path';

// minimal .env loader
const env = {};
try {
  const raw = fs.readFileSync(path.resolve('.env.local'), 'utf8');
  raw.split('\n').forEach((l) => { const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) env[m[1]] = m[2].trim(); });
} catch {}
const KEY = env.PRINTFUL_API_KEY;
const STORE = env.PRINTFUL_STORE_ID || '18675962';
const BASE = 'https://api.printful.com';
const PNG = path.resolve('scripts/mockups/png');

const products = [
  { file: 'sp-Taurus-Scorpio.png', name: 'Taurus ♥ Scorpio Tee' },
  { file: 'sp-Gemini-Aquarius.png', name: 'Gemini × Aquarius Tee' },
  { file: 'sp-Leo-Libra.png', name: 'Leo ♥ Libra Tee' },
  { file: 'sp-Cancer-Pisces.png', name: 'Cancer ♥ Pisces Tee' },
  { file: 'sp-Aries-Sagittarius.png', name: 'Aries × Sagittarius Tee' },
  { file: 'sp-Virgo-Capricorn.png', name: 'Virgo ♥ Capricorn Tee' },
  { file: 'mp-Leo.png', name: 'My Person Is A Leo Tee' },
  { file: 'mp-Scorpio.png', name: 'My Person Is A Scorpio Tee' },
  { file: 'mp-Pisces.png', name: 'My Person Is A Pisces Tee' },
  { file: 'mp-Libra.png', name: 'My Person Is A Libra Tee' },
  { file: 'mp-Taurus.png', name: 'My Person Is A Taurus Tee' },
  { file: 'mp-Aquarius.png', name: 'My Person Is A Aquarius Tee' },
  { file: 'art-YOURMOONTHEIRS.png', name: 'Couple Moon-Phase Poster' },
  { file: 'art-FULLNATALCHART.png', name: 'Birth-Chart Print' },
  { file: 'art-SYNASTRYMOONS.png', name: 'Synastry Moon Print' },
];

async function uploadFile(pngPath) {
  const buf = fs.readFileSync(pngPath);
  const fd = new FormData();
  fd.append('file', new Blob([buf], { type: 'image/png' }), path.basename(pngPath));
  const res = await fetch(`${BASE}/files?store_id=${STORE}`, {
    method: 'POST', headers: { Authorization: `Bearer ${KEY}` }, body: fd,
  });
  const j = await res.json().catch(() => ({}));
  return j.result && j.result.id;
}

async function createProduct(name, fileId) {
  const res = await fetch(`${BASE}/products?store_id=${STORE}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sync_product: { name }, file_ids: [fileId] }),
  });
  const j = await res.json().catch(() => ({}));
  if (j.result) return j.result.id || (j.result.sync_product && j.result.sync_product.id);
  throw new Error(JSON.stringify(j).slice(0, 160));
}

async function main() {
  let ok = 0, fail = 0;
  for (const p of products) {
    const png = path.join(PNG, p.file);
    if (!fs.existsSync(png)) { console.log('MISSING', p.file); fail++; continue; }
    try {
      const fileId = await uploadFile(png);
      if (!fileId) { console.log('UPLOAD_FAIL', p.name); fail++; continue; }
      const id = await createProduct(p.name, fileId);
      console.log('CREATED', p.name, '| id', id);
      ok++;
    } catch (e) {
      console.log('FAIL', p.name, e.message.slice(0, 140));
      fail++;
    }
  }
  console.log(`\nDONE: ${ok} created, ${fail} failed`);
}
main().catch((e) => console.log('FATAL', e.message));
