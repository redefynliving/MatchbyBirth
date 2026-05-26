import { spawn } from 'child_process';
import fetch from 'node-fetch';

const PORT = process.env.PORT || 3002;
const CWD = new URL('../', import.meta.url).pathname + 'apps/api';

function wait(ms){ return new Promise(r=>setTimeout(r, ms)); }

async function main(){
  console.log('Starting api server subprocess...');
  const proc = spawn('node', ['src/main.js'], { cwd: './', env: { ...process.env, PORT: String(PORT) }, stdio: ['ignore','pipe','pipe'] });

  proc.stdout.on('data', d=>process.stdout.write(`[api] ${d}`));
  proc.stderr.on('data', d=>process.stderr.write(`[api-err] ${d}`));

  const url = `http://localhost:${PORT}/api/synastry`;
  const payload = { chartA: { Sun: 10.0 }, chartB: { Sun: 10.0 }, options: { aspects: ['conjunction'] } };

  let lastErr = null;
  for(let i=0;i<50;i++){
    try{
      const res = await fetch(url, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' }, timeout: 3000 });
      if(!res.ok){
        const text = await res.text();
        lastErr = new Error(`HTTP ${res.status} ${text}`);
      } else {
        const j = await res.json();
        if(!('aspects' in j) || !('normalized_score' in j)){
          lastErr = new Error('Missing keys in response ' + JSON.stringify(j));
        } else {
          console.log('Integration test OK', j);
          proc.kill();
          process.exit(0);
        }
      }
    }catch(e){ lastErr = e; }
    await wait(200);
  }
  console.error('Integration test failed', lastErr);
  try{ proc.kill(); }catch(e){}
  process.exit(1);
}

main();
