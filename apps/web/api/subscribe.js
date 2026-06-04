import Resend from 'resend';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const bodySchema = z.object({
  email: z.string().email(),
  p1: z.string().optional(),
  p2: z.string().optional(),
  p1_dob: z.string().optional(),
  p2_dob: z.string().optional(),
  score: z.string().optional(),
  label: z.string().optional(),
  resultUrl: z.string().optional(),
});

function buildEmail({ email, p1, p2, p1_dob, p2_dob, score, label, resultUrl }) {
  const subject = `✦ Your Compatibility Mini-Report${p1 && p2 ? `: ${p1} & ${p2}` : ''}`;
  const title = 'Your Compatibility Mini-Report';

  const htmlParts = [];
  htmlParts.push(`<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color: #111827;">`);
  htmlParts.push(`<h1>✦ ${title}</h1>`);

  if (p1 || p2) {
    htmlParts.push(`<p><strong>Names:</strong> ${p1 || '-'} ${p2 ? ' & ' + p2 : ''}</p>`);
  }
  if (p1_dob || p2_dob) {
    htmlParts.push(`<p><strong>Birth dates:</strong> ${p1_dob || '-'} ${p2_dob ? ' & ' + p2_dob : ''}</p>`);
  }
  if (score) {
    htmlParts.push(`<p><strong>Score:</strong> <span style="color:#7c3aed; font-weight:700">${score}%</span></p>`);
  }
  if (label) {
    htmlParts.push(`<p><strong>Summary:</strong> ${label}</p>`);
  }
  if (resultUrl) {
    htmlParts.push(`<p>You can revisit your full result here: <a href="${resultUrl}">${resultUrl}</a></p>`);
  }

  htmlParts.push(`<p>Thanks for trying Match by Birth — visit <a href="https://matchbybirth.com">matchbybirth.com</a> for more.</p>`);
  htmlParts.push(`</div>`);

  const html = htmlParts.join('\n');

  const textParts = [];
  textParts.push(`${title}\n\n`);
  if (p1 || p2) textParts.push(`Names: ${p1 || '-'} ${p2 ? '& ' + p2 : ''}`);
  if (p1_dob || p2_dob) textParts.push(`Birth dates: ${p1_dob || '-'} ${p2_dob ? '& ' + p2_dob : ''}`);
  if (score) textParts.push(`Score: ${score}%`);
  if (label) textParts.push(`Summary: ${label}`);
  if (resultUrl) textParts.push(`Result URL: ${resultUrl}`);
  textParts.push('\nThanks for trying Match by Birth — visit https://matchbybirth.com for more.');

  const text = textParts.join('\n');

  return { subject, html, text };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const parsed = bodySchema.parse(req.body);
    const { email } = parsed;

    const apiKey = process.env.RESEND_API_KEY;

    const { subject, html, text } = buildEmail(parsed);

    if (!apiKey) {
      // In production, fail loudly so callers know email wasn't sent. In non-production, fall back to writing a file for inspection.
      if (process.env.NODE_ENV === 'production') {
        console.error('RESEND_API_KEY not set in production');
        return res.status(503).json({ success: false, error: 'Email service not configured' });
      }
      try {
        const outDir = path.resolve(process.cwd(), 'tmp', 'fake_emails');
        fs.mkdirSync(outDir, { recursive: true });
        const filename = path.join(outDir, `${Date.now()}-${email.replace(/[^a-z0-9@.-]/gi, '_')}.json`);
        fs.writeFileSync(filename, JSON.stringify({ to: email, subject, html, text, meta: parsed }, null, 2));
        console.warn(`RESEND_API_KEY not set — wrote email to ${filename}`);
        return res.status(200).json({ success: true, fallback: true, file: filename });
      } catch (writeErr) {
        console.error('Failed to write fallback email:', writeErr);
        return res.status(500).json({ success: false, error: 'Server error (fallback failed)' });
      }
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: 'hello@matchbybirth.com',
      to: email,
      subject,
      html,
      text,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Invalid request payload' });
    }
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}
