import { basename } from 'node:path';
import { PostError } from '../common/error.js';

export function getPostPath(filePath: string): string {
  return `posts/${getPostSlug(filePath)}/index.html`;
}

export function getPostSlug(filePath: string): string {
  const name = basename(filePath, '.md');
  if (!name.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)) {
    throw new PostError('Basename is empty or invalid: ' + filePath);
  }
  return name;
}
