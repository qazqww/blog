export interface PostPageInput {
  title: string;
  date: string;
  body: string;
}

export function renderPostPage(post: PostPageInput): string {
  return `<!doctype html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(post.title)}</title>
    </head>
    <body>
        <main>
            <article>
                <h1>${escapeHtml(post.title)}</h1>
                <p>
                    <time datetime="${escapeHtml(post.date)}">
                    ${escapeHtml(post.date)}</time>
                </p>
                ${post.body}
            </article>
        </main>
    </body>
    </html>`;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
