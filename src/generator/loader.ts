import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

export interface PostSource {
  filePath: string;
  content: string;
}

async function readPost(filePath: string): Promise<string> {
  // 파일을 UTF-8 문자열로 읽어 반환
  return await readFile(filePath, 'utf-8');
}

async function findMarkdownFiles(directory: string): Promise<string[]> {
  // 디렉터리에서 Markdown 파일 경로들을 찾아 반환
  return await readdir(directory, { withFileTypes: true }).then((entries) =>
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => join(directory, entry.name))
      .sort(),
  );
}

export async function loadPosts(directory: string): Promise<PostSource[]> {
  const files = await findMarkdownFiles(directory);
  const posts: PostSource[] = [];
  for (const filePath of files) {
    const content = await readPost(filePath);
    posts.push({ filePath, content });
  }
  return posts;
}
