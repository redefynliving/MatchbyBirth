const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Read posts from the index.js file
const postsFile = path.join(__dirname, '../apps/web/src/data/posts/index.js');
const content = fs.readFileSync(postsFile, 'utf8');

// Extract post data using regex
const slugRegex = /slug:\s*'([^']+)'/g;
const titleRegex = /title:\s*'([^']+)'/g;
const descRegex = /description:\s*'([^']+)'/g;
const catRegex = /category:\s*'([^']+)'/g;

const slugs = [...content.matchAll(slugRegex)].map(m => m[1]);
const titles = [...content.matchAll(titleRegex)].map(m => m[1]);
const descs = [...content.matchAll(descRegex)].map(m => m[1]);
const cats = [...content.matchAll(catRegex)].map(m => m[1]);

const posts = slugs.map((slug, i) => ({
  slug,
  title: titles[i] || '',
  description: descs[i] || '',
  category: cats[i] || null,
}));

console.log(`Found ${posts.length} posts to sync`);

async function sync() {
  // Delete existing posts first (clean sync)
  const delRes = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?id=gt.0`, {
    method: 'DELETE',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  console.log('DELETE status:', delRes.status);

  // Insert all posts
  const insRes = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(posts),
  });
  console.log('INSERT status:', insRes.status);
  if (!insRes.ok) {
    const text = await insRes.text();
    console.error('INSERT error:', text);
    process.exit(1);
  }

  console.log(`✓ Synced ${posts.length} posts to Supabase`);
}

sync().catch(err => {
  console.error(err);
  process.exit(1);
});