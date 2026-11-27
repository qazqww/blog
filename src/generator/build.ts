import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { loadPosts } from './loader.js';
import { parsePost, type ParsedPost } from './parser.js';
import { renderMarkdown } from './renderer.js';
import { getPostSlug } from './route.js';
import { renderPostPage } from '../templates/post.js';
import { renderHomePage } from '../templates/home.js';
import { renderTagPage } from '../templates/tag.js';
import { createSearchIndex } from './search-index.js';
import { createSitemap, type SitemapEntry } from './sitemap.js';
import { toAbsoluteUrl } from './site-url.js';
import { groupPostsByTag } from './tags.js';
import { PostError } from '../common/error.js';

async function main(): Promise<void> {
  const errors: string[] = [];
  const posts = await loadPosts('./content/posts');
  const parsedPosts: ParsedPost[] = [];
  for (const post of posts) {
    let postSlug = '';
    try {
      postSlug = getPostSlug(post.filePath);
    } catch (error) {
      if (error instanceof PostError) {
        errors.push(error.message);
      } else {
        throw error;
      }
    }
    try {
      const parsedPost = parsePost(post);
      parsedPost.postSlug = postSlug;
      parsedPosts.push(parsedPost);
    } catch (error) {
      if (error instanceof PostError) {
        errors.push(error.message);
      } else {
        throw error;
      }
    }
  }

  if (errors.length > 0) {
    throw errors;
  }

  const renderedPosts = parsedPosts.map((post) => ({
    ...post,
    body: renderMarkdown(post.body),
  }));
  if (renderedPosts.length === 0) {
    throw new Error('No posts found in the content/posts directory.');
  }

  const summaryPosts = [];
  for (const post of renderedPosts) {
    const postPath = `posts/${post.postSlug}/index.html`;
    const canonicalUrl = toAbsoluteUrl(postPath);
    const postHtml = renderPostPage({ ...post, canonicalUrl });

    const outputDirectory = path.join('dist', 'posts', post.postSlug);
    await mkdir(outputDirectory, { recursive: true });
    const outputPath = path.join(outputDirectory, 'index.html');
    await writeFile(outputPath, postHtml, 'utf-8');
    console.log(`Post page generated at ${outputPath}`);

    summaryPosts.push({
      title: post.title,
      date: post.date,
      url: postPath,
      tags: post.tags,
    });
  }

  summaryPosts.sort(
    (a, b) => b.date.localeCompare(a.date) || a.url.localeCompare(b.url),
  );
  const homePath = 'index.html';
  const homeCanonicalUrl = toAbsoluteUrl(homePath);
  const homepageHtml = renderHomePage(summaryPosts, homeCanonicalUrl);
  await writeFile('dist/index.html', homepageHtml, 'utf-8');
  console.log('Homepage generated at dist/index.html');

  const sitemapEntries: SitemapEntry[] = [];
  const homeEntry: SitemapEntry = {
    path: homePath,
  };
  const latestPost = summaryPosts[0];
  if (latestPost !== undefined) {
    homeEntry.lastmod = latestPost.date;
  }
  sitemapEntries.push(homeEntry);

  for (const post of summaryPosts) {
    sitemapEntries.push({
      path: post.url,
      lastmod: post.date,
    });
  }

  const postsByTag = groupPostsByTag(summaryPosts);
  for (const [tag, posts] of postsByTag.entries()) {
    const outputDirectory = path.join('dist', 'tags', tag);
    await mkdir(outputDirectory, { recursive: true });
    const outputPath = path.join(outputDirectory, 'index.html');
    const tagPath = `tags/${tag}/index.html`;
    const tagCanonicalUrl = toAbsoluteUrl(tagPath);
    const tagPageHtml = renderTagPage(tag, posts, tagCanonicalUrl);
    await writeFile(outputPath, tagPageHtml, 'utf-8');
    console.log(`Tag page for ${tag} generated at ${outputPath}`);

    const tagEntry: SitemapEntry = {
      path: tagPath,
    };
    if (posts[0] !== undefined) {
      tagEntry.lastmod = posts[0].date;
    }
    sitemapEntries.push(tagEntry);
  }

  await mkdir('dist/assets', { recursive: true });
  await copyFile('src/styles/main.css', 'dist/assets/main.css');
  await copyFile('public/favicon.ico', 'dist/favicon.ico');

  const searchIndex = createSearchIndex(parsedPosts);
  const searchJson = JSON.stringify(searchIndex, null, 2);
  await writeFile('dist/search-index.json', searchJson, 'utf-8');

  const sitemap = createSitemap(sitemapEntries);
  await writeFile('dist/sitemap.xml', sitemap, 'utf-8');
}

main().catch((error: unknown) => {
  if (Array.isArray(error)) {
    console.error(`Build failed: ${error.length} invalid post(s)`);
    for (const e of error) {
      console.error(`- ${e}`);
    }
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});
