export default function handler(req, res) {
  const { p1 = 'Person 1', p2 = 'Person 2', score = '72', label = 'Strong Match' } = req.query;

  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1a1a2e"/>
        <stop offset="100%" stop-color="#16213e"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <text x="600" y="160" font-family="Georgia,serif" font-size="44" fill="#ffffff" text-anchor="middle" font-weight="bold">Match by Birth</text>
    <text x="600" y="270" font-family="Georgia,serif" font-size="60" fill="#f0c674" text-anchor="middle">${p1} &amp; ${p2}</text>
    <text x="600" y="400" font-family="Georgia,serif" font-size="130" fill="#ffffff" text-anchor="middle" font-weight="bold">${score}%</text>
    <text x="600" y="480" font-family="Georgia,serif" font-size="38" fill="#a0aec0" text-anchor="middle">${label}</text>
    <text x="600" y="580" font-family="Georgia,serif" font-size="26" fill="#718096" text-anchor="middle">matchbybirth.com</text>
  </svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.send(svg);
}
