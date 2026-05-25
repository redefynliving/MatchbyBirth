import Resend from 'resend';
import { z } from 'zod';

const bodySchema = z.object({ email: z.string().email() });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const parsed = bodySchema.parse(req.body);
    const { email } = parsed;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'Resend API key not configured' });
    }

    const resend = new Resend(apiKey);

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color: #111827;">
        <h1>✦ Welcome to Match by Birth</h1>
        <p>Welcome to Match by Birth. Every month we'll send you compatibility insights, your sign's relationship forecast, and more. In the meantime, try our free calculator at <a href="https://matchbybirth.com">matchbybirth.com</a></p>
      </div>
    `;

    await resend.emails.send({
      from: 'hello@matchbybirth.com',
      to: email,
      subject: '✦ Your Cosmic Compatibility Report is on its way',
      html
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Invalid email' });
    }
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}
