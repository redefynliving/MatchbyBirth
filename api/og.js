import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const url = new URL(req.url);
    const p1 = url.searchParams.get('p1') || 'Alex';
    const p2 = url.searchParams.get('p2') || 'Jordan';
    const score = url.searchParams.get('score') || '78';
    const label = url.searchParams.get('label') || 'Mostly Compatible';

    return new ImageResponse(
      (
        <div style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          background: 'linear-gradient(180deg, #07102A 0%, #0D1B3A 100%)',
          color: '#F5F3EE',
          fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
          padding: 40,
          boxSizing: 'border-box'
        }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{p1} & {p2}</div>
              <div style={{ marginTop: 8, fontSize: 18, color: '#C9A84C' }}>{label}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ fontSize: 120, fontWeight: 800 }}>{score}%</div>
              <div style={{ fontSize: 20, color: '#BFC7D6' }}>Match by Birth</div>
            </div>
          </div>
          <div style={{ width: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="200" height="200" rx="20" fill="#0A1A2A" />
              <circle cx="100" cy="100" r="78" stroke="#C9A84C" strokeWidth="4" />
              <circle cx="70" cy="70" r="6" fill="#C9A84C" />
              <circle cx="130" cy="130" r="6" fill="#C9A84C" />
            </svg>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (err) {
    console.error(err);
    return new Response('Failed to generate image', { status: 500 });
  }
}
