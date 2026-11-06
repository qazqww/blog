import { loadPosts } from './loader.js';
import { parsePost } from './parser.js';

loadPosts('./content/posts').then((posts) => {
  const parsedPosts = posts.map((post) => parsePost(post));
  console.log(parsedPosts);
});
