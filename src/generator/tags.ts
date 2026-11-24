export function groupPostsByTag<T extends { tags: string[] }>(
  posts: T[],
): Map<string, T[]> {
  const tagMap = new Map<string, T[]>();
  for (const post of posts) {
    const tags = post.tags;
    for (const tag of tags) {
      const map = tagMap.get(tag);
      if (map === undefined) {
        tagMap.set(tag, [post]);
      } else {
        map.push(post);
      }
    }
  }
  return tagMap;
}
