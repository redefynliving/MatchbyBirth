const fetch = globalThis.fetch || require('node-fetch');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, p1, p2, p1_dob, p2_dob, score } = req.body || {};

    // Basic email validation
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    if (!p1 || !p2 || !p1_dob || !p2_dob) {
      return res.status(400).json({ error: 'Missing required fields: p1, p2, p1_dob, p2_dob' });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return res.status(500).json({ error: 'Server misconfiguration: RESEND_API_KEY not set' });
    }

    const resultLink = `https://matchbybirth.com/result?p1=${encodeURIComponent(p1)}&p1_dob=${encodeURIComponent(p1_dob)}&p2=${encodeURIComponent(p2)}&p2_dob=${encodeURIComponent(p2_dob)}`;

    const subject = '✦ Your Match by Birth result — save this link';

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827;">
        <h2 style="color:#7c3aed;">Your Match by Birth result</h2>
        <p>Hi there —</p>
        <p>Thanks for using Match by Birth. Here are the details you asked to save:</p>
        <ul>
          <li><strong>${escapeHtml(p1)}</strong> — ${escapeHtml(p1_dob)}</li>
          <li><strong>${escapeHtml(p2)}</strong> — ${escapeHtml(p2_dob)}</li>
        </ul>
        <p><strong>Score:</strong> ${escapeHtml(String(score ?? 'N/A'))}</p>
        <p>You can revisit your result any time using the link below:</p>
        <p><a href="${resultLink}" style="color:#111827; background:#f3e8ff; padding:8px 12px; border-radius:6px; text-decoration:none;">View your Match by Birth result</a></p>
        <p style="color:#6b7280; font-size:12px;">If you didn't request this email, you can safely ignore it.</p>
      </div>
    `;

    const payload = {
      from: 'support@matchbybirth.com',
      to: [email],
      subject,
      html
    };

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('Resend API error', resp.status, text);
      return res.status(502).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('save-result error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
