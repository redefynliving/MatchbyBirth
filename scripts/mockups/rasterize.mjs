// Rasterize each mockup SVG -> PNG via headless Chrome (no AI, no new deps).
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const SVG_DIR = path.resolve('scripts/mockups/svg');
const PNG_DIR = path.resolve('scripts/mockups/png');
fs.mkdirSync(PNG_DIR, { recursive: true });
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const files = fs.readdirSync(SVG_DIR).filter(f => f.endsWith('.svg'));
let done = 0;
for (const f of files) {
  const base = f.replace('.svg', '');
  const svgPath = path.join(SVG_DIR, f);
  const pngPath = path.join(PNG_DIR, base + '.png');
  const url = 'file://' + svgPath;
  try {
    execFileSync(CHROME, [
      '--headless', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
      `--window-size=1080,1350`, '--screenshot=' + pngPath, url
    ], { stdio: 'ignore', timeout: 30000 });
    done++;
  } catch (e) {
    console.log('FAIL', f, e.message.slice(0, 80));
  }
}
console.log('RASTERIZED', done, '/', files.length, 'to', PNG_DIR);
