export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(204).end();
  try {
    const body = req.body || await new Promise((r, j) => {
      let data = '';
      req.on('data', (c) => data += c);
      req.on('end', () => r(data ? JSON.parse(data) : {}));
      req.on('error', j);
    });
    // Log for real-time viewing in Vercel logs
    console.log('[geo-log]', JSON.stringify(body));
    // Optionally persist here (DB/S3) if you want durable storage
    res.status(204).end();
  } catch (err) {
    console.error('geo-log error', err);
    res.status(500).end();
  }
}
