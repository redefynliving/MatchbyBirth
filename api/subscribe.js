export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, p1, p2, p1_dob, p2_dob, score, label, resultUrl } = req.body || {};

    // Validate email with a stricter regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // Fail gracefully if email provider is not configured
      return res.status(503).json({ success: false, error: 'Email service not configured' });
    }

    // Construct a revisit link. Prefer explicit resultUrl, otherwise reconstruct from params if present.
    let resultLink = 'https://matchbybirth.com';
    if (resultUrl && typeof resultUrl === 'string') {
      try {
        const parsed = new URL(resultUrl);
        // Prevent obviously malformed URLs; allow both http and https but default to https homepage when suspicious
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
          resultLink = parsed.toString();
        }
      } catch (e) {
        // ignore bad resultUrl
      }
    }

    // If no explicit resultUrl, try reconstructing from params.
    if (resultLink === 'https://matchbybirth.com' && p1 && p2 && p1_dob && p2_dob) {
      // Safely encode components
      const q = new URLSearchParams({ p1: p1, p1_dob: p1_dob, p2: p2, p2_dob: p2_dob });
      resultLink = `https://matchbybirth.com/result?${q.toString()}`;
    }

    // Determine score display and bound it between 0 and 100
    let numericScore = Number(score);
    if (!Number.isFinite(numericScore)) {
      numericScore = NaN;
    } else {
      numericScore = Math.max(0, Math.min(100, Math.round(numericScore)));
    }
    const scoreDisplay = Number.isFinite(numericScore) ? numericScore : 'N/A';

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

    const safeP1 = sanitizeText(p1);
    const safeP2 = sanitizeText(p2);
    const safeLabel = sanitizeText(label);

    const namesLine = (safeP1 && safeP2) ? `<div style=\"color:#374151; font-size:16px; margin-top:6px;\">${escapeHtml(safeP1)} &amp; ${escapeHtml(safeP2)}</div>` : '';
    const labelLine = safeLabel ? `<div style=\"color:#6b7280; font-size:14px; margin-top:4px;\">${escapeHtml(safeLabel)}</div>` : '';

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

    // Build plain-text fallback
    const plainTextBullets = bullets.join('\n- ');
    const text = [];
    text.push('Match by Birth');
    text.push('');
    text.push('Your compatibility result is in');
    text.push('');
    if (Number.isFinite(numericScore)) {
      text.push(`Your score: ${scoreDisplay}/100`);
    }
    if (safeP1 && safeP2) {
      text.push(`${sanitizeText(safeP1)} + ${sanitizeText(safeP2)}`);
    }
    if (safeLabel) {
      text.push(safeLabel);
    }
    text.push('');
    text.push('Here\'s a quick look at your connection based on your birth dates.');
    text.push('');
    text.push('- ' + plainTextBullets);
    text.push('');
    text.push(`View your result: ${resultLink}`);
    text.push('');
    text.push('For entertainment purposes only.');
    text.push(`Support: ${supportEmail}`);

    const payload = {
      from: 'support@matchbybirth.com',
      to: [email],
      subject,
      // Resend supports a preview_text property; include if desired
      preview_text: preview,
      html,
      text: text.join('\n')
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
      const textResp = await resp.text();
      console.error('Resend error', resp.status, textResp);
      return res.status(502).json({ success: false, error: 'Email service error' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    // Do not leak error details to client
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeText(s) {
  if (!s) return '';
  // Strip tags and collapse whitespace
  return String(s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

      return res.status(502).json({ success: false, error: 'Email service error' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    // Do not leak error details to client
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeText(s) {
  if (!s) return '';
  // Strip tags and collapse whitespace
  return String(s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}
