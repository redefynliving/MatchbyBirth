const fetch = globalThis.fetch || require('node-fetch');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }

    const { nameA, nameB, dobA, dobB, scores, email } = req.body || {};

    if (!nameA || !nameB || !dobA || !dobB) {
      return res.status(400).json({ ok: false, error: 'Missing required fields: nameA, nameB, dobA, dobB' });
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: 'Missing or invalid email' });
    }

    // Generate AI report via Anthropic Haiku
    let aiText = null;
    try {
      const key = process.env.ANTHROPIC_API_KEY;
      if (key) {
        const prompt = `You are an astrology compatibility expert. Write a clean, elegant compatibility report for two people. Do NOT use emojis. Do NOT use markdown symbols (no **, no #, no backticks). Use plain paragraph breaks only. Keep prose warm, specific, and succinct. Include an overall score out of 100 and a brief breakdown. Names: ${nameA} and ${nameB}. Birthdays: ${dobA} and ${dobB}. Scores: ${JSON.stringify(scores)}.`;

        const body = {
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }]
        };

        const resp = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        if (resp.ok) {
          const data = await resp.json();
          aiText = data?.content?.[0]?.text || null;
        } else {
          const text = await resp.text();
          console.error('Anthropic API error', resp.status, text);
        }
      } else {
        console.error('ANTHROPIC_API_KEY not set');
      }
    } catch (err) {
      console.error('Error calling Anthropic', err);
    }

    if (!aiText) {
      // Fallback plain text
      const overall = String(scores?.overall ?? 'N/A');
      aiText = `${nameA} and ${nameB} have an overall compatibility score of ${overall} out of 100.\n\nThis score reflects a balance of shared values and areas where the two of you may need to work on communication.\n\nUse the Match by Birth calculator for more details and a personalized breakdown.`;
    }

    // Processing rules:
    // - Remove emojis
    // - Strip markdown headings (#)
    // - Convert **bold** to <strong>
    // - Paragraph breaks -> <p> tags
    // - No raw markdown symbols or emojis visible

    // Remove emojis (Unicode Extended Pictographic)
    aiText = aiText.replace(/\p{Extended_Pictographic}/gu, '');

    // Normalize line endings
    aiText = aiText.replace(/\r\n?/g, '\n');

    // Strip leading heading markers (if any)
    aiText = aiText.replace(/^#{1,6}\s*/gm, '');

    // Prepare placeholders for bold segments so we can escape safely
    const boldReplacements = [];
    aiText = aiText.replace(/\*\*(.+?)\*\*/gs, (_, inner) => {
      const idx = boldReplacements.length;
      boldReplacements.push(inner);
      return `@@BOLD:${idx}@@`;
    });

    // Escape the remaining text
    const escaped = escapeHtml(aiText);

    // Restore bold placeholders with escaped inner text wrapped in <strong>
    const restored = escaped.replace(/@@BOLD:(\d+)@@/g, (_, n) => {
      const inner = boldReplacements[Number(n)] || '';
      return `<strong>${escapeHtml(inner)}</strong>`;
    });

    // Remove any stray single '*' or '`' characters
    const cleaned = restored.replace(/[*`]/g, '');

    // Split into paragraphs (double newlines) and render with serif font
    const paragraphs = cleaned.split(/\n\s*\n+/).map(p => p.trim()).filter(Boolean);

    const bodyHtml = paragraphs.map(p => {
      // collapse single newlines into spaces
      const content = p.replace(/\n+/g, ' ');
      return `<p style="font-family: Georgia, 'Times New Roman', serif; line-height:1.6; margin:0 0 16px 0; color:#111827;">${content}</p>`;
    }).join('\n');

    const overallScore = Number(scores?.overall ?? NaN);
    const scoreDisplay = Number.isFinite(overallScore) ? Math.round(overallScore) : 'N/A';

    const emailHtml = `
      <div style="background:#ffffff; width:100%; padding:24px 16px; -webkit-font-smoothing:antialiased;">
        <div style="max-width:600px; margin:0 auto; border-radius:8px; overflow:hidden; box-shadow:0 6px 18px rgba(16,24,40,0.06);">

          <div style="background:#1a1a2e; padding:18px 24px; text-align:center;">
            <h1 style="margin:0; font-family: 'Georgia', 'Times New Roman', serif; color:#ffffff; font-weight:600; font-size:20px;">Your Compatibility Report</h1>
          </div>

          <div style="background:#ffffff; padding:24px; text-align:center;">

            <div style="margin-bottom:18px;">
              <div style="font-family: 'Georgia', 'Times New Roman', serif; color:#7c3aed; font-size:28px; font-weight:700;">${escapeHtml(nameA)} &amp; ${escapeHtml(nameB)}</div>
            </div>

            <div style="display:flex; justify-content:center; align-items:center; gap:12px; margin-bottom:18px;">
              <div style="width:92px; height:92px; border-radius:46px; background:#f3f0ff; display:flex; align-items:center; justify-content:center;">
                <div style="font-family: 'Georgia', 'Times New Roman', serif; color:#4c1d95; font-size:28px; font-weight:700;">${escapeHtml(String(scoreDisplay))}</div>
              </div>
              <div style="font-size:14px; color:#6b7280;">/ 100</div>
            </div>

            <hr style="border:none;border-top:1px solid #eef2f7;margin:18px 0;" />

            <div style="text-align:left;">
              ${bodyHtml}
            </div>

          </div>

          <div style="background:#f9fafb; padding:12px 24px; text-align:center; font-size:12px; color:#6b7280;">
            Match by Birth · For entertainment purposes only
          </div>

        </div>
      </div>
    `;

    // Send via Resend
    try {
      const resendKey = process.env.RESEND_API_KEY;
      if (!resendKey) {
        console.error('Resend key missing');
        return res.status(200).json({ ok: true });
      }

      const payload = {
        from: 'support@matchbybirth.com',
        to: [email],
        subject: `Your Compatibility Report — ${nameA} & ${nameB}`,
        html: emailHtml
      };

      const sendResp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!sendResp.ok) {
        const text = await sendResp.text();
        console.error('Resend API error', sendResp.status, text);
        return res.status(200).json({ ok: true });
      }
    } catch (err) {
      console.error('Error sending email', err);
      return res.status(200).json({ ok: true });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('generate-report error', err);
    return res.status(200).json({ ok: true });
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
