import type { PostSummary } from './home.js';
import { renderLayout, escapeHtml, type LayoutInput } from './layout.js';

export function renderTagPage(
  tag: string,
  posts: PostSummary[],
  canonicalUrl: string,
): string {
  const title = `${escapeHtml(tag)} 태그의 글`;
  const description = `${escapeHtml(tag)} 관련 글 목록입니다.`;
  const content = `
    <h1>${title}</h1>
      <ul>
        ${posts
          .map(
            (post) =>
              `<li><a href="${escapeHtml('../../' + post.url)}">${escapeHtml(post.title)}</a>
                <span><time>${escapeHtml(post.date)}</time></span></li>`,
          )
          .join('\n')}
      </ul>
      <a href="${escapeHtml('../../index.html')}">홈으로</a>
    `;
  const stylesheet = '../../assets/main.css';
  const favicon = '../../favicon.ico';

  const tagLayout: LayoutInput = {
    title,
    content,
    stylesheet,
    canonicalUrl,
    description,
    favicon,
  };

  return renderLayout(tagLayout);
}
