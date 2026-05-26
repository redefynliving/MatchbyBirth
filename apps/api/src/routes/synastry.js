import express from 'express';
import { spawn } from 'child_process';
import { synastryRateLimit } from '../middleware/synastry-rate-limit.js';
import { validateSynastry } from '../middleware/validate-synastry.js';

const router = express.Router();

// POST /api/synastry
// Body: { chartA: {...}, chartB: {...}, options: {...} }
router.post('/', synastryRateLimit, validateSynastry, async (req, res) => {
  try {
    const payload = {
      chartA: req.body.chartA || {},
      chartB: req.body.chartB || {},
      options: req.body.options || {}
    };

    const py = spawn('python3', ['apps/api/src/astro/run_synastry.py'], { stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';

    py.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    py.stderr.on('data', (chunk) => { stderr += chunk.toString(); });

    py.on('close', (code) => {
      if (code !== 0) {
        console.error('synastry python exit', code, stderr);
        const err = new Error('scoring-failure');
        err.code = 'ENGINE_ERROR';
        err.details = { stderr };
        err.status = 500;
        throw err;
      }
      try {
        const out = JSON.parse(stdout);
        return res.json(out);
      } catch (e) {
        console.error('invalid json from synastry runner', e, stdout, stderr);
        const err = new Error('bad-output');
        err.code = 'BAD_OUTPUT';
        err.details = { stdout, stderr };
        err.status = 500;
        throw err;
      }
    });

    // write payload and close stdin
    py.stdin.write(JSON.stringify(payload));
    py.stdin.end();

    // safety: kill if it runs too long (5s)
    setTimeout(() => {
      try { py.kill(); } catch (e) {}
    }, 5000);

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'server-error' });
  }
});

export default router;
