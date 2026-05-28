const fetch = globalThis.fetch || require('node-fetch');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { nameA, nameB, dobA, dobB, scores } = req.body || {};

    if (!nameA || !nameB || !dobA || !dobB) {
      return res.status(400).json({ error: 'Missing required fields: nameA, nameB, dobA, dobB' });
    }

    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
      return res.status(500).json({ error: 'Server misconfiguration: ANTHROPIC_API_KEY not set' });
    }

    const prompt = `You are an expert astrology writer. Produce a concise, well-structured markdown compatibility report for two people. Use the data exactly as provided. Output only markdown.

Input:
- nameA: ${nameA}
- nameB: ${nameB}
- dobA: ${dobA}
- dobB: ${dobB}
- synastry_scores: ${JSON.stringify(scores || {})}

Instructions:
- Title the report with both names.
- Include a brief summary (1-2 sentences) of overall compatibility.
- Provide sections: Summary, Strengths, Challenges, Practical advice.
- Keep the tone warm and non-judgmental.
- Keep it under ~700 words and use headings and bullet points where appropriate.

Return the markdown document only (no extraneous JSON or commentary).`;

    const body = {
      model: 'claude-haiku-4-5-20251001',
      prompt,
      max_tokens_to_sample: 2000,
      temperature: 0.7
    };

    const resp = await fetch('https://api.anthropic.com/v1/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('Anthropic API error', resp.status, text);
      return res.status(502).json({ error: 'AI provider error', details: text });
    }

    const data = await resp.json();
    // Support common response shapes
    const markdown = data.completion || data.completion?.[0]?.text || data.output || data.text || data.completion_text || (typeof data === 'string' ? data : undefined);

    if (!markdown) {
      return res.status(502).json({ error: 'AI provider returned no completion', raw: data });
    }

    return res.status(200).json({ ok: true, markdown });
  } catch (err) {
    console.error('generate-report error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
