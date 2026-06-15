'use strict';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_KEY = process.env.RESEND_API_KEY;
const APP_URL = process.env.APP_URL || 'https://matchbybirth.com';

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderNewsletterEmail(posts, unsubscribeUrl) {
  const postItems = posts.map((post) => `
    <div style="margin:0 0 24px;padding:20px;border:1px solid #e8e0d6;border-radius:16px;background:#fffdf9;">
      <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#756b82;margin:0 0 8px;">${escapeHtml(post.category || 'Astrology')}</p>
      <h2 style="font-family:Georgia,serif;font-size:22px;font-weight:600;margin:0 0 8px;"><a href="${APP_URL}/blog/${escapeHtml(post.slug)}" style="color:#26212b;text-decoration:none;">${escapeHtml(post.title)}</a></h2>
      <p style="font-family:Georgia,serif;font-size:15px;line-height:1.6;color:#4d4653;margin:0 0 12px;">${escapeHtml(post.description)}</p>
      <a href="${APP_URL}/blog/${escapeHtml(post.slug)}" style="display:inline-block;color:#6c4de6;font-weight:600;font-size:14px;text-decoration:none;">Read more →</a>
    </div>
  `).join('\n');

  const weekOf = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return `
    <div style="background:#f8f4ee;padding:40px 16px;">
      <div style="max-width:600px;margin:0 auto;">
        <div style="background:#fffdf9;border:1px solid #e8e0d6;border-radius:20px;padding:40px;">
          <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;text-align:center;color:#756b82;margin:0 0 8px;">Match by Birth</p>
          <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:500;text-align:center;color:#26212b;margin:0 0 8px;">Your Weekly Astrology Digest</h1>
          <p style="font-family:Georgia,serif;font-size:15px;text-align:center;color:#756b82;margin:0 0 32px;">Week of ${weekOf}</p>
          ${postItems}
          <div style="text-align:center;margin-top:32px;padding-top:24px;border-top:1px solid #e8e0d6;">
            <a href="${APP_URL}" style="display:inline-block;background:#6c4de6;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-weight:600;padding:14px 28px;border-radius:10px;">Try the Compatibility Calculator</a>
          </div>
          <p style="font-family:Arial,sans-serif;font-size:11px;line-height:1.6;text-align:center;color:#8b8390;margin:24px 0 0;">
            You're receiving this because you subscribed to Match by Birth updates.<br>
            <a href="${escapeHtml(unsubscribeUrl)}" style="color:#6c4de6;">Unsubscribe</a> at any time.
          </p>
        </div>
      </div>
    </div>
  `;
}

async function sendToResend(to, subject, html) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Match by Birth <support@matchbybirth.com>',
      to: [to],
      subject,
      html,
    }),
  });
  return response.ok;
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY || !RESEND_KEY) {
    console.error('Missing required env vars');
    process.exit(1);
  }

  // Get latest 3 blog posts (from Supabase or fallback to static)
  let posts;
  try {
    const postsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,title,description,category&order=created_at.desc&limit=3`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    posts = await postsRes.json();
  } catch {
    console.error('Failed to fetch blog posts from Supabase — table may not exist yet');
    process.exit(1);
  }

  if (!posts || posts.length === 0) {
    console.log('No blog posts found');
    process.exit(0);
  }

  // Get active subscribers
  const subsRes = await fetch(
    `${SUPABASE_URL}/rest/v1/email_subscribers?select=email&unsubscribed_at=is.null&limit=80`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  const subscribers = await subsRes.json();

  if (subscribers.length === 0) {
    console.log('No active subscribers');
    process.exit(0);
  }

  let sent = 0;
  let failed = 0;

  for (const sub of subscribers) {
    const unsubUrl = `${APP_URL}/unsubscribe?email=${encodeURIComponent(sub.email)}`;
    const html = renderNewsletterEmail(posts, unsubUrl);

    const ok = await sendToResend(sub.email, 'Your weekly astrology digest', html);
    if (ok) {
      sent++;
    } else {
      failed++;
    }
  }

  console.log(`Newsletter sent: ${sent} success, ${failed} failed, ${subscribers.length} total`);
}

main().catch((err) => {
  console.error('Newsletter job failed:', err);
  process.exit(1);
});