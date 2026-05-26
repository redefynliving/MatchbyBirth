/**
 * Integration test: starts the API server and verifies the /health endpoint responds.
 * Used by CI (node-integration-test job).
 */
import { spawn } from 'child_process';
import { setTimeout as sleep } from 'timers/promises';

const PORT = process.env.PORT || 3002;
const BASE_URL = `http://localhost:${PORT}`;
const MAX_WAIT_MS = 15_000;
const POLL_MS = 500;

async function waitForServer() {
  const deadline = Date.now() + MAX_WAIT_MS;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      if (res.ok || res.status < 500) return true;
    } catch {
      // not up yet
    }
    await sleep(POLL_MS);
  }
  return false;
}

async function run() {
  console.log(`[integration] Starting API server on port ${PORT}…`);

  const server = spawn('node', ['src/main.js'], {
    cwd: new URL('../../', import.meta.url).pathname,
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'inherit',
  });

  let exitCode = 0;

  try {
    const ready = await waitForServer();
    if (!ready) {
      console.error(`[integration] ✗ Server did not become ready within ${MAX_WAIT_MS}ms`);
      exitCode = 1;
    } else {
      console.log('[integration] Server is up. Running checks…');

      // Health check
      const health = await fetch(`${BASE_URL}/health`);
      if (!health.ok) {
        console.error(`[integration] ✗ /health returned ${health.status}`);
        exitCode = 1;
      } else {
        console.log('[integration] ✓ /health OK');
      }

      // 404 for unknown routes
      const notFound = await fetch(`${BASE_URL}/nonexistent-route`);
      if (notFound.status !== 404) {
        console.error(`[integration] ✗ expected 404 for unknown route, got ${notFound.status}`);
        exitCode = 1;
      } else {
        console.log('[integration] ✓ unknown route returns 404');
      }
    }
  } finally {
    server.kill('SIGTERM');
  }

  if (exitCode !== 0) {
    console.error('[integration] ✗ Integration tests FAILED');
    process.exit(exitCode);
  }
  console.log('[integration] ✓ All integration checks passed');
}

run().catch((err) => {
  console.error('[integration] Unexpected error:', err);
  process.exit(1);
});
