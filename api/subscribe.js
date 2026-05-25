export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email } = req.body || {};
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Invalid email' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'Resend API key not configured' });
    }

    const payload = {
      from: 'hello@matchbybirth.com',
      to: email,
      subject: '✦ Your Cosmic Compatibility Report is on its way',
      html: '<h1>Welcome to Match by Birth</h1><p>Every month we will send you compatibility insights, your sign\'s relationship forecast, and more. In the meantime, try our free calculator at <a href="https://matchbybirth.com">matchbybirth.com</a></p>'
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
