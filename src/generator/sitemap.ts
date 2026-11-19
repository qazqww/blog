import { toAbsoluteUrl } from './site-url.js';

export interface SitemapEntry {
  path: string;
  lastmod?: string;
}

export function createSitemap(entries: SitemapEntry[]): string {
  const source = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${entries
      .map(
        (entry) => `<url>
          <loc>${escapeXml(toAbsoluteUrl(entry.path))}</loc>
          ${
            typeof entry.lastmod !== 'undefined'
              ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>`
              : ''
          }
          </url>`,
      )
      .join('\n')}
  </urlset>
  `;
  return source;
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
