import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt({ html: false });
const defaultImage = markdown.renderer.rules.image;

markdown.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  token?.attrSet('fetchpriority', 'high');
  return defaultImage!(tokens, idx, options, env, self);
};

export function renderMarkdown(source: string): string {
  return markdown.render(source, { imageCount: 0 });
}
