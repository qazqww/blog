import { siteConfig } from '../config.js';

if (!siteConfig.url.endsWith('/')) {
  throw new Error('siteConfig.url must end with "/".');
}

export function toAbsoluteUrl(path: string): string {
  if (path.startsWith('/')) {
    throw new Error('path should not start with "/", ' + path);
  }
  return new URL(path, siteConfig.url).href;
}
