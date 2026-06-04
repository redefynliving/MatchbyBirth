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

    // Generate AI report via Anthropic
    let aiText = null;
    try {
      const key = process.env.ANTHROPIC_API_KEY;
      if (key) {
        // System prompt (per user request): instruct model to write like a personal letter.
        const systemPrompt = "Write as if you are writing a personal, intimate letter directly to this couple. Use 'you' and 'your' throughout. No headers, no bullet points, no section titles. Three paragraphs of flowing prose. Warm, specific, emotionally resonant. No emojis. No markdown.";

        const userPrompt = `You are an astrology compatibility expert. Write a clean, elegant compatibility report as a personal letter for two people named ${nameA} and ${nameB}. Use plain paragraphs only. Mention the birthdays: ${dobA} and ${dobB}. If a numeric overall score is available, include it naturally in the prose. Avoid markdown, emojis, headings, lists, buttons, or CTAs. Keep the tone intimate, luxurious, and emotionally specific.`;

        const body = {
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          system: systemPrompt,
          messages: [
            { role: 'user', content: userPrompt }
          ]
        };

        console.log('Anthropic request body:', JSON.stringify(body));

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
      aiText = `${nameA} and ${nameB} have an overall compatibility score of ${overall} out of 100.\n\nThis score reflects a balance of shared values and areas where the two of you may need to work on communication.\n\nUse Match by Birth for a personalized breakdown.`;
    }

    // Sanitization and paragraph handling
    // - Remove emojis
    // - Normalize line endings
    // - Strip heading markers
    // - Remove stray backticks

    aiText = aiText.replace(/[\u{1F300}-\u{1FFFF}]/gu, '').replace(/[\u{2600}-\u{26FF}]/gu, '').trim();
    aiText = aiText.replace(/\r\n?/g, '\n');
    aiText = aiText.replace(/^#{1,6}\s*/gm, '');
    aiText = aiText.replace(/`/g, '');

    // Split into paragraphs. The system prompt asks for three paragraphs; preserve whatever the model returns.
    const paragraphs = aiText.split(/\n\s*\n+/).map(p => p.trim()).filter(Boolean);

    // Render paragraphs with the requested typography
    const paragraphHtml = paragraphs.map(p => {
      const content = escapeHtml(p).replace(/\n+/g, ' ');
      return `<p style="font-family: Georgia, 'Times New Roman', serif; font-size:16px; line-height:1.8; margin:0 0 24px 0; color:#1f2937;">${content}</p>`;
    }).join('\n');

    const overallScore = Number(scores?.overall ?? NaN);
    const scoreDisplay = Number.isFinite(overallScore) ? Math.round(overallScore) : 'N/A';

    // Build the email HTML following the luxury minimal letter design
    const emailHtml = `
      <div style="background:#ffffff; width:100%; padding:48px 16px; -webkit-font-smoothing:antialiased;">
        <div style="max-width:560px; margin:0 auto;">

          <div style="text-align:center; color:#9ca3af; font-family: Arial, Helvetica, sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase;">Match by Birth</div>
          <hr style="border:none; border-top:1px solid #e5e7eb; margin:12px 0 28px 0;" />

          <div style="text-align:center; margin-bottom:24px; font-family: Georgia, 'Times New Roman', serif;">
            <div style="color:#4c1d95; font-size:32px; line-height:1;">${escapeHtml(nameA)} &amp; ${escapeHtml(nameB)}</div>
            <div style="color:#7c3aed; font-size:64px; font-weight:700; line-height:1; margin-top:8px;">${escapeHtml(String(scoreDisplay))}</div>
            <div style="color:#6b7280; font-size:11px; letter-spacing:2px; text-transform:uppercase; margin-top:6px;">COMPATIBILITY SCORE</div>
          </div>

          <hr style="border:none; border-top:1px solid #e5e7eb; margin:8px 0 28px 0;" />

          <div style="font-family: Georgia, 'Times New Roman', serif; font-size:16px; line-height:1.8; color:#1f2937;">
            ${paragraphHtml}
          </div>

          <div style="text-align:center; margin-top:12px; font-style:italic; color:#6b7280; font-family: Georgia, 'Times New Roman', serif;">The stars don't decide your story. They just help you understand it.</div>

          <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0 16px 0;" />

          <div style="text-align:center; color:#9ca3af; font-size:12px; font-family: Arial, Helvetica, sans-serif;">Match by Birth · For entertainment purposes only</div>

        </div>
      </div>
    `;

    // Send via Resend
    try {
      const resendKey = process.env.RESEND_API_KEY;
      if (!resendKey) {
        console.error('Resend key missing');
        // Fail loudly so callers know email didn't send
        return res.status(500).json({ ok: false, error: 'Server misconfiguration: RESEND_API_KEY not set' });
      }

      const payload = {
        from: 'support@matchbybirth.com',
        to: [email],
        subject: (`Your Compatibility Report — ${nameA} & ${nameB}`).replace(/[^\w\s\-&.,:;!()?]/g, ''),
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
        // Surface a provider error to clients while avoiding leaking details
        return res.status(502).json({ ok: false, error: 'Email provider error' });
      }

      // Try to capture provider response id for tracing (if provided)
      let providerId = null;
      try {
        const sendJson = await sendResp.json();
        providerId = sendJson?.id || sendJson?.messageId || null;
        if (providerId) console.log('Resend send id:', providerId);
      } catch (e) {
        // non-json or empty body — ignore
      }

      return res.status(200).json({ ok: true, provider_id: providerId });
    } catch (err) {
      console.error('Error sending email', err);
      return res.status(500).json({ ok: false, error: 'Email send failed' });
    }
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
