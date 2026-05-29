const fetch = globalThis.fetch || require('node-fetch');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }

    const { nameA, nameB, dobA, dobB, scores } = req.body || {};

    if (!nameA || !nameB || !dobA || !dobB) {
      return res.status(400).json({ ok: false, error: 'Missing required fields: nameA, nameB, dobA, dobB' });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(500).json({ ok: false, error: 'Server misconfiguration: GEMINI_API_KEY not set' });
    }

    const prompt = `You are an astrology compatibility expert. Given two people and their compatibility scores, write a warm, engaging 3-paragraph compatibility report in markdown. Names: ${nameA} and ${nameB}. Birthdays: ${dobA} and ${dobB}. Scores: ${JSON.stringify(scores)}. Be specific, fun, and avoid generic filler.`;

    const body = {
      contents: [
        {
          parts: [ { text: prompt } ]
        }
      ]
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('Gemini API error', resp.status, text);
      return res.status(502).json({ ok: false, error: 'AI provider error', details: text });
    }

    const data = await resp.json();
    const markdown = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!markdown) {
      return res.status(502).json({ ok: false, error: 'AI provider returned no completion', raw: data });
    }

    return res.status(200).json({ ok: true, markdown });
  } catch (err) {
    console.error('generate-report error', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};
