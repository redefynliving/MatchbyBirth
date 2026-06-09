import express from 'express';
import { spawn } from 'child_process';
import { fileURLToPath } from 'node:url';
import { synastryRateLimit } from '../middleware/synastry-rate-limit.js';
import { validateSynastry } from '../middleware/validate-synastry.js';

const router = express.Router();
const runnerPath = fileURLToPath(new URL('../astro/run_synastry.py', import.meta.url));

// POST /api/synastry
// Body: { chartA: {...}, chartB: {...}, options: {...} }
router.post('/', synastryRateLimit, validateSynastry, async (req, res) => {
  try {
    const payload = {
      chartA: req.body.chartA || {},
      chartB: req.body.chartB || {},
      options: req.body.options || {}
    };

    const output = await new Promise((resolve, reject) => {
      const py = spawn(process.env.PYTHON_BIN || 'python3', [runnerPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      let stdout = '';
      let stderr = '';

      py.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
      py.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
      py.on('error', reject);
      py.on('close', (code) => {
        clearTimeout(timeout);
        if (code !== 0) {
          return reject(new Error(`Synastry engine failed: ${stderr}`));
        }
        try {
          return resolve(JSON.parse(stdout));
        } catch {
          return reject(new Error('Synastry engine returned invalid JSON.'));
        }
      });

      const timeout = setTimeout(() => {
        py.kill();
        reject(new Error('Synastry engine timed out.'));
      }, 5000);

      py.stdin.write(JSON.stringify(payload));
      py.stdin.end();
    });

    return res.json(output);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'server-error' });
  }
});

export default router;
