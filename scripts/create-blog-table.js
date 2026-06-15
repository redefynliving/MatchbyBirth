const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Supabase credentials required');
  process.exit(1);
}

// Create blog_posts table
const sql = `
CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public to read
CREATE POLICY "Public read" ON blog_posts USING (true);

-- Enable updates
ALTER TABLE blog_posts REPLICA IDENTITY FULL;
`;

async function run() {
  // Execute SQL via Supabase REST
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'params=multiple-objects',
    },
    body: JSON.stringify({ sql }),
  });
  
  console.log('Status:', res.status);
  const text = await res.text();
  console.log(text);
}

run().catch(console.error);