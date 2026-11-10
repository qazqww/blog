import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { loadPosts } from './loader.js';
import { parsePost } from './parser.js';
import { renderMarkdown } from './renderer.js';
import { getPostSlug } from './route.js';
import { renderPostPage } from '../templates/post.js';
import { renderHomePage, type PostSummary } from '../templates/home.js';
import { renderTagPage } from '../templates/tag.js';

loadPosts('./content/posts').then(async (posts) => {
  const parsedPosts = posts.map((post) => parsePost(post));
  const renderedPosts = parsedPosts.map((post) => ({
    ...post,
    body: renderMarkdown(post.body),
  }));
  if (renderedPosts.length === 0) {
    throw new Error('No posts found in the content/posts directory.');
  }

  const summaryPosts = [];
  for (const post of renderedPosts) {
    const pageHtml = renderPostPage(post);
    const slugPath = getPostSlug(post.filePath);
    const outputDirectory = path.join('dist', 'posts', slugPath);
    await mkdir(outputDirectory, { recursive: true });
    const outputPath = path.join(outputDirectory, 'index.html');
    await writeFile(outputPath, pageHtml, 'utf-8');
    console.log(`Post page generated at ${outputPath}`);

    summaryPosts.push({
      title: post.title,
      date: post.date,
      url: `posts/${slugPath}/index.html`,
      tags: post.tags,
    });
  }

  summaryPosts.sort(
    (a, b) => b.date.localeCompare(a.date) || a.url.localeCompare(b.url),
  );
  const homepageHtml = renderHomePage(summaryPosts);
  await writeFile('dist/index.html', homepageHtml, 'utf-8');
  console.log('Homepage generated at dist/index.html');

  const postsByTag = new Map<string, PostSummary[]>();
  for (const post of summaryPosts) {
    for (const tag of post.tags) {
      if (!postsByTag.has(tag)) {
        postsByTag.set(tag, []);
      }
      postsByTag.get(tag)!.push(post);
    }
  }

  for (const [tag, posts] of postsByTag.entries()) {
    const tagPageHtml = renderTagPage(tag, posts);
    const outputDirectory = path.join('dist', 'tags', tag);
    await mkdir(outputDirectory, { recursive: true });
    const outputPath = path.join(outputDirectory, 'index.html');
    await writeFile(outputPath, tagPageHtml, 'utf-8');
    console.log(`Tag page for ${tag} generated at ${outputPath}`);
  }

  await mkdir('dist/assets', { recursive: true });
  await copyFile('src/styles/main.css', 'dist/assets/main.css');
});
