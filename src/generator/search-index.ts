import type { ParsedPost } from './parser.js';
import { getPostSlug } from './route.js';
import type { SearchEntry } from '../shared/search.js';

export function createSearchIndex(posts: ParsedPost[]): SearchEntry[] {
  const searchEntries = posts.map((post) => ({
    title: post.title,
    date: post.date,
    tags: [...post.tags],
    url: `posts/${getPostSlug(post.filePath)}/index.html`,
  }));
  searchEntries.sort(
    (a, b) => b.date.localeCompare(a.date) || a.url.localeCompare(b.url),
  );
  return searchEntries;
}
