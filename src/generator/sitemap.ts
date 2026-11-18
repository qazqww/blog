import { siteConfig } from '../config.js';

export interface SitemapEntry {
  path: string;
  lastmod?: string;
}

export function createSitemap(entries: SitemapEntry[]): string {
  if (!siteConfig.url.endsWith('/')) {
    throw new Error('siteConfig.url must end with "/".');
  }
  const source = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${entries
      .map(
        (entry) => `<url>
          <loc>${escapeXml(new URL(entry.path, siteConfig.url).href)}</loc>
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
