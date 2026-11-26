import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderMarkdown } from '../src/generator/renderer.js';

test('첫 이미지에 fetchpriority 적용', () => {
  const content = '![a](a.png)\n![b](b.png)';
  const result = renderMarkdown(content);
  const images = result.match(/<img [^>]*>/g) ?? [];

  assert.equal(images.length, 2);
  assert.match(images[0] ?? '', /fetchpriority="high"/);
  assert.doesNotMatch(images[0] ?? '', /loading=/);
  assert.match(images[1] ?? '', /loading="lazy"/);
  assert.doesNotMatch(images[1] ?? '', /fetchpriority=/);
});
