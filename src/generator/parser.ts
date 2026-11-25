import { PostError } from '../common/error.js';
import type { PostSource } from './loader.js';
import matter from 'gray-matter';

export interface ParsedPost {
  postSlug: string;
  filePath: string;
  title: string;
  date: string;
  body: string;
  tags: string[];
  description: string;
}

export function parsePost(source: PostSource): ParsedPost {
  const result = matter(source.content);
  const metadata: unknown = result.data;
  if (typeof metadata !== 'object' || metadata === null) {
    throw new PostError('Invalid front matter in post: ' + source.filePath);
  }

  if (
    !('title' in metadata) ||
    typeof metadata.title !== 'string' ||
    metadata.title.trim() === ''
  ) {
    throw new PostError(
      'Missing title in front matter of post: ' + source.filePath,
    );
  } else if (
    !('date' in metadata) ||
    typeof metadata.date !== 'string' ||
    !isValidDate(metadata.date)
  ) {
    throw new PostError(
      'Invalid date in front matter of post: ' + source.filePath,
    );
  }

  let description: string;
  if (!('description' in metadata)) {
    description = '';
  } else if (typeof metadata.description !== 'string') {
    throw new PostError(
      'Invalid description in front matter of post: ' + source.filePath,
    );
  } else {
    description = metadata.description.trim();
  }

  const tags = 'tags' in metadata ? metadata.tags : [];
  if (
    !Array.isArray(tags) ||
    !tags.every(
      (tag) =>
        typeof tag === 'string' &&
        tag
          .trim()
          .toLowerCase()
          .match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    )
  ) {
    throw new PostError(
      'Missing or invalid tags in front matter of post: ' + source.filePath,
    );
  }

  const uniqueTags: string[] = [
    ...new Set(tags.map((tag) => tag.trim().toLowerCase())),
  ];

  return {
    postSlug: '',
    filePath: source.filePath,
    title: metadata.title,
    date: metadata.date,
    body: result.content,
    tags: uniqueTags,
    description,
  };
}

function isValidDate(dateString: string): boolean {
  if (!dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return false;
  }
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString().startsWith(dateString);
}
