import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const client = createClient({
  projectId: 'mxtdl2ha',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});
const builder = createImageUrlBuilder(client);

const logs = await client.fetch(
  `*[_type == 'buildLog'] { title, coverImage { ..., asset-> }, gallery[] { ..., asset-> } }`
);

for (const log of logs) {
  console.log('\n---', log.title);
  console.log('cover asset:', log.coverImage?.asset?._id ?? 'NONE');
  for (const img of (log.gallery ?? [])) {
    const assetId = img.asset?._id ?? 'NULL ASSET';
    console.log('gallery item:', assetId, '| key:', img._key);
    if (img.asset) {
      try { console.log('  url:', builder.image(img).url().slice(0, 80)); }
      catch(e) { console.log('  url ERROR:', e.message); }
    }
  }
}
