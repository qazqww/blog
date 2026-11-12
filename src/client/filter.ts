import type { SearchEntry } from '../shared/search.js';

export function filterSearchEntries(
  entries: SearchEntry[],
  query: string,
): SearchEntry[] {
  const searchQuery = query.trim().toLowerCase();
  let result: SearchEntry[] = [];

  if (searchQuery === '') {
    return result;
  }

  result = entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchQuery) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery)),
  );
  return result;
}
