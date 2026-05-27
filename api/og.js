module.exports = function handler(req, res) {
  try {
    const url = new URL(req.url, 'http://localhost');
    const p1 = url.searchParams.get('p1') || 'Person 1';
    const p2 = url.searchParams.get('p2') || 'Person 2';
    const score = url.searchParams.get('score') || '72';
    const label = url.searchParams.get('label') || 'Strong Match';

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
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
    res.statusCode = 200;
    res.end(svg);
  } catch (err) {
    console.error('og handler error', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
};
