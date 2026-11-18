export function renderLayout(
  title: string,
  content: string,
  stylesheet: string,
  description: string = '',
): string {
  return `<!doctype html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${
          description.trim() !== ''
            ? `<meta name="description" content="${escapeHtml(description)}" />`
            : ''
        }
        <link rel="stylesheet" href="${escapeHtml(stylesheet)}" />
        <title>${escapeHtml(title)}</title>
    </head>
    <body>
        <main>
            ${content}
        </main>
    </body>
    </html>
    `;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
