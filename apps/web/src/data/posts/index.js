import editorialPosts from './editorial-posts-2026-09.js';
import sanityPosts from './sanity-posts.generated.js';
import part1 from './posts-legacy-part1.js';
import part2 from './posts-legacy-part2.js';
import part3 from './posts-legacy-part3.js';
import part4 from './posts-legacy-part4.js';
import part5 from './posts-legacy-part5.js';
import part6 from './posts-legacy-part6.js';
import part7 from './posts-legacy-part7.js';
import part8 from './posts-legacy-part8.js';
import part9 from './posts-legacy-part9.js';
import part10 from './posts-legacy-part10.js';
import part11 from './posts-legacy-part11.js';

const posts = [...part1, ...part2, ...part3, ...part4, ...part5, ...part6, ...part7, ...part8, ...part9, ...part10, ...part11];

export const existingPosts = posts;
export default [...editorialPosts, ...posts, ...sanityPosts];
