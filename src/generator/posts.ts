interface PostSortType {
  date: string;
  url: string;
}

export function sortPosts<T extends PostSortType>(posts: T[]): void {
  posts.sort(
    (a, b) => b.date.localeCompare(a.date) || a.url.localeCompare(b.url),
  );
}
