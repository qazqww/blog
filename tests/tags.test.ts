import { test } from 'node:test';
import assert from 'node:assert/strict';
import { groupPostsByTag } from '../src/generator/tags.js';

const tagPostJava1 = { url: 'a', tags: ['java'] };
const tagPostJava2 = { url: 'b', tags: ['java'] };
const tagPostJavaCpp = { url: 'c', tags: ['java', 'cpp'] };
const tagPostCpp = { url: 'd', tags: ['cpp'] };
const tagPostNone = { url: 'e', tags: [] };

test('함수 호출 후에도 입력 배열이 변하지 않는다', () => {
  groupPostsByTag([tagPostJava1, tagPostJavaCpp, tagPostNone]);
  assert.deepEqual(tagPostJava1, { url: 'a', tags: ['java'] });
  assert.deepEqual(tagPostJavaCpp, { url: 'c', tags: ['java', 'cpp'] });
  assert.deepEqual(tagPostNone, { url: 'e', tags: [] });
});

test('태그가 같은 글들이 태그 항목에 입력 순서대로 모인다', () => {
  const tagPostArray = [tagPostJava1, tagPostJavaCpp, tagPostJava2];
  const result = groupPostsByTag(tagPostArray);
  const postsByTag = result.get('java');
  assert.deepEqual(postsByTag?.at(0), tagPostJava1);
  assert.deepEqual(postsByTag?.at(1), tagPostJavaCpp);
  assert.deepEqual(postsByTag?.at(2), tagPostJava2);
});

test('태그가 여러 개인 글이 각 태그 항목에 모두 들어간다', () => {
  const result = groupPostsByTag([tagPostJavaCpp]);
  assert.equal(result.get('java')?.length, 1);
  assert.equal(result.get('cpp')?.length, 1);
});

test('태그가 없으면 어느 항목에도 들어가지 않는다', () => {
  const result = groupPostsByTag([tagPostNone]);
  //   const result = groupsPostsByTag([tagPostJava1]);
  assert.equal(result.size, 0);
});
