export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, p1, p2, p1_dob, p2_dob, score, label, resultUrl } = req.body || {};
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Invalid email' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'Resend API key not configured' });
    }

    // Construct a revisit link. Prefer explicit resultUrl, otherwise reconstruct from params if present.
    let resultLink = 'https://matchbybirth.com';
    if (resultUrl && typeof resultUrl === 'string' && resultUrl.startsWith('http')) {
      resultLink = resultUrl;
    } else if (p1 && p2 && p1_dob && p2_dob) {
      resultLink = `https://matchbybirth.com/result?p1=${encodeURIComponent(p1)}&p1_dob=${encodeURIComponent(p1_dob)}&p2=${encodeURIComponent(p2)}&p2_dob=${encodeURIComponent(p2_dob)}`;
    }

    // Determine score display
    const numericScore = Number(score);
    const scoreDisplay = Number.isFinite(numericScore) ? Math.round(numericScore) : 'N/A';

    // Determine score band bullets
    let bullets = [];
    if (Number.isFinite(numericScore)) {
      if (numericScore >= 85) {
        bullets = ['Strong chemistry', 'Natural emotional alignment', 'High long-term potential'];
      } else if (numericScore >= 70) {
        bullets = ['Strong attraction with room to grow', 'Good communication potential', 'Promising long-term compatibility'];
      } else if (numericScore >= 50) {
        bullets = ['Mixed compatibility with some strong areas', 'Communication may require intention', 'Growth depends on effort and timing'];
      } else {
        bullets = ['Different emotional rhythms', 'Connection may feel unpredictable', 'Better suited for reflection than idealization'];
      }
    } else {
      bullets = ['Quick score breakdown will appear here once you run the calculator.', 'Revisit your result to get a personalized summary.', 'Results are free and for entertainment purposes only.'];
    }

    const supportEmail = process.env.SUPPORT_EMAIL || 'support@matchbybirth.com';

    const subject = 'Your Match by Birth compatibility result';
    const preview = "Here’s your score, summary, and a link to revisit your results.";

    const namesLine = (p1 && p2) ? `<div style=\"color:#374151; font-size:16px; margin-top:6px;\">${escapeHtml(p1)} &amp; ${escapeHtml(p2)}</div>` : '';
    const labelLine = label ? `<div style=\"color:#6b7280; font-size:14px; margin-top:4px;\">${escapeHtml(label)}</div>` : '';

    const bulletsHtml = bullets.map(b => `<li style=\"margin-bottom:8px; color:#111827;\">${escapeHtml(b)}</li>`).join('');

    const upsellExists = !!process.env.PREMIUM_FLOW || false;
    const upsellHtml = upsellExists ? `<div style=\"margin-top:12px; font-size:13px;\"><a href=\"https://matchbybirth.com/premium\" style=\"color:#7c3aed; text-decoration:none;\">Unlock the full premium report</a></div>` : '';

    const html = `
      <div style="background:#ffffff; padding:28px 12px;">
        <div style="max-width:560px; margin:0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="text-align:center; color:#9ca3af; font-size:11px; letter-spacing:2px; text-transform:uppercase;">Match by Birth</div>
          <h2 style="text-align:center; color:#111827; font-size:20px; margin-top:8px;">Your compatibility result is in</h2>

          <div style="text-align:center; margin-top:12px;">
            <div style="font-family: Georgia, 'Times New Roman', serif; color:#4c1d95; font-size:28px; line-height:1;">${escapeHtml(String(scoreDisplay))}/100</div>
            ${namesLine}
            ${labelLine}
          </div>

          <p style="color:#374151; font-size:15px; margin-top:16px;">Here’s a quick look at your connection based on your birth dates.</p>

          <ul style="margin-top:12px; padding-left:18px;">
            ${bulletsHtml}
          </ul>

          <div style="text-align:center; margin-top:18px;">
            <a href="${escapeHtml(resultLink)}" style="background:#7c3aed; color:white; text-decoration:none; padding:12px 20px; border-radius:8px; display:inline-block; font-weight:600;">View My Full Result</a>
            ${upsellHtml}
          </div>

          <p style="color:#6b7280; font-size:12px; margin-top:18px; text-align:center;">For entertainment purposes only.</p>
          <p style="color:#9ca3af; font-size:12px; text-align:center;">Need help? <a href=\"mailto:${escapeHtml(supportEmail)}\" style=\"color:#7c3aed; text-decoration:none;\">${escapeHtml(supportEmail)}</a></p>
        </div>
      </div>
    `;

    const payload = {
      from: 'support@matchbybirth.com',
      to: [email],
      subject,
      // Resend supports a preview_text property; include if desired
      preview_text: preview,
      html
    };

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('Resend error', resp.status, text);
      return res.status(502).json({ success: false, error: 'Email service error' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}
