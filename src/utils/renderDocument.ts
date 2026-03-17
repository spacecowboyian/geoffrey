import type { DocumentElement, DocumentNode } from '@keystatic/core';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderNode(node: DocumentNode): string {
  // Text leaf node
  if ('text' in node) {
    let text = escapeHtml(node.text);
    if ((node as any).bold) text = `<strong>${text}</strong>`;
    if ((node as any).italic) text = `<em>${text}</em>`;
    if ((node as any).underline) text = `<u>${text}</u>`;
    if ((node as any).strikethrough) text = `<del>${text}</del>`;
    if ((node as any).code) text = `<code>${text}</code>`;
    if ((node as any).superscript) text = `<sup>${text}</sup>`;
    if ((node as any).subscript) text = `<sub>${text}</sub>`;
    return text;
  }

  const el = node as DocumentElement;
  const children = el.children ? el.children.map(renderNode).join('') : '';

  switch (el.type as string) {
    case 'paragraph':
      return `<p>${children}</p>\n`;
    case 'heading': {
      const level = (el as any).level ?? 2;
      return `<h${level}>${children}</h${level}>\n`;
    }
    case 'ordered-list':
      return `<ol>\n${children}</ol>\n`;
    case 'unordered-list':
      return `<ul>\n${children}</ul>\n`;
    case 'list-item':
      return `<li>${children}</li>\n`;
    case 'list-item-content':
      return children;
    case 'blockquote':
      return `<blockquote>\n${children}</blockquote>\n`;
    case 'code': {
      const lang = (el as any).language ?? '';
      const raw = el.children?.[0] && 'text' in el.children[0]
        ? escapeHtml(el.children[0].text)
        : children;
      return `<pre><code${lang ? ` class="language-${escapeHtml(lang)}"` : ''}>${raw}</code></pre>\n`;
    }
    case 'divider':
      return `<hr />\n`;
    case 'link': {
      const href = escapeHtml((el as any).href ?? '#');
      return `<a href="${href}" rel="noopener noreferrer">${children}</a>`;
    }
    case 'image': {
      const src = escapeHtml((el as any).src ?? '');
      const alt = escapeHtml((el as any).alt ?? '');
      const title = (el as any).title ? ` title="${escapeHtml((el as any).title)}"` : '';
      return `<figure class="prose-image"><img src="${src}" alt="${alt}"${title} loading="lazy" /></figure>\n`;
    }
    default:
      return children;
  }
}

export function renderDocument(nodes: readonly DocumentNode[]): string {
  return nodes.map(renderNode).join('');
}
