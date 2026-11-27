import { escapeHtml, renderLayout, type LayoutInput } from './layout.js';

export interface PostPageInput {
  title: string;
  date: string;
  body: string;
  tags: string[];
  description: string;
  canonicalUrl: string;
}

export function renderPostPage(post: PostPageInput): string {
  const articleHtml = `
    <article>
        <h1>${escapeHtml(post.title)}</h1>
        <p>
            <time datetime="${escapeHtml(post.date)}">
            ${escapeHtml(post.date)}</time>
        </p>
        ${
          post.tags.length > 0
            ? `<ul class="tags">
          ${post.tags.map((tag) => `<li><a href="${escapeHtml('../../tags/' + tag + '/index.html')}">${escapeHtml(tag)}</a></li>`).join('\n')}
        </ul>`
            : ''
        }
        ${post.body}
    </article>
    <a href="../../index.html">글 목록으로</a>
    `;
  const stylesheet = '../../assets/main.css';
  const favicon = '../../favicon.ico';

  const postLayout: LayoutInput = {
    title: post.title,
    content: articleHtml,
    stylesheet,
    canonicalUrl: post.canonicalUrl,
    description: post.description,
    favicon,
  };

  return renderLayout(postLayout);
}
