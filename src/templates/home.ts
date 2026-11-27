import { renderLayout, escapeHtml, type LayoutInput } from './layout.js';

export interface PostSummary {
  title: string;
  date: string;
  url: string;
}

export function renderHomePage(
  posts: PostSummary[],
  canonicalUrl: string,
): string {
  const title = 'Blog Title';
  const introduce = 'Welcome!';
  const description = '블로그의 홈 페이지입니다.';
  const contentList = `
    <h1>${title}</h1>
    <p>${introduce}</p>
    <ul>
        ${posts
          .map(
            (post) =>
              `<li>
                <a href="${escapeHtml(post.url)}">${escapeHtml(post.title)}</a>
                <time datetime="${escapeHtml(post.date)}">
                (${escapeHtml(post.date)})</time>
            </li>`,
          )
          .join('\n')}
    </ul>
    <section>
      <h2 id="search-heading">글 검색</h2>
      <label for="search-input">제목 or 태그</label>
      <input id="search-input" type="search" disabled>
      <p id="search-status" role="status">검색 데이터 준비 중...</p>
      <ul id="search-results"></ul>
    </section>
    <noscript>검색 기능에는 Javascript가 필요합니다. 아래 글 목록은 이용할 수 있습니다.</noscript>
    <script type="module" src="assets/client/search.js"></script>
    `;
  const stylesheet = 'assets/main.css';
  const favicon = 'favicon.ico';

  const homepageLayout: LayoutInput = {
    title,
    content: contentList,
    stylesheet,
    canonicalUrl,
    description,
    favicon,
  };

  return renderLayout(homepageLayout);
}
