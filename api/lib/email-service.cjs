'use strict';

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderReportEmail(report, reportUrl) {
  const sections = report.sections.map((section) => `
    <div style="margin:0 0 24px;">
      <h2 style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:1.6px;text-transform:uppercase;color:#756b82;margin:0 0 8px;">${escapeHtml(section.title)}</h2>
      <p style="font-family:Georgia,serif;font-size:16px;line-height:1.75;color:#26212b;margin:0;">${escapeHtml(section.body)}</p>
    </div>
  `).join('');

  return `
    <div style="background:#f8f4ee;padding:40px 16px;">
      <div style="max-width:600px;margin:0 auto;background:#fffdf9;border:1px solid #e8e0d6;border-radius:20px;padding:40px;">
        <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;text-align:center;color:#756b82;margin:0 0 24px;">Match by Birth</p>
        <h1 style="font-family:Georgia,serif;font-size:34px;font-weight:500;text-align:center;color:#26212b;margin:0 0 16px;">${escapeHtml(report.title)}</h1>
        <p style="font-family:Georgia,serif;font-size:17px;line-height:1.75;color:#4d4653;margin:0 0 32px;">${escapeHtml(report.overview)}</p>
        ${sections}
        <p style="font-family:Georgia,serif;font-size:16px;line-height:1.75;font-style:italic;color:#4d4653;margin:32px 0;">${escapeHtml(report.closing)}</p>
        <div style="text-align:center;margin-top:32px;">
          <a href="${escapeHtml(reportUrl)}" style="display:inline-block;background:#6d4ca0;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-weight:600;padding:14px 22px;border-radius:10px;">Open your private report</a>
        </div>
        <p style="font-family:Arial,sans-serif;font-size:11px;line-height:1.5;text-align:center;color:#8b8390;margin:28px 0 0;">For entertainment and reflection only. This is not professional relationship advice.</p>
      </div>
    </div>
  `;
}

async function sendReportEmail(input, options = {}) {
  const apiKey = options.apiKey ?? process.env.RESEND_API_KEY;
  const fetchImpl = options.fetchImpl || fetch;
  if (!apiKey) throw new Error('Email service is not configured.');

  const response = await fetchImpl('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': input.idempotencyKey,
    },
    body: JSON.stringify({
      from: 'Match by Birth <support@matchbybirth.com>',
      to: [input.to],
      subject: `Your Match by Birth report — ${String(input.report.title).slice(0, 120)}`,
      html: renderReportEmail(input.report, input.reportUrl),
    }),
  });

  if (!response.ok) {
    throw new Error(`Email provider failed with status ${response.status}.`);
  }

  return response.json();
}

module.exports = {
  escapeHtml,
  renderReportEmail,
  sendReportEmail,
};
