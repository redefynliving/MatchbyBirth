'use strict';

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
      <h2 style="font-family:Georgia,serif;font-size:22px;font-weight:600;margin:0 0 8px;"><a href="https://matchbybirth.com/blog/${escapeHtml(post.slug)}" style="color:#26212b;text-decoration:none;">${escapeHtml(post.title)}</a></h2>
      <p style="font-family:Georgia,serif;font-size:15px;line-height:1.6;color:#4d4653;margin:0 0 12px;">${escapeHtml(post.description)}</p>
      <a href="https://matchbybirth.com/blog/${escapeHtml(post.slug)}" style="display:inline-block;color:#6c4de6;font-weight:600;font-size:14px;text-decoration:none;">Read more →</a>
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
            <a href="https://matchbybirth.com" style="display:inline-block;background:#6c4de6;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-weight:600;padding:14px 28px;border-radius:10px;">Try the Compatibility Calculator</a>
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

module.exports = {
  renderNewsletterEmail,
};