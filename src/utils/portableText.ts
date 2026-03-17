import { toHTML } from '@portabletext/to-html';
import type { ArbitraryTypedObject, PortableTextBlock } from '@portabletext/types';
import { urlFor } from './imageUrl';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderPortableText(blocks: (PortableTextBlock | ArbitraryTypedObject)[]): string {
  if (!blocks || blocks.length === 0) return '';

  return toHTML(blocks, {
    components: {
      types: {
        image: ({ value }) => {
          const imageValue = value as { alt?: string; asset?: unknown };
          if (!imageValue.asset) return '';
          const src = urlFor(value).auto('format').width(1200).url();
          const alt = escapeHtml(imageValue.alt ?? '');
          return `<figure class="prose-image"><img src="${src}" alt="${alt}" loading="lazy" /></figure>`;
        },
      },
    },
  });
}
