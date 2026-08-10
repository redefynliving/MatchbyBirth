#!/usr/bin/env node
// Daily blog-drafts updater for macOS launchd.
// 1) git pull latest (cron pushes the ledger)
// 2) run the blog:drafts viewer, capturing its output
// 3) write a dated note into the Obsidian vault so the queue is always visible
//
// Safe to run manually: `node scripts/blog-drafts-daily.mjs`
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const vaultDir = process.env.VAULT_DIR || '/Users/alijahfox/Documents/OwlBrain';
const vaultNote = path.join(vaultDir, 'OWL', 'Blog Drafts Queue.md');

function run(cmd) {
  try { return execSync(cmd, { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); }
  catch (e) { return e.stdout || ''; }
}

function main() {
  run('git pull --rebase --quiet origin main');
  const out = run('npm run blog:drafts --silent');
  const ts = new Date().toISOString();
  const stamp = ts.slice(0, 10); // YYYY-MM-DD
  const header = `# Blog Drafts Queue\n\n_Last updated: ${ts} (auto, via launchd)_\n\n`;
  const body = out && out.trim() ? out.trim() : '(no output — run `npm run blog:drafts` manually)';
  fs.mkdirSync(path.dirname(vaultNote), { recursive: true });
  fs.writeFileSync(vaultNote, header + '```\n' + body + '\n```\n');
  console.log(`Wrote ${vaultNote}`);
}

main();
