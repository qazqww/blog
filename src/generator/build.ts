import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadPosts } from './loader.js';
import { parsePost } from './parser.js';
import { renderMarkdown } from './renderer.js';
import { renderPostPage } from '../templates/post.js';
import { getPostSlug } from './route.js';

loadPosts('./content/posts').then(async (posts) => {
  const parsedPosts = posts.map((post) => parsePost(post));
  const renderedPosts = parsedPosts.map((post) => ({
    ...post,
    body: renderMarkdown(post.body),
  }));
  if (renderedPosts.length === 0) {
    throw new Error('No posts found in the content/posts directory.');
  }
  for (const post of renderedPosts) {
    const pageHtml = renderPostPage(post);
    const slugPath = getPostSlug(post.filePath);
    const outputDirectory = path.join('dist', 'posts', slugPath);
    await mkdir(outputDirectory, { recursive: true });
    const outputPath = path.join(outputDirectory, 'index.html');
    await writeFile(outputPath, pageHtml, 'utf-8');
    console.log(`Post page generated at ${outputPath}`);
  }
});
