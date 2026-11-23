import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePost } from '../src/generator/parser.js';

test('제목과 날짜만 있는 글을 읽는다', () => {
  const source = {
    filePath: 'example.md',
    content: "---\ntitle: 예시\ndate: '2026-01-02'\n---\n본문",
  };
  const post = parsePost(source);
  assert.equal(post.title, '네네');
  assert.equal(post.date, '2026-01-02');
  assert.deepEqual(post.tags, []);
  assert.equal(post.description, '');
  assert.equal(post.body, '본문');
});

test('제목이 없거나 비어있을 경우 에러', () => {
  const noTitle = {
    filePath: 'example.md',
    content: "---\ndate: '2026-01-02'\n---\n본문",
  };
  const emptyTitle = {
    filePath: 'example.md',
    content: "---\ntitle: ' '\ndate: '2026-01-02'\n---\n본문",
  };
  assert.throws(() => parsePost(noTitle), {
    message: `Missing title in front matter of post: ${noTitle.filePath}`,
  });
  assert.throws(() => parsePost(emptyTitle), {
    message: `Missing title in front matter of post: ${emptyTitle.filePath}`,
  });
});

test('설명과 태그에서 처음과 끝의 공백을 자르며 태그의 대문자는 소문자로 처리한다', () => {
  const source = {
    filePath: 'example.md',
    content: `---\ntitle: 예시\ndate: '2026-01-02'
tags: ['Java', 'java', '   javascript ', 'JavaScript']
description: '  이것은 설명입니다   '
---\n본문`,
  };
  const post = parsePost(source);
  assert.deepEqual(post.tags, ['java', 'javascript']);
  assert.equal(post.description, '이것은 설명입니다');
});

test('날짜의 형식이 틀리거나 존재하지 않는 날짜인 경우 에러', () => {
  const wrongDateFormat = {
    filePath: 'example.md',
    content: "---\ntitle: 예시\ndate: '2026-1-2'\n---\n본문",
  };
  const wrongDateType = {
    filePath: 'example.md',
    content: '---\ntitle: 예시\ndate: 2026-01-02\n---\n본문',
  };
  const invalidDate = {
    filePath: 'example.md',
    content: "---\ntitle: 예시\ndate: '2026-02-30'\n---\n본문",
  };
  assert.throws(() => parsePost(wrongDateFormat), {
    message: `Invalid date in front matter of post: ${wrongDateFormat.filePath}`,
  });
  assert.throws(() => parsePost(wrongDateType), {
    message: `Invalid date in front matter of post: ${wrongDateType.filePath}`,
  });
  assert.throws(() => parsePost(invalidDate), {
    message: `Invalid date in front matter of post: ${invalidDate.filePath}`,
  });
});

test('설명이 string이 아닐 경우 에러', () => {
  const source = {
    filePath: 'example.md',
    content:
      "---\ntitle: 예시\ndate: '2026-01-02'\ndescription: 123\n---\n본문",
  };
  assert.throws(() => parsePost(source), {
    message: `Invalid description in front matter of post: ${source.filePath}`,
  });
});
