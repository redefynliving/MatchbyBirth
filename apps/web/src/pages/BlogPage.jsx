
import React from 'react';
import { Helmet } from 'react-helmet';
import posts from '@/data/posts';
import { Link } from 'react-router-dom';

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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts.map((post) => (
              <article key={post.slug} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-2"><Link to={`/blog/${post.slug}`} className="hover:underline">{post.title}</Link></h3>
                <p className="text-sm text-muted-foreground mb-3">{new Date(post.date).toLocaleDateString()}</p>
                <p className="text-muted-foreground mb-4">{post.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((t) => (
                    <span key={t} className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs">{t}</span>
                  ))}
                </div>
                <Link to={`/blog/${post.slug}`} className="inline-block text-primary font-medium">Read More →</Link>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default BlogPage;
