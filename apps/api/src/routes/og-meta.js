import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  const { p1, p2, score, group } = req.query;

  // Handle group results
  if (group) {
    const groupData = group.split(',');
    
    // Validate group data format (pairs of Name,DOB)
    if (groupData.length < 4 || groupData.length % 2 !== 0) {
      return res.status(400).json({ error: 'Invalid group format. Expected: Name1,DOB1,Name2,DOB2,...' });
    }

    // Parse group members
    const members = [];
    for (let i = 0; i < groupData.length; i += 2) {
      const name = groupData[i]?.trim();
      const dob = groupData[i + 1]?.trim();
      
      if (!name || !dob) {
        return res.status(400).json({ error: 'Invalid group format. Each member must have a name and DOB.' });
      }
      
      members.push({ name, dob });
    }

    // Calculate group vibe score (mock calculation - can be replaced with actual logic)
    const groupVibeScore = Math.floor(Math.random() * 41) + 60; // Random score between 60-100 for demo

    const groupNames = members.map(m => m.name).join(' & ');
    const ogTitle = `Our friend group is ${groupVibeScore}% compatible 👀`;
    const ogDescription = 'Check out our group compatibility score and see which pairs are most compatible!';
    const ogImage = 'https://matchbybirth.com/og-group-image.png';
    const twitterCard = 'summary_large_image';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta property="og:title" content="${escapeHtml(ogTitle)}">
  <meta property="og:description" content="${escapeHtml(ogDescription)}">
  <meta property="og:image" content="${escapeHtml(ogImage)}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="${escapeHtml(twitterCard)}">
  <meta name="twitter:title" content="${escapeHtml(ogTitle)}">
  <meta name="twitter:description" content="${escapeHtml(ogDescription)}">
  <meta name="twitter:image" content="${escapeHtml(ogImage)}">
  <title>${escapeHtml(ogTitle)}</title>
</head>
<body>
  <h1>${escapeHtml(groupNames)}</h1>
  <p>Group Compatibility Score: ${groupVibeScore}%</p>
</body>
</html>
    `.trim();

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(htmlContent);
    return;
  }

  // Handle 2-person results (existing logic)
  if (!p1 || !p2 || score === undefined) {
    return res.status(400).json({ error: 'Missing required query parameters: p1, p2, and score' });
  }

  // Validate score is a valid number
  const scoreNum = Number(score);
  if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
    return res.status(400).json({ error: 'Score must be a valid number between 0 and 100' });
  }

  const ogTitle = `${p1} & ${p2} are ${scoreNum}% compatible 👀`;
  const ogDescription = 'Check out our compatibility score!';
  const ogImage = 'https://matchbybirth.com/og-image.png';
  const twitterCard = 'summary_large_image';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta property="og:title" content="${escapeHtml(ogTitle)}">
  <meta property="og:description" content="${escapeHtml(ogDescription)}">
  <meta property="og:image" content="${escapeHtml(ogImage)}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="${escapeHtml(twitterCard)}">
  <meta name="twitter:title" content="${escapeHtml(ogTitle)}">
  <meta name="twitter:description" content="${escapeHtml(ogDescription)}">
  <meta name="twitter:image" content="${escapeHtml(ogImage)}">
  <title>${escapeHtml(ogTitle)}</title>
</head>
<body>
  <h1>${escapeHtml(p1)} & ${escapeHtml(p2)}</h1>
  <p>Compatibility Score: ${scoreNum}%</p>
</body>
</html>
  `.trim();

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(htmlContent);
});

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

export default router;