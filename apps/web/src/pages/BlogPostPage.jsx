import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import posts from '@/data/posts';

function BlogPostPage() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <main className="section-spacing">
        <div className="content-container text-center">
          <h1 className="text-3xl font-semibold">Post not found</h1>
          <p className="mt-4">We couldn't find the article you're looking for.</p>
          <Link to="/" className="mt-6 inline-block text-primary">Back to calculator</Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Match by Birth</title>
        <meta name="description" content={post.description} />
      </Helmet>

      <main className="section-spacing">
        <div className="content-container max-w-3xl">
          <article>
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-sm text-muted-foreground mb-6">{new Date(post.date).toLocaleDateString()}</p>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            <div className="mt-12 text-center">
              <Link to="/" className="btn btn-primary">Return to calculator</Link>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}

export default BlogPostPage;
