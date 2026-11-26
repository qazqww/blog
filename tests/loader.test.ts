import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadPosts, type PostSource } from '../src/generator/loader.js';
import test, { after } from 'node:test';
import assert from 'node:assert/strict';

const content =
  "---\ntitle: post $i\ndate: '2026-01-01'\ntags: [java]\n---\n본문 $i\n";

test('파일의 로드 순서 확인 테스트', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'loader-'));
  after(() => rm(dir, { recursive: true }));

  await writeFile(join(dir, 'a.md'), content, 'utf-8');
  await writeFile(join(dir, 'b.md'), content, 'utf-8');
  await writeFile(join(dir, 'c.txt'), content, 'utf-8');

  const posts: PostSource[] = await loadPosts(dir);

  assert.equal(posts.length, 2);
  assert.equal(posts.at(0)?.filePath, join(dir, 'a.md'));
  assert.equal(posts.at(1)?.filePath, join(dir, 'b.md'));
});
