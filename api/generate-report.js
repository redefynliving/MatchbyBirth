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
    let markdown = null;
    try {
      const key = process.env.ANTHROPIC_API_KEY;
      if (key) {
        const prompt = `You are an astrology compatibility expert. Given two people and their compatibility scores, write a warm, engaging 3-paragraph compatibility report in markdown. Names: ${nameA} and ${nameB}. Birthdays: ${dobA} and ${dobB}. Scores: ${JSON.stringify(scores)}. Be specific, fun, and avoid generic filler.`;

        const body = {
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          messages: [{ role: "user", content: prompt }]
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
          // Response path: response.content[0].text
          markdown = data?.content?.[0]?.text || null;
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

    if (!markdown) {
      // Fallback markdown if AI fails
      markdown = `## ${escapeHtml(nameA)} & ${escapeHtml(nameB)}\n\nWe couldn't generate a full AI report right now, but here's a quick summary based on the scores you saw.\n\nOverall: ${escapeHtml(String(scores?.overall ?? 'N/A'))}/100\n\nThanks for trying Match by Birth!`;
    }

    // Convert basic markdown (headings + paragraphs) to minimal HTML
    const html = markdown
      .split('\n\n')
      .map((block) => {
        if (/^#{1,6}\s+/.test(block)) {
          const m = block.match(/^(#{1,6})\s+(.*)$/);
          const level = Math.min(m[1].length, 6);
          return `<h${level} style="color:#7c3aed;">${escapeHtml(m[2])}</h${level}>`;
        }
        return `<p>${escapeHtml(block).replace(/\n/g, '<br/>')}</p>`;
      })
      .join('');

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827;">
        <h2 style="color:#7c3aed;">Your Match by Birth Report</h2>
        <p>Hi there —</p>
        ${html}
        <p style="color:#6b7280; font-size:12px;">If you didn't request this email, you can safely ignore it.</p>
        <hr />
        <div style="margin-top:12px;">
          <p style="font-weight:bold;">Want weekly compatibility updates?</p>
          <p>Get a weekly compatibility summary straight to your inbox.</p>
          <p><a href="https://matchbybirth.com/premium" style="color:#ffffff; background:#7c3aed; padding:10px 14px; border-radius:6px; text-decoration:none; display:inline-block;">Get your weekly compatibility update — $4.99/mo</a></p>
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
        subject: `✨ Your Match by Birth Report -- ${nameA} & ${nameB}`,
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
        // Don't expose error to client
        return res.status(200).json({ ok: true });
      }
    } catch (err) {
      console.error('Error sending email', err);
      return res.status(200).json({ ok: true });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('generate-report error', err);
    // Always return success to the client to avoid exposing errors
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
