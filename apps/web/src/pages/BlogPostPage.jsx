import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import posts from '@/data/posts';

function BlogPostPage() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-3xl font-bold mb-4">Post not found</h1>
        <p className="text-muted-foreground mb-6">We couldn't find that post. Try browsing the blog index.</p>
        <Link to="/blog" className="px-5 py-3 bg-primary text-primary-foreground rounded-lg">Back to Blog</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Match by Birth</title>
        <meta name="description" content={post.description} />
      </Helmet>

      <main className="section-spacing bg-background min-h-screen">
        <div className="content-container max-w-3xl">
          <article className="prose prose-lg mx-auto bg-card border border-border rounded-2xl p-10 shadow-sm">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <p className="text-sm text-muted-foreground mb-4">{new Date(post.date).toLocaleDateString()}</p>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />

            <div className="mt-8">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">{t}</span>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <p className="mb-4">Want to check your compatibility score? Try our free calculator.</p>
              <a href="/" className="inline-block px-5 py-3 bg-primary text-primary-foreground rounded-lg">Open Calculator</a>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}

export default BlogPostPage;
