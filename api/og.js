import sharp from 'sharp';

export default async function handler(req, res) {
  try {
    const { p1 = 'Person 1', p2 = 'Person 2', score = '72', label = 'Strong Match' } = req.query;

    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a1a2e"/>
            <stop offset="100%" style="stop-color:#16213e"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#bg)"/>
        <text x="600" y="180" font-family="serif" font-size="48" fill="#ffffff" text-anchor="middle" font-weight="bold">Match by Birth</text>
        <text x="600" y="280" font-family="serif" font-size="64" fill="#f0c674" text-anchor="middle">${p1} &amp; ${p2}</text>
        <text x="600" y="400" font-family="serif" font-size="120" fill="#ffffff" text-anchor="middle" font-weight="bold">${score}%</text>
        <text x="600" y="480" font-family="serif" font-size="40" fill="#a0aec0" text-anchor="middle">${label}</text>
        <text x="600" y="580" font-family="serif" font-size="28" fill="#718096" text-anchor="middle">matchbybirth.com</text>
      </svg>
    `;

    const png = await sharp(Buffer.from(svg)).png().toBuffer();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.status(200).send(png);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Failed to generate image');
  }
}
