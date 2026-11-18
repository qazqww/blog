import type { SearchEntry } from '../shared/search.js';
import { filterSearchEntries } from './filter.js';

const searchStatus = document.querySelector('#search-status');
try {
  const searchEntries = await loadSearchEntries();
  if (searchStatus !== null) {
    searchStatus.textContent = `검색 가능한 글 : ${searchEntries.length}개`;
  }
  const searchInput = document.querySelector('#search-input');
  const searchResult = document.querySelector('#search-results');
  if (
    searchInput instanceof HTMLInputElement &&
    searchResult instanceof HTMLUListElement
  ) {
    searchInput.disabled = false;
    searchInput?.addEventListener('input', (e) => {
      const searchedEntries = filterSearchEntries(
        searchEntries,
        searchInput.value,
      );
      if (searchStatus != null) {
        if (searchInput.value.trim() === '') {
          searchStatus.textContent = '검색어를 입력하세요.';
        } else if (searchedEntries.length === 0) {
          searchStatus.textContent = '검색 결과가 없습니다.';
        } else {
          searchStatus.textContent = `검색 결과 ${searchedEntries.length}개`;
        }
      }
      renderSearchResults(searchResult, searchedEntries);
    });
  } else {
    throw new Error('HTML 요소 탐색 에러');
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

export function renderSearchResults(ul: HTMLElement, entries: SearchEntry[]) {
  ul.replaceChildren();
  for (const entry of entries) {
    const li = document.createElement('li');
    const title = document.createElement('p');
    const a = document.createElement('a');
    a.href = entry.url;
    a.textContent = entry.title;
    const time = document.createElement('time');
    time.textContent = entry.date;
    time.dateTime = entry.date;

    li.appendChild(title);
    title.appendChild(a);
    li.appendChild(time);

    if (entry.description !== '') {
      const desc = document.createElement('p');
      desc.textContent = entry.description;
      li.appendChild(desc);
    }

    ul.appendChild(li);
  }
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
      !pattern.test(val.url) ||
      !('description' in val) ||
      typeof val.description !== 'string'
    ) {
      return false;
    }
  }

  return true;
}
