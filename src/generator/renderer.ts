import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt({ html: false });

export function renderMarkdown(source: string): string {
  return markdown.render(source);
}
