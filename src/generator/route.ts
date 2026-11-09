import { basename } from 'node:path';

export function getPostSlug(filePath: string): string {
  const name = basename(filePath, '.md');
  if (!name.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)) {
    throw new Error('Basename is empty or invalid: ' + filePath);
  }
  return name;
}
