import type { PostSource } from './loader.js';
import matter from 'gray-matter';

export interface ParsedPost {
  filePath: string;
  title: string;
  date: string;
  body: string;
}

export function parsePost(source: PostSource): ParsedPost {
  const result = matter(source.content);
  const metadata: unknown = result.data;
  if (typeof metadata !== 'object' || metadata === null) {
    throw new Error('Invalid front matter in post: ' + source.filePath);
  }

  if (
    !('title' in metadata) ||
    typeof metadata.title !== 'string' ||
    metadata.title.trim() === ''
  ) {
    throw new Error(
      'Missing title in front matter of post: ' + source.filePath,
    );
  } else if (
    !('date' in metadata) ||
    typeof metadata.date !== 'string' ||
    !isValidDate(metadata.date)
  ) {
    throw new Error('Invalid date in front matter of post: ' + source.filePath);
  }

  return {
    filePath: source.filePath,
    title: metadata.title,
    date: metadata.date,
    body: result.content,
  };
}

function isValidDate(dateString: string): boolean {
  if (!dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return false;
  }
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString().startsWith(dateString);
}
