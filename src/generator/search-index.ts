import type { SearchEntry } from '../shared/search.js';
import type { ParsedPost } from './parser.js';
import { sortPosts } from './posts.js';

export function createSearchIndex(posts: ParsedPost[]): SearchEntry[] {
  const searchEntries = posts.map((post) => ({
    title: post.title,
    date: post.date,
    tags: [...post.tags],
    url: post.postPath,
    description: post.description,
  }));
  sortPosts(searchEntries);
  return searchEntries;
}
