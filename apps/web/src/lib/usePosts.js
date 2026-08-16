import { useEffect, useState } from 'react';

// Lazily loads the posts data module so its ~600KB payload stays out of the
// initial bundle and is shared as a single async chunk across blog routes.
export function usePosts() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    let active = true;
    import('@/data/posts').then((mod) => {
      if (active) setPosts(mod.default);
    });
    return () => {
      active = false;
    };
  }, []);

  return posts;
}
