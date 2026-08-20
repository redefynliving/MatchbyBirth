import postsData from '@/data/posts';

// The posts payload is static data already shipped on every blog visit, so we
// return it synchronously. The previous lazy `import()` gated rendering behind
// a separate ~600KB chunk with no error handling: if that chunk was slow or
// failed to evaluate, `posts` stayed null and the page showed "Loading blog…"
// forever. Returning the static import removes the waterfall and any hang.
export function usePosts() {
  return postsData;
}
