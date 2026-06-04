import express from 'express';
import { z } from 'zod';
import { Resend } from 'resend';

const router = express.Router();

const bodySchema = z.object({ email: z.string().email() });

router.post('/', async (req, res) => {
  try {
    const parsed = bodySchema.parse(req.body);
    const { email } = parsed;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // In production we signal service misconfiguration. In non-production return 200 for local workflows.
      if (process.env.NODE_ENV === 'production') {
        console.error('RESEND_API_KEY not set in production');
        return res.status(503).json({ success: false, error: 'Email service not configured' });
      }
      console.warn('RESEND_API_KEY not set — skipping email send in non-production');
      return res.status(200).json({ success: true, fallback: true });
    }

    const resend = new Resend(apiKey);

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color: #111827;">
        <h1>✦ Welcome to Match by Birth</h1>
        <p>Welcome to Match by Birth. Every month we'll send you compatibility insights, your sign's relationship forecast, and more. In the meantime, try our free calculator at <a href="https://matchbybirth.com">matchbybirth.com</a>.</p>
      </div>
    `;

    await resend.emails.send({
      from: 'hello@matchbybirth.com',
      to: email,
      subject: '✦ Your Cosmic Compatibility Report is on its way',
      html
    });

    return res.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Invalid email' });
    }
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
