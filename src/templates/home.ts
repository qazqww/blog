import { renderLayout, escapeHtml } from './layout.js';

export interface PostSummary {
  title: string;
  date: string;
  url: string;
}

export function renderHomePage(posts: PostSummary[]): string {
  const title = 'Blog Title';
  const introduce = 'Welcome!';
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
    `;

  return renderLayout(title, contentList);
}
