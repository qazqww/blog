export interface LayoutInput {
  title: string;
  content: string;
  stylesheet: string;
  canonicalUrl: string;
  description?: string;
}

export function renderLayout(input: LayoutInput): string {
  return `<!doctype html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${
          input.description !== undefined && input.description.trim() !== ''
            ? `<meta name="description" content="${escapeHtml(input.description)}" />`
            : ''
        }
        <link rel="stylesheet" href="${escapeHtml(input.stylesheet)}" />
        <link rel="canonical" href="${escapeHtml(input.canonicalUrl)}" />
        <title>${escapeHtml(input.title)}</title>
    </head>
    <body>
        <main>
            ${input.content}
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
