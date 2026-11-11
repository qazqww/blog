import type { SearchEntry } from '../shared/search.js';

let searchStatus = document.querySelector('#search-status');
try {
  const searchEntries = await loadSearchEntries();
  if (searchStatus !== null) {
    searchStatus.textContent = `검색 가능한 글 : ${searchEntries.length}개`;
  }
} catch (err) {
  console.error('검색 데이터 로딩 중 에러 발생 => ', err);
  if (searchStatus !== null) {
    searchStatus.textContent = '검색 데이터를 불러오지 못했습니다.';
  }
}

export async function loadSearchEntries(): Promise<SearchEntry[]> {
  const response = await fetch('search-index.json');
  if (!response.ok) {
    throw new Error('Search Entry Error.');
  }

  const data: unknown = await response.json();
  if (!isSearchEntryArray(data)) {
    throw new Error('Response data is not SearchEntry Array type.');
  }

  return data;
}

function isSearchEntryArray(value: unknown): value is SearchEntry[] {
  const pattern = /^posts\/[a-z0-9]+(?:-[a-z0-9]+)*\/index\.html$/;
  if (!Array.isArray(value)) {
    return false;
  }
  for (const val of value) {
    if (
      typeof val !== 'object' ||
      val === null ||
      !('title' in val) ||
      typeof val.title !== 'string' ||
      !('date' in val) ||
      typeof val.date !== 'string' ||
      !('url' in val) ||
      typeof val.url !== 'string' ||
      !('tags' in val) ||
      !Array.isArray(val.tags) ||
      !val.tags.every((tag: unknown) => typeof tag === 'string') ||
      !pattern.test(val.url)
    ) {
      return false;
    }
  }

  return true;
}
