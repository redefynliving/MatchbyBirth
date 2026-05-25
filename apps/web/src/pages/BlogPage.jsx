
import React from 'react';
import { Helmet } from 'react-helmet';

function BlogPage() {
  return (
    <>
      <Helmet>
        <title>Astrology Blog & Guides | Match by Birth</title>
        <meta name="description" content="Read our latest articles and guides on zodiac compatibility, astrology, and relationship advice." />
      </Helmet>

      <main className="section-spacing bg-background min-h-screen">
        <div className="content-container max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Blog & Guides</h1>
            <p className="text-lg text-muted-foreground">Insights into the stars and your relationships.</p>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Coming Soon</h2>
            <p className="text-muted-foreground">
              We are currently writing our first batch of astrological guides. Stay tuned!
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default BlogPage;
