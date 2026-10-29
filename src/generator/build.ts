import { loadPosts } from './loader.js';

loadPosts('./content/posts').then((posts) => {
  console.log(posts);
});
