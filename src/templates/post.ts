import { renderLayout, escapeHtml } from './layout.js';

export interface PostPageInput {
  title: string;
  date: string;
  body: string;
}

export function renderPostPage(post: PostPageInput): string {
  const articleHtml = `
    <article>
        <h1>${escapeHtml(post.title)}</h1>
        <p>
            <time datetime="${escapeHtml(post.date)}">
            ${escapeHtml(post.date)}</time>
        </p>
        ${post.body}
    </article>
    <a href="../../index.html">글 목록으로</a>
    `;
  const stylesheet = '../../assets/main.css';

  return renderLayout(post.title, articleHtml, stylesheet);
}
